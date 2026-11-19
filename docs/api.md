# F-2 API kontrakti (v1)

> Ishlab turgan backendda asl manba — Swagger: `/api/docs` (JSON: `/api/docs-json`).
> Bu fayl — jamoaviy kelishuv. Endpoint qo'shilsa yoki shakli o'zgarsa, shu fayl **o'sha PR'ning o'zida** yangilanadi va frontendchiga shu kuni aytiladi.

Arxitektura va biznes qoidalar: [arxitektura.md](arxitektura.md).

## 1. Umumiy qoidalar

| Nima | Qoida | Misol |
| --- | --- | --- |
| Manzil | Hamma endpoint `/api` bilan boshlanadi | `/api/patients` |
| Format | JSON, maydonlar `camelCase` | `{ "firstName": "Jasur" }` |
| Avtorizatsiya | `Authorization: Bearer <accessToken>` | |
| Refresh | `rt` cookie (httpOnly), faqat `/api/auth/*` ga yuboriladi | |
| ID | Butun son | `42` |
| Vaqt | ISO 8601, UTC | `"2026-12-03T05:00:00.000Z"` (Toshkentda 10:00) |
| Sana | `YYYY-MM-DD`, Toshkent kuni | `"2026-12-03"` |
| Pul | Butun so'm | `350000` |
| Telefon | `+998` va 9 raqam | `"+998901234567"` |
| Sahifalash | So'rov: `?page=1&pageSize=20` (`pageSize` ≤ 100). Javob: `Paginated<T>` | 3-bo'lim |
| Filtrlar | Query'da; bo'sh qiymat — filtr yo'q | `?status=SCHEDULED` |

Status kodlari: `200` OK, `201` yaratildi, `204` javobsiz muvaffaqiyat, `400` noto'g'ri ma'lumot, `401` kirilmagan, `403` ruxsat yo'q, `404` topilmadi, `409` to'qnashuv, `413` fayl katta, `415` fayl turi mos emas, `422` biznes qoida buzildi, `429` juda ko'p urinish, `500` server xatosi.

## 2. Xato formati

Har xato bir xil shaklda qaytadi (T-10, global exception filter):

```json
{
  "statusCode": 409,
  "code": "APPOINTMENT_DOCTOR_CONFLICT",
  "message": "Shifokor bu vaqtda band: 10:00–10:30",
  "details": { "conflictWith": { "id": 812, "startAt": "2026-12-03T05:00:00.000Z", "endAt": "2026-12-03T05:30:00.000Z" } },
  "path": "/api/appointments",
  "timestamp": "2026-12-03T04:12:44.120Z"
}
```

- `message` — o'zbekcha, foydalanuvchiga ko'rsatsa bo'ladigan matn.
- `code` — frontend shunga qarab qaror qiladi (matnga qarab emas).
- Validatsiya xatosida: `"details": { "fields": [{ "field": "phone", "message": "Telefon raqami noto'g'ri" }] }`.

| `code` | HTTP | Qachon |
| --- | --- | --- |
| `VALIDATION_ERROR` | 400 | DTO tekshiruvidan o'tmadi |
| `UNAUTHORIZED` | 401 | Token yo'q yoki muddati o'tgan |
| `INVALID_CREDENTIALS` | 401 | Login yoki parol noto'g'ri |
| `FORBIDDEN` | 403 | Rol yoki egalik yetarli emas |
| `USER_BLOCKED` | 403 | Xodim bloklangan |
| `PASSWORD_CHANGE_REQUIRED` | 403 | Avval parolni almashtirish kerak |
| `NOT_FOUND` | 404 | Yozuv topilmadi |
| `CONFLICT` | 409 | Unique maydon takrorlandi (Prisma `P2002`) |
| `PATIENT_DUPLICATE` | 409 | Shu telefon va ism bilan bemor bor |
| `APPOINTMENT_DOCTOR_CONFLICT` | 409 | Shifokor bu vaqtda band |
| `APPOINTMENT_CHAIR_CONFLICT` | 409 | Kreslo bu vaqtda band |
| `OUTSIDE_WORKING_HOURS` | 422 | Shifokor ish vaqtidan tashqarida |
| `INVALID_STATUS_TRANSITION` | 422 | Bunday status o'tishi mumkin emas |
| `VISIT_NOT_OPEN` | 422 | Tashrif yakunlangan, o'zgartirib bo'lmaydi |
| `DIAGNOSIS_REQUIRED` | 422 | Tashxissiz yakunlab bo'lmaydi |
| `PAYMENT_EXCEEDS_DEBT` | 422 | Summa qarzdan katta |
| `DISCOUNT_NOT_ALLOWED` | 422 | To'lov qilingan yoki chegara oshdi |
| `LAST_ADMIN` | 422 | Oxirgi faol ADMIN'ni bloklab yoki rolini olib bo'lmaydi |
| `FILE_TOO_LARGE` | 413 | Fayl 15 MB dan katta |
| `FILE_TYPE_NOT_ALLOWED` | 415 | JPEG, PNG, WEBP yoki PDF emas |
| `TOO_MANY_REQUESTS` | 429 | Login urinishlari limiti |
| `INTERNAL_ERROR` | 500 | Kutilmagan xato (tafsiloti faqat server logida) |

