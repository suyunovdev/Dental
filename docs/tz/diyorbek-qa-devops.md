# TZ: Diyorbek — QA/DevOps

| | |
| --- | --- |
| **Rol** | Repo qoidalari, CI/CD, serverlar, backup, test-keyslar, regress, pilot |
| **Fayllar** | `.github/`, `docker-compose*.yml`, `*/Dockerfile`, `deploy/`, `docs/qa/`, `docs/ops/` |
| **Kim bilan ishlaysiz** | Ilyos (test va pilot sheriklik), hamma dasturchilar (xatolar, deploy) |
| **Albatta o'qing** | [arxitektura.md](../arxitektura.md) — 7 (qoidalar = test manbai), 9 (rollar), 10 (xavfsizlik), 11 (muhitlar); [api.md](../api.md) — 2 (xatolar) |

Siz jamoaning "xavfsizlik to'ri"siz: kod qanday yetkazilishi (CI/CD), qayerda ishlashi (server) va klinikaga borishdan oldin to'g'ri ishlashi (test) sizga bog'liq. Qoidalar hujjatlarda yozilgan — sizning ishingiz ularning **haqiqatda** bajarilishini tekshirish.

## Tasklar

| ID | Task | Muddat | Kimga kerak |
| --- | --- | --- | --- |
| T-07 | GitHub repo, branch qoidalari, PR shabloni | 20.11 | Hamma |
| T-14 | Staging server va CI | 25.11 | Hamma |
| T-26 | Test reja va test-keyslar (H2 modullari) | 02.12 | Demo №1 |
| T-35 | Qabul moduli testlari va regress | 09.12 | Oraliq ko'rsatuv |
| T-45 | Tibbiy karta testlari va regress | 16.12 | Demo №2 |
| T-54 | To'liq regress | 23.12 | Feature freeze, pilot qarori |
| T-60 | Production server, domen, SSL, kunlik backup | 26.12 | Pilot |
| T-62 | Klinikada pilot (Ilyos bilan) | 29.12 | Topshirish |

---

## T-07 · GitHub repo, branch qoidalari, PR shabloni · 20.11

> **Muhim:** repo **public** va Ilyosning shaxsiy akkauntida. Bunday repoda hamkorga admin roli berilmaydi — GitHub Settings'ni faqat Ilyos (egasi) o'zgartira oladi. Siz sozlamalarni tekshirasiz va nima o'zgarishi kerakligini Ilyosga aniq yozib berasiz. Repo ochiq bo'lgani uchun hamma narsa — kod, issue, PR, Actions loglari — hammaga ko'rinadi: qoidalar `arxitektura.md` 10.1-bo'limda.

