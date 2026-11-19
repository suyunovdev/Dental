# Texnik topshiriqlar (TZ)

Har bir jamoa a'zosi uchun alohida TZ. Avval umumiy hujjatlarni o'qing, keyin o'zingiznikini:

1. [arxitektura.md](../arxitektura.md) — tizim qanday tuzilgan, qoidalar (hamma uchun majburiy).
2. [api.md](../api.md) — endpoint'lar va javob shakllari (backend va frontend uchun majburiy).
3. O'z TZ'ingiz:

| Kim | Rol | TZ | Tasklar |
| --- | --- | --- | --- |
| Shoxjahon | Backend-1 (yetakchi) | [shoxjahon-backend-1.md](shoxjahon-backend-1.md) | 11 |
| Muhammadyusuf | Backend-2 | [muhammadyusuf-backend-2.md](muhammadyusuf-backend-2.md) | 12 |
| Jahongir | Frontend-1 (yetakchi) | [jahongir-frontend-1.md](jahongir-frontend-1.md) | 9 |
| Nurmuhammad | Frontend-2 | [nurmuhammad-frontend-2.md](nurmuhammad-frontend-2.md) | 8 |
| Sanjar | Dizayner | [sanjar-dizayner.md](sanjar-dizayner.md) | 7 |
| Diyorbek | QA/DevOps | [diyorbek-qa-devops.md](diyorbek-qa-devops.md) | 8 |

Har taskning **qabul mezoni** task-trekerdagi "Natija" ustunidan olingan va TZ'da kengaytirilgan. Task faqat shu ro'yxatdagi hamma band bajarilganda "Bajarildi" bo'ladi.

---

## Birinchi ikki kun (19–20 noyabr) — hamma

- [ ] GitHub taklifini qabul qilish, repoga kira olishni tekshirish.
- [ ] **Repo public** — commit'dagi email hammaga ko'rinadi. GitHub → Settings → Emails → "Keep my email addresses private" ni yoqing va git'da shu sahifadagi `...@users.noreply.github.com` email'ini qo'ying: `git config --global user.email "<noreply email>"`.
- [ ] Node.js 24 LTS, Git, Docker (Docker Desktop yoki boshqa), VS Code o'rnatish. `node -v` → `v24.x`.
- [ ] `arxitektura.md`, `api.md` va o'z TZ'ingizni o'qish. Tushunmagan joyni yozib qo'yish.
- [ ] 20.11 dagi T-05 uchrashuvida (Shoxjahon tushuntiradi) savollarni berish.
- [ ] Task-trekerda o'z tasklaringiz va muddatlarini ko'rib chiqish. Real bo'lmagan muddat bo'lsa — **shu kuni** Ilyosga aytish.

## Task qanday bajariladi

