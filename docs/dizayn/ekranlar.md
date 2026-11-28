# F-2 Ekranlar spetsifikatsiyasi va wireframe tuzilmasi (T-11)

> **Holat:** v1.0 (27.11.2026) · **Muallif:** Sanjar (Dizayner)  
> **Asos:** [arxitektura.md](../arxitektura.md) (5.1, 7, 9-bo'limlar), [api.md](../api.md) (3-bo'lim), [tokenlar.md](tokenlar.md).  
> **Qoida:** Barcha ekranlar **Ant Design 6** komponentlari bilan quriladi. Har bir ekranda 4 ta majburiy holat mavjud: **Yuklanmoqda (`Skeleton`)**, **Bo'sh (`EmptyState`)**, **Xato (`ErrorState`)**, **Ma'lumot**.

---

## 1-qism. H2 (Demo №1 · 02.12) ekranlari — birinchi navbat

### 1. Kirish va parolni almashtirish (`/login`, `/change-password` · T-20)

- **Kim ko'radi:** `/login` — tizimga kirmagan hamma; `/change-password` — tizimga kirgan hamma (`mustChangePassword = true` bo'lsa majburiy yo'naltiriladi).
- **AntD tuzilmasi:** `AuthLayout` (markazda `Card`, maksimal kenglik `400 px`, `colorBgLayout: #F8FAFC`).
- **Maydonlar (`/login`):**
  - Sarlavha: klinika nomi va "Tizimga kirish"
  - `username` (`Input`, kichik harflar) — Login
  - `password` (`Input.Password`) — Parol
  - `Button type="primary" block` — "Kirish"
- **Maydonlar (`/change-password`):**
  - Ogohlantirish (`Alert type="info"`): agar `mustChangePassword = true` bo'lsa, "Xavfsizlik uchun birinchi kirishda parolni almashtiring"
  - `currentPassword`, `newPassword` (kamida 8 belgi, login bilan bir xil emas), `confirmPassword`
  - `Button type="primary"` — "Parolni saqlash"
- **4 holat:**
  - *Yuklanmoqda:* tugmada `loading` spinner
  - *Bo'sh:* forma bo'sh holatda, fokus `username` maydonida
  - *Xato:* `INVALID_CREDENTIALS` → "Login yoki parol noto'g'ri"; `USER_BLOCKED` → "Hisobingiz bloklangan, rahbarga murojaat qiling"; `TOO_MANY_REQUESTS` → "Juda ko'p urinish, 1 daqiqadan keyin urinib ko'ring"
  - *Ma'lumot:* kirish muvaffaqiyatli → rolga qarab yo'naltirish (`ADMIN → /dashboard`, `DOCTOR → /doctor`, `RECEPTIONIST → /calendar`, `CASHIER → /cashier`)

---

### 2. Asosiy layout va 4 rol uchun menyu (`MainLayout`, `/`, `403`, `404` · T-21)

- **Kim ko'radi:** tizimga kirgan barcha xodimlar (`arxitektura.md` 5.1 va 9-bo'lim bo'yicha).
- **AntD tuzilmasi:** `Layout` + chapda yig'iladigan `Sider` (`240 px`, `#FFFFFF`) + tepada `Header` (`56 px`, `#FFFFFF`) + `Content` (`#F8FAFC`, ichki bo'shliq `24 px`).
- **Header tarkibi:**
  - Chapda: mobil/planshetda menyu ochish tugmasi (`MenuOutlined`), staging'da sariq `"STAGING"` `Tag` (`VITE_APP_ENV === 'staging'`)
  - O'ngda: foydalanuvchi F.I.Sh. (`Me.fullName`) va roli (`Tag`), `Dropdown` menyu: "Parolni almashtirish" (`/change-password`) va "Chiqish" (`POST /api/auth/logout`)
- **4 rol bo'yicha yon menyu (`app/menu.ts`):**