1. Hamma 6 kishi repoga kirganini tekshiring (taklifni qabul qilmaganlar bo'lsa — ularga yozing).
2. **19.11 da yoqilgan sozlamalarni tekshiring:**
   - `main` ruleset'i ("main himoyasi"): PR majburiy, kamida 1 ta tasdiq, yangi push'dan keyin eski tasdiq bekor bo'ladi, force-push va o'chirish taqiqlangan. Ilyos zarurat bo'lsa chetlab o'ta oladi;
   - Secret scanning, Push protection, Dependabot alerts.

   Tekshirish: `gh api repos/suyunovdev/Dental/rules/branches/main` (`deletion`, `non_fast_forward`, `pull_request` chiqishi kerak) va repo sahifasidagi Security tabi.
3. **CI tayyor bo'lgach (T-14):** Ilyosga yozing — ruleset'ga "Require status checks" (`backend`, `frontend`) qo'shiladi. CODEOWNERS fayli qo'shilgach — "Require review from Code Owners" ham yoqiladi.
4. **`.github/pull_request_template.md`:**

   ```markdown
   ## Task
   T-__ — (task nomi)

   ## Nima o'zgardi
   -

   ## Qanday tekshiriladi
   1.

   ## Skrinshot yoki Swagger (UI yoki API o'zgargan bo'lsa)

   ## Tekshiruv
   - [ ] `main`dan yangilangan, konflikt yo'q
   - [ ] Lint, typecheck, testlar lokalda o'tdi
   - [ ] Yangi yoki o'zgargan endpoint Swagger'da va `docs/api.md` da
   - [ ] Rollar tekshirilgan
   - [ ] UI: yuklanish, bo'sh va xato holatlari bor
   - [ ] Haqiqiy bemor ma'lumoti, parol yoki token yo'q
   ```

5. **`.github/CODEOWNERS`** (login'larni o'zingiz to'ldirasiz):

   ```
   *                     @suyunovdev
   /backend/             @<shoxjahon> @<muhammadyusuf>
   /backend/prisma/      @<shoxjahon>
   /frontend/            @<jahongir> @<nurmuhammad>
   /.github/             @<diyorbek>
   /deploy/              @<diyorbek>
   docker-compose*.yml   @<diyorbek>
   /docs/                @suyunovdev
   ```

6. **Bug shabloni** `.github/ISSUE_TEMPLATE/bug.yml` — maydonlar: qisqacha, muhit (local / staging / production), rol, qadamlar, kutilgan natija, haqiqiy natija, skrinshot, jiddiylik. Shablonda ogohlantirish: "Haqiqiy bemor ma'lumoti, parol va token yozmang — issue hammaga ko'rinadi".
7. **Belgilar (labels):** `bug`, `kritik`, `yuqori`, `o'rta`, `past`, `backend`, `frontend`, `dizayn`, `ui-review`, `pilot`, `blocked`.
8. **Ildiz fayllari:** `.gitignore` (`node_modules`, `dist`, `.env*` lekin `!.env.example`, `uploads/`, `coverage/`, `*.log`, `.DS_Store`, `src/generated/`), `.editorconfig`, `.nvmrc` (`24`), `.gitattributes` (`* text=auto eol=lf` — Windows va Mac'dagi qator oxiri farqi PR'larni buzmasligi uchun).

**Qabul mezoni**

- [ ] Hamma repoga ulangan, `main` himoyalangan, PR review majburiy (tekshirilgan)
- [ ] Secret scanning va Push protection yoqilganligi tekshirilgan
- [ ] PR shabloni, CODEOWNERS, bug shabloni va belgilar bor
- [ ] `.gitattributes`, `.gitignore`, `.nvmrc` bor

## T-14 · Staging server va CI · 25.11

**Maqsad:** har PR avtomatik tekshiriladi, `main`ga tushgan kod 10 daqiqada staging'da bo'ladi.

1. **Server:** VPS, 2 vCPU, 4 GB RAM, 40+ GB disk, Ubuntu LTS. Staging'da faqat soxta ma'lumot, shuning uchun mamlakat muhim emas.
2. **Himoya:** alohida `deploy` foydalanuvchisi (`docker` guruhida), SSH faqat kalit bilan, root bilan kirish o'chiq, `ufw` — faqat 22, 80, 443; `fail2ban`; `unattended-upgrades`.
3. Docker va compose plagini. Repo serverga **faqat o'qish huquqli deploy key** bilan: `/opt/f2`.
4. **Fayllar:**
   - `backend/Dockerfile` — multi-stage, `node:24-slim`; ishga tushishda `prisma migrate deploy`, keyin `node dist/main`;
   - `frontend/Dockerfile` — yig'ish → `nginx:stable-alpine`;
   - `deploy/nginx.conf` — statik fayllar, `/api` → `backend:3000`, SPA uchun `try_files $uri /index.html`, `client_max_body_size 20m`, gzip, xavfsizlik sarlavhalari (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`), hash'li fayllarga uzoq kesh, `index.html`ga kesh yo'q;
   - `docker-compose.prod.yml` — `db`, `backend`, `web`; `pgdata` va `uploads` volume'lari; `restart: unless-stopped`; **`db` porti tashqariga ochilmaydi**.
5. **TLS:** Let's Encrypt (certbot) yoki Caddy — birini tanlab, runbook'ga yozing. `staging.<domen>` DNS'i.
6. **GitHub Actions:**
   - `ci.yml` (PR va `main`ga push): `backend` va `frontend` job'lari — `setup-node` (24, npm kesh) → `npm ci` → lint → typecheck → test → build. `backend` job'ida e2e testlar uchun `services: postgres:17`. `concurrency` + `cancel-in-progress: true` (minutlarni tejaydi).
   - `deploy-staging.yml` (`main`ga push, CI'dan keyin): SSH → `cd /opt/f2 && git fetch && git checkout <sha> && docker compose -f docker-compose.prod.yml up -d --build` → `/api/health` bir necha marta tekshiriladi.
   - Image'lar serverda yig'iladi — registry kerak emas.
   - Secrets: `STAGING_HOST`, `STAGING_USER`, `STAGING_SSH_KEY`, `STAGING_KNOWN_HOSTS`. `StrictHostKeyChecking=no` ishlatilmaydi.
   - **Repo public — Actions loglari ham ochiq.** Workflow'da sirni `echo` qilmang, `set -x` ishlatmang, server manzilini va yo'llarini logga chiqarmang.
7. Staging'da seed: `docker compose exec backend npm run db:seed`. Test akkauntlarning parollari faqat staging `.env`da; jamoaga shaxsiy xabarda beriladi.
8. Public repoda standart runner'lardagi Actions bepul va minut limiti yo'q.
9. **`docs/ops/runbook.md`:** serverga kirish, deploy, loglar (`docker compose logs -f backend`), qayta ishga tushirish, oldingi versiyaga qaytish (oldingi sha → `up -d --build`), seed'ni yangilash.

**Qabul mezoni**

- [ ] `main`ga merge bo'lganda staging avtomatik yangilanadi
- [ ] PR'da CI ishlaydi, qizil bo'lsa PR'da ko'rinadi
- [ ] Baza tashqaridan ochiq emas (5432 portini boshqa kompyuterdan tekshirib ko'rilgan)
- [ ] Runbook yozilgan

## T-26 · Test reja va test-keyslar · 02.12 (Ilyos bilan)

**Maqsad:** H2 modullari (kirish, bemorlar, xizmatlar, xodimlar) demo'dan oldin tizimli tekshirilsin.

1. **`docs/qa/test-reja.md`:** nima testlanadi, qayerda (staging), test akkauntlar (har rol), jiddiylik darajalari, "o'tdi" sharti (kritik va yuqori xato yo'q).
2. **Jiddiylik:**

   | Daraja | Misol | Qachon tuzatiladi |
   | --- | --- | --- |
   | Kritik | Ma'lumot yo'qoladi, pul noto'g'ri, ruxsatsiz kirish, asosiy oqim to'xtaydi | Darhol |
   | Yuqori | Asosiy funksiya ishlamaydi, aylanma yo'l bor | Shu hafta |
   | O'rta | Noqulaylik, kichik funksiya | Vaqt bo'lsa |
   | Past | Kosmetika, imlo | Oxirida |

3. **Keyslar** `docs/qa/keyslar/<modul>.md`, jadval ko'rinishida:

   | ID | Sarlavha | Rol | Oldingi shart | Qadamlar | Kutilgan natija | Ustuvorlik |
   | --- | --- | --- | --- | --- | --- | --- |
   | TC-PAT-001 | Bemor qo'shish | RECEPTIONIST | Kirgan | 1. "Yangi bemor" 2. Majburiy maydonlar 3. "Saqlash" | Bemor ro'yxatda, xabar chiqdi | Yuqori |
   | TC-PAT-007 | Bir xil telefon va ism | RECEPTIONIST | Bemor bor | Xuddi shu raqam va ism bilan qo'shish | "Bu bemor allaqachon bor" | Yuqori |
   | TC-AUTH-004 | Kassir xodimlar sahifasiga URL orqali | CASHIER | Kirgan | `/staff` ni ochish | 403 sahifa | Yuqori |
   | TC-AUTH-009 | 6 marta noto'g'ri parol | — | — | 6 marta xato kiritish | 6-urinishda "Juda ko'p urinish" | O'rta |

   Har modul uchun: to'g'ri ishlashi, noto'g'ri kiritish (validatsiya), har rol ruxsat etilmagan amalga urinadi (to'g'ridan-to'g'ri URL bilan ham), chegaraviy holatlar (uzun ism, `O'g'iloy` kabi apostrofli ism, har xil yozilgan telefon, bo'sh ro'yxat), sessiya (chiqib, "Orqaga" bosish; F5).
4. Xatolar — GitHub issue (bug shabloni + belgilar). Har kuni kech Ilyos bilan 15 daqiqa ko'rib chiqish.
5. Natijalar trekerdagi alohida varaqda ("Regress H2"): keys ID, natija (o'tdi / yiqildi), issue havolasi.

**Qabul mezoni**

- [ ] Test-keyslar yozilgan, topilgan xatolar ro'yxatda
- [ ] Har modulda kamida 5 ijobiy, 5 salbiy va rollar keyslari
- [ ] 01.12 da (Demo №1 dan oldin) to'liq bir marta o'tkazilgan

## T-35 · Qabul moduli testlari va regress · 09.12 (Ilyos bilan)

Keyslar `arxitektura.md` 7.1 dagi qoidalardan:

- bir shifokorga bir vaqtga ikkinchi qabul → "Shifokor bu vaqtda band";
- chegaralar tegib turadi (10:00–10:30 va 10:30–11:00) → ruxsat;
- bir kreslo, ikki shifokor, bir vaqt → "Kreslo band";
- ish vaqtidan tashqari (08:30, 17:45–18:15, dam olish kuni) → rad;
- ikki brauzerda (ikki registrator) bir vaqtda bir joyga yozish → bittasi o'tadi, ikkinchisiga sabab;
- bekor qilingan qabul joyiga yozish → mumkin;
- status o'tishlari: ruxsat etilganlari bir bosishda; ruxsat etilmaganlari uchun tugma umuman yo'q;
- taqvimda band vaqtga sudrash → qabul joyiga qaytadi;
- **vaqt zonasi:** 10:00 ga yozilgan qabul taqvimda, navbatda va bemor kartasida — hamma joyda 10:00;
- shifokor roli: faqat o'z qabullari, sudray olmaydi;
- **"1 daqiqada yozish":** sekundomer bilan 5 marta, o'rtacha ≤ 60 soniya;
- regress: H2 dagi "yuqori" keyslar.

**Qabul mezoni**

- [ ] Kritik xato qolmagan
- [ ] Hamma keys o'tkazilgan, natijasi yozilgan
- [ ] Oraliq ko'rsatuvdan oldin (09.12 ertalab) staging'da tekshirilgan

## T-45 · Tibbiy karta testlari va regress · 16.12 (Ilyos bilan)

- **Tish formulasi:** 32 doimiy + 20 sut tishi, har holat, tarix; noto'g'ri raqamni Swagger orqali yuborish → `400`.
- **Tashrif:** boshlash, xizmat qo'shish (tish bilan va tishsiz), olib tashlash; tashxissiz yakunlash → rad; yakunlangach kassada chiqadi; yakunlangandan keyin o'zgartirib bo'lmaydi.
- Preyskurant narxini o'zgartirish eski tashrifga ta'sir qilmaydi.
- **Davolash rejasi:** jami to'g'ri; bekor qilingan band jamidan chiqadi.
- **Fayllar:** JPEG, PNG, PDF yuklanadi; nomi `.jpg`ga o'zgartirilgan `.exe` → rad; 16 MB → rad; boshqa shifokor akkauntidan fayl URL'i → `403`; tizimdan chiqqandan keyin fayl URL'i → `401`.
- Allergiya ogohlantirishi tashrif sahifasida ko'rinadi.
- Registrator va kassir tibbiy tablarni ko'rmaydi.
- Regress: H2 va H3 dagi "yuqori" keyslar.

**Qabul mezoni**

- [ ] Kritik xato qolmagan
- [ ] Demo №2 dan oldin (15.12) o'tkazilgan

## T-54 · To'liq regress · 23.12 (Ilyos bilan)

- **Pul:** Shoxjahonning T-47 jadvalidagi hamma ssenariy — UI orqali, natija kalkulyator bilan solishtiriladi.
- **Ikki marta bosish:** tez ikki klik va sekin internet (DevTools → Slow 3G) → bitta to'lov.
- **Chegirma:** kassir 10% dan ortiq → rad; to'lovdan keyin chegirma → rad. **Qaytarish** — faqat admin.
- **Chek:** printerda yoki PDF'da — summalar, sana, kassir to'g'ri.
- **Hisobotlar:** bir hafta uchun qo'lda hisob (to'lovlar ro'yxatidan) = hisobot = Excel.
- **Kun chegarasi:** kech soatda (23:50 atrofida) qilingan to'lov shu kunga tushadi.
- **Rollar matritsasi:** `arxitektura.md` 9-bo'limdagi har qator × 4 rol.
- **Planshet** (1024×768): asosiy ekranlar.
- Eslatma (T-52 qilingan bo'lsa) — staging botida.
- Xatolar ro'yxati → Ilyos bilan saralash → T-56 / T-57.

**Qabul mezoni**

- [ ] Barcha xatolar ustuvorlik bilan ro'yxatda
- [ ] Pul va hisobot keyslari 100% o'tkazilgan
- [ ] Ilyosga "pilotga tayyormi" bo'yicha qisqa xulosa (ha / yo'q va sabablari)

## T-60 · Production server, domen, SSL, kunlik backup · 26.12

1. **Server:** Ilyos tanlagan, **O'zbekistondagi** VPS (qonun talabi — `arxitektura.md` 10-bo'lim). 2–4 vCPU, 4–8 GB RAM, 80+ GB SSD.
2. Staging'dagi kabi himoya. **Hamma sirlar yangi:** JWT siri, baza paroli — staging'dan ko'chirilmaydi.
3. Domen, DNS, SSL; HTTP → HTTPS yo'naltirish; HSTS. `NODE_ENV=production` — Swagger o'chiq.
4. **Deploy** qo'lda: `deploy-prod.yml` (`workflow_dispatch`) GitHub'ning `production` environment'i orqali — Ilyos "required reviewer", u tasdiqlamaguncha ishga tushmaydi. Production sirlari faqat shu environment'da.
5. **Backup:**
   - cron, har kuni 03:00 (Toshkent): `docker compose exec -T db pg_dump -Fc` + `uploads` arxivi → shifrlash (`gpg --symmetric` yoki `age`) → server tashqarisidagi saqlashga (u ham O'zbekistonda) `rclone` yoki `rsync` bilan;
   - 14 kunlik + 4 haftalik nusxa saqlanadi;
   - xato bo'lsa — Telegram'ga xabar (bot API'ga `curl`);
   - shifrlash kaliti serverda emas — Ilyos va sizda, repoda yo'q.
6. **Tiklashni sinash:** oxirgi backup'ni alohida bazaga (`f2_restore_test`) va vaqtinchalik papkaga tiklang → bemorlar soni va to'lovlar yig'indisi production bilan mos → qancha vaqt ketganini yozing.
7. **Monitoring:** `/api/health` har 5 daqiqada tashqaridan tekshiriladi (masalan, UptimeRobot) → Telegram yoki email; disk 80% to'lsa ogohlantirish.
8. Runbook'ga production bo'limi: deploy, orqaga qaytish, tiklash (qadamma-qadam), kimda qanday kirish bor.

**Qabul mezoni**

- [ ] Backup'dan tiklash sinab ko'rilgan — natija va vaqt runbook'da
- [ ] Domen HTTPS bilan ochiladi, HTTP → HTTPS
- [ ] Baza va backup O'zbekistondagi serverlarda
- [ ] Monitoring ogohlantirishi sinalgan (servisni vaqtincha o'chirib ko'rib)

## T-62 · Klinikada pilot · 29.12 (Ilyos bilan)

1. **Reja (24.12 gacha):** sanalar (2–3 kun), joyida kim bo'ladi (siz va Ilyos, backend telefonda tayyor), qamrov (hamma rollar), zaxira yo'l (1-kuni qog'oz jurnal ham parallel yuritiladi).
2. **Boshlashdan oldin:** production tayyor (T-60), haqiqiy ma'lumotlar kiritilgan (T-61), xodimlar o'qitilgan (T-63), akkauntlar berilgan (vaqtinchalik parol — birinchi kirishda almashtiriladi).
3. **Pilot paytida:** joyida kuzatish; har muammo GitHub issue'ga (`pilot` belgisi: vaqt, rol, nima bo'ldi, jiddiylik); har kun oxirida 15 daqiqalik saralash; production'ga faqat kritik tuzatish, Ilyos ruxsati bilan.
4. **O'lchanadigan narsalar:** tizimda yozilgan qabullar soni (qog'ozdagiga nisbatan), yozish vaqti, kiritilgan to'lovlar, xatolar soni, xodimlar fikri (5 ta savol).
5. **Yakuniy hisobot (1 bet):** nima ishladi, nima muammo bo'ldi, tavsiya.

**Qabul mezoni**

- [ ] Xodimlar tizimda kunlik ishni bajara oldi
- [ ] Pilot jurnali va yakuniy hisobot Ilyosga berilgan
- [ ] Pilot davomida ma'lumot yo'qolmagan (kunlik backup ishlagan)
