import { HttpStatus, ValidationError } from '@nestjs/common';
import { AppException, ErrorCode } from '../errors.js';

export interface FieldError {
  field: string;
  message: string;
}

const CONSTRAINT_MESSAGES: Record<string, string> = {
  isNotEmpty: 'Majburiy maydon',
  isString: "Matn bo'lishi kerak",
  isInt: "Butun son bo'lishi kerak",
  isNumber: "Raqam bo'lishi kerak",
  isEnum: "Ruxsat etilmagan qiymat",
  maxLength: 'Juda uzun',
  minLength: 'Juda qisqa',
  isEmail: "Email manzili noto'g'ri",
  isDateString: "Sana formati noto'g'ri",
  isDate: "Sana formati noto'g'ri",
  isPositive: "Musbat son bo'lishi kerak",
  min: 'Belgilangan minimumdan kichik',
  max: 'Belgilangan maksimumdan katta',
  matches: "Format noto'g'ri",
  isBoolean: "Mantiqiy qiymat bo'lishi kerak",
};

export function extractValidationErrors(
  errors: ValidationError[],
  parentField = '',
): FieldError[] {
  const fields: FieldError[] = [];

  for (const error of errors) {
    const fieldName = parentField
      ? `${parentField}.${error.property}`
      : error.property;

    if (error.constraints) {
      let message = "Noto'g'ri qiymat";
      // Agar isNotEmpty bo'lsa, uni birinchi o'ringa qo'yamiz (Majburiy maydon)
      if (error.constraints.isNotEmpty) {
        message = CONSTRAINT_MESSAGES.isNotEmpty;
      } else {
        const constraintKeys = Object.keys(error.constraints);
        const firstConstraint = constraintKeys[0];
        message =
          CONSTRAINT_MESSAGES[firstConstraint] ||
          error.constraints[firstConstraint] ||
          "Noto'g'ri qiymat";
      }

      fields.push({
        field: fieldName,
        message,
      });
    }

    if (error.children && error.children.length > 0) {
      fields.push(...extractValidationErrors(error.children, fieldName));
    }
  }

  return fields;
}

export function validationExceptionFactory(errors: ValidationError[]): AppException {
  const fields = extractValidationErrors(errors);
  return new AppException(
    ErrorCode.VALIDATION_ERROR,
    HttpStatus.BAD_REQUEST,
    "Kiritilgan ma'lumotlar noto'g'ri",
    { fields },
  );
}
