# TZ: Nurmuhammad — Frontend-2

| | |
| --- | --- |
| **Rol** | Frontend: umumiy komponentlar, bemorlar, xizmatlar, qabulga yozish, navbat, bemor kartasi, hisobotlar |
| **Sahifalar** | `components/`, `lib/`, `/dev/components`, `/patients`, `/patients/:id`, `/catalog`, `AppointmentModal`, `/queue`, `/dashboard`, `/reports` |
| **Review hamkori** | Jahongir (siz uning PR'larini, u sizning PR'laringizni ko'radi) |
| **Albatta o'qing** | [arxitektura.md](../arxitektura.md) — 5, 7.1, 7.6, 9-bo'limlar; [api.md](../api.md) — 1, 2, 3, 4.4–4.6, 4.9, 4.10, 4.12, 4.13; Jahongirning `frontend/README.md` (T-09) |

Siz yozadigan umumiy komponentlarni (`PhoneInput`, `MoneyText`, `PatientSelect` …) hamma sahifa ishlatadi. Ular bir marta, to'g'ri yozilsa, keyingi har sahifa tezroq va bir xil chiqadi.

## Tasklar

| ID | Task | Kerakli API / dizayn | Muddat |
| --- | --- | --- | --- |
| T-13 | Tema va umumiy komponentlar | T-09, T-12 (qoralama 24.11) | 25.11 |
| T-22 | Bemorlar ro'yxati va formasi | T-18 (kontrakt 26.11) | 02.12 |
| T-23 | Xizmatlar va narxlar sahifasi | T-19 (kontrakt 26.11) | 02.12 |
| T-32 | Qabulga yozish oynasi | T-28 (kontrakt 03.12), T-25 dizayn | 07.12 |
| T-33 | Bugungi navbat | T-28 | 09.12 |
| T-42 | Bemor kartasi | T-37–T-40 (kontrakt 10.12), T-25 dizayn | 16.12 |
| T-51 | Dashboard va hisobotlar | T-48, T-49 (kontrakt 17.12), T-44 dizayn | 23.12 |
| T-59 | Planshet moslashuvi, UI sayqal, "O'zgarishlar" tabi | T-53, T-58 | 27.12 |

---

## T-13 · Tema va umumiy komponentlar · 25.11

**Nega "Button, Input, Table" qayta yozilmaydi:** Ant Design'da ular tayyor va sinalgan. Ustidan o'z `Button`imizni yozish — vaqt yo'qotish va yangi xato manbai. Shuning uchun taskning ma'nosi: **(1)** AntD'ni Sanjarning UI kit'iga moslash (tema) va **(2)** loyihada ko'p joyda takrorlanadigan komponentlarni bir marta yozish.

1. **`app/theme.ts`** — Sanjarning tokenlari: `colorPrimary`, `colorSuccess`, `colorWarning`, `colorError`, `fontFamily`, `fontSize`, `borderRadius`, `controlHeight` + kerakli komponent tokenlari (Table sarlavhasi, Button). 24.11 da qoralama, 25.11 da yakuniy.
2. **`lib/format.ts`** (Vitest testlari bilan):
   - `formatMoney(350000)` → `"350 000 so'm"`;
   - `formatPhone('+998901234567')` → `"+998 90 123 45 67"`;
   - `normalizePhone()` — backend bilan bir xil qoida (`arxitektura.md` 7.6);
   - `formatDate`, `formatDateTime`, `formatTime` — Toshkent vaqti; `getAge(birthDate)`.
3. **`lib/labels.ts`** — o'zbekcha nomlar va ranglar: `AppointmentStatus`, `ToothStatus` (kod + rang), `PlanItemStatus`, `PaymentMethod`, `Role`, `FileKind`. Ranglar Sanjarning UI kit'idan.
4. **Komponentlar** (`components/`):
   - `PageHeader` — sarlavha, qisqa tavsif, o'ngda amallar;
   - `PhoneInput` — `+998` prefiksi, `90 123 45 67` maskasi, qiymati normallashtirilgan;
   - `MoneyText` va `MoneyInput` — faqat butun son, minglar bo'sh joy bilan, "so'm";
   - `DateText` — Toshkent vaqti;
   - `StatusTag` — `type` va `value` → `labels.ts` dan nom va rang;
   - `EmptyState`, `ErrorState` (xabar + "Qayta urinish");
   - `ConfirmButton` — tasdiqlash so'raydigan tugma;
   - `PatientSelect` — qidiruvli tanlash: 300 ms kechikish, `GET /patients?search=&pageSize=10`, variant ko'rinishi "Karimova Dilnoza · +998 90 123 45 67 · 1990", pastida "+ Yangi bemor" (`onCreateNew`). Hozircha soxta ma'lumot bilan, T-22 dan keyin API'ga ulanadi;
   - `useTableParams()` hook — sahifa raqami va qidiruvni URL'da saqlaydi (`useSearchParams`).
5. **`/dev/components`** vitrini (faqat `import.meta.env.DEV` da): har komponent hamma holatlari bilan — oddiy, xato, o'chirilgan, yuklanmoqda.

**Qabul mezoni**

- [ ] Komponentlar UI kit bo'yicha ishlaydi
- [ ] Vitrinada har komponent hamma holatlari bilan ko'rinadi
- [ ] `format.ts` testlari yashil
- [ ] AntD komponentlari qayta yozilmagan — faqat tema va loyiha komponentlari

## T-22 · Bemorlar ro'yxati va formasi · 02.12 (kontrakt 26.11)

**Maqsad:** registrator bemorni tez topadi va qo'shadi. API — `api.md` 4.4, qoidalar — `arxitektura.md` 7.6.

1. `api/patients.ts` — ro'yxat, bitta bemor, yaratish, tahrirlash, `check-phone`, arxivlash hook'lari.
2. **`/patients`:** qidiruv (300 ms kechikish, URL'da saqlanadi); jadval — №, FIO, telefon, yosh, amallar (Ochish, Tahrirlash); server sahifalash; qatorni bosish → karta.
3. **`PatientFormModal`** (yaratish va tahrirlash): familiya*, ism*, otasining ismi, tug'ilgan sana (kelajak sana tanlanmaydi), jinsi, telefon* (`PhoneInput`), qo'shimcha telefon, manzil, allergiya (izoh: "Allergiya va muhim kasalliklar"), izoh.
4. Telefon kiritilgach (`onBlur`) → `check-phone`. Shu raqamda bemor bo'lsa — sariq ogohlantirish: "Bu raqamda 2 ta bemor bor: Karimova Dilnoza, Karimov Sardor" (havolalar bilan). Bu xato emas, saqlashga to'sqinlik qilmaydi.
5. `409 PATIENT_DUPLICATE` → "Bu bemor allaqachon bor" + "Kartani ochish" havolasi.
6. ADMIN: arxivlash, arxivdan qaytarish, "Arxivdagilar" filtri.
7. DOCTOR tahrirlaganda faqat "Allergiya" maydoni faol.
8. 4 holat: yuklanmoqda; bo'sh ("Bemor topilmadi" + "Yangi bemor" tugmasi); xato; ma'lumot.

**Qabul mezoni**

- [ ] Bemor qo'shiladi, topiladi, tahrirlanadi
- [ ] Qidiruv va sahifa raqami URL'da — "Orqaga" tugmasi ro'yxatni buzmaydi
- [ ] Bir xil raqam haqida ogohlantirish chiqadi
- [ ] Majburiy maydonlar va xato xabarlari o'zbekcha

## T-23 · Xizmatlar va narxlar sahifasi · 02.12 (kontrakt 26.11)

**Maqsad:** preyskurantni ko'rish va admin tomonidan boshqarish. API — `api.md` 4.5.

1. **`/catalog`:** chapda toifalar, o'ngda xizmatlar jadvali — kod, nomi, narx (`MoneyText`), davomiylik, holat. Nom bo'yicha qidiruv.
2. **ADMIN:** toifa va xizmat qo'shish/tahrirlash (toifa, nom, kod, narx — `MoneyInput`, davomiylik — 5 daqiqa qadam, faol), nofaol qilish. Boshqa rollarda tahrir tugmalari umuman ko'rinmaydi.
3. Narx o'zgartirilganda formada izoh: "Yangi narx faqat bundan keyingi tashriflarga ta'sir qiladi".

**Qabul mezoni**

- [ ] Admin narxlarni o'zgartira oladi
- [ ] Boshqa rollar faqat ko'radi
- [ ] Narxlar "350 000 so'm" ko'rinishida

## T-32 · Qabulga yozish oynasi · 07.12 (kontrakt 03.12)

**Maqsad:** registrator bemorni 1 daqiqada qabulga yozadi. Qoidalar — `arxitektura.md` 7.1.

Komponent: `pages/appointments/AppointmentModal.tsx`, props: `{ open, onClose, initial?: { doctorId?, startAt?, endAt?, patientId? } }`. Taqvimdan (Jahongir), navbatdan va bemor kartasidan ochiladi.

1. `api/appointments.ts` ga (fayl Jahongirniki) `useCreateAppointment()` qo'shasiz.
2. **Bemor:** `PatientSelect` (ism yoki telefon). Topilmasa — "+ Yangi bemor" → oynaning o'zida qisqa forma (familiya, ism, telefon) → `POST /patients` → avtomatik tanlanadi. Qolgan ma'lumotlar keyin kartada to'ldiriladi.
3. **Qabul:** shifokor (rang nuqtasi bilan), kreslo (ixtiyoriy), sana, boshlanish vaqti (15 daqiqa qadam), davomiylik (15 / 30 / 45 / 60 / 90 yoki xizmat tanlansa — uning `durationMin`), izoh. Tugash vaqti yonida avtomatik: "10:00 – 10:30".
4. **Natija:** `201` → oyna yopiladi, taqvim va navbat yangilanadi, "Qabulga yozildi" xabari.
5. **Xatolar** — oyna yopilmaydi, kiritilgan ma'lumot yo'qolmaydi:
   - `409` → "Shifokor bu vaqtda band: 10:00–10:30", vaqt maydoni qizil;
   - `422 OUTSIDE_WORKING_HOURS` → "Shifokor bu kuni 09:00–18:00 ishlaydi".
6. **Klaviatura:** Tab bilan maydonlararo o'tish, Enter — yuborish. Oyna ochilganda fokus bemor qidiruvida.
7. **"Bemor hozir shu yerda"** belgisi (navbatsiz bemor uchun): vaqt — hozir (5 daqiqaga yaxlitlangan), yaratilgandan keyin darhol status `ARRIVED`.

**Qabul mezoni**

- [ ] Registrator 1 daqiqada bemorni yozadi — mavjud bemor uchun ≤ 60 soniya (QA vaqtni o'lchaydi)
- [ ] Yangi bemorni oynadan chiqmasdan qo'shsa bo'ladi
- [ ] Band vaqt yoki ish vaqtidan tashqarida aniq sabab ko'rsatiladi, ma'lumot yo'qolmaydi

## T-33 · Bugungi navbat · 09.12

**Maqsad:** registrator kim kelgani, kim kutayotgani va kim qabuldaligini bir qarashda ko'radi.

1. **`/queue`** — bugungi qabullar ustunlar bo'yicha: "Yozilgan" (`SCHEDULED`), "Kutmoqda" (`ARRIVED`, kelganiga necha daqiqa), "Qabulda" (`IN_PROGRESS`), "Yakunlangan" (`COMPLETED`), "Kelmadi / Bekor".
2. **Kartochka:** vaqt, bemor (FIO, telefon), shifokor (rangi bilan), kreslo, amallar.
3. **Bir bosishda:** "Keldi" (`SCHEDULED` yoki `NO_SHOW` → `ARRIVED`), "Kelmadi" (faqat vaqti o'tganlarda), "Bekor" (sabab so'raladi), "Qaytarish" (`ARRIVED` → `SCHEDULED`). Optimistik yangilash; xato bo'lsa joyiga qaytadi va sabab ko'rsatiladi.
4. Shifokor filtri, `refetchInterval: 30_000`, "+ Navbatsiz bemor" → `AppointmentModal`.
5. Vaqti o'tgan, lekin hali "Yozilgan" turganlar ajratib ko'rsatiladi (kechikmoqda).

**Qabul mezoni**

- [ ] Statuslar bir bosishda o'zgaradi
- [ ] Ekran 30 soniyada o'zi yangilanadi
- [ ] Kutish vaqti ko'rinadi, kechikayotganlar ajralib turadi

## T-42 · Bemor kartasi · 16.12 (kontrakt 10.12)

**Maqsad:** bemorning butun tarixi bitta sahifada. API — `api.md` 4.4, 4.6–4.10.

1. **Yuqori qism:** FIO, yoshi, telefon(lar), allergiya (qizil), Telegram ulanganmi, "Qabulga yozish" (RECEPTIONIST, ADMIN) → `AppointmentModal` (`patientId` bilan).
2. **Tablar** — rolga qarab:

   | Tab | Kim ko'radi | Mazmuni |
   | --- | --- | --- |
   | Umumiy | hamma | Ma'lumotlar, tahrirlash (rolga qarab) |
   | Qabullar | ADMIN, RECEPTIONIST, DOCTOR | `GET /patients/:id/appointments` |
   | Tish formulasi | ADMIN, DOCTOR | `<ToothChart readOnly />` (Jahongir, T-41) |
   | Tashriflar | ADMIN, DOCTOR | Ro'yxat; ochilganda tashxis, xizmatlar, shifokor |
   | Davolash rejasi | ADMIN, DOCTOR | Bosqichlar bo'yicha guruhlangan bandlar, bosqich jami va umumiy jami. DOCTOR — yaratish, tahrirlash, band holatini o'zgartirish |
   | Fayllar | ADMIN, DOCTOR | Yuklash va ko'rish |
   | Balans | ADMIN, CASHIER, RECEPTIONIST | Jahongirning `PatientBalance` komponenti (T-50 da qo'shadi) |
   | O'zgarishlar | ADMIN | Audit jurnali (T-59 da) |

   `403` kelsa (masalan, boshqa shifokorning bemori) — tab ichida "Bu ma'lumotni ko'rishga ruxsatingiz yo'q".
3. **Fayl yuklash:** AntD `Upload.Dragger`, `customRequest` orqali axios bilan (token qo'shilishi uchun), progress. `accept=".jpg,.jpeg,.png,.webp,.pdf"`; 15 MB dan kattasi yuborilmasdan rad etiladi. Turi (Rentgen / Rasm / Hujjat) va izoh.
4. **Faylni ko'rsatish:** `<img src="/api/files/1/content">` **ishlamaydi** — brauzer bunday so'rovga `Authorization` sarlavhasini qo'shmaydi. Shuning uchun `useAuthorizedBlobUrl(fileId)` hook: axios `responseType: 'blob'` → `URL.createObjectURL()` → komponent yopilganda `URL.revokeObjectURL()`. Rasmlar — miniatyuralar va AntD `Image.PreviewGroup`; PDF — blob URL yangi oynada.
5. Uzun ro'yxatlar — sahifalash yoki "Yana ko'rsatish".

**Qabul mezoni**

- [ ] Bemorning butun tarixi bitta sahifada
- [ ] Tablar rolga qarab ko'rinadi; ruxsatsiz holatda tushunarli xabar
- [ ] Rentgen yuklanadi va kattalashtirib ko'riladi, PDF ochiladi
- [ ] Reja bosqichlari va jami narx to'g'ri

## T-51 · Dashboard va hisobotlar · 23.12 (kontrakt 17.12, dizayn 14.12)

**Maqsad:** rahbar kunlik tushumni bir qarashda ko'radi. API — `api.md` 4.12.

1. **`/dashboard`** (ADMIN, `/reports/summary`): bugungi tushum (sof va usullar bo'yicha), yakunlangan tashriflar, qabullar holati, yangi bemorlar, umumiy qarz; oxirgi 30 kun tushumi grafigi (Recharts, usullar bo'yicha qatlamli ustunlar); bugungi qabullar shifokorlar bo'yicha. Sana tanlash (standart — bugun).
2. **`/reports`** — tablar:
   - "Kunlik tushum": sana oralig'i (tayyor variantlar: bu hafta, bu oy, o'tgan oy), jadval + grafik, "Jami" qatori, "Excel" tugmasi;
   - "Shifokorlar": davr; ustunlar — tashriflar, hisoblangan summa, ulush (hisoblangan), tushgan summa, ulush (tushgan). Har ustun nomida tushuntirish (tooltip); Excel;
   - "Qarzdorlar": `DebtorsTable` komponenti — qarz bo'yicha tartib, telefon (`tel:` havola), oxirgi tashrif, Excel. CASHIER faqat shu tabni ko'radi. Komponentni Jahongir kassada ham ishlatadi.
3. **Excel:** `api/client.ts` ga `downloadFile(url, params)` yordamchisi — `responseType: 'blob'`, fayl nomi `Content-Disposition` dan.
4. **Grafiklar:** o'qda qisqa ko'rinish ("1,2 mln"), tooltip'da to'liq summa; ranglar Sanjarning palitrasidan.

**Qabul mezoni**

- [ ] Rahbar kunlik tushumni bir qarashda ko'radi
- [ ] Ekrandagi raqamlar Excel'dagi bilan bir xil
- [ ] Ma'lumotsiz davr to'g'ri ko'rinadi (`EmptyState`)

## T-59 · Planshet moslashuvi va UI sayqal · 27.12

**Maqsad:** shifokor va registrator planshetda ham qulay ishlasin; UI review'dagi kamchiliklar yopilsin.

1. **Planshet:** 1024×768 va 768×1024. Ustuvor ekranlar: shifokor ish stoli, tashrif, tish formulasi, navbat, taqvim.
2. Bosiladigan elementlar ≥ 40 px; jadvallar gorizontal aylanadi (`scroll={{ x: 'max-content' }}`); menyu tor ekranda yig'iladi; modallar ekranga sig'adi.
3. Sanjarning T-53 ro'yxatidagi tuzatishlar.
4. **"O'zgarishlar" tabi** (bemor kartasi, ADMIN): `GET /audit-logs?entity=Patient&entityId=...` — kim, qachon, nima o'zgardi (oldin → keyin).
5. Chrome DevTools planshet rejimida, iloji bo'lsa haqiqiy planshetda sinang.

**Qabul mezoni**

- [ ] Asosiy ekranlar planshetda qulay ishlaydi
- [ ] T-53 ro'yxatidagi "albatta tuzatiladi" bandlari yopilgan
- [ ] "O'zgarishlar" tabi ishlaydi
