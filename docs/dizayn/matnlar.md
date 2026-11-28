# F-2 Interfeys matnlari va xabarlar lug'ati (T-11)

> **Holat:** v1.0 (27.11.2026) · **Muallif:** Sanjar (Dizayner)  
> **Qoida:** Barcha foydalanuvchi ko'radigan matnlar **o'zbekcha, faqat lotin yozuvida** (kirill harflari ishlatilmaydi). Atamalar hamma sahifada bir xil bo'lishi shart.

---

## 1. Yagona atamalar

| To'g'ri atama (ishlatiladi) | Ishlatilmaydi | Izoh |
| --- | --- | --- |
| **Qabul** | Yozuv, zayavka, bron | Taqvimdagi uchrashuv (`Appointment`) |
| **Tashrif** | Priyom, vizit, ko'rik | Shifokor ochadigan klinik yozuv (`Visit`) |
| **Bemor** | Patsiyent, mijoz, klient | Klinika mijozi (`Patient`) |
| **Xodim** | Sotrudnik, user | Tizim foydalanuvchisi (`User`) |
| **Kreslo** | Kabinet, stul | Stomatologiya kreslosi (`Chair`) |
| **Qarz** | Dolg, balans | To'lanmagan summa |
| **Chegirma** | Skidka | Tashrif summasidan ayirma |
| **Qaytarish** | Vozvrat | `REFUND` amali |
| **Tish formulasi** | Tish xaritasi, zubnaya | FDI 32/20 tish sxemasi |
| **so'm** | sum, UZS (jadval ichida) | Masalan: `350 000 so'm` |

---

## 2. Umumiy tugmalar va harakatlar

| Harakat | Tugma matni | Izoh |
| --- | --- | --- |
| Yaratish | `+ Yangi bemor`, `+ Qabulga yozish`, `+ Yangi xodim`, `+ Yangi xizmat` | Asosiy `primary` tugma |
| Saqlash | `Saqlash` | Modal va formalarda |
| Bekor qilish (modalni yopish) | `Yopish` yoki `Orqaga` | "Bekor qilish" faqat qabulni/rejani bekor qilishda ishlatiladi! |
| Qabulni bekor qilish | `Qabulni bekor qilish` | Sabab kiritish majburiy |
| Qayta urinish | `Qayta urinish` | Xato holatida (`ErrorState`) |
| Tozalash | `Filtrni tozalash` | Qidiruv natija bermaganda |
| Chop etish | `Chekni chop etish` | Kassada to'lovdan keyin |
| Eksport | `Excel yuklash` | Hisobotlar sahifasida |

---

## 3. Bo'sh holatlar (`EmptyState`)

| Sahifa / bo'lim | Sarlavha | Qisqa izoh | Tugma |
| --- | --- | --- | --- |
| Bemorlar (ro'yxat bo'sh) | `Hozircha bemorlar yo'q` | `Birinchi bemorni qo'shish uchun tugmani bosing` | `+ Yangi bemor` |
| Qidiruv natijasiz | `Hech narsa topilmadi` | `So'rov yoki filtrlarni o'zgartirib ko'ring` | `Filtrni tozalash` |
| Qabul taqvimi (kun bo'sh) | `Bu kunda qabullar yo'q` | `Taqvimdagi bo'sh vaqtni bosib bemorni yozishingiz mumkin` | `+ Qabulga yozish` |
| Bugungi navbat | `Bugun navbatda bemor yo'q` | `Yangi qabullar kelishi bilan shu yerda ko'rinadi` | `—` |
| Bemor tashriflari | `Tashriflar tarixi bo'sh` | `Shifokor qabulni boshlagandan keyin tashriflar shu yerda ko'rinadi` | `—` |
| Bemor fayllari | `Fayllar yuklanmagan` | `Rentgen surati yoki hujjatlarni yuklash mumkin (15 MB gacha)` | `+ Fayl yuklash` |
| Kassa (to'lanmaganlar) | `To'lanmagan tashriflar yo'q` | `Barcha yakunlangan tashriflar bo'yicha hisob-kitob qilingan` | `—` |
| Hisobotlar (grafik) | `Tanlangan davrda ma'lumot yo'q` | `Boshqa sana oralig'ini tanlab ko'ring` | `—` |

---

## 4. Xato holatlari va `ErrorCode` xabarlari

Backend'dan kelgan `code` (`api.md` 2-bo'lim) bo'yicha foydalanuvchiga ko'rsatiladigan matnlar:

| Holat / `code` | Ekrandagi matn | Keyingi harakat |
| --- | --- | --- |
| Internet yo'q / tarmoq xatosi | `Internet bilan aloqa uzildi. Ulanishni tekshirib qayta urining.` | `Qayta urinish` |
| `INTERNAL_ERROR` (500) | `Serverda kutilmagan xatolik yuz berdi. Birozdan keyin qayta urining.` | `Qayta urinish` |
| `403 FORBIDDEN` | `Sizda bu bo'limni ko'rish yoki bu amalni bajarish huquqi yo'q.` | `Bosh sahifaga` |
| `404 NOT_FOUND` | `So'ralgan ma'lumot topilmadi yoki o'chirilgan.` | `Orqaga` |
| `INVALID_CREDENTIALS` | `Login yoki parol noto'g'ri.` | `—` |
| `USER_BLOCKED` | `Hisobingiz bloklangan. Klinika rahbariga murojaat qiling.` | `—` |
| `TOO_MANY_REQUESTS` | `Juda ko'p urinish. 1 daqiqadan keyin qayta urining.` | `—` |
| `PATIENT_DUPLICATE` | `Shu ism va telefon raqami bilan bemor bazada allaqachon mavjud.` | Mavjud bemorni ochish |
| `APPOINTMENT_DOCTOR_CONFLICT` | `Shifokor bu vaqtda band. Boshqa vaqt tanlang.` | Vaqtni o'zgartirish |
| `APPOINTMENT_CHAIR_CONFLICT` | `Tanlangan kreslo bu vaqtda band.` | Kreslo/vaqtni o'zgartirish |
| `OUTSIDE_WORKING_HOURS` | `Tanlangan vaqt shifokorning ish jadvalidan tashqarida.` | Ish vaqtini ko'rish |
| `INVALID_STATUS_TRANSITION` | `Qabul holatini bu holatga o'tkazib bo'lmaydi.` | Sahifani yangilash |
| `DIAGNOSIS_REQUIRED` | `Tashrifni yakunlash uchun tashxisni kiriting.` | Tashxis maydoniga fokus |
| `PAYMENT_EXCEEDS_DEBT` | `To'lov summasi qolgan qarzdan katta bo'la olmaydi.` | Summani tuzatish |
| `DISCOUNT_NOT_ALLOWED` | `Chegirma berish mumkin emas (to'lov qilingan yoki limit oshgan).` | `—` |
| `LAST_ADMIN` | `Oxirgi faol administratorni bloklab yoki rolini olib bo'lmaydi.` | `—` |
| `FILE_TOO_LARGE` | `Fayl hajmi 15 MB dan oshmasligi kerak.` | Boshqa fayl tanlash |
| `FILE_TYPE_NOT_ALLOWED` | `Faqat JPEG, PNG, WEBP yoki PDF fayllarni yuklash mumkin.` | Boshqa fayl tanlash |

---

## 5. Muhim tasdiqlash va ogohlantirish matnlari

- **Allergiya ogohlantirishi (qizil `Alert`):** `Diqqat! Bemor allergiyasi / muhim kasalligi: <allergies matni>`
- **Bir telefon raqamida bir nechta bemor (`check-phone`):** `Bu telefon raqamida N ta bemor ro'yxatdan o'tgan (<ismlar>). Agar bu oila a'zosi bo'lsa, saqlashni davom ettirishingiz mumkin.`
- **Tashrifni yakunlash tasdig'i (`Modal`):** `Tashrif yakunlansinmi? Yakunlangandan keyin bajarilgan xizmatlar va narxlar o'zgarmaydi, summa kassaga qarz sifatida o'tadi.` → Tugmalar: `Yopish` / `Ha, yakunlash`
- **Qabulni bekor qilish (`Modal`):** `Qabulni bekor qilish sababini kiriting (majburiy):` → Tugmalar: `Yopish` / `Bekor qilish`
- **Ichki kvitansiya (80 mm chek pastida):** `Ichki kvitansiya — fiskal chek emas`
- **Vaqt zonasi ogohlantirishi:** `Kompyuter vaqt zonasi Toshkent (UTC+5) ga sozlanmagan. Taqvim va hisobot vaqtlari noto'g'ri ko'rinishi mumkin.`
