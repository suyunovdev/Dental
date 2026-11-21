import { PrismaClient, Role, Gender, AppointmentStatus, VisitStatus, ToothStatus, PaymentType, PaymentMethod } from '../src/generated/prisma';

const prisma = new PrismaClient();

// bcrypt hash for 'Admin123!' (cost 12)
const DEFAULT_PASSWORD_HASH = '$2b$12$e80yqXFvL8fFjI1Vp/t4e.o1W0gWw0O4pZ4M4M.W6K0F0A4U7T.3u';

async function main() {
  console.log('--- Seeding boshlandi ---');

  // Tozalash (teskari tartibda)
  await prisma.auditLog.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.patientFile.deleteMany();
  await prisma.treatmentPlanItem.deleteMany();
  await prisma.treatmentPlan.deleteMany();
  await prisma.toothRecord.deleteMany();
  await prisma.visitService.deleteMany();
  await prisma.visit.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.service.deleteMany();
  await prisma.serviceCategory.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.doctorSchedule.deleteMany();
  await prisma.chair.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  // 1. Foydalanuvchilar (Xodimlar)
  const admin = await prisma.user.create({
    data: {
      fullName: 'Adminbek Rahbarov',
      username: (process.env.SEED_ADMIN_USERNAME || 'admin').toLowerCase(),
      passwordHash: DEFAULT_PASSWORD_HASH,
      phone: '+998901000001',
      roles: [Role.ADMIN],
      isActive: true,
      mustChangePassword: false,
    },
  });

  const receptionist = await prisma.user.create({
    data: {
      fullName: 'Munira Registratorova',
      username: 'receptionist',
      passwordHash: DEFAULT_PASSWORD_HASH,
      phone: '+998901000002',
      roles: [Role.RECEPTIONIST],
      isActive: true,
      mustChangePassword: false,
    },
  });

  const cashier = await prisma.user.create({
    data: {
      fullName: 'Kamola Kassirova',
      username: 'cashier',
      passwordHash: DEFAULT_PASSWORD_HASH,
      phone: '+998901000003',
      roles: [Role.CASHIER],
      isActive: true,
      mustChangePassword: false,
    },
  });

  // 3 nafar shifokor
  const doctor1 = await prisma.user.create({
    data: {
      fullName: 'Dr. Jasur Aliyev',
      username: 'dr_jasur',
      passwordHash: DEFAULT_PASSWORD_HASH,
      phone: '+998901000011',
      roles: [Role.DOCTOR],
      specialty: 'Terapevt',
      color: '#2F855A',
      sharePercent: 30,
      isActive: true,
      mustChangePassword: false,
    },
  });

  const doctor2 = await prisma.user.create({
    data: {
      fullName: 'Dr. Nodira Karimova',
      username: 'dr_nodira',
      passwordHash: DEFAULT_PASSWORD_HASH,
      phone: '+998901000012',
      roles: [Role.DOCTOR],
      specialty: 'Ortoped',
      color: '#3182CE',
      sharePercent: 35,
      isActive: true,
      mustChangePassword: false,
    },
  });

  const doctor3 = await prisma.user.create({
    data: {
      fullName: 'Dr. Bobur Umidov',
      username: 'dr_bobur',
      passwordHash: DEFAULT_PASSWORD_HASH,
      phone: '+998901000013',
      roles: [Role.DOCTOR],
      specialty: 'Jarroh',
      color: '#D69E2E',
      sharePercent: 40,
      isActive: true,
      mustChangePassword: false,
    },
  });

  const doctors = [doctor1, doctor2, doctor3];

  // Ish jadvallari: Dushanba-Shanba (1..6) 09:00 - 18:00 (540..1080 daqiqalar)
  for (const doc of doctors) {
    for (let weekday = 1; weekday <= 6; weekday++) {
      await prisma.doctorSchedule.create({
        data: {
          doctorId: doc.id,
          weekday,
          startMinute: 540,
          endMinute: 1080,
        },
      });
    }
  }

  // 2. Kreslolar (3 ta)
  const chair1 = await prisma.chair.create({ data: { name: '1-kreslo', isActive: true } });
  const chair2 = await prisma.chair.create({ data: { name: '2-kreslo', isActive: true } });
  const chair3 = await prisma.chair.create({ data: { name: '3-kreslo', isActive: true } });
  const chairs = [chair1, chair2, chair3];

  // 3. Xizmat toifalari va xizmatlar (~15 ta xizmat)
  const catTherapy = await prisma.serviceCategory.create({
    data: { name: 'Terapiya', sortOrder: 1, isActive: true },
  });
  const catSurgery = await prisma.serviceCategory.create({
    data: { name: 'Jarrohlik', sortOrder: 2, isActive: true },
  });
  const catOrthopedics = await prisma.serviceCategory.create({
    data: { name: 'Ortopediya', sortOrder: 3, isActive: true },
  });
  const catHygiene = await prisma.serviceCategory.create({
    data: { name: 'Gigiyena', sortOrder: 4, isActive: true },
  });

  const s1 = await prisma.service.create({
    data: { categoryId: catTherapy.id, code: 'TH-01', name: "Birlamchi stomatologik ko'rik", price: 50000, durationMin: 20 },
  });
  const s2 = await prisma.service.create({
    data: { categoryId: catTherapy.id, code: 'TH-02', name: 'Kariesni davolash (plomba)', price: 250000, durationMin: 45 },
  });
  const s3 = await prisma.service.create({
    data: { categoryId: catTherapy.id, code: 'TH-03', name: 'Pulpitni davolash (1 kanal)', price: 350000, durationMin: 60 },
  });
  const s4 = await prisma.service.create({
    data: { categoryId: catTherapy.id, code: 'TH-04', name: 'Tish nervini olish', price: 200000, durationMin: 40 },
  });

  const s5 = await prisma.service.create({
    data: { categoryId: catSurgery.id, code: 'SR-01', name: "Oddiy tish sug'urish", price: 150000, durationMin: 30 },
  });
  const s6 = await prisma.service.create({
    data: { categoryId: catSurgery.id, code: 'SR-02', name: "Murakkab tish sug'urish", price: 350000, durationMin: 60 },
  });
  const s7 = await prisma.service.create({
    data: { categoryId: catSurgery.id, code: 'SR-03', name: "Aql tishini sug'urish", price: 500000, durationMin: 60 },
  });
  const s8 = await prisma.service.create({
    data: { categoryId: catSurgery.id, code: 'SR-04', name: "Implant o'rnatish", price: 3500000, durationMin: 90 },
  });

  const s9 = await prisma.service.create({
    data: { categoryId: catOrthopedics.id, code: 'OR-01', name: 'Metall-keramika toj (koronka)', price: 600000, durationMin: 60 },
  });
  const s10 = await prisma.service.create({
    data: { categoryId: catOrthopedics.id, code: 'OR-02', name: 'Tsirkoniy toj', price: 1200000, durationMin: 60 },
  });
  const s11 = await prisma.service.create({
    data: { categoryId: catOrthopedics.id, code: 'OR-03', name: "Vkladka o'rnatish", price: 400000, durationMin: 45 },
  });
  const s12 = await prisma.service.create({
    data: { categoryId: catOrthopedics.id, code: 'OR-04', name: 'Tish protezi (qisman)', price: 1800000, durationMin: 60 },
  });

  const s13 = await prisma.service.create({
    data: { categoryId: catHygiene.id, code: 'HY-01', name: 'Ultratovushli tish tozalash', price: 200000, durationMin: 30 },
  });
  const s14 = await prisma.service.create({
    data: { categoryId: catHygiene.id, code: 'HY-02', name: 'Air Flow tozalash', price: 250000, durationMin: 30 },
  });
  const s15 = await prisma.service.create({
    data: { categoryId: catHygiene.id, code: 'HY-03', name: 'Tishlarni oqartirish (bleaching)', price: 1200000, durationMin: 60 },
  });

  const allServices = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15];

  // 4. Bemorlar (50 bemor)
  // Maxsus holat: Ona va bola (bitta telefon: +998901112233)
  const mother = await prisma.patient.create({
    data: {
      firstName: 'Dilnoza',
      lastName: 'Rahimova',
      middleName: 'Karimovna',
      birthDate: new Date('1988-04-12'),
      gender: Gender.FEMALE,
      phone: '+998901112233',
      address: 'Toshkent sh., Chilonzor tumani',
      allergies: 'Penitsillin',
      createdById: receptionist.id,
    },
  });

  const child = await prisma.patient.create({
    data: {
      firstName: 'Azizbek',
      lastName: 'Rahimov',
      middleName: 'Jasurovich',
      birthDate: new Date('2018-09-20'),
      gender: Gender.MALE,
      phone: '+998901112233', // O'sha telefon
      address: 'Toshkent sh., Chilonzor tumani',
      allergies: null,
      createdById: receptionist.id,
    },
  });

  const patients = [mother, child];

  // Qolgan 48 bemor
  const uzbekFirstNamesM = ['Anvar', 'Bekzod', 'Doston', 'Elbek', 'Farhod', 'G\'ayrat', 'Humoyun', 'Ilyos', 'Javohir', 'Kamron', 'Mansur', 'Nodir', 'Otabek', 'Po\'lat', 'Qodir', 'Rustam', 'Sanjar', 'Temur', 'Ulug\'bek', 'Vali', 'Xurshid', 'Yodgor', 'Zafar', 'Akmal'];
  const uzbekFirstNamesF = ['Aziza', 'Barno', 'Charos', 'Dildora', 'Feruza', 'Gulnoza', 'Hilola', 'Iroda', 'Kamola', 'Lola', 'Madina', 'Nargiza', 'Oydin', 'Parvina', 'Ra\'no', 'Sevara', 'Umida', 'Vazira', 'Yulduz', 'Zilola', 'Shahnoza', 'Malika', 'Nigora', 'Zuhra'];
  const uzbekLastNames = ['Karimov', 'Rahimov', 'Aliyev', 'Tursunov', 'Umarov', 'Sodiqov', 'Ergashev', 'Mirzayev', 'Qosimov', 'Shamsiyev', 'Yusupov', 'Rasulov', 'Bekmurodov', 'Xoliqov', 'Nazarov', 'Boboyev'];

  for (let i = 0; i < 48; i++) {
    const isMale = i % 2 === 0;
    const fNames = isMale ? uzbekFirstNamesM : uzbekFirstNamesF;
    const firstName = fNames[i % fNames.length];
    const baseLastName = uzbekLastNames[i % uzbekLastNames.length];
    const lastName = isMale ? baseLastName : `${baseLastName}a`;
    const phoneNum = (900000000 + (i + 100) * 137).toString().slice(0, 7);
    const phone = `+99890${phoneNum}`;

    const p = await prisma.patient.create({
      data: {
        firstName,
        lastName,
        gender: isMale ? Gender.MALE : Gender.FEMALE,
        birthDate: new Date(1980 + (i % 25), (i % 12), (i % 28) + 1),
        phone,
        address: `Toshkent sh., ${i + 1}-mavze`,
        allergies: i % 7 === 0 ? 'Lidokain' : null,
        createdById: receptionist.id,
      },
    });
    patients.push(p);
  }

  // 5. Qabullar (Joriy haftaga 30 ta qabul)
  const now = new Date();
  const appointments = [];

  for (let i = 0; i < 30; i++) {
    const doc = doctors[i % doctors.length];
    const chair = chairs[i % chairs.length];
    const patient = patients[i % patients.length];

    // Dushanbadan shanbagacha soat 10:00 dan 16:00 oralig'ida
    const dayOffset = (i % 6);
    const appDate = new Date(now);
    appDate.setDate(now.getDate() - now.getDay() + 1 + dayOffset); // shu hafta dushanbadan
    appDate.setHours(9 + (Math.floor(i / 6) * 2), (i % 2) * 30, 0, 0);

    const startAt = new Date(appDate);
    const endAt = new Date(appDate.getTime() + 45 * 60 * 1000); // 45 min

    const status = i < 10 
      ? AppointmentStatus.COMPLETED 
      : (i < 15 ? AppointmentStatus.ARRIVED : AppointmentStatus.SCHEDULED);

    const app = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: doc.id,
        chairId: chair.id,
        startAt,
        endAt,
        status,
        arrivedAt: status !== AppointmentStatus.SCHEDULED ? startAt : null,
        createdById: receptionist.id,
      },
    });
    appointments.push(app);
  }

  // 6. Tashriflar (10 ta yakunlangan tashrif)
  for (let i = 0; i < 10; i++) {
    const app = appointments[i];
    const doc = doctors.find((d) => d.id === app.doctorId)!;
    const service1 = allServices[i % allServices.length];
    const service2 = allServices[(i + 3) % allServices.length];

    const subtotal = service1.price + service2.price;
    const discountAmount = i % 3 === 0 ? 50000 : 0;
    const total = subtotal - discountAmount;

    const visit = await prisma.visit.create({
      data: {
        appointmentId: app.id,
        patientId: app.patientId,
        doctorId: app.doctorId,
        status: VisitStatus.COMPLETED,
        complaint: 'Tish og\'rig\'i va sezuvchanlik',
        diagnosis: 'Karies o\'rta darajali',
        startedAt: app.startAt,
        completedAt: app.endAt,
        subtotal,
        discountAmount,
        discountReason: discountAmount > 0 ? 'Aksiya bo\'yicha' : null,
        total,
        doctorSharePercent: doc.sharePercent,
      },
    });

    // Tashrif xizmatlari
    await prisma.visitService.create({
      data: {
        visitId: visit.id,
        serviceId: service1.id,
        serviceName: service1.name,
        unitPrice: service1.price,
        quantity: 1,
        amount: service1.price,
        toothNumber: 16,
      },
    });

    await prisma.visitService.create({
      data: {
        visitId: visit.id,
        serviceId: service2.id,
        serviceName: service2.name,
        unitPrice: service2.price,
        quantity: 1,
        amount: service2.price,
        toothNumber: 17,
      },
    });

    // Tish holati yozuvi
    await prisma.toothRecord.create({
      data: {
        patientId: app.patientId,
        doctorId: doc.id,
        visitId: visit.id,
        toothNumber: 16,
        status: ToothStatus.FILLED,
        note: 'Plomba qo\'yildi',
      },
    });

    // 7. To'lovlar (To'liq yoki qisman to'lovlar)
    const paymentAmount = i % 2 === 0 ? total : Math.floor(total / 2); // Qisman to'lov misoli
    await prisma.payment.create({
      data: {
        visitId: visit.id,
        patientId: app.patientId,
        cashierId: cashier.id,
        type: PaymentType.PAYMENT,
        method: PaymentMethod.CASH,
        amount: paymentAmount,
        clientRequestId: `req-seed-${visit.id}-1`,
        note: i % 2 === 0 ? 'To\'liq to\'lov' : '50% avans/qisman to\'lov',
      },
    });
  }

  console.log('--- Seeding muvaffaqiyatli yakunlandi! ---');
  console.log(`Foydalanuvchilar: ${await prisma.user.count()} ta`);
  console.log(`Kreslolar: ${await prisma.chair.count()} ta`);
  console.log(`Xizmatlar: ${await prisma.service.count()} ta`);
  console.log(`Bemorlar: ${await prisma.patient.count()} ta`);
  console.log(`Qabullar: ${await prisma.appointment.count()} ta`);
  console.log(`Yakunlangan tashriflar: ${await prisma.visit.count()} ta`);
  console.log(`To'lovlar: ${await prisma.payment.count()} ta`);
}

main()
  .catch((e) => {
    console.error('Seed xatosi:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
