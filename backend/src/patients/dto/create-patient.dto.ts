import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePatientDto {
  @ApiProperty({ example: 'Jasur', description: 'Ismi' })
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @ApiProperty({ example: 'Aliyev', description: 'Familiyasi' })
  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @ApiProperty({ example: '+998901234567', description: 'Asosiy telefon raqami' })
  @IsNotEmpty()
  @IsString()
  phone!: string;

  @ApiPropertyOptional({ example: 'Anvarovich', description: 'Otasining ismi' })
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiPropertyOptional({ example: '1995-04-12', description: 'Tug\'ilgan sanasi (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiPropertyOptional({ enum: ['MALE', 'FEMALE'], example: 'MALE', description: 'Jinsi' })
  @IsOptional()
  @IsEnum(['MALE', 'FEMALE'])
  gender?: 'MALE' | 'FEMALE';

  @ApiPropertyOptional({ example: '+998912345678', description: 'Qo\'shimcha telefon raqami' })
  @IsOptional()
  @IsString()
  phone2?: string;

  @ApiPropertyOptional({ example: 'Toshkent sh., Chilonzor', description: 'Yashash manzili' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'Penitsillinga allergiya', description: 'Allergiya va kasalliklar' })
  @IsOptional()
  @IsString()
  allergies?: string;

  @ApiPropertyOptional({ example: 'Tavsiya bilan kelgan', description: 'Qo\'shimcha izoh' })
  @IsOptional()
  @IsString()
  note?: string;
}
