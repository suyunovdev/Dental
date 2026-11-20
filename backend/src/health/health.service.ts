import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class HealthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async check() {
    await this.prisma.$queryRaw`SELECT 1`;
    return {
      status: 'ok',
      db: 'ok',
      version: this.configService.get<string>('GIT_SHA', 'dev'),
    };
  }
}
