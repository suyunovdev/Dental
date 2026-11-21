CREATE EXTENSION IF NOT EXISTS btree_gist;

-- 1. Bitta shifokorga bir vaqtda ikki faol qabul bo'lmaydi
ALTER TABLE "Appointment" ADD CONSTRAINT "appointment_doctor_no_overlap"
  EXCLUDE USING gist ("doctorId" WITH =, tsrange("startAt", "endAt", '[)') WITH &&)
  WHERE (status NOT IN ('CANCELLED', 'NO_SHOW'));

-- 2. Bitta kresloda ham bir vaqtda ikki faol qabul bo'lmaydi
ALTER TABLE "Appointment" ADD CONSTRAINT "appointment_chair_no_overlap"
  EXCLUDE USING gist ("chairId" WITH =, tsrange("startAt", "endAt", '[)') WITH &&)
  WHERE ("chairId" IS NOT NULL AND status NOT IN ('CANCELLED', 'NO_SHOW'));

-- 3. CHECK cheklovlari
ALTER TABLE "Appointment" ADD CONSTRAINT "appointment_time_valid" CHECK ("endAt" > "startAt");
ALTER TABLE "Payment" ADD CONSTRAINT "payment_amount_positive" CHECK ("amount" > 0);
ALTER TABLE "Service" ADD CONSTRAINT "service_price_non_negative" CHECK ("price" >= 0);
ALTER TABLE "User" ADD CONSTRAINT "user_share_percent_range" CHECK ("sharePercent" BETWEEN 0 AND 100);
ALTER TABLE "DoctorSchedule" ADD CONSTRAINT "schedule_time_valid" CHECK ("startMinute" < "endMinute");
