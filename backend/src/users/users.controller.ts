import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, ParseIntPipe, Req,
  HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common';
import {
  ApiTags, ApiBearerAuth, ApiOperation,
  ApiOkResponse, ApiCreatedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { UsersService } from './users.service.js';
import { UserDto, CreateUserDto, UpdateUserDto, ResetPasswordDto } from './dto/index.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

interface JwtPayload { sub: number; username: string; roles: string[] }

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private ip(req: Request): string {
    return (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
      ?? req.socket.remoteAddress
      ?? 'unknown';
  }

  @Get()
  @ApiOperation({ summary: 'Barcha foydalanuvchilar ro\'yxati' })
  @ApiOkResponse({ type: UserDto, isArray: true })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('doctors')
  @ApiOperation({ summary: 'Faol shifokorlar ro\'yxati (kalender uchun)' })
  @ApiOkResponse({ type: UserDto, isArray: true })
  findDoctors() {
    return this.usersService.findDoctors();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta foydalanuvchi' })
  @ApiOkResponse({ type: UserDto })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Yangi foydalanuvchi yaratish' })
  @ApiCreatedResponse({ type: UserDto })
  create(
    @Body() dto: CreateUserDto,
    @CurrentUser() actor: JwtPayload,
    @Req() req: Request,
  ) {
    return this.usersService.create(dto, actor.sub, this.ip(req));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Foydalanuvchini tahrirlash' })
  @ApiOkResponse({ type: UserDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @CurrentUser() actor: JwtPayload,
    @Req() req: Request,
  ) {
    return this.usersService.update(id, dto, actor.sub, this.ip(req));
  }

  @Patch(':id/block')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Foydalanuvchini bloklash' })
  @ApiOkResponse({ type: UserDto })
  block(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() actor: JwtPayload,
    @Req() req: Request,
  ) {
    return this.usersService.block(id, actor.sub, this.ip(req));
  }

  @Patch(':id/unblock')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Foydalanuvchini blokdan chiqarish' })
  @ApiOkResponse({ type: UserDto })
  unblock(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() actor: JwtPayload,
    @Req() req: Request,
  ) {
    return this.usersService.unblock(id, actor.sub, this.ip(req));
  }

  @Patch(':id/reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Parolni tiklash (admin tomonidan)' })
  resetPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ResetPasswordDto,
    @CurrentUser() actor: JwtPayload,
    @Req() req: Request,
  ) {
    return this.usersService.resetPassword(id, dto.newPassword, actor.sub, this.ip(req));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Foydalanuvchini o\'chirish (oxirgi admin himoyalangan)' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() actor: JwtPayload,
    @Req() req: Request,
  ) {
    return this.usersService.remove(id, actor.sub, this.ip(req));
  }
}
