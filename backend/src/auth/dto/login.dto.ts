import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin', description: 'Xodim logini' })
  @IsString({ message: "Login matn bo'lishi kerak" })
  @IsNotEmpty({ message: 'Login kiritilishi shart' })
  username!: string;

  @ApiProperty({ example: 'Admin123!', description: 'Xodim paroli' })
  @IsString({ message: "Parol matn bo'lishi kerak" })
  @IsNotEmpty({ message: 'Parol kiritilishi shart' })
  password!: string;
}