## 3. Asosiy tiplar

```ts
type Role = 'ADMIN' | 'RECEPTIONIST' | 'DOCTOR' | 'CASHIER';
type AppointmentStatus = 'SCHEDULED' | 'ARRIVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
type ToothStatus = 'HEALTHY' | 'CARIES' | 'FILLED' | 'PULPITIS' | 'PERIODONTITIS' | 'ROOT_ONLY' | 'CROWN' | 'IMPLANT' | 'MISSING';
type PaymentMethod = 'CASH' | 'CARD' | 'TRANSFER';

interface Paginated<T> { items: T[]; total: number; page: number; pageSize: number }

interface Me { id: number; fullName: string; username: string; roles: Role[]; mustChangePassword: boolean }

interface User {
  id: number; fullName: string; username: string; phone: string | null; roles: Role[];
  isActive: boolean; specialty: string | null; color: string | null; sharePercent: number | null; createdAt: string;
}
interface DoctorShort { id: number; fullName: string; specialty: string | null; color: string | null }
interface Chair { id: number; name: string; isActive: boolean }
interface ScheduleDay { weekday: 1 | 2 | 3 | 4 | 5 | 6 | 7; isWorking: boolean; startTime: string | null; endTime: string | null } // "09:00"

interface Patient {
  id: number; firstName: string; lastName: string; middleName: string | null; fullName: string;
  birthDate: string | null; gender: 'MALE' | 'FEMALE' | null; phone: string; phone2: string | null;
  address: string | null; allergies: string | null; note: string | null;
  isArchived: boolean; telegramLinked: boolean; createdAt: string; updatedAt: string;
}
interface PatientShort { id: number; fullName: string; phone: string; birthDate: string | null }

interface ServiceCategory { id: number; name: string; sortOrder: number; isActive: boolean }
interface ServiceItem {
  id: number; categoryId: number; categoryName: string; code: string | null;
  name: string; price: number; durationMin: number; isActive: boolean;
}

interface Appointment {
  id: number; startAt: string; endAt: string; status: AppointmentStatus;
  note: string | null; cancelReason: string | null; arrivedAt: string | null;
  patient: PatientShort; doctor: DoctorShort; chair: Chair | null; visitId: number | null; createdAt: string;
}

interface Visit {
  id: number; appointmentId: number; status: 'OPEN' | 'COMPLETED';
  patient: PatientShort & { allergies: string | null }; doctor: DoctorShort;
  complaint: string | null; diagnosis: string | null; note: string | null;
  startedAt: string; completedAt: string | null;
  services: VisitServiceLine[]; subtotal: number; discountAmount: number; discountReason: string | null; total: number;
}
interface VisitServiceLine {
  id: number; serviceId: number; serviceName: string; toothNumber: number | null;
  quantity: number; unitPrice: number; amount: number;
}

interface ToothState { toothNumber: number; status: ToothStatus; note: string | null; updatedAt: string; doctor: DoctorShort }
interface ToothRecord { id: number; toothNumber: number; status: ToothStatus; note: string | null; visitId: number | null; doctor: DoctorShort; createdAt: string }

interface TreatmentPlan {
  id: number; patientId: number; doctor: DoctorShort; title: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED'; note: string | null;
  items: PlanItem[]; total: number; createdAt: string;   // total — CANCELLED bo'lmagan bandlar yig'indisi
}
interface PlanItem {
  id: number; serviceId: number; serviceName: string; toothNumber: number | null; stage: number;
  quantity: number; unitPrice: number; amount: number; status: 'PLANNED' | 'DONE' | 'CANCELLED'; visitId: number | null; note: string | null;
}

interface PatientFile {
  id: number; kind: 'XRAY' | 'PHOTO' | 'DOCUMENT'; originalName: string; mimeType: string; sizeBytes: number;
  note: string | null; visitId: number | null; uploadedBy: { id: number; fullName: string }; createdAt: string;
}

interface Payment {
  id: number; visitId: number; patient: PatientShort; type: 'PAYMENT' | 'REFUND'; method: PaymentMethod;
  amount: number; note: string | null; reason: string | null; refundOfId: number | null;
  cashier: { id: number; fullName: string }; createdAt: string;
}
interface VisitBalance { visitId: number; completedAt: string; doctor: DoctorShort; total: number; paid: number; debt: number }
interface UnpaidVisit extends VisitBalance { patient: PatientShort }
interface PatientBalance { patientId: number; totalBilled: number; totalPaid: number; debt: number; visits: VisitBalance[] }

interface Receipt {
  receiptNo: string; clinicName: string; clinicPhone: string; createdAt: string;
  cashier: string; patient: string; doctor: string;
  lines: { name: string; toothNumber: number | null; quantity: number; unitPrice: number; amount: number }[];
  subtotal: number; discountAmount: number; total: number;
  paidNow: number; method: PaymentMethod; paidTotal: number; debtLeft: number;
}

interface AuditLogEntry {
  id: number; actor: { id: number; fullName: string } | null; action: string; entity: string;
  entityId: number | null; summary: string | null; before: unknown; after: unknown; ip: string | null; createdAt: string;
}
```

