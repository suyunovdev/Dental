process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://f2:f2@localhost:5432/f2';
process.env.JWT_ACCESS_SECRET = 'test-secret-at-least-32-characters-long';
process.env.CLINIC_NAME = 'Test Stom Clinic';
process.env.CLINIC_PHONE = '+998901234567';

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import {
  Controller,
  Get,
  HttpStatus,
  INestApplication,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ValidationPipe,
} from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { AppException, ErrorCode } from '../src/common/errors.js';
import { GlobalExceptionFilter } from '../src/common/filters/global-exception.filter.js';
import { validationExceptionFactory } from '../src/common/filters/validation-exception.factory.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

@Controller('test-errors')
class TestErrorsController {
  @Get('401')
  get401() {
    throw new UnauthorizedException();
  }

  @Get('403')
  get403() {
    throw new ForbiddenException();
  }

  @Get('404')
  get404() {
    throw new NotFoundException('Yozuv topilmadi');
  }

  @Get('409')
  get409() {
    throw new AppException(
      ErrorCode.CONFLICT,
      HttpStatus.CONFLICT,
      'Shu telefon va ism bilan bemor bor',
    );
  }

  @Get('422')
  get422() {
    throw new AppException(
      ErrorCode.OUTSIDE_WORKING_HOURS,
      HttpStatus.UNPROCESSABLE_ENTITY,
      'Shifokor ish vaqtidan tashqarida',
      { workingHours: '09:00-18:00' },
    );
  }

  @Get('500')
  get500() {
    throw new Error('Kutilmagan xatolik yuz berdi');
  }
}

describe('Global Exception Filter (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const mockPrisma = {
      $connect: vi.fn().mockResolvedValue(undefined),
      $disconnect: vi.fn().mockResolvedValue(undefined),
      $queryRaw: vi.fn().mockResolvedValue([{ '?column?': 1 }]),
      pool: { end: vi.fn().mockResolvedValue(undefined) },
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [TestErrorsController],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        exceptionFactory: validationExceptionFactory,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  const assertErrorFormat = (body: Record<string, unknown>, expectedStatus: number, expectedCode: string) => {
    expect(body.statusCode).toBe(expectedStatus);
    expect(body.code).toBe(expectedCode);
    expect(typeof body.message).toBe('string');
    expect(typeof body.path).toBe('string');
    expect(typeof body.timestamp).toBe('string');
    expect(body).not.toHaveProperty('stack');
  };

  it('400 VALIDATION_ERROR: DTO xatolari o\'zbekcha va yagona shaklda qaytishi kerak', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/patients')
      .send({ firstName: '' }) // firstName bo'sh, lastName va phone yo'q
      .expect(400);

    assertErrorFormat(response.body, 400, ErrorCode.VALIDATION_ERROR);
    expect(response.body.details).toHaveProperty('fields');
    expect(Array.isArray(response.body.details.fields)).toBe(true);

    const fields = response.body.details.fields as Array<{ field: string; message: string }>;
    const lastNameError = fields.find((f) => f.field === 'lastName');
    expect(lastNameError?.message).toBe('Majburiy maydon');
  });

  it('401 UNAUTHORIZED bir xil formatda qaytishi kerak', async () => {
    const response = await request(app.getHttpServer()).get('/api/test-errors/401').expect(401);
    assertErrorFormat(response.body, 401, ErrorCode.UNAUTHORIZED);
  });

  it('403 FORBIDDEN bir xil formatda qaytishi kerak', async () => {
    const response = await request(app.getHttpServer()).get('/api/test-errors/403').expect(403);
    assertErrorFormat(response.body, 403, ErrorCode.FORBIDDEN);
  });

  it('404 NOT_FOUND bir xil formatda qaytishi kerak', async () => {
    const response = await request(app.getHttpServer()).get('/api/test-errors/404').expect(404);
    assertErrorFormat(response.body, 404, ErrorCode.NOT_FOUND);
  });

  it('409 CONFLICT bir xil formatda qaytishi kerak', async () => {
    const response = await request(app.getHttpServer()).get('/api/test-errors/409').expect(409);
    assertErrorFormat(response.body, 409, ErrorCode.CONFLICT);
  });

  it('422 UNPROCESSABLE_ENTITY bir xil formatda va details bilan qaytishi kerak', async () => {
    const response = await request(app.getHttpServer()).get('/api/test-errors/422').expect(422);
    assertErrorFormat(response.body, 422, ErrorCode.OUTSIDE_WORKING_HOURS);
    expect(response.body.details).toEqual({ workingHours: '09:00-18:00' });
  });

  it('500 INTERNAL_ERROR: stack trace yashirilgan holda yagona formatda qaytishi kerak', async () => {
    const response = await request(app.getHttpServer()).get('/api/test-errors/500').expect(500);
    assertErrorFormat(response.body, 500, ErrorCode.INTERNAL_ERROR);
    expect(response.body.message).toBe('Kutilmagan server xatosi yuz berdi');
    expect(response.body).not.toHaveProperty('stack');
  });
});
