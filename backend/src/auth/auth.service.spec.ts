import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UnauthorizedException, ForbiddenException, BadRequestException } from '@nestjs/common';
import type { Socket } from 'node:net';
import { AuthService } from './auth.service.js';
import type { PrismaService } from '../prisma/prisma.service.js';
import type { JwtService } from '@nestjs/jwt';
import type { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { Role } from '../generated/prisma/client.js';
import * as passwordUtils from '../common/password.js';

describe('AuthService (Unit Testlar)', () => {
  let authService: AuthService;
  let prismaMock: {
    user: {
      findUnique: ReturnType<typeof vi.fn>;
      update: ReturnType<typeof vi.fn>;
    };
    refreshToken: {
      create: ReturnType<typeof vi.fn>;
      findUnique: ReturnType<typeof vi.fn>;
      update: ReturnType<typeof vi.fn>;
      updateMany: ReturnType<typeof vi.fn>;
    };
    auditLog: {
      create: ReturnType<typeof vi.fn>;
    };
    $transaction: ReturnType<typeof vi.fn>;
  };
  let jwtServiceMock: {
    signAsync: ReturnType<typeof vi.fn>;
    verifyAsync: ReturnType<typeof vi.fn>;
  };
  let configServiceMock: {
    get: ReturnType<typeof vi.fn>;
  };
  let reqMock: Partial<Request>;
  let resMock: Partial<Response>;

  beforeEach(() => {
    prismaMock = {
      user: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
      refreshToken: {
        create: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        updateMany: vi.fn(),
      },
      auditLog: {
        create: vi.fn(),
      },
      $transaction: vi.fn((cb: (tx: unknown) => unknown) => cb(prismaMock)),
    };

    jwtServiceMock = {
      signAsync: vi.fn().mockResolvedValue('mock-access-token'),
      verifyAsync: vi.fn(),
    };

    configServiceMock = {
      get: vi.fn((key: string, defaultVal?: unknown) => {
        const map: Record<string, unknown> = {
          JWT_ACCESS_SECRET: 'test-secret',
          JWT_ACCESS_TTL: '15m',
          REFRESH_TTL_DAYS: 14,
          COOKIE_SECURE: false,
        };
        return map[key] ?? defaultVal;
      }),
    };

    reqMock = {
      ip: '127.0.0.1',
      headers: { 'user-agent': 'Vitest-Test' },
      cookies: {},
      socket: { remoteAddress: '127.0.0.1' } as unknown as Socket,
    };

    resMock = {
      cookie: vi.fn(),
      clearCookie: vi.fn(),
    };

    authService = new AuthService(
      prismaMock as unknown as PrismaService,
      jwtServiceMock as unknown as JwtService,
      configServiceMock as unknown as ConfigService,
    );
  });

  describe('login', () => {
    it('to\'g\'ri login va parol bo\'lsa, access token va user qaytaradi', async () => {
      const mockUser = {
        id: 1,
        fullName: 'Jasur Aliyev',
        username: 'dr_jasur',
        passwordHash: '$2b$12$hashedpassword',
        roles: [Role.DOCTOR],
        isActive: true,
        mustChangePassword: false,
      };

      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      vi.spyOn(passwordUtils, 'verifyPassword').mockResolvedValue(true);

      const result = await authService.login(
        { username: 'DR_JASUR ', password: 'Password123!' },
        reqMock as Request,
        resMock as Response,
      );

      expect(result.accessToken).toBe('mock-access-token');
      expect(result.user.username).toBe('dr_jasur');
      expect(resMock.cookie).toHaveBeenCalledWith(
        'rt',
        expect.any(String),
        expect.objectContaining({ httpOnly: true, path: '/api/auth' }),
      );
      expect(prismaMock.auditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ action: 'LOGIN' }) }),
      );
    });

    it('parol noto\'g\'ri bo\'lsa, 401 INVALID_CREDENTIALS xatosi beradi va audit yozadi', async () => {
      const mockUser = {
        id: 1,
        username: 'dr_jasur',
        passwordHash: '$2b$12$hashedpassword',
        isActive: true,
      };

      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      vi.spyOn(passwordUtils, 'verifyPassword').mockResolvedValue(false);

      await expect(
        authService.login(
          { username: 'dr_jasur', password: 'WrongPassword' },
          reqMock as Request,
          resMock as Response,
        ),
      ).rejects.toThrow(UnauthorizedException);

      expect(prismaMock.auditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ action: 'LOGIN_FAILED' }) }),
      );
    });

    it('bloklangan xodim kelsa, 403 USER_BLOCKED xatosi beradi', async () => {
      const mockUser = {
        id: 1,
        username: 'blocked_user',
        passwordHash: '$2b$12$hashedpassword',
        isActive: false,
      };

      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      vi.spyOn(passwordUtils, 'verifyPassword').mockResolvedValue(true);

      await expect(
        authService.login(
          { username: 'blocked_user', password: 'Password123!' },
          reqMock as Request,
          resMock as Response,
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('refreshToken (Rotatsiya va O\'g\'irlanish himoyasi)', () => {
    it('normal refresh: eski token bekor bo\'ladi va yangisi beriladi', async () => {
      const mockToken = {
        id: 10,
        userId: 1,
        tokenHash: 'somehash',
        expiresAt: new Date(Date.now() + 100000),
        revokedAt: null,
        user: {
          id: 1,
          username: 'admin',
          roles: [Role.ADMIN],
          isActive: true,
        },
      };

      reqMock.cookies = { rt: 'valid-refresh-token' };
      prismaMock.refreshToken.findUnique.mockResolvedValue(mockToken);
      prismaMock.refreshToken.create.mockResolvedValue({ id: 11 });

      const result = await authService.refreshToken(reqMock as Request, resMock as Response);

      expect(result.accessToken).toBe('mock-access-token');
      expect(prismaMock.refreshToken.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 10 },
          data: expect.objectContaining({ revokedAt: expect.any(Date), replacedById: 11 }),
        }),
      );
      expect(resMock.cookie).toHaveBeenCalledWith(
        'rt',
        expect.any(String),
        expect.objectContaining({ httpOnly: true }),
      );
    });

    it('xavfsizlik: bekor qilingan token qayta ishlatilsa (o\'g\'irlanish) -> barcha sessiyalar yopiladi', async () => {
      const stolenToken = {
        id: 10,
        userId: 1,
        tokenHash: 'somehash',
        expiresAt: new Date(Date.now() + 100000),
        revokedAt: new Date(Date.now() - 5000), // allaqachon bekor qilingan!
        user: { id: 1, username: 'admin', isActive: true },
      };

      reqMock.cookies = { rt: 'stolen-refresh-token' };
      prismaMock.refreshToken.findUnique.mockResolvedValue(stolenToken);

      await expect(
        authService.refreshToken(reqMock as Request, resMock as Response),
      ).rejects.toThrow(UnauthorizedException);

      // Barcha sessiyalar bekor qilinganini tekshirish
      expect(prismaMock.refreshToken.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 1, revokedAt: null },
          data: expect.objectContaining({ revokedAt: expect.any(Date) }),
        }),
      );
      expect(resMock.clearCookie).toHaveBeenCalledWith('rt', expect.any(Object));
      expect(prismaMock.auditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ action: 'SECURITY_ALERT' }) }),
      );
    });
  });

  describe('logout', () => {
    it('joriy tokenni bekor qiladi va cookie\'ni tozalaydi', async () => {
      reqMock.cookies = { rt: 'my-token' };

      await authService.logout(reqMock as Request, resMock as Response);

      expect(prismaMock.refreshToken.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ revokedAt: null }),
          data: expect.objectContaining({ revokedAt: expect.any(Date) }),
        }),
      );
      expect(resMock.clearCookie).toHaveBeenCalledWith('rt', expect.any(Object));
    });
  });

  describe('changePassword', () => {
    it('yangi parol login bilan bir xil bo\'lsa 400 beradi', async () => {
      const mockUser = {
        id: 1,
        username: 'admin',
        passwordHash: '$2b$12$hashed',
      };
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      vi.spyOn(passwordUtils, 'verifyPassword').mockResolvedValue(true);

      await expect(
        authService.changePassword(
          1,
          { currentPassword: 'OldPassword123!', newPassword: 'admin' },
          reqMock as Request,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('muvaffaqiyatli almashtirilganda parolni yangilaydi va boshqa sessiyalarni bekor qiladi', async () => {
      const mockUser = {
        id: 1,
        username: 'admin',
        passwordHash: '$2b$12$hashed',
      };
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      vi.spyOn(passwordUtils, 'verifyPassword').mockResolvedValue(true);
      vi.spyOn(passwordUtils, 'hashPassword').mockResolvedValue('$2b$12$newhashed');

      await authService.changePassword(
        1,
        { currentPassword: 'OldPassword123!', newPassword: 'NewSecurePassword2026!' },
        reqMock as Request,
      );

      expect(prismaMock.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 1 },
          data: expect.objectContaining({
            passwordHash: '$2b$12$newhashed',
            mustChangePassword: false,
          }),
        }),
      );

      expect(prismaMock.refreshToken.updateMany).toHaveBeenCalled();
    });
  });
});
