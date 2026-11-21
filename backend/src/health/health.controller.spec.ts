import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HealthController } from './health.controller.js';
import { HealthService } from './health.service.js';

describe('HealthController', () => {
  let controller: HealthController;
  let checkSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    checkSpy = vi.fn().mockResolvedValue({
      status: 'ok',
      db: 'ok',
      version: 'test-sha',
    });

    const mockService = {
      check: checkSpy,
    } as unknown as HealthService;

    controller = new HealthController(mockService);
  });

  it('health check natijasini qaytarishi kerak', async () => {
    const result = await controller.check();
    expect(result).toEqual({
      status: 'ok',
      db: 'ok',
      version: 'test-sha',
    });
    expect(checkSpy).toHaveBeenCalledTimes(1);
  });
});
