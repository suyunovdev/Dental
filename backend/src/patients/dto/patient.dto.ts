import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PatientShortDto {
  @ApiProperty({ example: 42, description: 'Bemor ID raqami' })
  id!: number;

  @ApiProperty({ example: 'Aliyev Jasur Anvarovich', description: 'To\'liq ism-familiyasi' })
  fullName!: string;

  @ApiProperty({ example: '+998901234567', description: 'Telefon raqami' })
  phone!: string;

  @ApiPropertyOptional({ example: '1995-04-12', description: 'Tug\'ilgan sanasi (YYYY-MM-DD)', nullable: true })
  birthDate!: string | null;
}

export class PatientDto {
  @ApiProperty({ example: 42, description: 'Bemor ID raqami' })
  id!: number;

  @ApiProperty({ example: 'Jasur', description: 'Ismi' })
  firstName!: string;

  @ApiProperty({ example: 'Aliyev', description: 'Familiyasi' })
  lastName!: string;

  @ApiPropertyOptional({ example: 'Anvarovich', description: 'Otasining ismi', nullable: true })
  middleName!: string | null;

  @ApiProperty({ example: 'Aliyev Jasur Anvarovich', description: 'To\'liq ism-familiyasi' })
  fullName!: string;

  @ApiPropertyOptional({ example: '1995-04-12', description: 'Tug\'ilgan sanasi (YYYY-MM-DD)', nullable: true })
  birthDate!: string | null;

  @ApiPropertyOptional({ enum: ['MALE', 'FEMALE'], example: 'MALE', description: 'Jinsi', nullable: true })
  gender!: 'MALE' | 'FEMALE' | null;

  @ApiProperty({ example: '+998901234567', description: 'Asosiy telefon raqami' })
  phone!: string;

  @ApiPropertyOptional({ example: '+998912345678', description: 'Qo\'shimcha telefon raqami', nullable: true })
  phone2!: string | null;

  @ApiPropertyOptional({ example: 'Toshkent sh., Chilonzor tumani', description: 'Manzili', nullable: true })
  address!: string | null;

  @ApiPropertyOptional({ example: 'Penitsillinga allergiya bor', description: 'Allergiya va muhim kasalliklar', nullable: true })
  allergies!: string | null;

  @ApiPropertyOptional({ example: 'Tavsiya orqali kelgan', description: 'Qo\'shimcha izoh', nullable: true })
  note!: string | null;

  @ApiProperty({ example: false, description: 'Arxivlanganlik holati' })
  isArchived!: boolean;

  @ApiProperty({ example: true, description: 'Telegram hisobi ulanganmi' })
  telegramLinked!: boolean;

  @ApiProperty({ example: '2026-11-20T10:00:00.000Z', description: 'Yaratilgan vaqt (UTC)' })
  createdAt!: string;

  @ApiProperty({ example: '2026-11-20T10:00:00.000Z', description: 'Oxirgi o\'zgarish vaqti (UTC)' })
  updatedAt!: string;
}
