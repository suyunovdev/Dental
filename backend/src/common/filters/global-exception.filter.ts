import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AppException, ErrorCode, ErrorCodeType, ErrorResponseDto } from '../errors.js';

interface PrismaClientKnownRequestError {
  code: string;
  meta?: Record<string, unknown>;
  message: string;
}

function isPrismaError(error: unknown): error is PrismaClientKnownRequestError {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code: unknown }).code;
    return typeof code === 'string' && code.startsWith('P');
  }
  return false;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let code: ErrorCodeType = ErrorCode.INTERNAL_ERROR;
    let message = "Kutilmagan server xatosi yuz berdi";
    let details: unknown = undefined;

    if (exception instanceof AppException) {
      statusCode = exception.getStatus();
      code = exception.code;
      message = exception.message;
      details = exception.details;
    } else if (isPrismaError(exception)) {
      if (exception.code === 'P2002') {
        statusCode = HttpStatus.CONFLICT;
        code = ErrorCode.CONFLICT;
        message = "Bunday ma'lumot allaqachon mavjud";
        details = { target: exception.meta?.target };
      } else if (exception.code === 'P2025') {
        statusCode = HttpStatus.NOT_FOUND;
        code = ErrorCode.NOT_FOUND;
        message = "Yozuv topilmadi";
      } else if (exception.code === 'P2003') {
        statusCode = HttpStatus.BAD_REQUEST;
        code = ErrorCode.VALIDATION_ERROR;
        message = "Bog'langan yozuv topilmadi";
        details = { field: exception.meta?.field_name };
      } else {
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        code = ErrorCode.INTERNAL_ERROR;
        message = "Ma'lumotlar bazasi xatosi";
      }
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'object' && res !== null) {
        const resObj = res as Record<string, unknown>;
        if (typeof resObj.code === 'string') {
          code = resObj.code as ErrorCodeType;
        } else {
          code = this.mapStatusToErrorCode(statusCode);
        }

        if (typeof resObj.message === 'string') {
          message = resObj.message;
        } else if (Array.isArray(resObj.message)) {
          message = resObj.message.join(', ');
        } else {
          message = this.getDefaultStatusMessage(statusCode);
        }

        if (resObj.details) {
          details = resObj.details;
        }
      } else if (typeof res === 'string') {
        message = res;
        code = this.mapStatusToErrorCode(statusCode);
      }
    } else {
      // Kutilmagan xatolik - log qilamiz, lekin stack trace'ni mijozga yubormaymiz
      this.logger.error(
        `[500 XATOLIK]: ${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      code = ErrorCode.INTERNAL_ERROR;
      message = "Kutilmagan server xatosi yuz berdi";
    }

    const errorResponse: ErrorResponseDto = {
      statusCode,
      code,
      message,
      ...(details !== undefined ? { details } : {}),
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    response.status(statusCode).json(errorResponse);
  }

  private mapStatusToErrorCode(status: number): ErrorCodeType {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return ErrorCode.VALIDATION_ERROR;
      case HttpStatus.UNAUTHORIZED:
        return ErrorCode.UNAUTHORIZED;
      case HttpStatus.FORBIDDEN:
        return ErrorCode.FORBIDDEN;
      case HttpStatus.NOT_FOUND:
        return ErrorCode.NOT_FOUND;
      case HttpStatus.CONFLICT:
        return ErrorCode.CONFLICT;
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return ErrorCode.INVALID_STATUS_TRANSITION;
      case HttpStatus.TOO_MANY_REQUESTS:
        return ErrorCode.TOO_MANY_REQUESTS;
      case HttpStatus.PAYLOAD_TOO_LARGE:
        return ErrorCode.FILE_TOO_LARGE;
      case HttpStatus.UNSUPPORTED_MEDIA_TYPE:
        return ErrorCode.FILE_TYPE_NOT_ALLOWED;
      default:
        return ErrorCode.INTERNAL_ERROR;
    }
  }

  private getDefaultStatusMessage(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return "Noto'g'ri so'rov";
      case HttpStatus.UNAUTHORIZED:
        return "Avtorizatsiyadan o'tilmagan";
      case HttpStatus.FORBIDDEN:
        return "Ruxsat berilmagan";
      case HttpStatus.NOT_FOUND:
        return "Yozuv topilmadi";
      case HttpStatus.CONFLICT:
        return "Ma'lumotlar to'qnashuvi";
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return "Biznes qoida buzildi";
      case HttpStatus.TOO_MANY_REQUESTS:
        return "Juda ko'p so'rov yuborildi. Birozdan so'ng qayta urining";
      case HttpStatus.PAYLOAD_TOO_LARGE:
        return "Fayl hajmi ruxsat etilgan limitdan katta";
      case HttpStatus.UNSUPPORTED_MEDIA_TYPE:
        return "Fayl formati ruxsat etilmagan";
      default:
        return "Server xatosi";
    }
  }
}
