import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../common/dto/pagination.dto.js';
import { PatientsService } from './patients.service.js';
import { CreatePatientDto } from './dto/create-patient.dto.js';
import { UpdatePatientDto } from './dto/update-patient.dto.js';
import { PatientQueryDto } from './dto/patient-query.dto.js';
import { PatientDto, PatientShortDto } from './dto/patient.dto.js';

@ApiTags('patients')
@ApiBearerAuth()
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  @ApiOperation({ summary: 'Bemorlar ro\'yxati (sahifalash va qidiruv bilan)' })
  @ApiPaginatedResponse(PatientDto)
  async findAll(@Query() query: PatientQueryDto) {
    return this.patientsService.findAll(query);
  }

  @Get('check-phone')
  @ApiOperation({ summary: 'Telefon raqam bo\'yicha bemorlarni tekshirish' })
  @ApiQuery({ name: 'phone', required: true, example: '+998901234567' })
  @ApiResponse({
    status: 200,
    description: 'Shu raqamdagi bemorlar qisqa ro\'yxati',
    type: [PatientShortDto],
  })
  async checkPhone(@Query('phone') phone: string) {
    return this.patientsService.checkPhone(phone);
  }

  @Post()
  @ApiOperation({ summary: 'Yangi bemor qo\'shish' })
  @ApiResponse({
    status: 201,
    description: 'Bemor muvaffaqiyatli yaratildi',
    type: PatientDto,
  })
  async create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bemor ma\'lumotlarini ID bo\'yicha olish' })
  @ApiResponse({
    status: 200,
    description: 'Bemor ma\'lumotlari',
    type: PatientDto,
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.patientsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Bemor ma\'lumotlarini qisman yangilash' })
  @ApiResponse({
    status: 200,
    description: 'Yangilangan bemor ma\'lumotlari',
    type: PatientDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePatientDto: UpdatePatientDto,
  ) {
    return this.patientsService.update(id, updatePatientDto);
  }

  @Post(':id/archive')
  @ApiOperation({ summary: 'Bemorni arxivlash (faqat ADMIN)' })
  @ApiResponse({
    status: 200,
    description: 'Bemor arxivlandi',
    type: PatientDto,
  })
  async archive(@Param('id', ParseIntPipe) id: number) {
    return this.patientsService.archive(id);
  }

  @Post(':id/unarchive')
  @ApiOperation({ summary: 'Bemorni arxivdan chiqarish (faqat ADMIN)' })
  @ApiResponse({
    status: 200,
    description: 'Bemor arxivdan chiqarildi',
    type: PatientDto,
  })
  async unarchive(@Param('id', ParseIntPipe) id: number) {
    return this.patientsService.unarchive(id);
  }
}
