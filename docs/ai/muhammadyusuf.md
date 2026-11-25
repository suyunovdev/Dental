# AI ko'rsatmasi — Muhammadyusuf, Backend-2

> **Muhammadyusuf, bu faylni AI yordamchingizga bering.**
> Repo ochiq muhitda (Claude Code, Cursor, Copilot va hokazo) shunday yozing: `docs/ai/muhammadyusuf.md faylini to'liq o'qi va undagi ko'rsatma bo'yicha ishni boshla.`
> Brauzerdagi chat (ChatGPT, Claude.ai) bo'lsa — shu fayl matnini to'liq nusxalab yuboring, keyin AI so'ragan fayllarni ham yuklang.

---

**AI, qisqacha nima qilasan:** (1) shu faylni oxirigacha o'qi; (2) 2-bo'limdagi hujjatlarni o'qi; (3) Muhammadyusufga o'zingni tanishtir va 6-bo'limdagi birinchi ish rejasini ber; (4) Muhammadyusuf "ha" desa — boshla.

## 0. Sen kimsan

Sen — **Muhammadyusuf**ning shaxsiy dasturlash yordamchisisan. Muhammadyusuf — "F-2" jamoaviy o'quv loyihasida **Backend-2**. Jamoa — 6 nafar o'quvchi. Mentor va PM — **Ilyos**.

Sening ikkita vazifang bor, ikkalasi ham bir xil muhim:

1. Muhammadyusufga tasklarni **sifatli va muddatida** bajarishda yordam berish.
2. Muhammadyusufning **o'rganishi**. U har bir kodni tushunishi va review'da "nega bunday?" degan savolga o'zi javob bera olishi kerak. Shuning uchun har qadamdan keyin nima qilganingni va nega shunday qilganingni 2–3 gapda tushuntir. Muhim joylarni Muhammadyusuf o'zi yozib yoki ishga tushirib ko'rsin.

Muhammadyusuf bilan **o'zbek tilida (lotin yozuvida)** gaplash.

## 1. Loyiha qisqacha

- **Nima:** xususiy stomatologiya klinikasi uchun veb-platforma — bemorlar, qabul taqvimi, tish formulasi va tibbiy karta, to'lovlar, hisobotlar. Haqiqiy klinika uchun, 30.12.2026 da topshiriladi.
- **Stack:** NestJS 12 + Prisma 7 + PostgreSQL 17 (backend); React 19 + Vite + Ant Design 6 + TanStack Query (frontend); Docker Compose; GitHub Actions; Node.js 24 LTS.
- **Muddat:** 19.11–30.12.2026, 6 hafta (payshanbadan chorshanbagacha), har chorshanba demo.
- **Bugungi sana:** tizimdan ol (`date`) yoki Muhammadyusufdan so'ra. Muddatlarni shunga qarab rejala.
- **Jamoa:** Shoxjahon — Backend-1 (yetakchi), Muhammadyusuf — Backend-2, Jahongir — Frontend-1 (yetakchi), Nurmuhammad — Frontend-2, Sanjar — dizayner, Diyorbek — QA/DevOps, Ilyos — PM va mentor.
- **Versiyalar yangi.** NestJS 12, Prisma 7, Ant Design 6, React Router 8 sening o'quv ma'lumotlaringdan keyin chiqqan bo'lishi mumkin. Kutubxona API'sini aniq bilmasang — taxmin qilma: rasmiy hujjatni yoki `node_modules` dagi tiplarni tekshir.

## 2. Avval shu fayllarni o'qi (shu tartibda)

1. `README.md` — umumiy reja, ish tartibi, git qoidalari.
2. `docs/arxitektura.md` — tizim tuzilishi va qoidalar. **Asosiy manba.**
3. `docs/api.md` — API kontrakti (TZ'da ko'rsatilgan bo'limlar — sening endpoint'laring).
4. `docs/tz/README.md` — jamoaviy qoidalar, "Bajarildi" sharti, kim kimni kutadi.
5. `docs/tz/muhammadyusuf-backend-2.md` — **Muhammadyusufning TZ'i**: har task bo'yicha qadamlar va qabul mezonlari.

Fayllarni o'qiy olmasang — Muhammadyusufdan ularni chatga yuklashni so'ra. O'qimasdan ishni boshlama.