## 4. Endpoint'lar

"Rollar" ustunida: **Hamma** — kirgan har qanday xodim; **Public** — tokensiz.

### 4.1 Auth — Shoxjahon (T-15, T-16)

| Metod | Yo'l | Rollar | Tavsif |
| --- | --- | --- | --- |
| POST | `/api/auth/login` | Public | `{ username, password }` → `{ accessToken, user: Me }` + `rt` cookie |
| POST | `/api/auth/refresh` | Public (cookie) | → `{ accessToken }`, cookie yangilanadi |
| POST | `/api/auth/logout` | Hamma | → `204`, joriy refresh bekor, cookie o'chadi |
| GET | `/api/auth/me` | Hamma | → `Me` |
| POST | `/api/auth/change-password` | Hamma | `{ currentPassword, newPassword }` → `204`; boshqa sessiyalar yopiladi |

### 4.2 Xodimlar — Muhammadyusuf (T-17)

| Metod | Yo'l | Rollar | Tavsif |
| --- | --- | --- | --- |
| GET | `/api/users?search=&role=&isActive=&page=&pageSize=` | ADMIN | → `Paginated<User>` |
| POST | `/api/users` | ADMIN | `{ fullName, username, password, roles, phone?, specialty?, color?, sharePercent? }` → `User`. `mustChangePassword = true` |
| GET | `/api/users/:id` | ADMIN | → `User` |
| PATCH | `/api/users/:id` | ADMIN | `{ fullName?, phone?, roles?, specialty?, color?, sharePercent? }` → `User` |
| POST | `/api/users/:id/block` | ADMIN | → `User`; hamma sessiyalari yopiladi. O'zini bloklab bo'lmaydi |
| POST | `/api/users/:id/unblock` | ADMIN | → `User` |
| POST | `/api/users/:id/reset-password` | ADMIN | `{ newPassword }` → `204`; `mustChangePassword = true` |
| GET | `/api/doctors` | Hamma | → `DoctorShort[]` (faqat faol shifokorlar) |

### 4.3 Kreslolar va ish jadvali — Muhammadyusuf (T-30)

| Metod | Yo'l | Rollar | Tavsif |
| --- | --- | --- | --- |
| GET | `/api/chairs` | Hamma | → `Chair[]` |
| POST | `/api/chairs` | ADMIN | `{ name }` → `Chair` |
| PATCH | `/api/chairs/:id` | ADMIN | `{ name?, isActive? }` → `Chair` |
| GET | `/api/doctors/:id/schedule` | Hamma | → `ScheduleDay[]` (doim 7 ta) |
| PUT | `/api/doctors/:id/schedule` | ADMIN | `ScheduleDay[]` (7 ta) → butun hafta almashtiriladi |
| GET | `/api/doctors/:id/free-slots?date=&durationMin=` | ADMIN, RECEPTIONIST | → `{ startAt, endAt }[]`, 15 daqiqa qadam. **Ixtiyoriy** (vaqt qolsa) |

