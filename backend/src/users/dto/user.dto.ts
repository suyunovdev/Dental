import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../generated/prisma/index.js';

export class UserDto {
  @ApiProperty() id!: number;
  @ApiProperty() fullName!: string;
  @ApiProperty() username!: string;
  @ApiPropertyOptional() phone?: string | null;
  @ApiProperty({ enum: Role, isArray: true }) roles!: Role[];
  @ApiProperty() isActive!: boolean;
  @ApiProperty() mustChangePassword!: boolean;
  @ApiPropertyOptional() specialty?: string | null;
  @ApiPropertyOptional() color?: string | null;
  @ApiPropertyOptional() sharePercent?: number | null;
  @ApiProperty() createdAt!: Date;
  @ApiProperty() updatedAt!: Date;
}
