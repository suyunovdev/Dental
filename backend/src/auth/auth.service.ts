import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService, type JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import crypto from 'node:crypto';
import type { Request, Response } from 'express';
import { PrismaService } from '../prisma/prisma.service.js';
import { verifyPassword, hashPassword } from '../common/password.js';
import {
  LoginDto,
  ChangePasswordDto,
  LoginResponseDto,
  RefreshResponseDto,
  MeDto,
} from './dto/index.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 1. Login: username kichik harfga -> isActive tekshiriladi -> verifyPassword
   * access token (15 daqiqa) + sha256 refresh token (14 kun)
   */
  async login(dto: LoginDto, req: Request, res: Response): Promise<LoginResponseDto> {
    const username = dto.username.toLowerCase().trim();
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    const isPasswordValid = user ? await verifyPassword(dto.password, user.passwordHash) : false;

    if (!user || !isPasswordValid) {
      // Audit log (parol yozilmaydi)
      await this.prisma.auditLog.create({
        data: {
          action: 'LOGIN_FAILED',
          entity: 'User',
          summary: `Muvaffaqiyatsiz kirish urinishi: ${username}`,
          ip: (req.ip || req.socket.remoteAddress || null) as string | null,
        },
      });

      throw new UnauthorizedException({
        statusCode: 401,
        code: 'INVALID_CREDENTIALS',
        message: 'Login yoki parol noto\'g\'ri',
      });
    }

    if (!user.isActive) {
      throw new ForbiddenException({
        statusCode: 403,
        code: 'USER_BLOCKED',
        message: 'Xodim bloklangan',
      });
    }

    // Access token
    const accessToken = await this.generateAccessToken(user.id, user.username, user.roles);

    // Refresh token
    await this.issueRefreshToken(user.id, req, res);

    // Audit log
    await this.prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'LOGIN',
        entity: 'User',
        entityId: user.id,
        summary: 'Tizimga muvaffaqiyatli kirdi',
        ip: (req.ip || req.socket.remoteAddress || null) as string | null,
      },
    });

    return {
      accessToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        roles: user.roles,
        mustChangePassword: user.mustChangePassword,
      },
    };
  }

  /**
   * 2. Refresh token rotatsiyasi:
   * Eskisi bekor bo'ladi va yangisi beriladi.
   * Agar revokedAt bor token qayta kelsa (o'g'irlanish belgisi) -> hamma sessiyalar yopiladi!
   */
  async refreshToken(req: Request, res: Response): Promise<RefreshResponseDto> {
    const rawToken = req.cookies?.rt as string | undefined;

    if (!rawToken) {
      throw new UnauthorizedException({
        statusCode: 401,
        code: 'UNAUTHORIZED',
        message: 'Refresh token taqdim etilmagan',
      });
    }

    const tokenHash = this.hashToken(rawToken);
    const existingToken = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!existingToken) {
      this.clearRefreshCookie(res);
      throw new UnauthorizedException({
        statusCode: 401,
        code: 'UNAUTHORIZED',
        message: 'Token yaroqsiz',
      });
    }

    // Token o'g'irlanishi himoyasi: bekor qilingan token qayta ishlatilsa
    if (existingToken.revokedAt) {
      await this.revokeAllSessions(existingToken.userId);
      this.clearRefreshCookie(res);

      await this.prisma.auditLog.create({
        data: {
          actorId: existingToken.userId,
          action: 'SECURITY_ALERT',
          entity: 'RefreshToken',
          entityId: existingToken.id,
          summary: 'Bekor qilingan refresh token qayta ishlatildi — barcha sessiyalar yopildi',
          ip: (req.ip || req.socket.remoteAddress || null) as string | null,
        },
      });

      throw new UnauthorizedException({
        statusCode: 401,
        code: 'UNAUTHORIZED',
        message: 'Xavfsizlik sababli barcha sessiyalar yopildi. Qaytadan kiring.',
      });
    }

    // Muddati o'tgan bo'lsa
    if (existingToken.expiresAt < new Date()) {
      this.clearRefreshCookie(res);
      throw new UnauthorizedException({
        statusCode: 401,
        code: 'UNAUTHORIZED',
        message: 'Token muddati o\'tgan',
      });
    }

    // Foydalanuvchi faolligi
    if (!existingToken.user.isActive) {
      this.clearRefreshCookie(res);
      throw new ForbiddenException({
        statusCode: 403,
        code: 'USER_BLOCKED',
        message: 'Xodim bloklangan',
      });
    }

    // Yangi token va rotatsiya tranzaksiyada
    const newRawToken = crypto.randomBytes(32).toString('base64url');
    const newTokenHash = this.hashToken(newRawToken);
    const refreshTtlDays = this.configService.get<number>('REFRESH_TTL_DAYS', 14);
    const expiresAt = new Date(Date.now() + refreshTtlDays * 24 * 60 * 60 * 1000);

    const rotated = await this.prisma.$transaction(async (tx) => {
      const claimed = await tx.refreshToken.updateMany({
        where: { id: existingToken.id, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      if (claimed.count !== 1) return null;

      const newRecord = await tx.refreshToken.create({
        data: {
          userId: existingToken.userId,
          tokenHash: newTokenHash,
          expiresAt,
          userAgent: (req.headers['user-agent'] || null) as string | null,
          ip: (req.ip || req.socket.remoteAddress || null) as string | null,
        },
      });

      await tx.refreshToken.update({
        where: { id: existingToken.id },
        data: { replacedById: newRecord.id },
      });

      const token = await this.generateAccessToken(
        existingToken.user.id,
        existingToken.user.username,
        existingToken.user.roles,
      );

      return { accessToken: token };
    });

    if (!rotated) {
      await this.revokeAllSessions(existingToken.userId);
      this.clearRefreshCookie(res);
      throw new UnauthorizedException({
        statusCode: 401,
        code: 'UNAUTHORIZED',
        message: 'Xavfsizlik sababli barcha sessiyalar yopildi. Qaytadan kiring.',
      });
    }

    this.setRefreshCookie(res, newRawToken);

    return rotated;
  }

  /**
   * 3. Logout: joriy refresh token bekor qilinadi, cookie o'chiriladi
   */
  async logout(req: Request, res: Response): Promise<void> {
    const rawToken = req.cookies?.rt as string | undefined;

    if (rawToken) {
      const tokenHash = this.hashToken(rawToken);
      await this.prisma.refreshToken.updateMany({
        where: { tokenHash, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }

    this.clearRefreshCookie(res);
  }

  /**
   * 4. Joriy kirgan xodim profili
   */
  async getMe(userId: number): Promise<MeDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        username: true,
        roles: true,
        mustChangePassword: true,
      },
    });

    if (!user) {
      throw new NotFoundException({
        statusCode: 404,
        code: 'NOT_FOUND',
        message: 'Foydalanuvchi topilmadi',
      });
    }

    return user;
  }

  /**
   * 5. Parolni almashtirish:
   * Joriy parol tekshiriladi; yangi parol >= 8 belgi va login bilan bir xil emas;
   * mustChangePassword = false; joriy sessiyadan boshqa hamma sessiyalar yopiladi.
   */
  async changePassword(userId: number, dto: ChangePasswordDto, req: Request): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException({
        statusCode: 404,
        code: 'NOT_FOUND',
        message: 'Foydalanuvchi topilmadi',
      });
    }

    const isCurrentValid = await verifyPassword(dto.currentPassword, user.passwordHash);
    if (!isCurrentValid) {
      throw new UnauthorizedException({
        statusCode: 401,
        code: 'INVALID_CREDENTIALS',
        message: 'Joriy parol noto\'g\'ri',
      });
    }

    if (dto.newPassword.toLowerCase() === user.username.toLowerCase()) {
      throw new BadRequestException({
        statusCode: 400,
        code: 'VALIDATION_ERROR',
        message: 'Yangi parol login bilan bir xil bo\'lishi mumkin emas',
      });
    }

    if (dto.newPassword === dto.currentPassword) {
      throw new BadRequestException({
        statusCode: 400,
        code: 'VALIDATION_ERROR',
        message: 'Yangi parol joriy parol bilan bir xil bo\'lishi mumkin emas',
      });
    }

    const newHash = await hashPassword(dto.newPassword);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: newHash,
        mustChangePassword: false,
      },
    });

    // Joriy sessiyadan boshqa hamma sessiyalarni yopish
    const rawToken = req.cookies?.rt as string | undefined;
    const currentTokenHash = rawToken ? this.hashToken(rawToken) : null;

    await this.prisma.refreshToken.updateMany({
      where: {
        userId,
        tokenHash: currentTokenHash ? { not: currentTokenHash } : undefined,
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });

    // Audit log
    await this.prisma.auditLog.create({
      data: {
        actorId: userId,
        action: 'CHANGE_PASSWORD',
        entity: 'User',
        entityId: userId,
        summary: 'Parol muvaffaqiyatli almashtirildi',
        ip: (req.ip || req.socket.remoteAddress || null) as string | null,
      },
    });
  }

  /**
   * 6. Foydalanuvchining hamma sessiyalarini yopish (T-17 uchun eksport qilinadi)
   */
  async revokeAllSessions(userId: number): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  // ==========================================
  // YORDAMCHI METODLAR
  // ==========================================

  private async generateAccessToken(userId: number, username: string, roles: string[]): Promise<string> {
    const expiresIn = (this.configService.get<string>('JWT_ACCESS_TTL') || '15m') as unknown as JwtSignOptions['expiresIn'];
    return this.jwtService.signAsync(
      {
        sub: userId,
        username,
        roles,
      },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn,
      },
    );
  }

  private async issueRefreshToken(userId: number, req: Request, res: Response): Promise<string> {
    const rawToken = crypto.randomBytes(32).toString('base64url');
    const tokenHash = this.hashToken(rawToken);
    const refreshTtlDays = this.configService.get<number>('REFRESH_TTL_DAYS', 14);
    const expiresAt = new Date(Date.now() + refreshTtlDays * 24 * 60 * 60 * 1000);

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
        userAgent: (req.headers['user-agent'] || null) as string | null,
        ip: (req.ip || req.socket.remoteAddress || null) as string | null,
      },
    });

    this.setRefreshCookie(res, rawToken);
    return rawToken;
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private setRefreshCookie(res: Response, token: string): void {
    const refreshTtlDays = this.configService.get<number>('REFRESH_TTL_DAYS', 14);
    const cookieSecure = this.configService.get<boolean>('COOKIE_SECURE', false);

    res.cookie('rt', token, {
      httpOnly: true,
      secure: cookieSecure,
      sameSite: 'strict',
      path: '/api/auth',
      maxAge: refreshTtlDays * 24 * 60 * 60 * 1000,
    });
  }

  private clearRefreshCookie(res: Response): void {
    res.clearCookie('rt', {
      httpOnly: true,
      sameSite: 'strict',
      path: '/api/auth',
    });
  }
}