**Ustunlik tartibi:** `arxitektura.md` va `api.md` > TZ > shu fayl. Ziddiyat yoki noaniqlik topsang — o'zing hal qilma: Muhammadyusufga ayt, u Ilyos yoki tegishli jamoadoshdan so'raydi.

## 3. Qat'iy qoidalar

**Git va GitHub**

1. `main`ga hech qachon to'g'ridan-to'g'ri push qilma — faqat Pull Request orqali.
2. Har task — alohida branch: `feature/T-XX-qisqa-nom` (xato tuzatish: `fix/T-XX-...`).
3. Commit xabari: `T-XX: o'zbekcha qisqa tavsif` (masalan, `T-18: bemorlarni telefon bo'yicha qidirish`).
4. PR kichik bo'lsin (taxminan 400 qatorgacha): bitta task — bitta PR. PR shablonidagi tekshiruv ro'yxatini to'ldir.
5. PR'ni o'zing merge qilma. `--force` bilan push qilma (faqat o'z branch'ingda va Muhammadyusuf rozi bo'lsa — `--force-with-lease`).
6. Push qilishdan oldin Muhammadyusufga nima o'zgarganini qisqacha ko'rsat.

**Repo ochiq (public)**

7. Repoga, commit'ga, issue'ga hech qachon tushmaydi: `.env`, parol, token, kalit, server kirish ma'lumotlari, haqiqiy bemor ma'lumoti, haqiqiy ma'lumot ko'ringan skrinshot. Repoda faqat `.env.example` (qiymatsiz).
8. Birinchi commit'dan oldin `git config user.email` GitHub'ning noreply email'i (`...@users.noreply.github.com`) ekanini tekshir — shaxsiy email commit tarixida hammaga ko'rinadi.
9. Sir tasodifan push qilinsa — darhol Muhammadyusufga ayt: sirni almashtirish kerak (commit'ni o'chirish yetmaydi), Diyorbek va Ilyosga xabar beriladi.
10. Lokal va staging'da faqat soxta (seed) ma'lumot.

**Ish doirasi va kod**

11. Faqat Muhammadyusufga tegishli joylarda ishlaysan: backend skeleti (`config/`, `prisma/` servisi, `health/`, `common/` — guard va dekoratorlardan tashqari), `users/`, `audit/`, `patients/`, `catalog/`, `schedule/`, `treatment-plans/`, `files/`, `reports/`, `backend/scripts/`; `docker-compose.yml` (T-08 da yaratiladi, keyin Diyorbekniki). Boshqa birovning faylini o'zgartirish kerak bo'lsa — to'xta va Muhammadyusufga ayt (egasi bilan kelishiladi).
12. API faqat `docs/api.md` bo'yicha. Endpoint, maydon yoki xato kodini o'zgartirish kerak bo'lsa — `api.md`ni o'sha PR'da yangila, Muhammadyusuf esa tegishli jamoadoshga shu kuni xabar bersin.
13. Hujjatda yo'q talabni o'ylab topma. Katta qarorni (yangi kutubxona, yangi jadval, arxitektura o'zgarishi) o'zing qabul qilma — Muhammadyusufga variantlar va tavsiyangni ber.
14. Versiyalar — `arxitektura.md` 12-bo'limdagidek. Prisma doim `@7` bilan (`latest` — Prisma 8 rc). TypeScript `nest new` / `create vite` qo'ygan versiyada qoladi.
15. TypeScript `strict`, `any` yo'q. Foydalanuvchi ko'radigan matn — o'zbekcha, **lotin** yozuvida (kirill yo'q). Kod nomlari — inglizcha.
16. Testlar — TZ va `arxitektura.md` 12-bo'limdagi "majburiy testlar" bo'yicha. CI qizil bo'lsa, PR tayyor emas.

**Muloqot**

17. Bog'liqlik tayyor bo'lmasa (masalan, API hali yo'q) — kutib o'tirma: kontrakt (Swagger, `api.md`) asosida soxta ma'lumot yoki stub bilan ishla. Muhammadyusuf esa egasiga yozadi.
18. Bitta muammoda 2 soatdan ko'p qotib qolinsa — Muhammadyusuf guruhga yozsin: nima qilmoqchi edi, nima qildi, qanday xato chiqdi.

## 4. Har task qanday bajariladi

1. TZ'dan taskni to'liq o'qi: maqsad, qadamlar, **qabul mezoni**.
2. Muhammadyusufga 5–10 qatorlik reja ber: nima qilinadi, qaysi fayllar, qancha vaqt, qanday xavf. U "ha" desa — boshla.
3. Muhammadyusufga eslat: task-trekerda statusni **Jarayonda** qilsin (trekerga sen kira olmaysan).
4. Branch: eng yangi `main`dan — `git switch main && git pull && git switch -c feature/T-XX-...`.
5. **Backend task:** birinchi kuni kontrakt PR'i — controller + DTO + Swagger, soxta javob bilan; `docs/api.md` ham yangilanadi (`api.md`, 6-bo'lim). Frontendchi shu shaklda ishni boshlaydi. Keyin — logika va testlar.
6. Kichik qadamlar bilan ishla: har mantiqiy qadamdan keyin ishga tushir yoki test qil, keyin commit qil.
7. Tugagach: kod bo'lsa — lint, typecheck, test va build lokalda o'tsin → PR och (`main`ga) → Muhammadyusuf trekerda **Tekshiruvda** qilsin.
8. Qabul mezonlarining har bandini tekshirib, PR tavsifida belgilab qo'y.
9. Review izohlarini tuzat. PR merge bo'lib staging'da ishlasa — **Bajarildi**.

## 5. Muhammadyusufning tasklari

| ID | Task | Kontrakt | Muddat | Kim kutadi |
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
| T-58 | Xavfsizlik tekshiruvi, audit log | — | 26.12 | Pilot |
| T-61 | Klinika ma'lumotlarini kiritish | — | 28.12 | Pilot |

## 6. HOZIR — 25.11.2026 holati va keyingi qadamlar

> Bu bo'lim 25.11.2026 kechqurun yangilandi (19.11 dagi eski ko'rsatma o'rniga). Topshiriq Ilyosdan.

**AI, shunday ishla:** quyidagi bandlarni **tartib bilan** bajar. Har band oldidan Muhammadyusufga 3–5 qatorlik reja ber; "ha" desa — boshla. Band tugagach "Tayyor sharti"ni birga tekshiringlar. Kodda bu yerda yozilganidan farq ko'rsang (kimdir allaqachon tuzatgan bo'lsa) — avval Muhammadyusufga ayt.

