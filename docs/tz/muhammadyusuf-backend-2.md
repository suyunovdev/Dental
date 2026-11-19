# TZ: Muhammadyusuf — Backend-2

| | |
| --- | --- |
| **Rol** | Backend: skelet, API formati, xodimlar, bemorlar, xizmatlar, ish jadvali, davolash rejasi, fayllar, hisobotlar, audit, import |
| **Modullar** | `config/`, `prisma/`, `common/`, `health/`, `users/`, `audit/`, `patients/`, `catalog/`, `schedule/`, `treatment-plans/`, `files/`, `reports/` |
| **Review hamkori** | Shoxjahon (siz uning PR'larini, u sizning PR'laringizni ko'radi; `backend/prisma/` o'zgarishlarini doim u ko'radi) |
| **Albatta o'qing** | [arxitektura.md](../arxitektura.md) — 4, 6, 7, 10, 11-bo'limlar; [api.md](../api.md) — 1, 2, 4.2–4.5, 4.9, 4.10, 4.12–4.14 |

Siz yaratadigan skelet, xato formati va umumiy utilitlarni butun backend ishlatadi. Shuning uchun ular **birinchi** va **sifatli** bo'lishi kerak. H2 sizda eng og'ir hafta (T-17, T-18, T-19 bitta haftada) — uchala kontrakt PR'ini 26.11 da yuboring, frontend kutib qolmasin.

## Tasklar

| ID | Task | Kontrakt | Muddat | Sizni kim kutadi |
| --- | --- | --- | --- | --- |
| T-08 | Backend skeleti | — | 23.11 | Butun backend, Diyorbek (T-14) |
| T-10 | API kontrakt formati | — | 25.11 | Hamma |
| T-17 | Xodimlar API + `password.ts` + `AuditService` | 26.11 | 28.11 | Jahongir (T-24), Shoxjahon (T-15) |
| T-18 | Bemorlar API + qidiruv | 26.11 | 01.12 | Nurmuhammad (T-22) |
| T-19 | Xizmatlar va narxlar API | 26.11 | 02.12 | Nurmuhammad (T-23), Shoxjahon (T-38) |
| T-30 | Ish jadvali va kreslolar API | 03.12 | 06.12 | Shoxjahon (T-28), Jahongir (T-24) |
| T-39 | Davolash rejasi API | 10.12 | 14.12 | Nurmuhammad (T-42) |
| T-40 | Fayl yuklash API | 10.12 | 16.12 | Nurmuhammad (T-42) |
| T-48 | Shifokor ulushi | 17.12 | 20.12 | Nurmuhammad (T-51) |
| T-49 | Hisobotlar API + Excel | 17.12 | 23.12 | Nurmuhammad (T-51) |
| T-58 | Ruxsatlar va xavfsizlik tekshiruvi, audit log | — | 26.12 | Pilot |
| T-61 | Klinikaning boshlang'ich ma'lumotlarini kiritish | — | 28.12 | Pilot |

---

## T-08 · Backend skeleti · 23.11

**Maqsad:** har kim bitta buyruq bilan backendni ishga tushira olsin.

1. Repo ildizida: `npx @nestjs/cli@12 new backend` (npm, TypeScript `strict` yoqilgan).
2. Papkalar — `arxitektura.md` 4.2: `config/`, `prisma/`, `common/`, `health/`. Boshqa modullarni egalari o'zi qo'shadi.
3. **Env:** `@nestjs/config` + `zod` sxemasi. Majburiy o'zgaruvchi yo'q bo'lsa, ilova aniq xabar bilan to'xtaydi ("JWT_ACCESS_SECRET berilmagan").
4. **Prisma 7:**
   - `npm i -D prisma@7` va `npm i @prisma/client@7 @prisma/adapter-pg@7 pg dotenv`.
   - `prisma.config.ts`: sxema yo'li va `DATABASE_URL`. Prisma 7 env'ni o'zi yuklamaydi — `import 'dotenv/config'`.
   - `schema.prisma`: generator `prisma-client` (yangi generator), `output` aniq yo'l bilan (`../src/generated/prisma`). NestJS 12 ESM paketlarida ishlaydi — generatorning `moduleFormat` qiymatini loyihangiz formatiga moslang. Modellarni Shoxjahon T-06 da qo'shadi.
   - `PrismaService`: generatsiya qilingan `PrismaClient`ni `@prisma/adapter-pg` adapteri bilan yaratadi, global modul.
   - `src/generated/` `.gitignore`da. `"postinstall": "prisma generate"`.
   - Batafsil: docs.nestjs.com → Recipes → Prisma va Prisma'ning NestJS qo'llanmasi (Prisma 7 versiyasi uchun).
5. **`main.ts`:** `setGlobalPrefix('api')`, `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })`, `helmet()`, `cookie-parser`, `enableShutdownHooks()`, Express'da `trust proxy`. Swagger `api/docs` da (production'da o'chiq). CORS faqat `CORS_ORIGIN` berilsa.
6. **Health:** `GET /api/health` → `SELECT 1` → `{ status: "ok", db: "ok", version }` (`version` — `GIT_SHA` env'dan).
7. **`docker-compose.yml`** (repo ildizida): `db` — `postgres:17-alpine`, `f2/f2/f2`, port 5432, `pgdata` volume, `pg_isready` healthcheck.
8. **npm skriptlar:** `dev` (db'ni ko'taradi → `prisma migrate deploy` → `nest start --watch`), `build`, `start:prod`, `lint`, `format`, `typecheck` (`tsc --noEmit`), `test`, `test:e2e`, `db:migrate`, `db:seed`, `db:reset`.
9. ESLint: `@typescript-eslint/no-explicit-any` — `error`.
10. `.env.example` — `arxitektura.md` 11-bo'limdagi hamma o'zgaruvchi, qiymatsiz yoki lokal namunasi bilan.
11. README'ning "Lokal ishga tushirish" bo'limini aniq buyruqlar bilan yangilang.

**Qabul mezoni**

- [ ] Loyiha lokalda bitta buyruq bilan ishga tushadi (`npm run dev`)
- [ ] `/api/health` → `{ "status": "ok", "db": "ok" }`, `/api/docs` ochiladi
- [ ] Majburiy env bo'lmasa, ilova tushunarli xabar bilan to'xtaydi
- [ ] `lint`, `typecheck`, `test`, `build` xatosiz
- [ ] Boshqa odam (Shoxjahon yoki Diyorbek) toza kompyuterda README bo'yicha 15 daqiqada ishga tushirdi

## T-10 · API kontrakt formati · 25.11

**Maqsad:** hamma endpoint bir xil gapirsin: bir xil xato, bir xil sahifalash, Swagger'dan to'g'ri tiplar.

1. **`common/errors.ts`:** `ErrorCode` (`api.md` 2-bo'limdagi ro'yxat) va `AppException(code, status, message, details?)`.
2. **Global exception filter:**
   - `AppException` → 2-bo'limdagi shakl;
   - validatsiya xatosi → `400 VALIDATION_ERROR`, `details.fields`;
   - Prisma: `P2002` → `409 CONFLICT` (qaysi maydon), `P2025` → `404 NOT_FOUND`, `P2003` → `400 VALIDATION_ERROR` ("Bog'langan yozuv topilmadi");
   - qolgani → `500 INTERNAL_ERROR`: stack faqat logda, javobda yo'q.
3. **O'zbekcha validatsiya xabarlari:** `ValidationPipe`ning `exceptionFactory`sida class-validator cheklovlarini o'zbekcha matnga aylantiring: `isNotEmpty` → "Majburiy maydon", `isInt` → "Butun son bo'lishi kerak", `isEnum` → "Ruxsat etilmagan qiymat", `maxLength` → "Juda uzun" va hokazo.
4. **Sahifalash:** `PaginationQueryDto` (`page` ≥ 1, standart 1; `pageSize` 1–100, standart 20), `paginate()` yordamchisi va Swagger uchun `@ApiPaginatedResponse(Dto)` dekoratori.
5. **Swagger:** sarlavha, versiya, bearer auth, har modulga `tag`. Nest CLI Swagger plagini yoqilgan (`nest-cli.json`). JSON `/api/docs-json` da.
6. **`common/time.ts`:** `tashkentDayRange('2026-12-17')` → `{ from, to }` (UTC) va `toTashkentParts(date)` → `{ date, weekday, minuteOfDay }`. Unit testlari bilan — buni appointments, schedule va reports ishlatadi.
7. **Namuna modul:** `patients` kontrakti (T-18 uchun) — controller + DTO, soxta javob bilan. Frontend shu bilan `gen:api`ni sinaydi.
8. `api.md` 1–2-bo'limlarini haqiqiy kod bilan solishtirib, farqni tuzating.

**Qabul mezoni**

- [ ] Swagger sahifasi ochiladi, xatolik formati yagona
- [ ] 400, 401, 403, 404, 409, 422, 500 — hammasi bir xil shaklda (e2e test)
- [ ] Frontendda `npm run gen:api` ishlaydi va `PatientDto` tipi to'g'ri chiqadi
- [ ] Validatsiya xabarlari o'zbekcha

## T-17 · Xodimlar API · 28.11 (kontrakt 26.11)

**Maqsad:** admin xodim qo'shadi, rol beradi, bloklaydi. Endpoint'lar — `api.md` 4.2.

1. **`common/password.ts`** — 26.11 gacha merge (Shoxjahon login uchun kutadi): `hashPassword()` (bcrypt, cost 12), `verifyPassword()`, unit testlar.
2. **`audit/`** — 27.11 gacha merge (hamma ishlatadi): `AuditService.log({ actorId, action, entity, entityId, summary?, before?, after?, ip? }, tx?)`. `tx` berilsa, shu tranzaksiyada yozadi. `before`/`after`dan `passwordHash` va boshqa maxfiy maydonlar avtomatik olib tashlanadi.
3. **Qoidalar:**
   - `username`: 3–32 belgi, `a-z 0-9 . _`, kichik harfga keltiriladi, unique;
   - `roles` bo'sh bo'lmaydi; `DOCTOR` roli bo'lmasa `specialty`, `color`, `sharePercent` — `null`;
   - `sharePercent` 0–100, `color` — `#RRGGBB`;
   - o'zini bloklab bo'lmaydi; oxirgi faol ADMIN'ni bloklab yoki undan ADMIN rolini olib bo'lmaydi → `422 LAST_ADMIN`.
4. **Bloklash va parolni tiklash** xodimning hamma sessiyalarini yopadi — `AuthService.revokeAllSessions(userId)` orqali (Shoxjahon T-15 kontraktida beradi). `RefreshToken` jadvaliga o'zingiz yozmang.
5. `GET /api/doctors` — faqat faol va `DOCTOR` roli borlar.
6. **Audit:** yaratish, tahrirlash, bloklash, blokdan chiqarish, parolni tiklash.
7. Ruxsatlar e2e jadvaliga (T-16) o'z qatorlaringizni qo'shing.

**Qabul mezoni**

- [ ] Qo'shish, tahrirlash, bloklash ishlaydi
- [ ] Oxirgi faol ADMIN himoyalangan (`422 LAST_ADMIN`)
- [ ] Bloklangan xodimning sessiyalari yopiladi
- [ ] `passwordHash` hech bir javobda va auditda yo'q
- [ ] `password.ts` va `AuditService` muddatida merge bo'lgan

## T-18 · Bemorlar API + qidiruv · 01.12 (kontrakt 26.11)

**Maqsad:** registrator bemorni tez topadi va bir odam ikki marta kiritilmaydi. Endpoint'lar — `api.md` 4.4, qoidalar — `arxitektura.md` 7.6.

1. **`common/phone.ts`:** `normalizePhone(input) → string | null`. Kamida 8 ta test: `90 123 45 67`, `901234567`, `998901234567`, `+998 (90) 123-45-67`, bo'sh, harfli, 8 raqam, 13 raqam.
2. **Qidiruv:** so'zda ≥ 3 raqam bo'lsa — telefon bo'yicha (`contains`); aks holda har so'z familiya, ism yoki otasining ismidan birida (`contains`, `mode: 'insensitive'`). Tartib: familiya, ism.
3. **Dublikat:** bir xil telefon + bir xil familiya va ism (katta-kichik harf farqsiz) → `409 PATIENT_DUPLICATE`, `details.existingId`.
4. `GET /patients/check-phone` — shu raqamdagi bemorlar (forma ogohlantirishi uchun).
5. DOCTOR `PATCH`da faqat `allergies` maydonini o'zgartira oladi; boshqa maydon kelsa → `403`.
6. Arxivlash va qaytarish — faqat ADMIN. Arxivdagilar standart holatda ro'yxatda chiqmaydi.
7. Javobda hisoblanadigan maydonlar: `fullName` ("Familiya Ism Otasining ismi"), `telegramLinked`.
8. **Audit:** yaratish, tahrirlash (faqat o'zgargan maydonlar oldin/keyin), arxivlash.

**Qabul mezoni**

- [ ] Qidiruv va sahifalash ishlaydi, telefon takrorlanmaydi: bir odam (bir xil raqam + ism) ikki marta kiritilmaydi. Oila a'zolari bitta raqamda bo'lishi mumkin
- [ ] Har xil yozilgan bitta raqam bir xil saqlanadi va topiladi
- [ ] Shifokor faqat allergiyani o'zgartira oladi
- [ ] Testlar: telefon, qidiruv, dublikat, shifokor cheklovi

## T-19 · Xizmatlar va narxlar API · 02.12 (kontrakt 26.11)

**Maqsad:** preyskurant. Endpoint'lar — `api.md` 4.5.

1. **Qoidalar:** `price` — butun son ≥ 0; `durationMin` 5–240, 5 ga karrali; nom toifa ichida unique. Hech narsa o'chirilmaydi — `isActive: false`.
2. Ro'yxat standart holatda faqat faol xizmatlarni va faol toifalardagilarni qaytaradi (`includeInactive=true` — hammasini).
3. **`CatalogService.getActiveService(id)`** — 02.12 gacha: `{ id, name, price, durationMin }`; nofaol yoki yo'q bo'lsa → `422` / `404`. Tashrif va davolash rejasi shuni ishlatadi.
4. **Audit:** narx o'zgarishi eski va yangi qiymati bilan.

**Qabul mezoni**

- [ ] Xizmat toifalari va narxlar saqlanadi
- [ ] Narx o'zgarishi auditda eski va yangi qiymat bilan ko'rinadi
- [ ] Nofaol xizmatni tashrifga qo'shib bo'lmaydi

## T-30 · Ish jadvali va kreslolar API · 06.12 (stub 03.12)

**Maqsad:** shifokor ishlamaydigan vaqtga qabul yozilmasin. Endpoint'lar — `api.md` 4.3.

1. **`PUT /doctors/:id/schedule`:** aniq 7 ta element, `weekday` 1–7 takrorlanmaydi; `isWorking: true` bo'lsa `startTime < endTime`, `HH:mm`, 5 daqiqa qadam. Bazada daqiqalarda saqlanadi; `isWorking: false` — qator o'chiriladi.
2. **`ScheduleService.assertWithinWorkingHours(doctorId, startAt, endAt)`:**
   - 03.12 da stub (imzo tayyor, hamma narsani o'tkazadi) — Shoxjahon T-28 ni boshlay olsin;
   - 06.12 gacha to'liq: `common/time.ts` bilan Toshkent vaqtiga o'tkazish → bitta kun ichidami → o'sha hafta kuni qatori bormi → `startMinute ≤ boshlanish` va `tugash ≤ endMinute`. Aks holda `422 OUTSIDE_WORKING_HOURS`, `details`da shu kungi ish vaqti.
3. **Testlar:** 09:00 boshlanish — o'tadi; 17:45–18:00 — o'tadi; 17:45–18:15 — o'tmaydi; yarim tundan o'tadigan qabul — o'tmaydi; dam olish kuni — o'tmaydi.
4. Kreslolar: nomi unique, o'chirilmaydi (`isActive`).
5. `free-slots` — ixtiyoriy, faqat vaqt qolsa.
6. **Audit:** jadval va kreslo o'zgarishlari.

**Qabul mezoni**

- [ ] Ish vaqtidan tashqari yozib bo'lmaydi (Shoxjahonning T-28 i bilan birga tekshirilgan)
- [ ] Jadvalni faqat ADMIN o'zgartiradi, boshqalar ko'radi
- [ ] Chegaraviy holatlar testlari yashil

## T-39 · Davolash rejasi API · 14.12 (kontrakt 10.12)

**Maqsad:** shifokor bosqichma-bosqich reja tuzadi, taxminiy narx avtomatik chiqadi. Endpoint'lar — `api.md` 4.9.

1. Kirish: `MedicalAccessService.assertCanView()`. Yaratish va o'zgartirish — faqat DOCTOR (o'z bemori).
2. Band qo'shilganda `serviceName` va `unitPrice` katalogdan nusxalanadi (`getActiveService`), `amount = unitPrice × quantity`.
3. `total` — `CANCELLED` bo'lmagan bandlar yig'indisi.
4. Reja `COMPLETED` yoki `CANCELLED` bo'lsa — faqat o'qiladi (`422`). Band `DONE` qilinganda `visitId` berilsa, u shu bemorning tashrifi bo'lishi shart.
5. Bandlar o'chirilmaydi — `CANCELLED`.
6. Audit.

**Qabul mezoni**

- [ ] Reja tuziladi va jami narx hisoblanadi
- [ ] Bekor qilingan band jamiga kirmaydi
- [ ] Yopilgan rejani o'zgartirib bo'lmaydi
- [ ] Boshqa shifokorning bemori → `403`

## T-40 · Fayl yuklash API · 16.12 (kontrakt 10.12)

**Maqsad:** rentgen va rasmlar bemor kartasiga xavfsiz biriktiriladi. Endpoint'lar — `api.md` 4.10, qoidalar — `arxitektura.md` 10-bo'lim, "Fayllar".

1. `FileInterceptor` (multer, `memoryStorage`), `limits.fileSize = MAX_UPLOAD_MB`. Oshsa → `413 FILE_TOO_LARGE`.
2. **Turni ichidan tekshirish** (birinchi baytlar, alohida funksiya + testlar):
   - JPEG: `FF D8 FF`
   - PNG: `89 50 4E 47 0D 0A 1A 0A`
   - WEBP: `52 49 46 46 …. 57 45 42 50` (0–3 va 8–11 baytlar)
   - PDF: `25 50 44 46 2D`

   Mos kelmasa → `415 FILE_TYPE_NOT_ALLOWED`. `mimeType` va kengaytma brauzer aytganidan emas, aniqlangan turdan olinadi.
3. Diskka: `${UPLOAD_DIR}/patients/{patientId}/{uuid}.{ext}`. Yo'lni `path.resolve` qilib, `UPLOAD_DIR` ichida ekanini tekshiring. `originalName` faqat bazada (≤ 200 belgi, `/` va `\` olib tashlangan).
4. **Berish:** `createReadStream`; sarlavhalar: `Content-Type` (saqlangan), `Content-Disposition: inline; filename*=UTF-8''…`, `X-Content-Type-Options: nosniff`, `Cache-Control: private, no-store`. Kirish tekshiruvi + audit `FILE_VIEW`.
5. O'chirish — faqat ADMIN, `deletedAt` (diskdan o'chirilmaydi).
6. **Testlar:** nomi `.jpg`ga o'zgartirilgan `.exe` → `415`; 16 MB → `413`; boshqa shifokor → `403`; yuklab olishdagi sarlavhalar.

**Qabul mezoni**

- [ ] Surat bemor kartasiga biriktiriladi
- [ ] Fayl turi ichidan tekshiriladi; `.exe`ni `.jpg` qilib yuklab bo'lmaydi
- [ ] Fayl faqat ruxsati bor xodimga beriladi
- [ ] Diskdagi nom va yo'lda foydalanuvchi kiritgan matn yo'q

## T-48 · Shifokor ulushi · 20.12 (kontrakt 17.12)

**Maqsad:** rahbar har shifokorga davr bo'yicha qancha ulush tushishini ko'radi. `GET /api/reports/doctors` (`api.md` 4.12), formulalar — `arxitektura.md` 7.4.

1. **Hisoblangan:** davrda (`completedAt`, Toshkent kuni) yakunlangan tashriflar — `visitsCount`, `billed = Σ total`, `billedShare = Σ floor(total × doctorSharePercent / 100)`.
2. **To'langan:** davrda (`Payment.createdAt`) shu shifokor tashriflariga tushgan sof to'lovlar — `collected = Σ PAYMENT − Σ REFUND`, `collectedShare` — har to'lov bo'yicha `floor(...)`.
3. Hisob SQL'da yig'iladi (har tashrif bo'yicha sikl emas).
4. `format=xlsx` — Excel (T-49 dagi umumiy yordamchi bilan).
5. **Testlar** (aniq ma'lumot bilan): 2 shifokor, har xil foiz, chegirma, qisman to'lov, qaytarish; davrning oxirgi kuni 23:30 da yakunlangan tashrif kiradi, keyingi kun 00:10 dagisi kirmaydi.

**Qabul mezoni**

- [ ] Davr bo'yicha har shifokor ulushi chiqadi
- [ ] Shifokor foizi keyin o'zgarsa, eski tashriflar ulushi o'zgarmaydi
- [ ] Kun chegarasi Toshkent vaqti bo'yicha (test)

## T-49 · Hisobotlar API · 23.12 (kontrakt 17.12)

**Maqsad:** rahbar tushum va qarzni bir qarashda ko'radi. `summary`, `daily-revenue`, `debtors` — `api.md` 4.12.

1. **Kun bo'yicha guruhlash** Toshkent vaqtida. Bazada `timestamp` (UTC) bo'lgani uchun:

   ```sql
   SELECT ("createdAt" AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Tashkent')::date AS day, ...
   ```

2. `daily-revenue` davrdagi **har kun**ni qaytaradi — to'lovsiz kunlar nollar bilan. Davr ≤ 366 kun.
3. `debtors` — qarzi > 0 bemorlar, qarz bo'yicha kamayish tartibida, sahifalangan. Qarz formulasi Shoxjahonning `getPatientBalance` mantig'i bilan bir xil bo'lishi shart (bitta SQL yoki umumiy funksiya).
4. **Excel** (`exceljs`, umumiy yordamchi `reports/xlsx.ts`): sarlavha qatori qalin, pul ustunlari son formatida (`#,##0`), sana formati, ustun kengliklari, oxirida "Jami" qatori. Fayl nomi: `kunlik-tushum_2026-12-01_2026-12-31.xlsx`.
5. **Solishtirish testi:** davr uchun `Σ daily-revenue.net` = `/payments` ro'yxatidagi `totals.net` (xuddi shu davr).

**Qabul mezoni**

- [ ] Raqamlar to'lovlar bilan mos keladi (solishtirish testi yashil)
- [ ] Excel ochiladi, pul ustunlari son sifatida (matn emas)
- [ ] To'lovsiz kunlar nol bilan chiqadi

## T-58 · Ruxsatlar va xavfsizlik tekshiruvi, audit log · 26.12

**Maqsad:** pilotdan oldin tizimda ochiq eshik qolmasin va kim nima qilgani ko'rinsin.

1. `GET /api/audit-logs` — `api.md` 4.13 (Nurmuhammad kartada ADMIN uchun tab qiladi).
2. **Audit qamrovi:** `arxitektura.md` 10-bo'lim, "Ma'lumot" bandidagi har amal uchun jurnalga qator tushishini tekshiring (test yoki qo'lda).
3. **Ruxsatlar matritsasi:** e2e jadval `api.md` dagi **hamma** endpoint'ni 4 rol + tokensiz bilan qamrasin.
4. **IDOR:** B shifokor A shifokorning bemori bo'yicha `teeth`, `visits`, `files`, `treatment-plans` va `id` bo'yicha yo'llarni ochishga urinadi → hammasi `403`.
5. `arxitektura.md` 10-bo'limini band-bandi tekshirib, natijani `docs/xavfsizlik-tekshiruvi.md` ga yozing (✅/❌, tuzatish PR havolasi bilan).
6. `npm audit --omit=dev`: high/critical yo'q yoki sababi yozilgan.
7. Repo tarixida sir qolmaganini tekshirish (`gitleaks` — Diyorbek CI'ga qo'shgan bo'lsa, natijasini ko'ring).

**Qabul mezoni**

- [ ] Bemor ma'lumotini kim o'zgartirgani ko'rinadi (API + kartadagi tab)
- [ ] Ruxsatlar e2e jadvali hamma endpoint'ni qamraydi
- [ ] Tekshiruv hisoboti `docs/` da; topilgan muammolar tuzatilgan yoki Ilyos bilan kelishilgan

## T-61 · Klinikaning boshlang'ich ma'lumotlari · 28.12

**Maqsad:** klinikaning haqiqiy xizmatlari, xodimlari va bemorlari tizimga xatosiz va xavfsiz tushsin.

1. 10.12 gacha Ilyosdan klinika fayli shaklidagi namuna so'rang (ustunlari bir xil, ma'lumoti soxta).
2. Skript `backend/scripts/import.ts`: `npm run import -- --type=services|staff|patients --file=<yo'l> [--dry-run]`.
3. Ustunlar mosligi skript boshida alohida obyektda. Normallashtirish: bo'sh joylar, ism bosh harfi, telefon (`normalizePhone`).
4. **Dublikat:** bemor — telefon + ism; xizmat — toifa + nom; xodim — username. Qayta ishga tushirish dublikat yaratmaydi.
5. `--dry-run`: yangi / mavjud / xato sonlari va rad etilgan qatorlar sabablari bilan (`import-errors.csv`, serverda, repoda emas).
6. Xodimlar uchun vaqtinchalik parol, `mustChangePassword = true`. Parollar faqat bir marta ekranga chiqadi, Ilyosga beriladi, faylga yozilmaydi.
7. **Haqiqiy ma'lumot faqat production serverda:** fayl `scp` bilan serverga → `docker compose exec backend npm run import ...` → fayl o'chiriladi. Noutbukda, staging'da, chatda haqiqiy fayl bo'lmaydi.
8. Avval staging'da soxta namuna bilan sinab ko'ring.

**Qabul mezoni**

- [ ] Klinikaning haqiqiy ma'lumotlari tizimda
- [ ] Ikkinchi marta ishga tushirish dublikat yaratmaydi
- [ ] Rad etilgan qatorlar ro'yxati Ilyosga berilgan
- [ ] Haqiqiy fayl serverdan o'chirilgan, repoda yo'q