| Menyu bandi | Yo'l | ADMIN | RECEPTIONIST | DOCTOR | CASHIER |
| --- | --- | :---: | :---: | :---: | :---: |
| Bosh sahifa | `/dashboard` | ✅ | — | — | — |
| Qabul taqvimi | `/calendar` | ✅ | ✅ | ✅ | — |
| Bugungi navbat | `/queue` | ✅ | ✅ | — | — |
| Shifokor ish stoli | `/doctor` | — | — | ✅ | — |
| Bemorlar | `/patients` | ✅ | ✅ | ✅ | ✅ |
| Kassa | `/cashier` | ✅ | — | — | ✅ |
| Hisobotlar | `/reports` | ✅ | — | — | ✅ *(qarzdorlar)* |
| Xizmatlar va narxlar | `/catalog` | ✅ | ✅ | ✅ | ✅ |
| Xodimlar | `/staff` | ✅ | — | — | — |
| Kreslolar | `/settings/chairs` | ✅ | — | — | — |

- **4 holat:**
  - *Yuklanmoqda:* `/auth/me` tekshirilayotganda markazda `Spin`
  - *Bo'sh:* tegishli emas (har doim menyu bor)
  - *Xato:* `403` sahifa ("Bu bo'limga ruxsatingiz yo'q" + "Bosh sahifaga" tugmasi), `404` sahifa ("Sahifa topilmadi" + "Bosh sahifaga"), vaqt zonasi Toshkent emas bo'lsa tepada ogohlantiruvchi `Alert`
  - *Ma'lumot:* faol menyu bandi `#F0FDFA` fonda `#0F766E` matn bilan ajralib turadi

---

### 3. Bemorlar ro'yxati va qo'shish/tahrirlash formasi (`/patients` · T-22)

