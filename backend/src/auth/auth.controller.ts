import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import {
  LoginDto,
  ChangePasswordDto,
  LoginResponseDto,
  RefreshResponseDto,
  MeDto,
} from './dto/index.js';
import { Public, CurrentUser } from '../common/decorators/index.js';
import { JwtAuthGuard } from '../common/guards/index.js';

@ApiTags('Auth')
@Controller('auth')
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Tizimga kirish (Login)' })
  @ApiResponse({
    status: 200,
    description: 'Muvaffaqiyatli kirildi',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Login yoki parol noto\'g\'ri' })
  @ApiResponse({ status: 403, description: 'Xodim bloklangan' })
  @ApiResponse({ status: 429, description: 'Juda ko\'p urinish (limit: daqiqasiga 5 ta)' })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    return this.authService.login(dto, req, res);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Tokenni yangilash (cookie orqali)' })
  @ApiResponse({
    status: 200,
    description: 'Yangi access token berildi',
    type: RefreshResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Yaroqsiz yoki muddati o\'tgan refresh token' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RefreshResponseDto> {
    return this.authService.refreshToken(req, res);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tizimdan chiqish (Logout)' })
  @ApiResponse({ status: 204, description: 'Sessiya muvaffaqiyatli yopildi' })
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.authService.logout(req, res);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Joriy kirgan xodim ma\'lumotlari' })
  @ApiResponse({
    status: 200,
    description: 'Foydalanuvchi ma\'lumotlari',
    type: MeDto,
  })
  @ApiResponse({ status: 401, description: 'Avtorizatsiyadan o\'tilmagan' })
  async me(@CurrentUser('id') userId: number): Promise<MeDto> {
    return this.authService.getMe(userId);
  }

  @Post('change-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Parolni almashtirish' })
  @ApiResponse({ status: 204, description: 'Parol muvaffaqiyatli almashtirildi' })
  @ApiResponse({ status: 400, description: 'Yangi parol talablarga mos kelmaydi' })
  @ApiResponse({ status: 401, description: 'Joriy parol noto\'g\'ri' })
  async changePassword(
    @CurrentUser('id') userId: number,
    @Body() dto: ChangePasswordDto,
    @Req() req: Request,
  ): Promise<void> {
    await this.authService.changePassword(userId, dto, req);
  }
}
