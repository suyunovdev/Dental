# TZ: Jahongir — Frontend-1 (yetakchi)

| | |
| --- | --- |
| **Rol** | Frontend yetakchisi: skelet, kirish, layout, taqvim, tish formulasi, shifokor sahifalari, kassa |
| **Sahifalar** | `/login`, `/change-password`, layout va menyu, `/staff`, `/settings/chairs`, `/calendar`, `/doctor`, `/visits/:id`, `/cashier`; `features/tooth-chart/`; `api/client.ts` |
| **Review hamkori** | Nurmuhammad (siz uning PR'larini, u sizning PR'laringizni ko'radi) |
| **Albatta o'qing** | [arxitektura.md](../arxitektura.md) — 5, 7.1, 7.2, 7.3, 9-bo'limlar; [api.md](../api.md) — 1, 2, 3, 4.1–4.3, 4.6–4.8, 4.11 |

Siz frontendning qoidalarini o'rnatasiz: so'rov qanday yoziladi, xato qanday ko'rsatiladi, sahifa qanday qo'shiladi. Nurmuhammad sizning namunangizga qarab yozadi, shuning uchun T-09 dagi namunalar toza bo'lishi kerak.

## Tasklar

| ID | Task | Kerakli API / dizayn | Muddat |
| --- | --- | --- | --- |
| T-09 | Frontend skeleti | — | 23.11 |
| T-20 | Login va himoyalangan sahifalar | T-15 (kontrakt 26.11) | 29.11 |
| T-21 | Asosiy layout, rolga qarab menyu | T-11 wireframe | 01.12 |
| T-24 | Xodimlar sahifasi (+ ish jadvali va kreslolar 08.12 gacha) | T-17, T-30 | 02.12 / 08.12 |
| T-31 | Qabul taqvimi | T-28, T-30 (kontrakt 03.12), T-25 dizayn | 09.12 |
| T-41 | Tish formulasi UI | T-37 (kontrakt 10.12), T-34 dizayn | 15.12 |
| T-43 | Shifokor ish stoli va tashrif sahifasi | T-38 (kontrakt 10.12) | 16.12 |
| T-50 | Kassa: to'lov, chek | T-47 (kontrakt 17.12), T-34 dizayn | 22.12 |
| T-57 | Xatolarni tuzatish (frontend) | QA ro'yxati | 27.12 |

---

## T-09 · Frontend skeleti · 23.11

**Maqsad:** hamma frontendchi bir xil asosda, bir xil qoidalar bilan ishlasin.

1. Repo ildizida: `npm create vite@latest frontend -- --template react-ts`.
2. Paketlar: `antd @ant-design/icons react-router @tanstack/react-query axios dayjs`; dev: `@tanstack/react-query-devtools openapi-typescript vitest prettier`.
3. Papkalar — `arxitektura.md` 5-bo'lim.
4. `vite.config.ts`: `@` → `src` alias; `server.proxy: { '/api': 'http://localhost:3000' }`.
5. `lib/dayjs.ts`: `utc`, `timezone`, `customParseFormat`, `relativeTime` plaginlari; `uz-latn` lokali; `dayjs.tz.setDefault('Asia/Tashkent')`.
6. `app/providers.tsx`: `QueryClientProvider` (`staleTime: 30_000`, `retry: 1`), AntD `ConfigProvider` (`uz_UZ` lokali, `app/theme.ts` dan tema — Sanjarning tokenlari kelguncha vaqtinchalik), AntD `<App>` (xabarlar `App.useApp()` orqali).
7. `app/router.tsx`: `createBrowserRouter`; 5.1-jadvaldagi **hamma** yo'l lazy placeholder sahifa bilan ("Bemorlar — tez orada"); 404 sahifa; route `errorElement` — "Nimadir buzildi" + "Qayta yuklash".
8. `api/client.ts`: axios, `baseURL: import.meta.env.VITE_API_URL ?? '/api'`, `timeout: 15_000`. Interceptor'lar T-20 da. `getErrorMessage(error)` yordamchisi: backend `message`ini yoki "Server bilan bog'lanib bo'lmadi" matnini qaytaradi.
9. Namuna: `api/health.ts` + `useHealth()` hook (Swagger tipi bilan) va uni ishlatadigan placeholder.
10. Skriptlar: `dev`, `build`, `preview`, `lint`, `typecheck`, `test`, `format`, `gen:api` (`api.md` 5-bo'lim).
11. `.env.example`: `VITE_API_URL=/api`, `VITE_APP_ENV=local`.
12. `frontend/README.md`: sahifa qanday qo'shiladi, query/mutation hook qanday yoziladi, xato qanday ko'rsatiladi — qisqa namunalar bilan.

**Qabul mezoni**

- [ ] Loyiha lokalda ishga tushadi, bo'sh sahifalar ochiladi
- [ ] 5.1-jadvaldagi hamma yo'l ochiladi; noma'lum yo'l — 404
- [ ] `/api/health` so'rovi proksi orqali backendga yetadi
- [ ] `lint`, `typecheck`, `build` xatosiz
- [ ] `frontend/README.md` da namunalar bor

## T-20 · Login va himoyalangan sahifalar · 29.11 (kontrakt 26.11)

**Maqsad:** xavfsiz kirish; sahifa yangilansa ham sessiya saqlanadi. Qoidalar — `arxitektura.md` Q4 va 10-bo'lim.

1. **`/login`:** login, parol, "Kirish". Enter bilan yuboriladi, so'rov paytida tugma band. Xatolar backend `message`idan; `TOO_MANY_REQUESTS` uchun: "Juda ko'p urinish. Bir daqiqadan keyin qayta urinib ko'ring".
2. **`AuthProvider`:** holat `loading | authenticated | anonymous`. Ilova ochilganda `POST /auth/refresh` → muvaffaqiyatli bo'lsa `GET /auth/me`. Tekshiruv tugaguncha butun ekranda spinner (login sahifasi bir lahza ko'rinib ketmasin).
3. **Token faqat xotirada** (`client.ts` ichidagi o'zgaruvchi). `localStorage` va `sessionStorage`ga yozilmaydi.
4. **Interceptor'lar** — bir vaqtda kelgan bir nechta `401` uchun refresh faqat **bir marta**:

   ```ts
   // api/client.ts
   import axios, { type AxiosError } from 'axios';

   declare module 'axios' {
     interface InternalAxiosRequestConfig { _retry?: boolean }
   }

   export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL ?? '/api', timeout: 15_000 });

   let accessToken: string | null = null;
   let refreshing: Promise<void> | null = null;
   let onSessionExpired: () => void = () => {};
   const NO_RETRY = ['/auth/login', '/auth/refresh'];

   export function setAccessToken(token: string | null) { accessToken = token; }
   export function setOnSessionExpired(fn: () => void) { onSessionExpired = fn; } // AuthProvider chaqiradi

   api.interceptors.request.use((config) => {
     if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
     return config;
   });

   api.interceptors.response.use(undefined, async (error: AxiosError) => {
     const original = error.config;
     if (!original || error.response?.status !== 401 || original._retry || NO_RETRY.includes(original.url ?? '')) {
       throw error;
     }
     original._retry = true;
     refreshing ??= api
       .post<{ accessToken: string }>('/auth/refresh')
       .then((res) => setAccessToken(res.data.accessToken))
       .finally(() => { refreshing = null; });
     try {
       await refreshing;
     } catch {
       onSessionExpired(); // AuthProvider beradi: holatni tozalaydi va /login?next=... ga o'tkazadi
       throw error;
     }
     return api(original);
   });
   ```

5. **`RequireAuth`:** kirmagan → `/login?next=<joriy yo'l>`; `mustChangePassword` → `/change-password`.
6. **`/change-password`:** joriy parol, yangi parol, takrorlash. Qoidalar: ≥ 8 belgi, login bilan bir xil emas, ikkalasi mos.
7. **Chiqish:** `POST /auth/logout` → token tozalanadi → `queryClient.clear()` → `/login`. Keshni tozalash shart: aks holda keyingi xodim oldingisining ma'lumotini ko'rib qolishi mumkin.
8. Kirgandan keyin `next` ga o'tiladi, lekin faqat ichki yo'l bo'lsa (`/` bilan boshlanadi, `//` bilan emas). Aks holda rol bo'yicha bosh sahifa.

**Qabul mezoni**

- [ ] Kirmagan foydalanuvchi login sahifasiga qaytariladi
- [ ] Sahifa yangilansa (F5) sessiya saqlanadi
- [ ] Bir vaqtda 3 ta so'rov `401` olsa, refresh bir marta chaqiriladi (Network tab'da tekshiring)
- [ ] Chiqishdan keyin boshqa xodim kirsa, oldingi ma'lumot ko'rinmaydi
- [ ] Token brauzer xotirasida (`localStorage`, `sessionStorage`) yo'q

## T-21 · Asosiy layout, rolga qarab menyu · 01.12

**Maqsad:** har rol faqat o'z bo'limlarini ko'radi va ishlatadi.

1. **`app/menu.ts`** — yagona ro'yxat: `{ key, label, icon, path, roles }[]`. Menyu ham, yo'l himoyasi ham shundan olinadi (ikki joyda takrorlanmaydi).
2. **`MainLayout`:** chap menyu (logo, rolga qarab filtrlangan bandlar, yig'iladi; 1200 px dan tor ekranda o'zi yig'iladi), header (sahifa nomi, xodim ismi va rollari, "Chiqish"), kontent.
3. **`RequireRole`:** ruxsat yo'q yo'lga URL orqali kirilsa — 403 sahifa ("Bu bo'limga ruxsatingiz yo'q"). Bo'sh sahifa yoki cheksiz yo'naltirish bo'lmasin.
4. `/` — rol bo'yicha yo'naltirish (`arxitektura.md` 5.1 ostidagi tartib).
5. `VITE_APP_ENV=staging` bo'lsa, tepada sariq chiziq: "STAGING — soxta ma'lumot".
6. Brauzer vaqt zonasi `Asia/Tashkent` bo'lmasa — ogohlantirish: "Kompyuter vaqt zonasi Toshkent emas — qabul vaqtlari noto'g'ri ko'rinishi mumkin".
7. Ko'rinish — Sanjarning wireframe va UI kit'i bo'yicha.

**Qabul mezoni**

- [ ] Har rol faqat o'z bo'limlarini ko'radi
- [ ] Ruxsatsiz sahifaga URL orqali kirilsa — 403 sahifa
- [ ] Bir nechta roli bor xodim hamma rollarining bo'limlarini ko'radi
- [ ] Staging'da "STAGING" belgisi chiqadi

## T-24 · Xodimlar sahifasi · 02.12 (ish jadvali va kreslolar · 08.12)

**Maqsad:** admin xodim qo'shadi, rol beradi, shifokorga ish jadvali belgilaydi. API — `api.md` 4.2, 4.3.

**1-qism (02.12):**

1. `/staff` jadvali: FIO, login, rollar (teglar), telefon, holat (faol / bloklangan), amallar. Qidiruv, rol va holat filtri, server tomonda sahifalash.
2. Qo'shish va tahrirlash — Drawer: FIO, login (faqat yaratishda), telefon (`PhoneInput`), rollar (bir nechta tanlash, o'zbekcha nomlar), vaqtinchalik parol (faqat yaratishda, "Yaratish" tugmasi bilan). `DOCTOR` tanlansa: mutaxassislik, rang (AntD `ColorPicker`, Sanjarning shifokor palitrasi), ulush foizi (0–100).
3. Bloklash / blokdan chiqarish — tasdiqlash bilan. Parolni tiklash — yangi vaqtinchalik parol bir marta ko'rsatiladi ("Nusxa olish" tugmasi bilan).
4. Xatolar: `LAST_ADMIN`, `CONFLICT` (login band) — tushunarli xabar.

**2-qism (08.12, T-30 tayyor bo'lgach):**

5. Shifokor Drawer'ida "Ish jadvali" tabi: 7 qator (Dushanba … Yakshanba) — "Ishlaydi" switch + vaqt oralig'i (`TimePicker.RangePicker`, `HH:mm`, 5 daqiqa qadam) → `PUT /doctors/:id/schedule`.
6. `/settings/chairs`: kreslolar jadvali, qo'shish, nomini o'zgartirish, nofaol qilish.

**Qabul mezoni**

- [ ] Admin xodim qo'shadi va rol beradi
- [ ] Shifokorga rang, foiz va ish jadvali beriladi
- [ ] Kreslolar qo'shiladi va nofaol qilinadi
- [ ] Vaqtinchalik parol faqat bir marta ko'rsatiladi

## T-31 · Qabul taqvimi · 09.12 (kontrakt 03.12)

**Maqsad:** registrator butun kunni bir qarashda ko'radi: kim, qachon, qaysi shifokorda. Qoidalar — `arxitektura.md` Q8, 7.1.

1. **Birinchi PR (03.12):** `api/appointments.ts` — `useAppointments({ from, to, doctorId, chairId })`, `useMoveAppointment()`, `useChangeAppointmentStatus()`. Nurmuhammad shu faylga T-32 da `useCreateAppointment()` qo'shadi.
2. **Kutubxona:** `react-big-calendar` + `@types/react-big-calendar`; `dayjsLocalizer(dayjs)`; CSS fayllari; drag-and-drop uchun `withDragAndDrop` addon'i.
3. **Ko'rinishlar:**
   - **Kun** (standart): shifokorlar ustun-ustun (`resources`, `resourceIdAccessor`, `resourceTitleAccessor`), qaysi shifokorlar ko'rinishini filtr bilan tanlash;
   - **Hafta**: bitta shifokor tanlanganda. Tanlanmagan bo'lsa: "Haftalik ko'rinish uchun shifokorni tanlang".
4. **Sozlamalar:** `step={15}`, `timeslots={4}`, `min` 08:00, `max` 20:00, `culture="uz-latn"`, `messages` o'zbekcha (Bugun, Oldingi, Keyingi, Kun, Hafta, "Bu oraliqda qabul yo'q").
5. **Qabul ko'rinishi:** sarlavha — bemor FIO (telefon — tooltip'da), rang — shifokor rangi. Statusga qarab: `ARRIVED` — qalin chegara, `IN_PROGRESS` — to'q, `COMPLETED` — xira, `NO_SHOW` — kulrang; `CANCELLED` — yashirin, "Bekor qilinganlarni ko'rsatish" switch'i bilan chiqadi. Hammasi `lib/labels.ts` dan.
6. **Ish vaqtidan tashqari** kataklar xira: `slotPropGetter(date, resourceId)` + `GET /doctors/:id/schedule`.
7. **Amallar:**
   - bo'sh katakni belgilash → Nurmuhammadning `<AppointmentModal>` i shifokor va vaqt to'ldirilgan holda ochiladi;
   - qabulni bosish → Drawer: tafsilotlar, status tugmalari (Keldi, Kelmadi, Bekor — sabab bilan), "Bemor kartasi" havolasi;
   - sudrab ko'chirish va cho'zish → `PATCH` (optimistik). `409` yoki `422` kelsa — qabul joyiga qaytadi va `message.error(...)` sababni ko'rsatadi.
8. **Ma'lumot:** ko'rinib turgan oraliq bo'yicha so'rov (`onRangeChange`), `refetchInterval: 60_000`, yuklanish va xato holatlari.
9. **DOCTOR roli:** faqat o'z ustuni, faqat ko'rish (sudrash va belgilash o'chiq).
10. `events` va `resources` `useMemo` bilan — har render'da qayta yaratilmasin.

**Qabul mezoni**

- [ ] Taqvimda qabullar ko'rinadi va suriladi
- [ ] Kun ko'rinishida shifokorlar ustun-ustun, ish vaqtidan tashqari xira
- [ ] Band vaqtga surilgan qabul joyiga qaytadi va sabab ko'rsatiladi
- [ ] Shifokor faqat o'z qabullarini ko'radi va o'zgartira olmaydi
- [ ] 50 ta qabulli kunda sezilarli sekinlashish yo'q

## T-41 · Tish formulasi UI · 15.12 (kontrakt 10.12, dizayn 07.12)

**Maqsad:** shifokor tishni bosib, holatini va bajarilgan xizmatni belgilaydi. Qoidalar — `arxitektura.md` Q7, 7.5.

Komponent: `features/tooth-chart/ToothChart.tsx`, props: `{ patientId: number; visitId?: number; readOnly?: boolean }`. Tashrif sahifasida (T-43) va bemor kartasida (T-42, `readOnly`) ishlatiladi.

1. **Joylashuv (FDI)** — shifokorga qaraganda, bemorning o'ng tomoni chapda:

   ```
   Doimiy:  yuqori  18 17 16 15 14 13 12 11 | 21 22 23 24 25 26 27 28
            pastki  48 47 46 45 44 43 42 41 | 31 32 33 34 35 36 37 38
   Sut:     yuqori  55 54 53 52 51 | 61 62 63 64 65
            pastki  85 84 83 82 81 | 71 72 73 74 75
   ```

   "Doimiy / Sut tishlari" almashtirgichi. Standart: bemor 6 yoshdan kichik bo'lsa — sut, aks holda doimiy.
2. **Har tish** — tugma: raqam + holat kodi (C, Pl, P, Pt, R, K, I, 0) + rang (`lib/labels.ts`). `aria-label="16-tish: karies"`, klaviatura bilan tanlanadi, kamida 40 px (planshet uchun).
3. **Bosilganda** — Popover yoki Drawer:
   - hozirgi holat, kim va qachon belgilagan; oxirgi 5 ta yozuv (`.../history`);
   - `readOnly` bo'lmasa: holat tanlash + izoh → "Saqlash" (`POST /patients/:id/teeth`, `visitId` bilan); "Xizmat qo'shish" → xizmatni qidirib tanlash + soni → `POST /visits/:id/services` (`toothNumber` bilan).
4. Saqlangandan keyin `['teeth', patientId]` va `['visit', visitId]` kalitlari yangilanadi.
5. Pastda — hamma holatlar izohi (legend).
6. Vitest: tishlar ro'yxati to'g'ri (32 + 20, takrorsiz, FDI tartibida).

**Qabul mezoni**

- [ ] Tish bosilganda holat va xizmat belgilanadi
- [ ] Doimiy va sut tishlari to'g'ri FDI tartibida
- [ ] Holat faqat rang bilan emas, harf kodi bilan ham ko'rinadi
- [ ] `readOnly` rejimda faqat ko'rish va tarix
- [ ] Planshetda barmoq bilan bosish qulay

## T-43 · Shifokor ish stoli va tashrif sahifasi · 16.12 (kontrakt 10.12)

**Maqsad:** shifokor bemorni qabul qiladi va tashrifni o'zi yopadi. Qoidalar — `arxitektura.md` 7.2.

1. **`/doctor`** — bugungi o'z qabullari (vaqt bo'yicha):
   - `ARRIVED` tepada ajratilgan: "Kutmoqda — 12 daqiqa" (`arrivedAt` dan);
   - "Qabulni boshlash" → `POST /visits` → `/visits/:id`; `IN_PROGRESS` uchun — "Davom ettirish";
   - har 30 soniyada yangilanadi.
2. **`/visits/:id`:**
   - Tepada: bemor FIO, yoshi, telefoni, kartaga havola. `allergies` bo'lsa — **qizil ogohlantirish** (`Alert type="error"`).
   - Shikoyat, tashxis, izoh + "Saqlash" (`PATCH`). Saqlanmagan o'zgarish bilan sahifadan chiqilsa — ogohlantirish (`useBlocker`).
   - `ToothChart` (`visitId` bilan).
   - Bajarilgan xizmatlar jadvali: xizmat, tish, soni, narx, summa, olib tashlash; "Xizmat qo'shish" (tishsiz xizmatlar uchun); jami summa.
   - "Tashrifni yakunlash" → tasdiqlash oynasi (xizmatlar ro'yxati va jami). Tashxis bo'sh bo'lsa, tugma ishlamaydi va sababi yoziladi → `POST /visits/:id/complete`.
   - `COMPLETED` tashrif — faqat o'qiladi, "Kassaga yuborildi" belgisi bilan. ADMIN ham faqat ko'radi.

**Qabul mezoni**

- [ ] Shifokor tashrifni o'zi yopadi
- [ ] Allergiya bo'lsa, sahifa tepasida qizil ogohlantirish
- [ ] Saqlanmagan o'zgarish bilan chiqib ketishda ogohlantirish chiqadi
- [ ] Yakunlangan tashrif faqat o'qiladi

## T-50 · Kassa: to'lov va chek · 22.12 (kontrakt 17.12)

**Maqsad:** kassir to'lovni tez va xatosiz qabul qiladi, chek chiqaradi. Qoidalar — `arxitektura.md` 7.3.

1. **`/cashier`** — tablar:
   - "To'lanmaganlar": sana, bemor, shifokor, jami, to'langan, qarz; bemor yoki telefon bo'yicha qidiruv;
   - "Bugungi to'lovlar": ro'yxat va usullar bo'yicha jami (naqd, karta, o'tkazma, qaytarish, sof);
   - "Qarzdorlar": Nurmuhammadning `DebtorsTable` komponenti (T-51), tayyor bo'lgach ulanadi.
2. **To'lov oynasi:** tashrif xulosasi (xizmatlar, chegirma, jami, to'langan, qarz); summa (`MoneyInput`, standart — qarz, maksimum — qarz); usul (Naqd / Karta / O'tkazma); izoh.
   - Oyna ochilganda `crypto.randomUUID()` → `Idempotency-Key`. Qayta urinishda **xuddi shu kalit** yuboriladi.
   - So'rov paytida tugma band. Muvaffaqiyatdan keyin — "Chek chiqarish".
3. **Chegirma:** tashrifga hali to'lov bo'lmasa — "Chegirma" tugmasi → summa yoki foiz + sabab → `POST /visits/:id/discount`. Kassir uchun 10% chegarasi oynada yozib qo'yiladi.
4. **Chek:** `GET /payments/:id/receipt` → `Receipt80mm` komponenti. Yashirin iframe yoki `react-to-print` orqali chop etish. CSS: `@page { size: 80mm auto; margin: 0 }`, kontent kengligi ~72 mm, qora matn, 12 px. Pastida (T-01 aniqlaguncha): "Ichki kvitansiya — fiskal chek emas". To'lovlar ro'yxatidan qayta chop etish mumkin.
5. **Qaytarish** (faqat ADMIN'da tugma): summa ≤ qaytarilmagan qismi, sabab majburiy.
6. **`PatientBalance`** komponenti (bemor balansi). Uni Nurmuhammadning bemor kartasiga "Balans" tabi sifatida o'zingiz qo'shasiz.

**Qabul mezoni**

- [ ] Kassir to'lovni qabul qilib chek chiqaradi
- [ ] Tugmani ikki marta bosish ikkita to'lov yaratmaydi
- [ ] Qisman to'lovdan keyin qarz to'g'ri ko'rinadi
- [ ] Chek 80 mm printerda (yoki "PDF'ga saqlash"da) to'g'ri chiqadi
- [ ] Qaytarish tugmasi faqat ADMIN'da

## T-57 · Xatolarni tuzatish (frontend) · 27.12

1. QA ro'yxatidagi frontend xatolari: avval kritik, keyin yuqori.
2. Har tuzatish — alohida kichik PR (`fix/T-57-...`), skrinshot bilan.
3. 23.12 dan keyin yangi funksiya qo'shilmaydi (feature freeze).

**Qabul mezoni**

- [ ] Kritik va yuqori xatolar yopilgan
- [ ] Har tuzatishni QA qayta tekshirgan

---

## Yetakchi sifatida

- T-09 dagi namunalar (hook, forma, xato ko'rsatish) — frontend qoidasi. Nurmuhammadning PR'larini 24 soat ichida ko'rasiz.
- `components/` va `lib/` dagi umumiy kodni Nurmuhammad yozadi (T-13). Siz ularni ishlatasiz, o'xshashini qayta yozmaysiz.
- H4 eng og'ir haftangiz (T-41 + T-43). T-41 ni 10.12 da boshlang — dizayn 07.12 da tayyor bo'ladi.