### 4.4 Bemorlar — Muhammadyusuf (T-18)

| Metod | Yo'l | Rollar | Tavsif |
| --- | --- | --- | --- |
| GET | `/api/patients?search=&archived=&page=&pageSize=` | Hamma | → `Paginated<Patient>`. `archived=true` faqat ADMIN |
| GET | `/api/patients/check-phone?phone=` | ADMIN, RECEPTIONIST | → `PatientShort[]` (shu raqamdagi bemorlar) |
| POST | `/api/patients` | ADMIN, RECEPTIONIST | `{ firstName, lastName, phone, middleName?, birthDate?, gender?, phone2?, address?, allergies?, note? }` → `Patient` |
| GET | `/api/patients/:id` | Hamma | → `Patient` |
| PATCH | `/api/patients/:id` | ADMIN, RECEPTIONIST; DOCTOR faqat `allergies` | Qisman yangilash → `Patient` |
| POST | `/api/patients/:id/archive` | ADMIN | → `Patient` |
| POST | `/api/patients/:id/unarchive` | ADMIN | → `Patient` |

### 4.5 Xizmatlar va narxlar — Muhammadyusuf (T-19)

| Metod | Yo'l | Rollar | Tavsif |
| --- | --- | --- | --- |
| GET | `/api/catalog/categories` | Hamma | → `ServiceCategory[]` |
| POST | `/api/catalog/categories` | ADMIN | `{ name, sortOrder? }` |
| PATCH | `/api/catalog/categories/:id` | ADMIN | `{ name?, sortOrder?, isActive? }` |
| GET | `/api/catalog/services?categoryId=&search=&includeInactive=` | Hamma | → `ServiceItem[]` (sahifasiz, preyskurant kichik) |
| POST | `/api/catalog/services` | ADMIN | `{ categoryId, name, price, durationMin?, code? }` → `ServiceItem` |
| PATCH | `/api/catalog/services/:id` | ADMIN | `{ categoryId?, name?, price?, durationMin?, code?, isActive? }` → `ServiceItem` |

### 4.6 Qabullar — Shoxjahon (T-28, T-29)