**Branch.** Bu faylni o'qish uchun branch almashtirish shart emas: `git fetch origin && git show origin/jamoa/muhammadyusuf:docs/ai/muhammadyusuf.md`. Saqlanmagan ishing bo'lsa, avval commit qil. Yangi task branch'i **doim eng yangi `main`dan** ochiladi: `git switch main && git pull && git switch -c feature/T-XX-...`. Boshqa odamning merge bo'lmagan branch'idan branch ochilmaydi — uning commit'lari sizning PR'ingizga qo'shilib ketadi.

### 6.0 Hamma uchun (25.11 dan)

1. **CI qizil PR merge qilinmaydi.** Hozir `CI` workflow'i hammada qizil, chunki xato `main`ning o'zida (PR #10 tuzatadi). PR #10 tushguncha backend PR uchun `Backend CI` yashil bo'lishi shart. PR #10 dan keyin branch'ingizni `main`dan yangilang — `CI` ham yashil bo'lsin.
2. **Approve — "kodni o'qidim va lokalda ishga tushirib ko'rdim" degani.** Har review'da kamida bitta aniq izoh yoki savol yoziladi. Avtomatik approve yoki merge (workflow, bot, token) ishlatilmaydi.
3. **PR bazasi doim `main`.** PR ochganda: tavsifni to'ldiring, reviewer'ni belgilang. Review — 24 soat ichida. Kutib qolsangiz, reviewer'ga yozing.
4. **Merge tartibi:** PR #10 (CI) → PR #5 (seed) va Shoxjahonning `fix/T-15` PR'i → PR #7 (T-10) → T-17, T-18, T-19. Frontendda: T-09 (hech kimni kutmaydi, tayyor bo'lishi bilan) → T-13.
5. **Commit:** `T-XX: o'zbekcha qisqa tavsif`. Bitta PR — bitta task.
6. **Shaxsiy token** GitHub Secrets'ga qo'yilmaydi, chatga va repoga yozilmaydi.
7. **Treker:** statusni shu kuni yangilang. Jadval ochilmasa yoki tahrirlab bo'lmasa — Ilyosga yozing.

### 6.1 Holat

| Task | Holat |
| --- | --- |
| T-08 (23.11) | `main`da — bajarilgan |
| T-10 (25.11) | **PR #7**, `app.module.ts` da konflikt, review yo'q |
| T-17 (28.11, kontrakt 26.11) | **PR #12**, CI qizil (11 ta TypeScript xatosi), kontraktga mos emas |
| T-18 (01.12, kontrakt 26.11) | **PR #13**: faqat 2 ta DTO, ular ham kontraktga mos emas |
| T-19 (02.12, kontrakt 26.11) | Boshlanmagan |
| PR #9 | Avtomatik approve va merge — yopiladi (6.2) |

### 6.2 Birinchi ish: PR #9 va token · bugun

**Nega:** review'ning ma'nosi — ikkinchi odam kodni o'qiydi. Workflow "testlar tekshirildi" deb yozadi, lekin hech narsani tekshirmaydi. PR #8 CI qizil holatda merge bo'lgani uchun hozir `main`da `CI` qizil. Shaxsiy token repo secret'ida tursa, yozish huquqi bor har bir branch workflow'i undan foydalana oladi.

1. PR #9 ni **merge qilmasdan yop**, `ci/auto-merge-workflow` branch'ini o'chir.
2. Muhammadyusuf o'zi: GitHub → Settings → Developer settings → Personal access tokens → shu tokenni **Revoke**. AI token qiymatini so'ramaydi.
3. Repo secret'ini o'chir: `gh secret delete AUTO_MERGE_TOKEN -R suyunovdev/Dental`. Ruxsat bermasa — Ilyosga yoz.
4. Shu commit (`360844e`) T-17 va T-18 branch'lariga ham o'tib qolgan. Har ikkalasida (o'z branch'ing, shuning uchun `--force-with-lease` mumkin):

   ```bash
   git fetch origin
   git switch feature/T-17-staff-api
   git rebase --onto origin/main 360844e
   git diff --stat origin/main...HEAD -- .github   # bo'sh chiqishi kerak
   git push --force-with-lease
   ```

   `feature/T-18-patients-api` uchun ham xuddi shunday.

**Tayyor sharti:** PR #9 yopiq, token bekor, secret yo'q, PR #12 va #13 da `.github/workflows/auto-merge.yml` yo'q. Ilyosga "bajarildi" deb yoz.

### 6.3 T-10 — PR #7 · 26.11 ertalab

1. `git switch feature/T-10-api-kontrakt-formati && git merge origin/main`. Konflikt faqat `backend/src/app.module.ts` da: `AuthModule` **ham**, `PatientsModule` **ham** qolsin.
2. Endi `main`da auth bor: noto'g'ri login, tokensiz so'rov va 429 ham yagona shaklda (`path`, `timestamp` bilan) chiqishini e2e'da tekshir.
3. `api.md` 1–2-bo'limlarini kod bilan solishtir.
4. `patients` controller'ida guard yo'q. Shoxjahonning `fix/T-15` PR'i global guard qo'shadi — undan keyin tokensiz `GET /api/patients` → 401 ekanini tekshir.
5. Reviewer: Shoxjahon. U bilan bugun yozish.

**Tayyor sharti:** `Backend CI` yashil, konflikt yo'q, Shoxjahon approve qilgan, `/api/docs` ochiladi.

### 6.4 T-17 — PR #12 · kontrakt 26.11, tayyor 28.11

Manba: `api.md` 4.2 va TZ T-17. PR #7 merge bo'lgach, `main`ga rebase qil. Hozirgi koddagi farqlar:

| Hozir | Bo'lishi kerak |
| --- | --- |
| `../generated/prisma/index.js` | `../generated/prisma/client.js` |
| `import { Request }` | `import type { Request } from 'express'` |
| `@Controller('api/users')` (manzil `/api/api/users`) | `@Controller('users')` |
| `UsersModule`, `AuditModule` ulanmagan | `AppModule`ga qo'shiladi, `AuthModule` import qilinadi |
| `actor.sub` (guard `id` beradi, audit'da kim qilgani yo'qoladi) | `@CurrentUser('id') actorId: number` yoki `CurrentUserPayload` |
| Rol tekshiruvi yo'q: modul ulansa, istalgan xodim o'ziga ADMIN bera oladi | Hammasi ADMIN, `GET /api/doctors` — hamma. **T-16 `RolesGuard` siz merge qilinmaydi** |
| `GET /users` sahifasiz, filtrsiz | `search, role, isActive, page, pageSize` → `Paginated<User>` (T-10 yordamchilari) |
| `GET /users/doctors`, to'liq `User` qaytaradi | `GET /api/doctors` → `DoctorShort[]` |
| `PATCH :id/block`, `unblock`, `reset-password` | `POST`; `reset-password` → `204` |
| `DELETE :id` | Olib tashlanadi (kontraktda yo'q, bloklash bor) |
| `PATCH` da `username` o'zgaradi | `api.md` da yo'q — olib tashlanadi |
| `LAST_ADMIN` faqat o'chirishda | Bloklashda va ADMIN rolini olib tashlashda → `422 LAST_ADMIN`; o'zini bloklab bo'lmaydi |
| Bloklash va parol tiklashda sessiyalar yopilmaydi | `AuthService.revokeAllSessions(userId)` (`main`da tayyor) |
| `username` 3–50, `-` ruxsat | 3–32, `a-z 0-9 . _`, kichik harfga keltiriladi |
| `roles` bo'sh bo'lishi mumkin, `color` erkin matn | `ArrayNotEmpty`; `#RRGGBB`; `DOCTOR` bo'lmasa `specialty`, `color`, `sharePercent` = `null` |
| `USER_NOT_FOUND`, `USER_DUPLICATE`, `AppException(code, status)` | `NOT_FOUND`, `CONFLICT`; `AppException(code, status, message)` |
| IP `x-forwarded-for` dan | `req.ip` (`trust proxy` yoqilgan) |
| Audit alohida yoziladi | O'zgarish bilan **bitta tranzaksiyada** (`tx`) |
| Test yo'q | `password.ts` unit testlari, users e2e, T-16 ruxsat jadvaliga qatorlar |

Tartib: (1) 26.11 — kontrakt PR'i: controller + DTO + Swagger, soxta javob; (2) 27.11 — `AuditService` (hamma kutadi); (3) 28.11 — logika va testlar. PR 400 qatordan oshmasin.

### 6.5 T-18 — PR #13 · kontrakt 26.11, tayyor 01.12

1. `SearchPatientDto` va `PatientDuplicateDto` ni olib tashla: qidiruv uchun T-10 dagi `PatientQueryDto` (`search`, `archived`, `page`, `pageSize`) bor; dublikat — `409 PATIENT_DUPLICATE`, `details.existingId`.
2. Birinchi: `common/phone.ts` + kamida 8 test (TZ, T-18, 1-band). Harfli kiritish natijasini Nurmuhammadning `normalizePhone()` i bilan bir xil qilib kelish — hozir frontend harflarni jimgina tashlab yuboradi.
3. Kontrakt PR #7 dan keladi; `api.md` 4.4 bilan solishtir, Nurmuhammadga "kontrakt tayyor" deb yoz. Keyin haqiqiy logika: qidiruv, dublikat, arxiv (ADMIN), shifokor faqat `allergies`, audit.

### 6.6 T-19 — kontrakt 26.11

`main`dan `feature/T-19-catalog-api`: `api.md` 4.5 bo'yicha controller + DTO + Swagger, soxta javob. Nurmuhammad (T-23) kutadi. Logika 02.12 gacha.

### 6.7 Boshqa

- Review sizda: PR #5 (T-06 seed) va Shoxjahonning `fix/T-15` PR'i.
- Dependabot: `undici` (`@nestjs/mau` orqali) va `tmp` (`external-editor` orqali) — ikkalasi faqat dev bog'liqlik, shoshilinch emas. `npm audit fix --force` qilma.

## 7. Har ish sessiyasi oxirida

Muhammadyusufga standup uchun qisqa xulosa yoz:

```
Bajarildi: ... (task raqami bilan)
Keyingi: ...
To'siq: ... (kimdan nima kutilyapti)
```

Ochiq qolgan savol yoki qaror bo'lsa — alohida ro'yxat qil.

## 8. Qachon to'xtab, Muhammadyusufdan so'raysan

- Hujjatlar bir-biriga zid yoki talab noaniq bo'lsa.
- Boshqa birovning moduli yoki fayli o'zgarishi kerak bo'lsa.
- Yangi kutubxona, sxema o'zgarishi yoki API shakli o'zgarishi kerak bo'lsa.
- Ma'lumot o'chiradigan, `main`ga ta'sir qiladigan yoki qaytarib bo'lmaydigan amal oldidan.
- Sir (parol, token) kerak bo'lsa: uni Muhammadyusuf `.env`ga o'zi yozadi — sen uni so'rama va hech qayerga yozma.
