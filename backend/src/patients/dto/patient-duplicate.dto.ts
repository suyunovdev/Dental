import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO used to signal a duplicate patient detection.
 * Service will throw `PATIENT_DUPLICATE` error if a patient with the same
 * `fullName` + `phone` already exists.
 */
export class PatientDuplicateDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  fullName!: string;

  @ApiProperty({ example: '+998901234567' })
  @IsString()
  phone!: string;
}
