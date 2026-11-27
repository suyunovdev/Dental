# Test reja — H2 modullari (T-26)

> **Task:** T-26 · **Mas'ullar:** Diyorbek (QA/DevOps), Ilyos (PM)  
> **Maqsad:** Demo №1 (02.12.2026) dan oldin H2 modullari — kirish/rollar (Auth), bemorlar, xizmatlar (katalog) va xodimlar funksiyalarini tizimli tekshirish.

---

## 1. Test doirasi (Nima testlanadi)

1. **Auth va RBAC (`auth`)** — T-15, T-16, T-20:
   - Login, access token (15 daqiqa) va `rt` httpOnly cookie orqali refresh rotatsiyasi;
   - Logout va barcha sessiyalarni bekor qilish;
   - Parolni almashtirish (`mustChangePassword`), login rate limit (daqiqasiga 5 urinish);
   - 4 ta rol (`ADMIN`, `RECEPTIONIST`, `DOCTOR`, `CASHIER`) bo'yicha ruxsatlar va himoyalangan yo'llar.
2. **Xodimlar va shifokorlar (`users`)** — T-17, T-24:
   - Xodim qo'shish, tahrirlash, qidirish va filtrlash;
   - Bloklash / blokdan chiqarish (darhol sessiya yopilishi), parolni tiklash;
   - Oxirgi faol `ADMIN` himoyasi, `GET /api/doctors` (faol shifokorlar).
3. **Bemorlar (`patients`)** — T-18, T-22:
   - Bemor qo'shish, tahrirlash (`DOCTOR` faqat `allergies`), telefon normallashtirish (`+998XXXXXXXXX`);
   - Dublikat nazorati (bir xil telefon + F.I. = `409 PATIENT_DUPLICATE`, ona va bola = ruxsat);
   - Qidiruv (ism va telefon bo'yicha), arxivlash / arxivdan chiqarish.
4. **Xizmatlar va narxlar (`catalog`)** — T-19, T-23:
   - Xizmat toifalari va xizmatlar CRUD, faol/nofaol holatlar, filtrlash;
   - `ADMIN`dan boshqa rollarda tahrirlash taqiqlanganligi.

---

## 2. Test muhiti (Qayerda testlanadi)

- **Asosiy muhit:** Staging server (`https://staging.<domen>` / `http://<STAGING_HOST>`), `NODE_ENV=staging`, faqat soxta (`seed`) ma'lumotlar.
- **Staging tayyor bo'lguncha (lokal muhit):**
  - Backend REST API: `http://localhost:3000/api`
  - Swagger / OpenAPI: `http://localhost:3000/api/docs`
  - Frontend (T-09/H2 sahifalari tayyor bo'lgach): `http://localhost:5173`
  - Baza: `docker compose up -d db` (PostgreSQL 17, `npx prisma migrate deploy && npm run db:seed`)

---

## 3. Test akkauntlar

Seed (`backend/prisma/seed.ts`) orqali yaratiladigan soxta test foydalanuvchilar:

| Rol | `username` | Izoh |
| --- | --- | --- |
| `ADMIN` | `admin` | Barcha bo'limlar va xodimlar boshqaruvi (`SEED_ADMIN_USERNAME`) |
| `RECEPTIONIST` | `receptionist` | Bemorlar va qabul jarayonlari |
| `DOCTOR` | `dr_jasur`, `dr_nodira`, `dr_bobur` | Shifokor huquqlari (bemor `allergies` tahriri) |
| `CASHIER` | `cashier` | Kassa va to'lovlar (xodimlar va katalog tahririga ruxsatsiz) |

> **Xavfsizlik qoidasi:** Test akkauntlarning parollari repoga, test-keyslarga va GitHub issue'larga **yozilmaydi** (faqat `.env` / staging muhitida va jamoaga shaxsiy xabarda saqlanadi). Haqiqiy bemor ma'lumotlari ishlatilmaydi.

---

## 4. Jiddiylik darajalari

| Daraja | Ta'rif va misol | Qachon tuzatiladi |
| --- | --- | --- |
| **Kritik** | Ma'lumot yo'qolishi, pul/qarz xatosi, ruxsatsiz kirish (`CASHIER` xodimlarni ko'ra olishi), asosiy oqim to'xtashi | Darhol |
| **Yuqori** | Asosiy funksiya ishlamaydi, lekin aylanma yo'l mavjud; validatsiya yoki xato kodi noto'g'ri | Shu hafta (Demo №1 gacha) |
| **O'rta** | Foydalanuvchi uchun noqulaylik, kichik funksiya cheklovi | Vaqt bo'lsa |
| **Past** | Kosmetik nuqson, imlo xatosi, kichik UI siljishi | Oxirida |

---

## 5. Xatolar va hisobot tartibi

1. Topilgan har bir xato GitHub Issues'da `.github/ISSUE_TEMPLATE/bug.yml` shabloni bilan ochiladi (`bug` + jiddiylik + modul teglari bilan).
2. Issue matni va skrinshotlarda **haqiqiy bemor ma'lumoti, parol va token bo'lmasligi shart** (repo public).
3. Har kun oxirida Ilyos bilan 15 daqiqa xatolar saralanadi.
4. Natijalar task-trekerning **"Regress H2"** varag'ida qayd etiladi: keys ID, natija (`O'tdi` / `Yiqildi`), bog'langan issue havolasi.

---

## 6. "O'tdi" (Test yakunlash) sharti

- Barcha 4 modul (`auth`, `patients`, `catalog`, `users`) keyslari 01.12.2026 gacha kamida 1 marta to'liq o'tkazilgan;
- **Kritik** va **Yuqori** darajadagi ochiq xatolar qolmagan (`0` ta);
- Har modulda ijobiy, salbiy, chegaraviy va rollar matritsasi tekshirilgan;
- Natija "Regress H2" varag'ida hujjatlashtirilgan.

---

## 7. Keyslar ro'yxati

- [Auth va kirish keyslari](keyslar/auth.md)
- [Bemorlar keyslari](keyslar/patients.md)
- [Xizmatlar va narxlar (katalog) keyslari](keyslar/catalog.md)
- [Xodimlar keyslari](keyslar/users.md)
