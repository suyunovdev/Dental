import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'Admin123!', description: 'Joriy parol' })
  @IsString({ message: "Joriy parol matn bo'lishi kerak" })
  @IsNotEmpty({ message: 'Joriy parol kiritilishi shart' })
  currentPassword!: string;

  @ApiProperty({ example: 'YangiParol2026!', description: 'Yangi parol (kamida 8 belgi)' })
  @IsString({ message: "Yangi parol matn bo'lishi kerak" })
  @MinLength(8, { message: "Yangi parol kamida 8 ta belgidan iborat bo'lishi kerak" })
  newPassword!: string;
}