- **Kim ko'radi:** hamma kirgan xodimlar ko'radi; qo'shish/tahrirlash — `ADMIN`, `RECEPTIONIST` (`DOCTOR` faqat `allergies` ni tahrirlaydi); arxivlash — faqat `ADMIN`.
- **AntD tuzilmasi:** `PageHeader` ("Bemorlar" + o'ngda `Button type="primary"` "+ Yangi bemor") + filtr paneli (`Input.Search` placeholder: "Ism, familiya yoki telefon...", `ADMIN` uchun `Switch`: "Arxivlanganlarni ko'rsatish") + `Table` (`Paginated<Patient>`, sahifada 20 ta).
- **Jadval ustunlari (`Patient`):**
  1. F.I.Sh. (`fullName`) — bosilganda `/patients/:id` ga o'tadi; agar `allergies` bo'lsa yonida qizil `Tooltip`/ikonka
  2. Telefon (`phone`, `+998 90 123 45 67` ko'rinishida, `tabular-nums`)
  3. Tug'ilgan sana (`birthDate` yoki `—`)
  4. Allergiya / eslatma (qisqa `Tag` yoki `—`)
  5. Amallar: "Ko'rish", "Tahrirlash" (`ADMIN`, `RECEPTIONIST`), "Arxivlash" (`ADMIN`)
- **Qo'shish / tahrirlash (`Modal` yoki `Drawer`, eni `560 px`):**
  - Majburiy maydonlar: `lastName` (Familiya), `firstName` (Ism), `phone` (`PhoneInput`, `+998`)
  - Telefon kiritilganda (`onBlur`): `GET /api/patients/check-phone` chaqiriladi; agar raqam bazada bo'lsa, sariq `Alert` chiqadi: *"Bu raqamda N ta bemor bor: ... (oila a'zosi bo'lsa davom etishingiz mumkin)"*
  - Ixtiyoriy maydonlar: `middleName`, `birthDate` (`DatePicker`), `gender` (`Radio.Group`: Erkak / Ayol), `phone2`, `address`, `allergies` (qizil urg'u bilan), `note`
- **4 holat:**
  - *Yuklanmoqda:* jadval ustida `Skeleton` qatorlar
  - *Bo'sh:* "Hozircha bemorlar yo'q" (`+ Yangi bemor` tugmasi bilan); qidiruvda topilmasa "Qidiruv bo'yicha bemor topilmadi" + "Filtrni tozalash"
  - *Xato:* `ErrorState` + "Qayta urinish"; dublikat (`409 PATIENT_DUPLICATE`) → formaning tepasida qizil `Alert`: "Shu ism va telefon bilan bemor allaqachon mavjud"
  - *Ma'lumot:* jadval + pastda `Pagination`

---

### 4. Xizmatlar va narxlar (`/catalog` · T-23)

- **Kim ko'radi:** hamma ko'radi; toifa va xizmat qo'shish/tahrirlash/nofaol qilish — faqat `ADMIN`.
- **AntD tuzilmasi:** 2 ustunli ko'rinish (chapda `260 px` toifalar ro'yxati `List` + "+ Toifa", o'ngda tanlangan toifadagi xizmatlar `Table`) + tepada qidiruv (`Input.Search`) va `Switch`: "Nofaollarni ko'rsatish" (`ADMIN` uchun).
- **Jadval ustunlari (`ServiceItem`):**
  1. Kod (`code` yoki `—`)
  2. Xizmat nomi (`name`)
  3. Narxi (`price` so'm, `tabular-nums`, o'ngga tekislangan)
  4. Taxminiy vaqt (`durationMin` daq)
  5. Holat (`isActive`: "Faol" / "Nofaol" `Tag`)
  6. Amallar (`ADMIN`): "Tahrirlash", "Nofaol qilish" / "Faollashtirish"
- **Modal (xizmat qo'shish/tahrirlash):** `categoryId` (`Select`), `name`, `price` (`MoneyInput`, ≥ 0), `durationMin` (`InputNumber`, 10–240), `code`
- **4 holat:**
  - *Yuklanmoqda:* chap ro'yxat va o'ng jadval uchun `Skeleton`
  - *Bo'sh:* "Bu toifada xizmatlar yo'q" (`ADMIN` uchun "+ Xizmat qo'shish")
  - *Xato:* `ErrorState` + "Qayta urinish"; takroriy nom (`409 CONFLICT`) → maydon ostida xato matni
  - *Ma'lumot:* toifalar `sortOrder` bo'yicha, xizmatlar narxi bilan tekis ustunda

---

### 5. Xodimlar va kreslolar (`/staff`, `/settings/chairs` · T-24)

- **Kim ko'radi:** faqat `ADMIN`.
- **AntD tuzilmasi (`/staff`):** `PageHeader` ("Xodimlar" + "+ Yangi xodim") + filtr (`Input.Search`, `Select`: Rol, `Select`: Holat) + `Table` (`Paginated<User>`).
- **Jadval ustunlari (`User`):**
  1. F.I.Sh. (`fullName`) + shifokor bo'lsa yonida uning `color` rangli doirachasi
  2. Login (`username`)
  3. Telefon (`phone`)
  4. Rollar (`roles` — har rol uchun `Tag`)
  5. Mutaxassislik / Ulush (`specialty`, `sharePercent%` — faqat `DOCTOR` uchun)
  6. Holat (`isActive`: "Faol" / "Bloklangan")
  7. Amallar: "Tahrirlash", "Ish jadvali" (shifokor uchun `Drawer` — 7 kun, `DoctorSchedule`), "Parolni tiklash" (`Modal`), "Bloklash / Faollashtirish" (`Popconfirm`; oxirgi faol `ADMIN` da o'chiq — `LAST_ADMIN`)
- **Xodim qo'shish/tahrirlash modali:** `fullName`, `username` (faqat yaratishda), `password` (faqat yaratishda, min 8 belgi), `roles` (ko'p tanlovli `Checkbox.Group`), `phone`. Agar `DOCTOR` tanlansa qo'shimcha blok ochiladi: `specialty`, `color` (10 ta shifokor palitrasidan tanlash), `sharePercent` (0–100%).
- **Kreslolar (`/settings/chairs`):** oddiy `Table` (`Chair`: nomi, holati) + "+ Yangi kreslo" modali + "Nofaol qilish".
- **4 holat:**
  - *Yuklanmoqda:* `Skeleton`
  - *Bo'sh:* "Xodimlar topilmadi" / "Kreslolar qo'shilmagan"
  - *Xato:* `422 LAST_ADMIN` → "Oxirgi faol administratorni bloklab bo'lmaydi"; `ErrorState` + "Qayta urinish"
  - *Ma'lumot:* jadval + ish jadvali `Drawer` (Dushanba–Yakshanba, kalit `Switch` + boshlanish/tugash `TimePicker`)

---

## 2-qism. H3–H5 ekranlari (28.11 gacha yakunlanadigan qism)

### 6. Qabul taqvimi (`/calendar` · T-31)

- **Kim ko'radi:** `ADMIN`, `RECEPTIONIST` (hamma shifokorlar), `DOCTOR` (faqat o'z qabullari).
- **Kutubxona cheklovi:** `react-big-calendar` ustunlari va vaqt to'ri kutubxonaniki; **shifokor rangi (`User.color`)** kartochkaning chap `4px` chegarasida va och `cardBg` fonda, status esa kartochka ichidagi qisqa `Tag`/ikonka orqali beriladi.
- **Tepada boshqaruv paneli:** sana almashtirgich (`< Bugun >`), ko'rinish (`Kun` — shifokorlar ustunlarda / `Hafta` — bitta shifokor), filtrlar (shifokor, kreslo, status) va "+ Qabulga yozish".
- **Qabul tafsiloti (`Drawer`, `420 px`):** bemor (`PatientShort`), shifokor, kreslo, vaqt, izoh, status o'tkazish tugmalari ("Keldi", "Ko'chirish", "Bekor qilish" — sabab modali bilan, "Kelmadi").
- **4 holat:** yuklanmoqda (`Spin`/`Skeleton` taqvim ustida), bo'sh ("Bu kunda qabullar yo'q" + bo'sh katakni bosib yozish), xato (`ErrorState`), ma'lumot (ish vaqtidan tashqari kataklar kulrang `#F3F4F6`).

### 7. Qabulga yozish modali (T-32)

- **Maydonlar:** `patientId` (qidiruvli `PatientSelect` + yonida "+ Yangi bemor" tez yaratish), `doctorId` (`Select`), `chairId` (`Select`, ixtiyoriy), sana (`DatePicker`), boshlanish vaqti va davomiylik (`10–240` daq, 5 ga karrali), `note`.
- **Maxsus xato holatlari:** `409 APPOINTMENT_DOCTOR_CONFLICT` / `APPOINTMENT_CHAIR_CONFLICT` → modal ichida qizil `Alert` ("Shifokor/kreslo bu vaqtda band: 10:00–10:30"), `422 OUTSIDE_WORKING_HOURS` → "Tanlangan vaqt shifokorning ish jadvalidan tashqarida".

### 8. Bugungi navbat (`/queue` · T-33)

- **Kim ko'radi:** `ADMIN`, `RECEPTIONIST`.
- **Tuzilma:** 3 ta ustun yoki filtrli jadval: **Kutilmoqda (`SCHEDULED`)** · **Keldi, kutmoqda (`ARRIVED`, kutish daqiqasi bilan)** · **Qabulda (`IN_PROGRESS`)**. Har 30–60 soniyada avtomatik yangilanadi.
- **4 holat:** yuklanmoqda, bo'sh ("Bugun navbatda bemor yo'q"), xato, ma'lumot.

### 9. Bemor kartasi (`/patients/:id` · T-42)

- **Kim ko'radi:** `ADMIN`, `RECEPTIONIST`, `DOCTOR`, `CASHIER` (tablar rolga qarab ko'rinadi).
- **Yuqori sarlavha (`Card`):** F.I.Sh., telefon, yosh, qarz (`PatientBalance.debt`, qizil yoki yashil `tabular-nums`), agar `allergies` bo'lsa — **doim ko'rinadigan qizil `Alert`**!
- **Tablar (rolga qarab):**
  1. *Umumiy ma'lumot* (hamma)
  2. *Tish formulasi* (`ADMIN`, `DOCTOR` — faqat ko'rish rejimi + tish tarixi)
  3. *Tashriflar tarixi* (`ADMIN`, `DOCTOR`)
  4. *Davolash rejasi* (`ADMIN`, `DOCTOR` — bosqichlar, bandlar, jami narx)
  5. *Fayllar / Rentgen* (`ADMIN`, `DOCTOR` — rasm/PDF oldindan ko'rish, yuklash `≤ 15 MB`)
  6. *Qabullar* (`ADMIN`, `RECEPTIONIST`, `DOCTOR`)
  7. *To'lovlar va balans* (`ADMIN`, `RECEPTIONIST`, `CASHIER`)
- **4 holat:** har tab ichida alohida `Skeleton`, `EmptyState`, `ErrorState`, ma'lumot.

### 10. Shifokor ish stoli (`/doctor`) va Tashrif sahifasi (`/visits/:id` · T-41, T-43)

- **`/doctor`:** faqat `DOCTOR`. Tepada "Keldi (kutmoqda)" (`ARRIVED`) kartochkalari ajratilgan + bugungi qabullar ro'yxati + "Qabulni boshlash" tugmasi.
- **`/visits/:id`:** bemor sarlavhasi (qizil allergiya ogohlantirishi bilan), **FDI tish formulasi** (doimiy 11–48 / sut 51–85 almashtirgichi, 9 holat rang + kod bilan, planshetda tish tugmasi `≥ 40 px`), shikoyat/tashxis/izoh formasi, bajarilgan xizmatlar jadvali (xizmat + tish raqami + miqdor + narx), o'ngda jami summa va **"Tashrifni yakunlash"** tugmasi (tashxis majburiy).

### 11. Kassa (`/cashier` · T-50)

- **Kim ko'radi:** `CASHIER`, `ADMIN`.
- **Tuzilma:** 2 tab — **"To'lanmagan tashriflar"** (`UnpaidVisit`: bemor, shifokor, tashrif sanasi, jami, to'langan, qarz, "To'lov" / "Chegirma" tugmalari) va **"To'lovlar tarixi"** (`Payment` + tepada `totals`: naqd, karta, o'tkazma, qaytarish, sof tushum).
- **Modallar:**
  - *To'lov:* summa (`≤ qarz`), usul (`Naqd` / `Karta / Terminal` / `O'tkazma`), izoh; `Idempotency-Key` bilan yuboriladi.
  - *Chegirma:* faqat to'lov qilinmagan tashrifga (Kassir `≤ 10%`, Admin cheksiz), sabab majburiy.
  - *Qaytarish (`REFUND`):* faqat `ADMIN`, sabab majburiy.
  - *Chek (80 mm):* `Receipt` asosida qora-oq (~`72 mm` kontent), pastda *"Ichki kvitansiya — fiskal chek emas"* yozuvi.

### 12. Dashboard (`/dashboard`) va Hisobotlar (`/reports` · T-51)

- **`/dashboard` (`ADMIN`):** "bir xil 4 ta kartochka" qolipisiz — **Bugungi sof tushum** eng katta va birinchi karta (`fontSizeHeading1: 30`, naqd/karta/o'tkazma bo'linmasi bilan), uning yonida ixcham kartalar (tashriflar soni, yangi bemorlar, jami qarz), pastda **30 kunlik tushum grafigi** (`Recharts`) va **Bugungi qabullar holati + shifokorlar kesimi**.
- **`/reports`:** 3 tab — **Kunlik tushum** (`ADMIN`), **Shifokorlar bo'yicha** (`ADMIN` — hisoblangan va to'langan ulushlar), **Qarzdorlar** (`ADMIN`, `CASHIER`). Har birida davr tanlash (`RangePicker`), jadval + grafik va **"Excel yuklash"** tugmasi.
