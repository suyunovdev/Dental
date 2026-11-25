import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../generated/prisma/client.js';

export class MeDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Adminbek Rahbarov' })
  fullName!: string;

  @ApiProperty({ example: 'admin' })
  username!: string;

  @ApiProperty({ example: ['ADMIN'], enum: Role, isArray: true })
  roles!: Role[];

  @ApiProperty({ example: false })
  mustChangePassword!: boolean;
}

export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken!: string;

  @ApiProperty({ type: MeDto })
  user!: MeDto;
}

export class RefreshResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken!: string;
}
