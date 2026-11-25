import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Search parameters for patients list.
 * TODO: implement actual filtering logic in service.
 */
export class SearchPatientDto {
  @ApiPropertyOptional({ description: 'Search by full name (case‑insensitive)' })
  @IsOptional() @IsString()
  fullName?: string;

  @ApiPropertyOptional({ description: 'Search by phone number' })
  @IsOptional() @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Page number (default 1)' })
  @IsOptional() @IsInt() @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: 'Page size (default 20)' })
  @IsOptional() @IsInt() @Min(1)
  limit?: number;
}
