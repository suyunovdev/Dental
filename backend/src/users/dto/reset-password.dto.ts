import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: 'NewP@ssw0rd!', minLength: 8 })
  @IsString() @IsNotEmpty() @MinLength(8) @MaxLength(72)
  newPassword!: string;
}