| Metod | Yo'l | Rollar | Tavsif |
| --- | --- | --- | --- |
| GET | `/api/appointments?from=&to=&doctorId=&chairId=&status=` | ADMIN, RECEPTIONIST; DOCTOR (faqat o'ziniki) | `from`, `to` — ISO vaqt, oraliq ≤ 31 kun → `Appointment[]` |
| POST | `/api/appointments` | ADMIN, RECEPTIONIST | `{ patientId, doctorId, startAt, endAt, chairId?, note? }` → `201 Appointment` |
| GET | `/api/appointments/:id` | ADMIN, RECEPTIONIST; DOCTOR (o'ziniki) | → `Appointment` |
| PATCH | `/api/appointments/:id` | ADMIN, RECEPTIONIST | Ko'chirish: `{ startAt?, endAt?, doctorId?, chairId?, note? }` → `Appointment` |
| POST | `/api/appointments/:id/status` | ADMIN, RECEPTIONIST | `{ status, reason? }` → `Appointment` (arxitektura.md, 7.1) |
| GET | `/api/patients/:id/appointments` | ADMIN, RECEPTIONIST; DOCTOR (o'z bemori) | → `Appointment[]`, yangisi birinchi |

### 4.7 Tashriflar — Shoxjahon (T-38, chegirma T-47)

| Metod | Yo'l | Rollar | Tavsif |
| --- | --- | --- | --- |
| POST | `/api/visits` | DOCTOR (o'z qabuli) | `{ appointmentId }` → `201 Visit`; qabul `IN_PROGRESS` |
| GET | `/api/visits/:id` | DOCTOR (o'z bemori), ADMIN | → `Visit` |
| PATCH | `/api/visits/:id` | DOCTOR (o'ziniki, `OPEN`) | `{ complaint?, diagnosis?, note? }` → `Visit` |
| POST | `/api/visits/:id/services` | DOCTOR (o'ziniki, `OPEN`) | `{ serviceId, toothNumber?, quantity? }` → `Visit` |
| DELETE | `/api/visits/:id/services/:lineId` | DOCTOR (o'ziniki, `OPEN`) | → `Visit` |
| POST | `/api/visits/:id/complete` | DOCTOR (o'ziniki, `OPEN`) | → `Visit` (`COMPLETED`) |
| POST | `/api/visits/:id/discount` | CASHIER, ADMIN | `{ amount, reason }` → `Visit` (arxitektura.md, 7.3) |
| GET | `/api/patients/:id/visits` | DOCTOR (o'z bemori), ADMIN | → `Visit[]`, yangisi birinchi |

### 4.8 Tish formulasi — Shoxjahon (T-37)

| Metod | Yo'l | Rollar | Tavsif |
| --- | --- | --- | --- |
| GET | `/api/patients/:id/teeth` | DOCTOR (o'z bemori), ADMIN | → `ToothState[]` (faqat yozuvi bor tishlar; qolgani `HEALTHY`) |
| GET | `/api/patients/:id/teeth/:toothNumber/history` | DOCTOR (o'z bemori), ADMIN | → `ToothRecord[]`, yangisi birinchi |
| POST | `/api/patients/:id/teeth` | DOCTOR | `{ toothNumber, status, visitId, note? }` → `201 ToothRecord`. `visitId` — shifokorning shu bemordagi `OPEN` tashrifi |

### 4.9 Davolash rejasi — Muhammadyusuf (T-39)

| Metod | Yo'l | Rollar | Tavsif |
| --- | --- | --- | --- |
| GET | `/api/patients/:id/treatment-plans` | DOCTOR (o'z bemori), ADMIN | → `TreatmentPlan[]` |
| POST | `/api/patients/:id/treatment-plans` | DOCTOR (o'z bemori) | `{ title, note?, items: [{ serviceId, toothNumber?, stage?, quantity?, note? }] }` → `201 TreatmentPlan` |
| GET | `/api/treatment-plans/:id` | DOCTOR (o'z bemori), ADMIN | → `TreatmentPlan` |
| PATCH | `/api/treatment-plans/:id` | DOCTOR (o'z bemori) | `{ title?, note?, status? }` → `TreatmentPlan` |
| POST | `/api/treatment-plans/:id/items` | DOCTOR (o'z bemori) | `{ serviceId, toothNumber?, stage?, quantity?, note? }` → `TreatmentPlan` |
| PATCH | `/api/treatment-plans/:id/items/:itemId` | DOCTOR (o'z bemori) | `{ stage?, quantity?, toothNumber?, status?, visitId?, note? }` → `TreatmentPlan` |

Bandlar o'chirilmaydi — `status: CANCELLED` qilinadi. Narx band qo'shilgan paytda katalogdan nusxalanadi.

### 4.10 Fayllar — Muhammadyusuf (T-40)

| Metod | Yo'l | Rollar | Tavsif |
| --- | --- | --- | --- |
| POST | `/api/patients/:id/files` | DOCTOR (o'z bemori), ADMIN | `multipart/form-data`: `file`, `kind`, `visitId?`, `note?` → `201 PatientFile` |
| GET | `/api/patients/:id/files` | DOCTOR (o'z bemori), ADMIN | → `PatientFile[]` (o'chirilganlarsiz) |
| GET | `/api/files/:id/content` | DOCTOR (o'z bemori), ADMIN | Faylning o'zi (stream), `Content-Disposition: inline` |
| DELETE | `/api/files/:id` | ADMIN | → `204` (`deletedAt` qo'yiladi, disk tozalanmaydi) |

### 4.11 To'lovlar — Shoxjahon (T-47)

| Metod | Yo'l | Rollar | Tavsif |
| --- | --- | --- | --- |
| GET | `/api/payments/unpaid-visits?search=&page=&pageSize=` | CASHIER, ADMIN | → `Paginated<UnpaidVisit>`, eskisi birinchi |
| GET | `/api/patients/:id/balance` | CASHIER, ADMIN, RECEPTIONIST | → `PatientBalance` |
| POST | `/api/payments` | CASHIER, ADMIN | Sarlavha `Idempotency-Key: <uuid>` (majburiy). `{ visitId, amount, method, note? }` → `201 Payment` (takror kalit — `200` va avvalgi to'lov) |
| POST | `/api/payments/:id/refund` | ADMIN | `{ amount, reason }` → `201 Payment` (`type: REFUND`) |
| GET | `/api/payments?from=&to=&method=&cashierId=&page=&pageSize=` | CASHIER, ADMIN | → `Paginated<Payment>` + `totals: { cash, card, transfer, refunds, net }` |
| GET | `/api/payments/:id/receipt` | CASHIER, ADMIN | → `Receipt` |

### 4.12 Hisobotlar — Muhammadyusuf (T-48, T-49)

`from` va `to` — sanalar (`YYYY-MM-DD`, Toshkent kuni, ikkalasi ham kiradi). `format=xlsx` bo'lsa, JSON o'rniga Excel fayl qaytadi (`Content-Disposition: attachment; filename="..."`).

| Metod | Yo'l | Rollar | Javob qatori |
| --- | --- | --- | --- |
| GET | `/api/reports/summary?date=` | ADMIN | `{ date, revenue: { cash, card, transfer, refunds, net }, visitsCompleted, appointments: { total, SCHEDULED, ARRIVED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW }, newPatients, totalDebt }` |
| GET | `/api/reports/daily-revenue?from=&to=&format=` | ADMIN | `{ date, cash, card, transfer, refunds, net, paymentsCount }[]` — davrdagi har kun, to'lovsiz kunlar ham (nollar bilan) |
| GET | `/api/reports/doctors?from=&to=&format=` | ADMIN | `{ doctor: DoctorShort, visitsCount, billed, billedShare, collected, collectedShare }[]` (arxitektura.md, 7.4) |
| GET | `/api/reports/debtors?minDebt=&page=&pageSize=&format=` | ADMIN, CASHIER | `Paginated<{ patient: PatientShort, debt, unpaidVisits, oldestUnpaidAt, lastVisitAt }>`, qarzi kattasi birinchi |

`net = cash + card + transfer − refunds`. Kun — `Payment.createdAt` ning Toshkent sanasi.

### 4.13 Amallar jurnali — Muhammadyusuf (T-58)

| Metod | Yo'l | Rollar | Tavsif |
| --- | --- | --- | --- |
| GET | `/api/audit-logs?entity=&entityId=&actorId=&from=&to=&page=&pageSize=` | ADMIN | → `Paginated<AuditLogEntry>`, yangisi birinchi |

### 4.14 Xizmat endpoint'lari

| Metod | Yo'l | Rollar | Tavsif | Egasi |
| --- | --- | --- | --- | --- |
| GET | `/api/health` | Public | `{ status: "ok", db: "ok", version: "<git sha>" }` | Muhammadyusuf (T-08) |

Telegram eslatma (T-52) tashqi API ochmaydi: bot Telegram'dan polling bilan o'qiydi, eslatmalarni cron yuboradi.

## 5. Frontend uchun tiplarni generatsiya qilish

Backend lokalda ishlab turganda:

```bash
cd frontend
npm run gen:api
# package.json: "gen:api": "openapi-typescript http://localhost:3000/api/docs-json -o src/api/schema.d.ts"
```

Ishlatish:

```ts
import type { components } from './schema';
type Patient = components['schemas']['PatientDto'];
```

`schema.d.ts` qo'lda tahrirlanmaydi va repoga commit qilinadi. Backend DTO o'zgarganda frontendchi qayta generatsiya qiladi.
Tiplar to'g'ri chiqishi uchun backend DTO'lari Swagger'da to'liq ko'rinishi kerak: Nest CLI Swagger plagini (`nest-cli.json` → `"plugins": ["@nestjs/swagger"]`) yoki `@ApiProperty()`.

## 6. Kontraktni o'zgartirish tartibi

1. Backendchi task boshida (birinchi kuni) controller + DTO + Swagger'ni soxta javob bilan kichik PR qiladi. Shu PR'da shu fayl ham yangilanadi.
2. Frontendchi PR'ni ko'rib, shakl o'ziga qulayligini tasdiqlaydi.
3. Merge'dan keyin frontend `gen:api` qiladi va ishni boshlaydi; backend logikani yozadi.
4. Keyin shakl o'zgarsa — backendchi shu kuni frontendchiga yozadi va bu faylni yangilaydi. Maydonni o'chirish yoki nomini o'zgartirish — faqat kelishib.
