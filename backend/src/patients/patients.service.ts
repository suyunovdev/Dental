import { HttpStatus, Injectable } from '@nestjs/common';
import { AppException, ErrorCode } from '../common/errors.js';
import { Paginated, paginate } from '../common/dto/pagination.dto.js';
import { CreatePatientDto } from './dto/create-patient.dto.js';
import { UpdatePatientDto } from './dto/update-patient.dto.js';
import { PatientQueryDto } from './dto/patient-query.dto.js';
import { PatientDto, PatientShortDto } from './dto/patient.dto.js';

@Injectable()
export class PatientsService {
  // Kontrakt sinovi uchun soxta (mock) bemor
  private mockPatient(id = 1, archived = false): PatientDto {
    return {
      id,
      firstName: 'Jasur',
      lastName: 'Aliyev',
      middleName: 'Anvarovich',
      fullName: 'Aliyev Jasur Anvarovich',
      birthDate: '1995-04-12',
      gender: 'MALE',
      phone: '+998901234567',
      phone2: null,
      address: 'Toshkent sh., Chilonzor',
      allergies: 'Penitsillinga allergiya bor',
      note: 'Birinchi tashrif',
      isArchived: archived,
      telegramLinked: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async findAll(query: PatientQueryDto): Promise<Paginated<PatientDto>> {
    const items = [this.mockPatient(1), this.mockPatient(2)];
    return paginate(items, 2, query);
  }

  async checkPhone(phone: string): Promise<PatientShortDto[]> {
    if (!phone) {
      return [];
    }
    return [
      {
        id: 1,
        fullName: 'Aliyev Jasur Anvarovich',
        phone,
        birthDate: '1995-04-12',
      },
    ];
  }

  async create(dto: CreatePatientDto): Promise<PatientDto> {
    const fullName = [dto.lastName, dto.firstName, dto.middleName]
      .filter(Boolean)
      .join(' ');

    return {
      id: 42,
      firstName: dto.firstName,
      lastName: dto.lastName,
      middleName: dto.middleName || null,
      fullName,
      birthDate: dto.birthDate || null,
      gender: dto.gender || null,
      phone: dto.phone,
      phone2: dto.phone2 || null,
      address: dto.address || null,
      allergies: dto.allergies || null,
      note: dto.note || null,
      isArchived: false,
      telegramLinked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async findOne(id: number): Promise<PatientDto> {
    if (id <= 0) {
      throw new AppException(
        ErrorCode.NOT_FOUND,
        HttpStatus.NOT_FOUND,
        'Bemor topilmadi',
      );
    }
    return this.mockPatient(id);
  }

  async update(id: number, dto: UpdatePatientDto): Promise<PatientDto> {
    const patient = this.mockPatient(id);
    const firstName = dto.firstName || patient.firstName;
    const lastName = dto.lastName || patient.lastName;
    const middleName = dto.middleName !== undefined ? dto.middleName : patient.middleName;

    return {
      id: patient.id,
      firstName,
      lastName,
      middleName,
      fullName: [lastName, firstName, middleName].filter(Boolean).join(' '),
      birthDate: dto.birthDate !== undefined ? dto.birthDate : patient.birthDate,
      gender: dto.gender !== undefined ? dto.gender : patient.gender,
      phone: dto.phone || patient.phone,
      phone2: dto.phone2 !== undefined ? dto.phone2 : patient.phone2,
      address: dto.address !== undefined ? dto.address : patient.address,
      allergies: dto.allergies !== undefined ? dto.allergies : patient.allergies,
      note: dto.note !== undefined ? dto.note : patient.note,
      isArchived: patient.isArchived,
      telegramLinked: patient.telegramLinked,
      createdAt: patient.createdAt,
      updatedAt: new Date().toISOString(),
    };
  }

  async archive(id: number): Promise<PatientDto> {
    return this.mockPatient(id, true);
  }

  async unarchive(id: number): Promise<PatientDto> {
    return this.mockPatient(id, false);
  }
}
