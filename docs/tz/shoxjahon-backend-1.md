# TZ: Shoxjahon — Backend-1 (yetakchi)

| | |
| --- | --- |
| **Rol** | Backend yetakchisi: arxitektura, baza, auth, qabul, tibbiy karta, to'lovlar |
| **Modullar** | `auth/`, `appointments/`, `visits/`, `dental-chart/`, `payments/`, `notifications/`, `backend/prisma/` |
| **Review hamkori** | Muhammadyusuf (siz uning PR'larini, u sizning PR'laringizni ko'radi) |
| **Albatta o'qing** | [arxitektura.md](../arxitektura.md) — 4, 6, 7, 9, 10-bo'limlar; [api.md](../api.md) — 2, 4.1, 4.6–4.8, 4.11 |

Siz backendning "skeleti va yuragi"siz: baza sxemasi, kim kirishi mumkinligi, qabul to'qnashmasligi va pul to'g'ri hisoblanishi sizga bog'liq. Bu joylarda xato qimmatga tushadi, shuning uchun har birida **test majburiy**.

## Tasklar

| ID | Task | Kontrakt | Muddat | Sizni kim kutadi |
| --- | --- | --- | --- | --- |
| T-05 | Arxitekturani jamoaga tushuntirish | — | 20.11 | Hamma |
| T-06 | Ma'lumotlar bazasi sxemasi | — | 24.11 | Butun backend |
| T-15 | Login, JWT, parolni almashtirish API | 26.11 | 29.11 | Jahongir (T-20) |
| T-16 | Rollar va huquqlar (RBAC) | — | 02.12 | Hamma backend |
| T-28 | Qabul API | 03.12 | 06.12 | Jahongir (T-31), Nurmuhammad (T-32, T-33) |
| T-29 | Vaqt to'qnashuvi | — | 08.12 | — |
| T-37 | Tish formulasi API | 10.12 | 13.12 | Jahongir (T-41) |
| T-38 | Tashrif API | 10.12 | 16.12 | Jahongir (T-43) |
| T-47 | To'lovlar API | 17.12 | 21.12 | Jahongir (T-50), Muhammadyusuf (T-48, T-49) |
| T-52 | Telegram eslatma (past ustuvorlik) | — | 23.12 | — |
| T-56 | Xatolarni tuzatish (backend) | — | 27.12 | Pilot |

---

## T-05 · Arxitekturani jamoaga tushuntirish · 20.11

**Maqsad:** har bir a'zo tizim qanday ishlashini va o'z kodi qayerga tushishini tushunsin.

1. `arxitektura.md` va `api.md` ni to'liq o'qing. Tushunmagan yoki rozi bo'lmagan joylarni yozib qo'ying.
2. 20.11 da 30–40 daqiqalik uchrashuv o'tkazing:
   - sxema (3-bo'lim) va so'rov yo'li: brauzer → Nginx → NestJS → Prisma → PostgreSQL;
   - modullar va egalari (4-bo'lim);
   - auth: access va refresh token nima uchun ikkita;
   - qabul to'qnashuvi ikki qatlamda qanday to'xtatiladi;
   - "avval kontrakt" qoidasi va migratsiya qoidalari (12-bo'lim).
3. Oxirida har kishidan so'rang: "Birinchi taskingiz kodi qaysi papkada bo'ladi va kimdan nimani kutasiz?"
4. Uchrashuvdagi qarorlar va o'zgarish takliflarini `arxitektura.md` ga PR qiling (Ilyos tasdiqlaydi).

**Qabul mezoni**

- [ ] Stek va arxitektura sxemasi jamoaga tushuntirilgan
- [ ] Har a'zo o'z moduli yoki sahifasini va birinchi bog'liqligini ayta oladi
- [ ] Qarorlar va savollar `arxitektura.md` ga PR qilingan

## T-06 · Ma'lumotlar bazasi sxemasi · 24.11

**Maqsad:** 16 jadvalli sxema, migratsiyalar va soxta ma'lumot. Butun jamoa shu bazada ishlaydi.

1. Muhammadyusufning T-08 (skelet) branch'i ustidan ishlang yoki 23.11 dagi merge'dan keyin `main`dan yangilaning. Prisma ulanishi T-08 da qilinadi; siz modellarni yozasiz.
2. `schema.prisma`: 6.1-bo'limdagi enum'lar, 6.2-bo'limdagi 16 model, bog'lanishlar, `@@index` va `@@unique`.
   - `roles Role[]` — PostgreSQL'da enum ro'yxati ishlaydi. Filtr: `where: { roles: { has: 'DOCTOR' } }`.
   - Pul va foiz maydonlari — `Int`. `birthDate` — `@db.Date`.
3. Birinchi migratsiya: `npx prisma migrate dev --name init`.
4. Ikkinchi migratsiya — qo'lda SQL: `npx prisma migrate dev --create-only --name constraints` → 6.3-bo'limdagi SQL'ni qo'shing → `npx prisma migrate dev`.
5. `prisma/seed.ts` — faqat soxta ma'lumot (`@faker-js/faker`, `uz_UZ_latin` lokali):
   - har rolda bittadan xodim + 3 shifokor (rang, foiz, dushanba–shanba 09:00–18:00 ish jadvali);
   - 3 kreslo, 4 toifa (Terapiya, Jarrohlik, Ortopediya, Gigiyena), ~15 xizmat;
   - 50 bemor (bir xil telefonli "ona va bola" holati ham bo'lsin), joriy haftaga 30 qabul, 10 yakunlangan tashrif, bir nechta qisman to'lov.
   - Parollar `SEED_*` env'dan olinadi, repoda yozilmaydi. Seed foydalanuvchilarida `mustChangePassword = false` (lokal va staging qulayligi uchun).
6. Cheklovni qo'lda sinang: `psql` da bitta shifokorga ustma-ust ikki qabul INSERT qiling — ikkinchisi xato berishi kerak.
   Keyingi migratsiyalarda Prisma bu cheklovlarni "ortiqcha" deb o'chirmoqchi bo'lishi mumkin. Har migratsiya SQL'ida `DROP CONSTRAINT` yoki `DROP INDEX` ko'rsangiz, o'sha qatorlarni olib tashlang (`arxitektura.md` 6.3). Muhammadyusufning migratsiyalarini ham shu jihatdan tekshirasiz.
7. `arxitektura.md` dagi ER diagrammani yakuniy sxema bilan solishtiring, farq bo'lsa yangilang.

**Qabul mezoni**

- [ ] Barcha jadvallar va bog'lanishlar diagrammada, migratsiya ishlaydi
- [ ] `npx prisma migrate reset` noldan xatosiz o'tadi va seed ma'lumot qo'shadi
- [ ] Exclusion va CHECK cheklovlari bazada bor (`\d "Appointment"`), ustma-ust qabul rad etiladi
- [ ] Seed'da haqiqiy odam ma'lumoti va parol yo'q

## T-15 · Login, JWT, parolni almashtirish · 29.11 (kontrakt 26.11)

**Maqsad:** xavfsiz kirish va sessiya. Endpoint'lar — `api.md` 4.1.

1. **Login:** username kichik harfga → xodim topiladi → `isActive` tekshiriladi → `verifyPassword()` (`common/password.ts`, Muhammadyusuf yozadi) → access token (`{ sub, roles }`, 15 daqiqa) + refresh token.
2. **Refresh token:** `crypto.randomBytes(32)` → base64url. Bazaga faqat `sha256` hash yoziladi. Cookie: `rt`, `httpOnly`, `secure: COOKIE_SECURE`, `sameSite: 'strict'`, `path: '/api/auth'`, `maxAge` = 14 kun. Cookie o'qish uchun `cookie-parser`.
3. **Refresh:** cookie → hash → qidiruv:
   - topilmadi yoki muddati o'tgan → `401`;
   - `revokedAt` bor (eski token qayta ishlatilyapti — o'g'irlanish belgisi) → foydalanuvchining **hamma** tokenlari bekor + `401`;
   - aks holda eskisi bekor qilinadi (`revokedAt`, `replacedById`) va yangisi beriladi.
4. **Logout:** joriy token bekor, cookie o'chiriladi (xuddi shu `path` bilan).
5. **Parolni almashtirish:** joriy parol tekshiriladi; yangi parol ≥ 8 belgi va login bilan bir xil emas; `mustChangePassword = false`; joriy sessiyadan boshqa hamma sessiyalar yopiladi.
6. **Limit:** `@nestjs/throttler` — login'ga daqiqasiga 5 urinish → `429 TOO_MANY_REQUESTS`.
7. **Xabar:** noto'g'ri login ham, noto'g'ri parol ham — bitta matn: "Login yoki parol noto'g'ri".
8. **Audit:** `LOGIN` va `LOGIN_FAILED` (username bilan, parolsiz).
9. `AuthService.revokeAllSessions(userId)` — kontrakt PR'ida (26.11) bering: Muhammadyusuf xodimni bloklash va parolni tiklashda chaqiradi.

**Testlar:** unit — refresh almashishi; eski tokenni qayta ishlatganda hamma sessiyalar yopilishi. E2E — login → me → refresh → logout → refresh `401`; 6-urinish `429`; bloklangan xodim `403 USER_BLOCKED`.

**Qabul mezoni**

- [ ] Login/logout ishlaydi, parollar hash qilingan
- [ ] Refresh token har safar almashadi, eskisi ikkinchi marta ishlamaydi
- [ ] Bloklangan xodim kira olmaydi va refresh qila olmaydi
- [ ] Hech bir javobda `passwordHash` yoki token hash yo'q
- [ ] Testlar CI'da yashil

## T-16 · Rollar va huquqlar (RBAC) · 02.12

**Maqsad:** har endpoint faqat kerakli rolga ochiq bo'lsin. Qoidalar — `arxitektura.md` 9-bo'lim.

1. **Global `JwtAuthGuard`** (`APP_GUARD`): tokenni tekshiradi va xodimni **bazadan o'qiydi** (`id`, `roles`, `isActive`, `mustChangePassword`) → `request.user`. `@Public()` bo'lsa o'tkazib yuboradi.
2. **`RolesGuard` + `@Roles(...)`**: kerakli rollardan kamida bittasi bo'lmasa → `403 FORBIDDEN`.
3. `mustChangePassword = true` bo'lsa, faqat `/auth/me`, `/auth/change-password`, `/auth/logout` ochiq, qolgani → `403 PASSWORD_CHANGE_REQUIRED`.
4. `@CurrentUser()` dekoratori.
5. **`MedicalAccessService.assertCanView(user, patientId)`** — `auth` modulidan eksport qilinadi: ADMIN → ruxsat; DOCTOR → shu bemor bilan kamida bitta qabul yoki tashrifi bo'lsa; boshqalar → `403`. Visits, dental-chart, treatment-plans, files modullari shuni chaqiradi.
6. **Ruxsatlar e2e testi** — jadval ko'rinishida: `[metod, yo'l, rol, kutilgan status]`. H2 endpoint'lari (auth, users, patients, catalog) uchun to'ldiring. Keyingi modullar egalari shu jadvalga o'z qatorlarini qo'shadi.
7. Swagger'da `addBearerAuth()` va controller'larda `@ApiBearerAuth()`.

**Qabul mezoni**

- [ ] Har endpoint faqat ruxsat berilgan rolga ochiq
- [ ] E2E jadval H2 endpoint'larining hammasini 4 rol bilan tekshiradi
- [ ] Bloklangan xodimning keyingi so'rovi darhol rad etiladi
- [ ] Tokensiz so'rov `401`, rol yetmasa `403` — adashtirilmaydi

## T-28 · Qabul API · 06.12 (kontrakt 03.12)

**Maqsad:** qabulning butun hayot sikli. Endpoint'lar — `api.md` 4.6, qoidalar — `arxitektura.md` 7.1.

1. **Status o'tishlari bitta joyda**, jadval ko'rinishida (`Record<from, Record<to, { roles, check }>>`). If-else zanjiri yozmang. Har o'tishga unit test.
2. **Tekshiruvlar:** davomiylik 10–240 daqiqa va 5 ga karrali; o'tgan kun yo'q; 90 kundan uzoq emas; bemor arxivlanmagan; shifokor faol va `DOCTOR` roli bor; kreslo faol.
3. **Ish vaqti:** `ScheduleService.assertWithinWorkingHours()` — Muhammadyusuf 03.12 gacha stub beradi, 06.12 gacha to'liq.
4. **Ro'yxat:** `from` va `to` majburiy, oraliq ≤ 31 kun. DOCTOR uchun `doctorId` doim o'zi (query'dagi qiymat e'tiborga olinmaydi). Javobda `patient`, `doctor`, `chair`, `visitId`.
5. **Ko'chirish:** faqat `SCHEDULED` va `ARRIVED`; hamma tekshiruv qaytadan; sana o'zgarsa `reminderSentAt = null`.
6. Visits uchun: `markInProgress(id, tx)` va `markCompleted(id, tx)`.
7. **Audit:** yaratish, ko'chirish, har status o'zgarishi.

**Qabul mezoni**

- [ ] Qabul to'liq hayot sikli ishlaydi: yozish → keldi → qabulda → yakunlandi; bekor; kelmadi; ko'chirish
- [ ] Ruxsat etilmagan o'tish `422`, hamma o'tishlarning unit testi bor
- [ ] Ish vaqtidan tashqari yozish `422`
- [ ] Ruxsatlar e2e jadvaliga qabul endpoint'lari qo'shilgan

## T-29 · Vaqt to'qnashuvi · 08.12

**Maqsad:** bir shifokorga yoki bir kresloga bir vaqtda ikki bemor tushmasin — hatto ikki registrator bir soniyada bossa ham.

1. **Oldindan tekshiruv** (service'da): faol statuslardagi ustma-ust qabulni qidirish (shifokor **yoki** kreslo, o'zi bundan mustasno) → `409 APPOINTMENT_DOCTOR_CONFLICT` yoki `APPOINTMENT_CHAIR_CONFLICT`, `details.conflictWith` bilan.
2. **Bazadagi himoya:** INSERT/UPDATE tranzaksiyada. Bazadan exclusion xatosi kelsa (`23P01`, xabarda constraint nomi) — uni ham to'g'ri `409` kodiga aylantiring. Prisma 7 driver adapter bu xatoni qanday o'rashini tekshirib, exception filter'da ushlang.
3. **Testlar:**
   - unit: chegaralar tegib turishi (10:00–10:30 va 10:30–11:00 — to'qnashmaydi), ichma-ich, qisman ustma-ust;
   - e2e: `Promise.all` bilan bir vaqtga ikkita `POST` → bittasi `201`, bittasi `409`;
   - bekor qilingan qabulning joyiga yozish mumkin;
   - `NO_SHOW → ARRIVED` paytida joy band bo'lsa → `409`.

**Qabul mezoni**

- [ ] Bir vaqtga ikki bemor yozib bo'lmaydi — shifokor bo'yicha ham, kreslo bo'yicha ham
- [ ] Parallel so'rovlar testi CI'da yashil
- [ ] `409` javobida band qilgan qabulning vaqti bor

## T-37 · Tish formulasi API · 13.12 (kontrakt 10.12)

**Maqsad:** har tishning hozirgi holati va tarixi. Endpoint'lar — `api.md` 4.8, qoidalar — `arxitektura.md` 7.5.

1. FDI raqamlari ro'yxati — `dental-chart/fdi.ts` (doimiy 32 + sut 20), unit testi bilan.
2. **Hozirgi holat** — har tish bo'yicha oxirgi yozuv: `findMany({ where: { patientId }, orderBy: [{ toothNumber: 'asc' }, { createdAt: 'desc' }], distinct: ['toothNumber'] })` yoki `DISTINCT ON` bilan SQL.
3. **Yozish:** `visitId` — shu shifokorning shu bemordagi `OPEN` tashrifi. Boshqa holatda `422 VISIT_NOT_OPEN` yoki `403`.
4. **O'qish:** `MedicalAccessService.assertCanView()`.
5. Har yozuv auditga tushadi.

**Qabul mezoni**

- [ ] 32 tish holati saqlanadi va tarixi ko'rinadi; sut tishlari (51–85) ham ishlaydi
- [ ] Noto'g'ri raqam (19, 60, 0) → `400`
- [ ] Boshqa shifokorning bemori → `403`
- [ ] Ruxsatlar e2e jadvali yangilangan

## T-38 · Tashrif API · 16.12 (kontrakt 10.12)

**Maqsad:** shifokor tashrifni boshlaydi, yuritadi va yopadi. Endpoint'lar — `api.md` 4.7 (chegirma T-47 da), qoidalar — `arxitektura.md` 7.2.

1. **Boshlash:** qabul shu shifokorniki va `ARRIVED` yoki bugungi `SCHEDULED`. Tranzaksiya: `Visit` yaratish + `markInProgress()`. Ikkinchi marta boshlash → `409`.
2. **Xizmat qo'shish:** `CatalogService.getActiveService()` → `serviceName` va `unitPrice` nusxalanadi, `amount = unitPrice × quantity`. `toothNumber` FDI bo'yicha tekshiriladi.
3. **Yakunlash** (tranzaksiya): tashxis bo'sh bo'lsa `422 DIAGNOSIS_REQUIRED` → `subtotal`, `total` → `doctorSharePercent` nusxasi → `COMPLETED`, `completedAt` → `markCompleted()`.
4. `OPEN` bo'lmagan tashrifga har qanday o'zgartirish → `422 VISIT_NOT_OPEN`.
5. Bemor tarixi `GET /patients/:id/visits` — xizmatlari bilan, yangisi birinchi.
6. **Audit:** boshlash, o'zgartirish, xizmat qo'shish/olib tashlash, yakunlash.

**Qabul mezoni**

- [ ] Tashrif yakunlanganda xizmatlar hisobga tushadi: kassadagi qarzlar ro'yxatida to'g'ri summa bilan chiqadi
- [ ] Preyskurant narxi o'zgarsa, eski tashrif summasi o'zgarmaydi (test)
- [ ] Yakunlangan tashrifni o'zgartirib bo'lmaydi (test)
- [ ] Boshqa shifokor tashrifni ocha ham, o'zgartira ham olmaydi

## T-47 · To'lovlar API · 21.12 (kontrakt 17.12)

**Maqsad:** pul to'g'ri hisoblansin va hech qachon yo'qolmasin. Endpoint'lar — `api.md` 4.11 va `POST /visits/:id/discount`, qoidalar — `arxitektura.md` 7.3.

1. **Balans** — bitta SQL so'rov (`$queryRaw` template yoki `groupBy`): har tashrif uchun `total`, `paid`, `debt`. `getVisitBalance()` va `getPatientBalance()` eksport qilinadi (hisobotlar ham ishlatadi).
2. **To'lov:** `Idempotency-Key` sarlavhasi majburiy (yo'q bo'lsa `400`). Tranzaksiya: `SELECT … FOR UPDATE` bilan tashrif qatori qulflanadi → qarz hisoblanadi → `0 < amount ≤ qarz` → yoziladi. Takror kalit → yangi to'lov yo'q, avvalgisi `200` bilan qaytadi.
3. **Qaytarish:** faqat ADMIN; asl yozuv `PAYMENT` bo'lishi kerak; shu to'lov bo'yicha jami qaytarilgan ≤ asl summa; usul asl to'lovniki.
4. **Chegirma:** CASHIER ≤ 10% (`CASHIER_MAX_DISCOUNT_PERCENT`), ADMIN cheksiz; tashrifga hali to'lov bo'lmasa; `reason` majburiy.
5. **Chek** (`Receipt`): `receiptNo` — to'lov id'si 6 xonali (`000123`); klinika nomi va telefoni env'dan.
6. **Kassa jurnali:** davr bo'yicha ro'yxat + usullar bo'yicha jami.
7. **Audit:** to'lov, qaytarish, chegirma.

**Testlar** (unit, jadval asosida):

| Holat | Jami | To'lovlar | Qaytarish | Kutilgan qarz |
| --- | --- | --- | --- | --- |
| To'liq to'lov | 500 000 | 500 000 | — | 0 |
| Qisman | 500 000 | 200 000 | — | 300 000 |
| Ikki qismda | 500 000 | 200 000 + 300 000 | — | 0 |
| 50 000 chegirma | 450 000 | 200 000 | — | 250 000 |
| Xato to'lov qaytarildi | 500 000 | 500 000 | 100 000 | 100 000 |

E2E: bir xil `Idempotency-Key` bilan ikki so'rov → bitta to'lov; qarzdan katta summa → `422`.

**Qabul mezoni**

- [ ] Bemor balansi va qarzi to'g'ri hisoblanadi — jadvaldagi hamma holat testda
- [ ] Ikki marta bosish dublikat to'lov yaratmaydi
- [ ] Kassir qaytarish qila olmaydi (`403`), chegirma chegarasi ishlaydi
- [ ] Hech bir to'lov o'chirilmaydi va tahrirlanmaydi

## T-52 · Telegram eslatma · 23.12 · past ustuvorlik

T-47 tayyor va kritik xato bo'lmasagina boshlanadi. Vaqt yetmasa, birinchi bo'lib shu qisqartiriladi.

1. Botni Ilyos BotFather'da yaratadi, token `.env`ga yoziladi. Staging va production uchun **alohida bot** (bitta bot ikki serverda polling qilsa, Telegram xato beradi).
2. `grammy`, long polling. `TELEGRAM_BOT_TOKEN` bo'sh bo'lsa, modul ishga tushmaydi.
3. **Bemorni ulash:** `/start` → "Telefon raqamni yuborish" tugmasi (`request_contact`) → `contact.user_id === from.id` tekshiruvi (birovning kontaktini yuborib bo'lmaydi) → raqam normallashtiriladi → shu raqamdagi hamma bemorlarga `telegramChatId` yoziladi → "Ulandingiz" xabari.
4. **Cron** (`@nestjs/schedule`), har 15 daqiqada, faqat 08:00–21:00 (Toshkent): `SCHEDULED`, `reminderSentAt IS NULL`, `startAt` 2 soatdan keyin va 24 soat ichida, bemorda `telegramChatId` bor → xabar → `reminderSentAt` yoziladi.
5. **Matn:** "Assalomu alaykum! {sana} kuni soat {vaqt} da {klinika} klinikasida qabulingiz bor (shifokor: {ism}). O'zgartirish uchun: {telefon}". Bir chatda bir nechta bemor bo'lsa — bemor ismi ham yoziladi.
6. Yuborish xatosi (bemor botni bloklagan va hokazo) logga yoziladi, ilova yiqilmaydi.

**Qabul mezoni**

- [ ] Qabuldan 1 kun oldin eslatma ketadi — staging botida sinab ko'rilgan
- [ ] Bitta qabulga eslatma bir martadan ortiq ketmaydi
- [ ] Bot token repoda yo'q

## T-56 · Xatolarni tuzatish (backend) · 27.12

1. QA ro'yxatidagi backend xatolari ustuvorlik bo'yicha: avval kritik, keyin yuqori.
2. Har tuzatish — alohida PR (`fix/T-56-...`). Imkon bo'lsa, avval xatoni qaytaradigan test yoziladi, keyin tuzatiladi.
3. 26.12 dan keyin sxema o'zgarishi faqat Ilyos ruxsati bilan.

**Qabul mezoni**

- [ ] Kritik va yuqori xatolar yopilgan
- [ ] Har tuzatishga test yoki QA'ning qayta tekshiruvi bor

---

## Yetakchi sifatida

- `backend/prisma/` va backend arxitekturasi bo'yicha qarorlar sizda. Muhammadyusufning PR'larini 24 soat ichida ko'rasiz.
- Har seshanba Ilyosga 3 qator: nima tayyor, nima kechikyapti, qanday xavf bor.
- Muhammadyusuf qotib qolsa — birinchi yordam sizdan.
- H4 (T-37 + T-38) va H5 (T-47 + T-52) haftalaringiz og'ir. Kechikish xavfini H3 oxirida Ilyosga ayting — masalan, T-52 ni Muhammadyusufga o'tkazish mumkin.
