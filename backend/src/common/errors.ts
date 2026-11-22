import { HttpException, HttpStatus } from '@nestjs/common';

export const ErrorCode = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  FORBIDDEN: 'FORBIDDEN',
  USER_BLOCKED: 'USER_BLOCKED',
  PASSWORD_CHANGE_REQUIRED: 'PASSWORD_CHANGE_REQUIRED',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  PATIENT_DUPLICATE: 'PATIENT_DUPLICATE',
  APPOINTMENT_DOCTOR_CONFLICT: 'APPOINTMENT_DOCTOR_CONFLICT',
  APPOINTMENT_CHAIR_CONFLICT: 'APPOINTMENT_CHAIR_CONFLICT',
  OUTSIDE_WORKING_HOURS: 'OUTSIDE_WORKING_HOURS',
  INVALID_STATUS_TRANSITION: 'INVALID_STATUS_TRANSITION',
  VISIT_NOT_OPEN: 'VISIT_NOT_OPEN',
  DIAGNOSIS_REQUIRED: 'DIAGNOSIS_REQUIRED',
  PAYMENT_EXCEEDS_DEBT: 'PAYMENT_EXCEEDS_DEBT',
  DISCOUNT_NOT_ALLOWED: 'DISCOUNT_NOT_ALLOWED',
  LAST_ADMIN: 'LAST_ADMIN',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  FILE_TYPE_NOT_ALLOWED: 'FILE_TYPE_NOT_ALLOWED',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode];

export interface ErrorResponseDto {
  statusCode: number;
  code: ErrorCodeType;
  message: string;
  details?: unknown;
  path: string;
  timestamp: string;
}

export class AppException extends HttpException {
  public readonly code: ErrorCodeType;
  public readonly details?: unknown;

  constructor(
    code: ErrorCodeType,
    status: HttpStatus,
    message: string,
    details?: unknown,
  ) {
    super(
      {
        statusCode: status,
        code,
        message,
        details,
      },
      status,
    );
    this.code = code;
    this.details = details;
  }
}
