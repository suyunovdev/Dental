import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AuditService } from '../audit/audit.service.js';
import { hashPassword } from '../common/password.js';
import { AppException } from '../common/errors.js';
import { Role, Prisma } from '../generated/prisma/index.js';
import type { CreateUserDto, UpdateUserDto } from './dto/index.js';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  /** Foydalanuvchi ma'lumotlaridan passwordHash ni yashirish */
  private omitHash<T extends { passwordHash: string }>(user: T): Omit<T, 'passwordHash'> {
    const { passwordHash: _, ...rest } = user;
    return rest;
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return users.map(u => this.omitHash(u));
  }

  async findDoctors() {
    const users = await this.prisma.user.findMany({
      where: { roles: { has: Role.DOCTOR }, isActive: true },
      orderBy: { fullName: 'asc' },
    });
    return users.map(u => this.omitHash(u));
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new AppException('USER_NOT_FOUND', 404);
    return this.omitHash(user);
  }

  async create(dto: CreateUserDto, actorId: number, ip?: string) {
    // Username takrorlanmasligini tekshirish
    const existing = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });
    if (existing) throw new AppException('USER_DUPLICATE', 409);

    const passwordHash = await hashPassword(dto.password);

    const user = await this.prisma.user.create({
      data: {
        fullName: dto.fullName,
        username: dto.username,
        passwordHash,
        phone: dto.phone ?? null,
        roles: dto.roles,
        specialty: dto.specialty ?? null,
        color: dto.color ?? null,
        sharePercent: dto.sharePercent ?? null,
        mustChangePassword: true,
      },
    });

    await this.audit.log({
      actorId,
      action: 'CREATE',
      entity: 'User',
      entityId: user.id,
      summary: `Yangi foydalanuvchi yaratildi: ${user.username}`,
      after: { fullName: user.fullName, username: user.username, roles: user.roles },
      ip,
    });

    return this.omitHash(user);
  }

  async update(id: number, dto: UpdateUserDto, actorId: number, ip?: string) {
    const before = await this.findOne(id);

    // Username o'zgarsa, takrorlanmasligini tekshirish
    if (dto.username && dto.username !== before.username) {
      const existing = await this.prisma.user.findUnique({
        where: { username: dto.username },
      });
      if (existing) throw new AppException('USER_DUPLICATE', 409);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.fullName !== undefined && { fullName: dto.fullName }),
        ...(dto.username !== undefined && { username: dto.username }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
        ...(dto.roles !== undefined && { roles: dto.roles }),
        ...(dto.specialty !== undefined && { specialty: dto.specialty }),
        ...(dto.color !== undefined && { color: dto.color }),
        ...(dto.sharePercent !== undefined && { sharePercent: dto.sharePercent }),
      },
    });

    await this.audit.log({
      actorId,
      action: 'UPDATE',
      entity: 'User',
      entityId: id,
      summary: `Foydalanuvchi yangilandi: ${user.username}`,
      before: before as Record<string, unknown>,
      after: this.omitHash(user) as Record<string, unknown>,
      ip,
    });

    return this.omitHash(user);
  }

  async block(id: number, actorId: number, ip?: string) {
    await this.findOne(id);
    const user = await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
    await this.audit.log({
      actorId, action: 'BLOCK', entity: 'User', entityId: id,
      summary: `Foydalanuvchi bloklandi: ${user.username}`, ip,
    });
    return this.omitHash(user);
  }

  async unblock(id: number, actorId: number, ip?: string) {
    await this.findOne(id);
    const user = await this.prisma.user.update({
      where: { id },
      data: { isActive: true },
    });
    await this.audit.log({
      actorId, action: 'UNBLOCK', entity: 'User', entityId: id,
      summary: `Foydalanuvchi blokdan chiqarildi: ${user.username}`, ip,
    });
    return this.omitHash(user);
  }

  async resetPassword(id: number, newPassword: string, actorId: number, ip?: string) {
    await this.findOne(id);
    const passwordHash = await hashPassword(newPassword);
    const user = await this.prisma.user.update({
      where: { id },
      data: { passwordHash, mustChangePassword: true },
    });
    await this.audit.log({
      actorId, action: 'RESET_PASSWORD', entity: 'User', entityId: id,
      summary: `Parol yangilandi: ${user.username}`, ip,
    });
    return { success: true };
  }

  async remove(id: number, actorId: number, ip?: string) {
    // Oxirgi ADMIN ni o'chirib bo'lmaydi
    const user = await this.findOne(id);
    if (user.roles.includes(Role.ADMIN)) {
      const adminCount = await this.prisma.user.count({
        where: { roles: { has: Role.ADMIN }, isActive: true },
      });
      if (adminCount <= 1) throw new AppException('LAST_ADMIN', 422);
    }

    await this.prisma.user.delete({ where: { id } });

    await this.audit.log({
      actorId, action: 'DELETE', entity: 'User', entityId: id,
      summary: `Foydalanuvchi o'chirildi: ${user.username}`, ip,
    });

    return { success: true };
  }
}
