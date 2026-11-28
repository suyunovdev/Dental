# F-2 Asosiy foydalanuvchi oqimlari (T-11)

> **Holat:** v1.0 (27.11.2026) · **Muallif:** Sanjar (Dizayner)  
> **Asos:** [arxitektura.md](../arxitektura.md) (7 va 8-bo'limlar), [sanjar-dizayner.md](../tz/sanjar-dizayner.md) (T-11).

Ushbu hujjat klinikadagi 5 ta asosiy kundalik jarayonni ekranlar kesimida ko'rsatadi.

---

## 1. Registrator: qo'ng'iroqdan qabulga yozishgacha

```mermaid
flowchart TD
    A["Qo'ng'iroq keldi"] --> B["/calendar: bo'sh vaqt katagini bosish"]
    B --> C["Qabulga yozish modali ochiladi (shifokor va vaqt to'ldirilgan)"]
    C --> D{"Bemor bazada bormi?"}
    D -->|"Ha"| E["Ism yoki telefon bo'yicha qidirish"]
    D -->|"Yo'q"| F["Shu oynada 'Yangi bemor' formasi"]
    F --> G["Telefon kiritilganda check-phone tekshiruvi"]
    G --> H{"Shu raqamda bemor bormi?"}
    H -->|"Ha, boshqa oila a'zosi"| I["Ogohlantirish: bu raqamda N ta bemor bor"]
    H -->|"Yo'q"| J["Bemor saqlanadi"]
    I --> J
    E --> K["Kreslo va davomiylikni tanlash (10-240 daq)"]
    J --> K
    K --> L["POST /api/appointments"]
    L --> M{"Natija"}
    M -->|"201 OK"| N["Modal yopiladi, taqvimda yangi qabul ko'rinadi"]
    M -->|"422 OUTSIDE_WORKING_HOURS"| O["Xabar: shifokor bu vaqtda ishlamaydi"]
    M -->|"409 CONFLICT"| P["Xabar: shifokor yoki kreslo band (vaqti bilan)"]
    O --> K
    P --> K
```

---

## 2. Registrator: bemor keldi va navbat

```mermaid
flowchart TD
    A["Bemor klinikaga keldi"] --> B["/queue: Bugungi navbat sahifasi"]
    B --> C["Qabulni topish (ism/telefon yoki shifokor filtri)"]
    C --> D{"Oldindan yozilganmi?"}
    D -->|"Ha (SCHEDULED / NO_SHOW)"| E["'Keldi' tugmasini bosish"]
    D -->|"Yo'q (navbatsiz)"| F["'Tez qabulga yozish' -> bugungi vaqt"]
    E --> G["Status: ARRIVED, arrivedAt yoziladi"]
    F --> G
    G --> H["Kutish vaqti taymeri ko'rinadi (masalan, 12 daq)"]
    H --> I["Shifokor qabulni boshlaganda status -> IN_PROGRESS"]
    I --> J["Navbat sahifasi 30-60 soniyada avtomatik yangilanadi"]
```

---

## 3. Shifokor: tashrifni boshlash, tish formulasi va yakunlash

```mermaid
flowchart TD
    A["/doctor: Shifokor ish stoli"] --> B["'Kutmoqda' (ARRIVED) bemorni ko'rish"]
    B --> C["'Qabulni boshlash' -> POST /api/visits"]
    C --> D["/visits/:id (OPEN) ochiladi"]
    D --> E["Sarlavhada allergiya ogohlantirishini tekshirish"]
    E --> F["Shikoyat va tashxis yozish"]
    F --> G{"Tish holati o'zgardimi?"}
    G -->|"Ha"| H["FDI tish formulasida tishni bosish -> holat tanlash (C, Pl, P...)"]
    G -->|"Yo'q"| I["Bajarilgan xizmatlarni qo'shish"]
    H --> I
    I --> J["Jami summa avtomatik hisoblanadi"]
    J --> K["'Tashrifni yakunlash' tugmasi"]
    K --> L{"Tashxis kiritilganmi?"}
    L -->|"Yo'q"| M["Xato: yakunlash uchun tashxis majburiy"]
    L -->|"Ha"| N["Tasdiqlash modali -> narxlar muzlaydi, status COMPLETED"]
    N --> O["Tashrif kassaga qarz sifatida tushadi"]
```

---

## 4. Kassir: to'lov qabul qilish va 80 mm chek

```mermaid
flowchart TD
    A["/cashier: Kassa sahifasi"] --> B["To'lanmagan tashriflar jadvalidan bemorni tanlash"]
    B --> C{"Chegirma kerakmi?"}
    C -->|"Ha (hali to'lov bo'lmagan)"| D["Chegirma modali (Kassir <= 10%, sabab majburiy)"]
    C -->|"Yo'q"| E["'To'lov qabul qilish' modali"]
    D --> E
    E --> F["Summa (to'liq yoki qisman) va usul (Naqd / Karta / O'tkazma)"]
    F --> G["Idempotency-Key bilan POST /api/payments"]
    G --> H{"Natija"}
    H -->|"422 PAYMENT_EXCEEDS_DEBT"| I["Xato: summa qarzdan katta bo'la olmaydi"]
    H -->|"201 OK"| J["Qarz kamayadi (yoki 0), 'Chekni chop etish' tugmasi chiqadi"]
    J --> K["80 mm ichki kvitansiya (fiskal chek emas) chop etiladi"]
```

---

## 5. Rahbar (ADMIN): kunlik nazorat va hisobotlar

```mermaid
flowchart TD
    A["/dashboard: Rahbar bosh sahifasi"] --> B["Bugungi tushum (naqd/karta/o'tkazma), qarz, tashriflar, qabullar"]
    B --> C["30 kunlik tushum grafigi va shifokorlar bo'yicha bugungi holat"]
    C --> D{"Batafsil tahlil kerakmi?"}
    D -->|"Kunlik tushum"| E["/reports -> Tab 1: davr tanlash -> jadval + grafik"]
    D -->|"Shifokorlar ulushi"| F["/reports -> Tab 2: hisoblangan va tushgan ulushlar"]
    D -->|"Qarzdorlar"| G["/reports -> Tab 3: qarzi kattalar ro'yxati"]
    E --> H["'Excel yuklash' tugmasi (format=xlsx)"]
    F --> H
    G --> H
```
