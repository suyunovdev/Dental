-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'RECEPTIONIST', 'DOCTOR', 'CASHIER');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('SCHEDULED', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "VisitStatus" AS ENUM ('OPEN', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ToothStatus" AS ENUM ('HEALTHY', 'CARIES', 'FILLED', 'PULPITIS', 'PERIODONTITIS', 'ROOT_ONLY', 'CROWN', 'IMPLANT', 'MISSING');

-- CreateEnum
CREATE TYPE "PlanStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PlanItemStatus" AS ENUM ('PLANNED', 'DONE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "FileKind" AS ENUM ('XRAY', 'PHOTO', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('PAYMENT', 'REFUND');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CARD', 'TRANSFER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "phone" TEXT,
    "roles" "Role"[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "mustChangePassword" BOOLEAN NOT NULL DEFAULT true,
    "specialty" TEXT,
    "color" TEXT,
    "sharePercent" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "replacedById" INTEGER,
    "userAgent" TEXT,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chair" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chair_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorSchedule" (
    "id" SERIAL NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "weekday" INTEGER NOT NULL,
    "startMinute" INTEGER NOT NULL,
    "endMinute" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DoctorSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "middleName" TEXT,
    "birthDate" DATE,
    "gender" "Gender",
    "phone" TEXT NOT NULL,
    "phone2" TEXT,
    "address" TEXT,
    "allergies" TEXT,
    "note" TEXT,
    "telegramChatId" TEXT,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "code" TEXT,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "durationMin" INTEGER NOT NULL DEFAULT 30,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "chairId" INTEGER,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED',
    "note" TEXT,
    "cancelReason" TEXT,
    "arrivedAt" TIMESTAMP(3),
    "reminderSentAt" TIMESTAMP(3),
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visit" (
    "id" SERIAL NOT NULL,
    "appointmentId" INTEGER NOT NULL,
    "patientId" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "status" "VisitStatus" NOT NULL DEFAULT 'OPEN',
    "complaint" TEXT,
    "diagnosis" TEXT,
    "note" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "subtotal" INTEGER NOT NULL DEFAULT 0,
    "discountAmount" INTEGER NOT NULL DEFAULT 0,
    "discountReason" TEXT,
    "total" INTEGER NOT NULL DEFAULT 0,
    "doctorSharePercent" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Visit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisitService" (
    "id" SERIAL NOT NULL,
    "visitId" INTEGER NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "serviceName" TEXT NOT NULL,
    "toothNumber" INTEGER,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisitService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToothRecord" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "toothNumber" INTEGER NOT NULL,
    "status" "ToothStatus" NOT NULL,
    "note" TEXT,
    "visitId" INTEGER,
    "doctorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ToothRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TreatmentPlan" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "status" "PlanStatus" NOT NULL DEFAULT 'ACTIVE',
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TreatmentPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TreatmentPlanItem" (
    "id" SERIAL NOT NULL,
    "planId" INTEGER NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "serviceName" TEXT NOT NULL,
    "toothNumber" INTEGER,
    "stage" INTEGER NOT NULL DEFAULT 1,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" INTEGER NOT NULL,
    "status" "PlanItemStatus" NOT NULL DEFAULT 'PLANNED',
    "visitId" INTEGER,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TreatmentPlanItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientFile" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "visitId" INTEGER,
    "kind" "FileKind" NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "storageKey" TEXT NOT NULL,
    "note" TEXT,
    "uploadedById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PatientFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "visitId" INTEGER NOT NULL,
    "patientId" INTEGER NOT NULL,
    "type" "PaymentType" NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "amount" INTEGER NOT NULL,
    "refundOfId" INTEGER,
    "note" TEXT,
    "reason" TEXT,
    "cashierId" INTEGER NOT NULL,
    "clientRequestId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "actorId" INTEGER,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" INTEGER,
    "summary" TEXT,
    "before" JSONB,
    "after" JSONB,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_tokenHash_key" ON "RefreshToken"("tokenHash");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Chair_name_key" ON "Chair"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DoctorSchedule_doctorId_weekday_key" ON "DoctorSchedule"("doctorId", "weekday");

-- CreateIndex
CREATE INDEX "Patient_phone_idx" ON "Patient"("phone");

-- CreateIndex
CREATE INDEX "Patient_lastName_firstName_idx" ON "Patient"("lastName", "firstName");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCategory_name_key" ON "ServiceCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Service_code_key" ON "Service"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Service_categoryId_name_key" ON "Service"("categoryId", "name");

-- CreateIndex
CREATE INDEX "Appointment_doctorId_startAt_idx" ON "Appointment"("doctorId", "startAt");

-- CreateIndex
CREATE INDEX "Appointment_chairId_startAt_idx" ON "Appointment"("chairId", "startAt");

-- CreateIndex
CREATE INDEX "Appointment_patientId_idx" ON "Appointment"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "Visit_appointmentId_key" ON "Visit"("appointmentId");

-- CreateIndex
CREATE INDEX "Visit_patientId_idx" ON "Visit"("patientId");

-- CreateIndex
CREATE INDEX "Visit_doctorId_completedAt_idx" ON "Visit"("doctorId", "completedAt");

-- CreateIndex
CREATE INDEX "VisitService_visitId_idx" ON "VisitService"("visitId");

-- CreateIndex
CREATE INDEX "ToothRecord_patientId_toothNumber_createdAt_idx" ON "ToothRecord"("patientId", "toothNumber", "createdAt");

-- CreateIndex
CREATE INDEX "TreatmentPlan_patientId_idx" ON "TreatmentPlan"("patientId");

-- CreateIndex
CREATE INDEX "TreatmentPlanItem_planId_idx" ON "TreatmentPlanItem"("planId");

-- CreateIndex
CREATE UNIQUE INDEX "PatientFile_storageKey_key" ON "PatientFile"("storageKey");

-- CreateIndex
CREATE INDEX "PatientFile_patientId_idx" ON "PatientFile"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_clientRequestId_key" ON "Payment"("clientRequestId");

-- CreateIndex
CREATE INDEX "Payment_visitId_idx" ON "Payment"("visitId");

-- CreateIndex
CREATE INDEX "Payment_patientId_idx" ON "Payment"("patientId");

-- CreateIndex
CREATE INDEX "Payment_createdAt_idx" ON "Payment"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_entity_entityId_idx" ON "AuditLog"("entity", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorSchedule" ADD CONSTRAINT "DoctorSchedule_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ServiceCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_chairId_fkey" FOREIGN KEY ("chairId") REFERENCES "Chair"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitService" ADD CONSTRAINT "VisitService_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "Visit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitService" ADD CONSTRAINT "VisitService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToothRecord" ADD CONSTRAINT "ToothRecord_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToothRecord" ADD CONSTRAINT "ToothRecord_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "Visit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToothRecord" ADD CONSTRAINT "ToothRecord_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreatmentPlan" ADD CONSTRAINT "TreatmentPlan_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreatmentPlan" ADD CONSTRAINT "TreatmentPlan_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreatmentPlanItem" ADD CONSTRAINT "TreatmentPlanItem_planId_fkey" FOREIGN KEY ("planId") REFERENCES "TreatmentPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreatmentPlanItem" ADD CONSTRAINT "TreatmentPlanItem_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreatmentPlanItem" ADD CONSTRAINT "TreatmentPlanItem_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "Visit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientFile" ADD CONSTRAINT "PatientFile_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientFile" ADD CONSTRAINT "PatientFile_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "Visit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientFile" ADD CONSTRAINT "PatientFile_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "Visit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_refundOfId_fkey" FOREIGN KEY ("refundOfId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_cashierId_fkey" FOREIGN KEY ("cashierId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
