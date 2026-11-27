# Test-keyslar: Xizmatlar va narxlar (`catalog`)

Manba: [docs/arxitektura.md](../../arxitektura.md) (6.2, 9-bo'limlar), [docs/api.md](../../api.md) (4.5-bo'lim), [docs/tz/diyorbek-qa-devops.md](../../tz/diyorbek-qa-devops.md) (T-26).

| ID | Sarlavha | Rol | Oldingi shart | Qadamlar | Kutilgan natija | Ustuvorlik |
| --- | --- | --- | --- | --- | --- | --- |
| `TC-CAT-001` | Xizmat toifalari va xizmatlarni ko'rish (barcha rollar) | `ADMIN`, `RECEPTIONIST`, `DOCTOR`, `CASHIER` | Seed toifa va xizmatlari mavjud | 1. Har bir rol bilan `GET /api/catalog/categories` va `GET /api/catalog/services` ni chaqirish | Barcha 4 rolda `200 OK` va faol toifa/xizmatlar ro'yxati qaytadi | Yuqori |
| `TC-CAT-002` | Yangi xizmat toifasi yaratish | `ADMIN` | `admin` sifatida kirgan | 1. `POST /api/catalog/categories` ga `{ "name": "Ortodontiya", "sortOrder": 5 }` yuborish | `201 Created`, yangi toifa yaratiladi va ro'yxatda chiqadi | Yuqori |
| `TC-CAT-003` | Yangi xizmat yaratish | `ADMIN` | `Ortodontiya` toifasi bor | 1. `POST /api/catalog/services` ga `{ "categoryId": <id>, "name": "Breket o'rnatish", "price": 4500000, "durationMin": 60, "code": "ORT-01" }` yuborish | `201 Created`, xizmat butun so'mda saqlanadi | Yuqori |
| `TC-CAT-004` | Xizmat narxini yangilash va nofaol qilish | `ADMIN` | Xizmat mavjud | 1. `PATCH /api/catalog/services/:id` orqali `price` ni o'zgartirish<br>2. `isActive: false` qilib, standart `GET /api/catalog/services` va `?includeInactive=true` ni chaqirish | Narx yangilanadi; nofaol xizmat standart ro'yxatda chiqmaydi, `includeInactive=true` da chiqadi (jismoniy o'chirilmaydi) | Yuqori |
| `TC-CAT-005` | Toifa va nom bo'yicha filtrlash | Hamma | Bir nechta toifa va xizmat bor | 1. `GET /api/catalog/services?categoryId=<id>`<br>2. `GET /api/catalog/services?search=karies` | Faqat tanlangan toifadagi va qidiruv so'ziga mos xizmatlar qaytadi | O'rta |
| `TC-CAT-006` | Bepul xizmat (`price = 0`) yaratish (chegaraviy) | `ADMIN` | Toifa mavjud | 1. `POST /api/catalog/services` ga `price: 0` bilan xizmat yuborish | `201 Created` (`price >= 0` qoidasiga ko'ra ruxsat etiladi) | O'rta |
| `TC-CAT-007` | Manfiy narx bilan xizmat yaratish | `ADMIN` | Toifa mavjud | 1. `POST /api/catalog/services` ga `price: -50000` yuborish | `400 VALIDATION_ERROR` (narx manfiy bo'lishi mumkin emas) | Yuqori |
| `TC-CAT-008` | Bir toifa ichida bir xil nomli xizmat yaratish | `ADMIN` | Toifada `Kariesni davolash` xizmati bor | 1. Xuddi shu `categoryId` va `name` bilan `POST /api/catalog/services` yuborish | `409 CONFLICT` | Yuqori |
| `TC-CAT-009` | Takroriy `code` bilan xizmat yaratish | `ADMIN` | `code: "TH-01"` band | 1. Boshqa nom va `code: "TH-01"` bilan `POST /api/catalog/services` yuborish | `409 CONFLICT` | O'rta |
| `TC-CAT-010` | Takroriy toifa nomi yaratish | `ADMIN` | `Terapiya` toifasi mavjud | 1. `POST /api/catalog/categories` ga `name: "Terapiya"` yuborish | `409 CONFLICT` | O'rta |
| `TC-CAT-011` | `ADMIN`dan boshqa rollar toifa/xizmat yaratishga urinishi | `RECEPTIONIST`, `DOCTOR`, `CASHIER` | Har rol bilan kirgan | 1. `POST /api/catalog/categories`, `POST /api/catalog/services` va `PATCH /api/catalog/services/1` ga urinish | Barcha holatlarda `403 FORBIDDEN` | Kritik |
| `TC-CAT-012` | Mavjud bo'lmagan toifaga xizmat qo'shish | `ADMIN` | `admin` sifatida kirgan | 1. `POST /api/catalog/services` ga `categoryId: 999999` yuborish | `404 NOT_FOUND` | O'rta |
