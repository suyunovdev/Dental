import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '../generated/prisma/index.js';

export interface AuditLogParams {
  actorId: number;
  action: string;
  entity: string;
  entityId: number | string;
  summary?: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  ip?: string;
}

/** Parol xeshlarini logdan yashirish */
function redactSensitive(obj?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!obj) return undefined;
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (/password|hash|token|secret/i.test(key)) {
      result[key] = '[REDACTED]';
    } else {
      result[key] = value;
    }
  }
  return result;
}

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(
    params: AuditLogParams,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const client = tx ?? this.prisma;
    const { actorId, action, entity, entityId, summary, before, after, ip } = params;

    await (client as PrismaService).auditLog.create({
      data: {
        actorId,
        action,
        entity,
        entityId: typeof entityId === 'number' ? entityId : parseInt(entityId, 10) || null,
        summary: summary ?? null,
        before: (redactSensitive(before) ?? Prisma.JsonNull) as Prisma.InputJsonValue,
        after: (redactSensitive(after) ?? Prisma.JsonNull) as Prisma.InputJsonValue,
        ip: ip ?? null,
      },
    });
  }
}
