import {
  IsString, IsNotEmpty, MinLength, MaxLength,
  IsOptional, IsArray, IsEnum, IsInt, Min, Max,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../generated/prisma/index.js';

export class CreateUserDto {
  @ApiProperty({ example: 'Alisher Qodirov' })
  @IsString() @IsNotEmpty() @MaxLength(100)
  fullName!: string;

  @ApiProperty({ example: 'alisher.qodirov' })
  @IsString() @IsNotEmpty() @MinLength(3) @MaxLength(50)
  @Matches(/^[a-z0-9._-]+$/, { message: 'username faqat kichik harf, raqam, ., _, - bo\'lishi mumkin' })
  username!: string;

  @ApiProperty({ example: 'P@ssw0rd!', minLength: 8 })
  @IsString() @IsNotEmpty() @MinLength(8) @MaxLength(72)
  password!: string;

  @ApiPropertyOptional({ example: '+998901234567' })
  @IsOptional() @IsString() @MaxLength(20)
  phone?: string;

  @ApiProperty({ enum: Role, isArray: true, example: [Role.DOCTOR] })
  @IsArray() @IsEnum(Role, { each: true })
  roles!: Role[];

  @ApiPropertyOptional({ example: 'Terapevt' })
  @IsOptional() @IsString() @MaxLength(100)
  specialty?: string;

  @ApiPropertyOptional({ example: '#4CAF50' })
  @IsOptional() @IsString() @MaxLength(20)
  color?: string;

  @ApiPropertyOptional({ example: 30, minimum: 0, maximum: 100 })
  @IsOptional() @IsInt() @Min(0) @Max(100)
  sharePercent?: number;
}