1. Trekerda statusni **Jarayonda** qiling.
2. `main`dan yangi branch: `feature/T-18-patients-api` yoki `fix/T-56-payment-rounding`.
3. Backend task bo'lsa, **birinchi kuni** kontrakt PR'i: controller + DTO + Swagger, soxta javob bilan ([api.md, 6-bo'lim](../api.md#6-kontraktni-ozgartirish-tartibi)). Frontendchi shuni kutib turmaydi, shu bilan ishlaydi.
4. Commit'lar task raqami bilan: `T-18: bemorlarni telefon bo'yicha qidirish`.
5. PR ochilganda statusni **Tekshiruvda** qiling. PR kichik bo'lsin (400 qatordan oshsa, bo'lib yuboring).
6. Review 24 soat ichida. Izohlar tuzatilgach — merge.
7. Staging'da o'zingiz tekshirib ko'ring. Hammasi ishlasa — **Bajarildi**.

**Kim kimni review qiladi:** Shoxjahon ↔ Muhammadyusuf, Jahongir ↔ Nurmuhammad. `backend/prisma/` — doim Shoxjahon. `.github/`, Docker fayllari — Diyorbek. `docs/` — Ilyos. UI o'zgargan PR'ga skrinshot qo'shiladi, Sanjar ko'rib chiqadi.

## "Bajarildi" (Definition of Done)

- [ ] Trekerdagi va TZ'dagi qabul mezonlari bajarilgan
- [ ] Kod review'dan o'tgan va `main`ga merge bo'lgan
- [ ] CI yashil: lint, typecheck, test, build
- [ ] Staging'da ishlayapti
- [ ] Backend: endpoint Swagger'da, `api.md` yangilangan, rollar tekshirilgan, kerakli testlar yozilgan
- [ ] Frontend: dizaynga mos; yuklanish, bo'sh va xato holatlari bor; o'zbekcha matnlar, kirill yo'q
- [ ] QA tekshirgan, kritik xato yo'q

## Kim kimni kutadi

Kontrakt (stub) muddati — frontend yoki boshqa modul ishni boshlay olishi uchun shakl tayyor bo'ladigan kun. Tayyor muddati — trekerdagi muddat.

| Kim kutadi | Nimani | Kimdan | Kontrakt | Tayyor |
| --- | --- | --- | --- | --- |
| Shoxjahon (T-06), hamma backend | Backend skeleti T-08 | Muhammadyusuf | — | 23.11 |
| Nurmuhammad (T-13) | Frontend skeleti T-09 | Jahongir | — | 23.11 |
| Nurmuhammad (T-13) | UI kit T-12 | Sanjar | qoralama 24.11 | 25.11 |
| Diyorbek (T-14) | Ikkala skelet | Muhammadyusuf, Jahongir | — | 23.11 |
| Shoxjahon (T-15) | `common/password.ts` | Muhammadyusuf | 26.11 | 28.11 |
| Jahongir (T-20) | Auth API T-15 | Shoxjahon | 26.11 | 29.11 |
| Jahongir (T-24) | Xodimlar API T-17 | Muhammadyusuf | 26.11 | 28.11 |
| Nurmuhammad (T-22) | Bemorlar API T-18 | Muhammadyusuf | 26.11 | 01.12 |
| Nurmuhammad (T-23) | Xizmatlar API T-19 | Muhammadyusuf | 26.11 | 02.12 |
| Jahongir, Nurmuhammad (H2) | Wireframe T-11, dizayn T-25 | Sanjar | 23.11 | 30.11 |
| Shoxjahon (T-28) | `ScheduleService` T-30 | Muhammadyusuf | 03.12 | 06.12 |
| Jahongir (T-31), Nurmuhammad (T-32, T-33) | Qabul API T-28 | Shoxjahon | 03.12 | 06.12 |
| Jahongir (T-24, ish jadvali) | Ish jadvali API T-30 | Muhammadyusuf | 03.12 | 06.12 |
| Jahongir (T-41, T-43) | Dizayn T-34 | Sanjar | — | 07.12 |
| Jahongir (T-41) | Tish formulasi API T-37 | Shoxjahon | 10.12 | 13.12 |
| Jahongir (T-43) | Tashrif API T-38 | Shoxjahon | 10.12 | 16.12 |
| Nurmuhammad (T-42) | Reja T-39, fayllar T-40 | Muhammadyusuf | 10.12 | 14.12 / 16.12 |
| Nurmuhammad (T-51) | Dizayn T-44 | Sanjar | — | 14.12 |
| Jahongir (T-50) | To'lovlar API T-47 | Shoxjahon | 17.12 | 21.12 |
| Nurmuhammad (T-51) | Hisobot API T-48, T-49 | Muhammadyusuf | 17.12 | 20.12 / 23.12 |
| Diyorbek (testlar) | Staging'da tayyor modul | hamma | — | har seshanba (demodan bir kun oldin) |

Agar sizni kutayotgan odam bo'lsa va siz kechiksangiz — **muddatdan oldin** guruhga yozing, muddat o'tgandan keyin emas.

## Haftalik demo (har chorshanba, staging'da)

| Sana | Nimani ko'rsatamiz |
| --- | --- |
| 25.11 | Hujjatlar, DB sxemasi, wireframe'lar, ishga tushgan skeletlar, staging va CI |
| 02.12 — Demo №1 | Har rol bilan kirish, rolga qarab menyu, bemor qo'shish/topish, xizmatlar, xodimlar |
| 09.12 | Taqvim, qabulga yozish, to'qnashuv xabari, bugungi navbat — klinikaga oraliq ko'rsatuv |
| 16.12 — Demo №2 | Shifokor tashrifni boshidan oxirigacha yuritadi: tish formulasi, xizmatlar, yakunlash, karta tarixi |
| 23.12 | Kassa, chek, hisobotlar, dashboard. **Feature freeze** — shundan keyin faqat xato tuzatiladi |
| 30.12 — Yakuniy | Pilot natijasi, topshirish |

## Kundalik qoidalar

- **Standup** (15 daqiqa): kecha nima qildim, bugun nima qilaman, nima to'sqinlik qilyapti.
- **2 soat qoidasi:** bir muammoda 2 soatdan ortiq qotib qolsangiz — guruhga yozing: nima qilmoqchi edingiz, nima qildingiz, qanday xato chiqdi (matni yoki skrinshoti bilan).
- **Haqiqiy bemor ma'lumoti** lokal va staging'da yo'q. Skrinshot va demolarda ham faqat soxta ma'lumot.
- **Parol va tokenlar** repoga, chatga, skrinshotga tushmaydi. `.env` — faqat o'z kompyuteringizda.
- **Repo ochiq:** kod, commit, issue, PR va skrinshotlarni hamma ko'radi. Sir yoki haqiqiy ma'lumot push qilinib qolsa — darhol Diyorbek va Ilyosga ayting: sirni almashtirish kerak, commit'ni o'chirish yetmaydi ([arxitektura.md, 10.1](../arxitektura.md#101-ochiq-public-repo-qoidalari)).
- **AI yordamchi** (ChatGPT, Claude va hokazo) ishlatsangiz, yozilgan kodni tushunib, o'zingiz javob bera oladigan holatda PR qiling. Review'da "nega bunday?" degan savolga javob bera olishingiz shart.
