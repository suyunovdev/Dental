# F-2 Dizayn tokenlari va rang tizimi (T-12)

> **Holat:** v1.0 (25.11.2026) · **Muallif:** Sanjar (Dizayner)  
> **Maqsad:** Frontend (`frontend/src/app/theme.ts` va `frontend/src/lib/labels.ts`) hamda Figma (`01 Asoslar (tokenlar)`) uchun yagona dizayn tokenlari manbasi.  
> **Asos:** [arxitektura.md](../arxitektura.md), [sanjar-dizayner.md](../tz/sanjar-dizayner.md), PR #11 (`frontend/src/lib/labels.ts`).

---

## 1. Dizayn yo'nalishi

- **Kimga:** xususiy stomatologiya klinikasi registratorlari, shifokorlari, kassiri va rahbari.
- **Kayfiyat:** xotirjam, ishonchli, toza, aniq va tibbiy muhitga mos.
- **Asosiy tamoyillar:**
  - Standart Ant Design ko'ki (`#1677ff`) ishlatilmaydi — klinikaga xos **zumrad-ko'k (medical teal)** asosiy rang olinadi.
  - Ko'k-binafsha gradientlar, ortiqcha soyalar, haddan tashqari yumaloqlik va bezak uchun ikonkalar ishlatilmaydi.
  - Rang hech qachon yagona signal bo'lmaydi: status va tish holatlari yonida doim **o'zbekcha matn yoki harf kodi** bo'ladi.
  - Raqamlar (pul, sana, vaqt) jadvallarda ustun bo'ylab tekis turishi uchun **`tabular-nums`** qo'llanadi.
  - Kontrast: barcha matn va statuslar WCAG AA talabiga mos (**kamida 4.5:1**).

---

## 2. Ant Design 6 tema tokenlari (`theme.ts`)

Quyidagi tokenlar `ConfigProvider` ning `theme.token` obyektiga to'g'ridan-to'g'ri o'tkaziladi.

### 2.1 Asosiy va semantik ranglar

| AntD token nomi | Qiymat | Oq fonda kontrast | Izoh |
| --- | --- | --- | --- |
| `colorPrimary` | `#0F766E` | 5.47:1 | Asosiy brend rangi (zumrad-ko'k): asosiy tugmalar, faol menyu, fokus |
| `colorPrimaryHover` | `#115E59` | 7.58:1 | Tugma va havola hover holati (oq matn bilan WCAG AA) |
| `colorPrimaryActive` | `#134E4A` | 9.48:1 | Tugma bosilgan (active) holati |
| `colorPrimaryBg` | `#F0FDFA` | — | Tanlangan qator va faol elementning och foni |
| `colorSuccess` | `#15803D` | 5.02:1 | Muvaffaqiyat, yakunlangan qabul/to'lov |
| `colorSuccessBg` | `#F0FDF4` | — | Muvaffaqiyat bildirishnomasi foni |
| `colorWarning` | `#B45309` | 5.02:1 | Ogohlantirish, kutilayotgan holat |
| `colorWarningBg` | `#FFFBEB` | — | Ogohlantirish foni |
| `colorError` | `#DC2626` | 4.83:1 | Xato, o'chirish/bekor qilish, allergiya va qarz urg'usi |
| `colorErrorBg` | `#FEF2F2` | — | Xato va allergiya `Alert` foni |
| `colorInfo` | `#0369A1` | 5.93:1 | Ma'lumot beruvchi xabarlar |
| `colorInfoBg` | `#F0F9FF` | — | Ma'lumot bloki foni |

### 2.2 Neytral ranglar (matn, chegara, fon)

| AntD token nomi | Qiymat | Oq fonda kontrast | Izoh |
| --- | --- | --- | --- |
| `colorText` | `#111827` | 17.74:1 | Asosiy sarlavha va jadval matni |
| `colorTextSecondary` | `#4B5563` | 7.56:1 | Ikkinchi darajali matn, yorliqlar, jadval ustun sarlavhalari |
| `colorTextTertiary` | `#6B7280` | 4.83:1 | Yordamchi izoh, placeholder, vaqt belgisi |
| `colorTextDisabled` | `#9CA3AF` | — | O'chirilgan (disabled) matn |
| `colorBorder` | `#D1D5DB` | — | Input, Select, tugma chegaralari |
| `colorBorderSecondary` | `#E5E7EB` | — | Karta, jadval qatorlari va bo'luvchi chiziqlar (`Divider`) |
| `colorBgLayout` | `#F8FAFC` | — | Sahifa umumiy foni |
| `colorBgContainer` | `#FFFFFF` | — | Karta, jadval, forma, yon menyu foni |
| `colorBgElevated` | `#FFFFFF` | — | Modal, Drawer, Dropdown, Popover foni |
| `colorFillAlter` | `#F9FAFB` | — | Jadval sarlavhasi (`thead`) va zebra-qator foni |

### 2.3 Tipografiya, o'lcham va bo'shliqlar

Shrift o'zbek lotin harflarini (`o'`, `g'`, `ʻ`) aniq ko'rsatishi va jadvallarda raqamlarni tekis chiqarishi kerak.

| AntD token nomi | Qiymat | Izoh |
| --- | --- | --- |
| `fontFamily` | `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif` | Barcha ekranlarda yagona shrift |
| `fontSize` | `14` | Asosiy matn o'lchami (px). Jadval va zich formalar uchun optimal |
| `fontSizeSM` | `12` | Kichik yorliq, tag, yordamchi matn |
| `fontSizeLG` | `16` | Karta sarlavhasi, urg'uli qiymat |
| `fontSizeHeading1` | `30` | Asosiy KPI / sahifa katta raqami (masalan, bugungi tushum) |
| `fontSizeHeading2` | `24` | Sahifa sarlavhasi (`PageHeader`) |
| `fontSizeHeading3` | `20` | Bo'lim sarlavhasi |
| `fontSizeHeading4` | `16` | Karta va modal sarlavhasi |
| `borderRadius` | `6` | Tugma, Input, Select burchagi (ortiqcha yumaloqliksiz) |
| `borderRadiusSM` | `4` | Tag, Badge, kichik tugmalar |
| `borderRadiusLG` | `8` | Karta, Modal, jadval konteyneri |
| `controlHeight` | `32` | Desktop / noutbuk (`≥ 1025px`): registrator va kassir uchun zich interfeys |
| `controlHeightLG` | `40` | Planshet (`≤ 1024px`): kreslo yonidagi shifokor ekrani uchun kattaroq bosish maydoni |
| `controlHeightSM` | `24` | Jadval ichidagi ixcham tugmalar |
| `wireframe` | `false` | AntD 6 standart to'ldirilgan uslubi |

**Bo'shliq tizimi (4 / 8 px):** `4` (`XXS`) · `8` (`XS`) · `12` (`SM`) · `16` (`base`) · `20` (`MD`) · `24` (`LG`) · `32` (`XL`).

**Planshet moslashuvi (`≤ 1024px`):** `ConfigProvider` ichida `componentSize="large"` yoki breakpoint orqali `controlHeight: 40` ga o'tkaziladi; tish formulasida har bir tish tugmasi kamida `40 × 40 px` bo'ladi.

**`tabular-nums` qoidasi:** pul summalari (`MoneyText`), narxlar, qarz, chek va vaqt ko'rsatkichlarida CSS `font-variant-numeric: tabular-nums;` majburiy.

### 2.4 `frontend/src/app/theme.ts` uchun tayyor namuna

```ts
import type { ThemeConfig } from 'antd';

export const getClinicTheme = (isTablet = false): ThemeConfig => ({
  token: {
    colorPrimary: '#0F766E',
    colorPrimaryHover: '#115E59',
    colorPrimaryActive: '#134E4A',
    colorPrimaryBg: '#F0FDFA',
    colorSuccess: '#15803D',
    colorSuccessBg: '#F0FDF4',
    colorWarning: '#B45309',
    colorWarningBg: '#FFFBEB',
    colorError: '#DC2626',
    colorErrorBg: '#FEF2F2',
    colorInfo: '#0369A1',
    colorInfoBg: '#F0F9FF',

    colorText: '#111827',
    colorTextSecondary: '#4B5563',
    colorTextTertiary: '#6B7280',
    colorTextDisabled: '#9CA3AF',
    colorBorder: '#D1D5DB',
    colorBorderSecondary: '#E5E7EB',
    colorBgLayout: '#F8FAFC',
    colorBgContainer: '#FFFFFF',
    colorBgElevated: '#FFFFFF',
    colorFillAlter: '#F9FAFB',

    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    fontSize: 14,
    fontSizeSM: 12,
    fontSizeLG: 16,
    fontSizeHeading1: 30,
    fontSizeHeading2: 24,
    fontSizeHeading3: 20,
    fontSizeHeading4: 16,

    borderRadius: 6,
    borderRadiusSM: 4,
    borderRadiusLG: 8,
    controlHeight: isTablet ? 40 : 32,
    controlHeightLG: 40,
    controlHeightSM: 24,
  },
  components: {
    Layout: {
      siderBg: '#FFFFFF',
      headerBg: '#FFFFFF',
      bodyBg: '#F8FAFC',
    },
    Menu: {
      itemSelectedBg: '#F0FDFA',
      itemSelectedColor: '#0F766E',
    },
    Table: {
      headerBg: '#F9FAFB',
      headerColor: '#4B5563',
      borderColor: '#E5E7EB',
    },
  },
});
```

---

## 3. Ma'noli ranglar (`frontend/src/lib/labels.ts`)

Barcha kalitlar va o'zbekcha nomlar `arxitektura.md` (6.1-bo'lim) hamda PR #11 (`frontend/src/lib/labels.ts`) bilan moslashtirilgan. Har bir matn + fon juftligi WCAG AA (**≥ 4.5:1**) kontrastiga ega.

### 3.1 Qabul statuslari (`AppointmentStatus`, 6 ta)

| Kalit | O'zbekcha nom | Matn rangi | Fon rangi | Chegara rangi | Kontrast (`matn/fon`) | AntD `badgeStatus` |
| --- | --- | --- | --- | --- | --- | --- |
| `SCHEDULED` | Yozilgan | `#1D4ED8` | `#EFF6FF` | `#BFDBFE` | 6.16:1 | `processing` |
| `ARRIVED` | Keldi (kutmoqda) | `#B45309` | `#FFFBEB` | `#FDE68A` | 4.84:1 | `warning` |
| `IN_PROGRESS` | Qabulda | `#0F766E` | `#F0FDFA` | `#99F6E4` | 5.25:1 | `processing` |
| `COMPLETED` | Yakunlandi | `#15803D` | `#F0FDF4` | `#BBF7D0` | 4.79:1 | `success` |
| `CANCELLED` | Bekor qilindi | `#4B5563` | `#F3F4F6` | `#D1D5DB` | 6.87:1 | `default` |
| `NO_SHOW` | Kelmadi | `#B91C1C` | `#FEF2F2` | `#FECACA` | 5.91:1 | `error` |

### 3.2 Tish holatlari (`ToothStatus`, 9 ta)

| Kalit | Kod | O'zbekcha nom | Matn / aksent rangi | Fon rangi | Chegara rangi | Kontrast (`matn/fon`) |
| --- | --- | --- | --- | --- | --- | --- |
| `HEALTHY` | `—` | Sog'lom | `#374151` | `#F9FAFB` | `#D1D5DB` | 9.86:1 |
| `CARIES` | `C` | Karies | `#A16207` | `#FEFCE8` | `#FDE047` | 4.76:1 |
| `FILLED` | `Pl` | Plomba | `#1D4ED8` | `#EFF6FF` | `#93C5FD` | 6.16:1 |
| `PULPITIS` | `P` | Pulpit | `#C2410C` | `#FFF7ED` | `#FDBA74` | 4.88:1 |
| `PERIODONTITIS` | `Pt` | Periodontit | `#B91C1C` | `#FEF2F2` | `#FCA5A5` | 5.91:1 |
| `ROOT_ONLY` | `R` | Ildiz qolgan | `#6D28D9` | `#F5F3FF` | `#C4B5FD` | 6.48:1 |
| `CROWN` | `K` | Toj | `#0E7490` | `#ECFEFF` | `#67E8F9` | 5.15:1 |
| `IMPLANT` | `I` | Implant | `#3730A3` | `#EEF2FF` | `#A5B4FC` | 8.88:1 |
| `MISSING` | `0` | Yo'q | `#4B5563` | `#E5E7EB` | `#9CA3AF` | 6.10:1 |

> **Eslatma:** tish tugmasida `HEALTHY` bo'lsa faqat tish raqami (`11`–`85`) ko'rinadi; boshqa holatlarda esa tish raqami yonida harf kodi (`C`, `Pl`, `P`, `Pt`, `R`, `K`, `I`, `0`) chiqadi. `MISSING` (`0`) holatida tugma biroz xira va ustidan chiziqli (yoki bo'sh konturli) ko'rsatiladi.

### 3.3 To'lov usullari va turlari (`PaymentMethod`, `PaymentType`)

**To'lov usullari (`PaymentMethod`, grafiklar va kassada):**

| Kalit | O'zbekcha nom | Matn / grafik rangi | Fon rangi | Chegara rangi | Kontrast |
| --- | --- | --- | --- | --- | --- |
| `CASH` | Naqd | `#15803D` | `#F0FDF4` | `#BBF7D0` | 4.79:1 |
| `CARD` | Karta / Terminal | `#1D4ED8` | `#EFF6FF` | `#BFDBFE` | 6.16:1 |
| `TRANSFER` | O'tkazma (Click / Payme) | `#6D28D9` | `#F5F3FF` | `#DDD6FE` | 6.48:1 |

**To'lov turlari (`PaymentType`):**

| Kalit | O'zbekcha nom | Matn rangi | Fon rangi | Chegara rangi |
| --- | --- | --- | --- | --- |
| `PAYMENT` | To'lov | `#15803D` | `#F0FDF4` | `#BBF7D0` |
| `REFUND` | Qaytarish (Refund) | `#B91C1C` | `#FEF2F2` | `#FECACA` |

### 3.4 Davolash rejasi va tashrif holatlari (`PlanStatus`, `PlanItemStatus`, `VisitStatus`)

| Guruh | Kalit | O'zbekcha nom | Matn rangi | Fon rangi | Chegara rangi |
| --- | --- | --- | --- | --- | --- |
| `PlanStatus` | `ACTIVE` | Faol | `#0F766E` | `#F0FDFA` | `#99F6E4` |
| `PlanStatus` | `COMPLETED` | Yakunlangan | `#15803D` | `#F0FDF4` | `#BBF7D0` |
| `PlanStatus` | `CANCELLED` | Bekor qilingan | `#4B5563` | `#F3F4F6` | `#D1D5DB` |
| `PlanItemStatus` | `PLANNED` | Rejalashtirilgan | `#1D4ED8` | `#EFF6FF` | `#BFDBFE` |
| `PlanItemStatus` | `DONE` | Bajarildi | `#15803D` | `#F0FDF4` | `#BBF7D0` |
| `PlanItemStatus` | `CANCELLED` | Bekor qilindi | `#4B5563` | `#F3F4F6` | `#D1D5DB` |
| `VisitStatus` | `OPEN` | Ochiq | `#0369A1` | `#F0F9FF` | `#BAE6FD` |
| `VisitStatus` | `COMPLETED` | Yakunlangan | `#15803D` | `#F0FDF4` | `#BBF7D0` |

### 3.5 Maxsus ogohlantirishlar (Allergiya va Qarz)

- **Allergiya / muhim kasalliklar (`Alert type="error"`):** fon `#FEF2F2`, chegara `#FCA5A5`, matn `#B91C1C`, ikona `#DC2626`. Bemor kartasi va tashrif sahifasi sarlavhasida darhol ko'rinadi.
- **Qarz (`debt > 0`):** matn `#B91C1C` (yoki `#DC2626`), qalin (`font-weight: 600`), `tabular-nums`. Qarz `0` bo'lsa — `#15803D`.

---

## 4. Shifokorlar palitrasi (10 ta rang)

Xodim qo'shishda (`User.color`, `arxitektura.md` 6.2-bo'lim) tanlanadigan 10 ta bir-biridan yaqqol farqlanadigan rang.
Har bir rang **to'q aksent** (`User.color`) ko'rinishida **oq matn (`#FFFFFF`)** bilan WCAG AA (`≥ 4.5:1`) dan o'tadi. Taqvim kartochkasini och fonda chiqarish kerak bo'lsa, juftlangan **och fon (`cardBg`) + qora/to'q matn (`#111827`)** dan foydalaniladi (chap chegarada `4px solid <User.color>` bilan).

| # | Rang nomi | `User.color` (asosiy) | Oq matn (`#FFFFFF`) bilan kontrast | Qora matn (`#000000`) bilan kontrast | To'q fonda tavsiya etilgan matn | Och karta foni (`cardBg`) | Och fonda `#111827` kontrast |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Zumrad | `#0F766E` | **5.47:1** ✅ | 3.84:1 | Oq (`#FFFFFF`) | `#CCFBF1` | 15.74:1 ✅ |
| 2 | Ko'k | `#1D4ED8` | **6.70:1** ✅ | 3.13:1 | Oq (`#FFFFFF`) | `#DBEAFE` | 14.54:1 ✅ |
| 3 | Yashil | `#2F855A` | **4.54:1** ✅ | **4.62:1** ✅ | Oq yoki qora | `#DCFCE7` | 16.15:1 ✅ |
| 4 | Binafsha | `#6D28D9` | **7.10:1** ✅ | 2.96:1 | Oq (`#FFFFFF`) | `#EDE9FE` | 14.94:1 ✅ |
| 5 | Siyohrang | `#4338CA` | **7.90:1** ✅ | 2.66:1 | Oq (`#FFFFFF`) | `#E0E7FF` | 14.40:1 ✅ |
| 6 | Okean | `#0E7490` | **5.36:1** ✅ | 3.92:1 | Oq (`#FFFFFF`) | `#CFFAFE` | 15.85:1 ✅ |
| 7 | Qirmizi | `#BE123C` | **6.29:1** ✅ | 3.34:1 | Oq (`#FFFFFF`) | `#FFE4E6` | 14.78:1 ✅ |
| 8 | Oltin-jigarrang | `#B45309` | **5.02:1** ✅ | 4.18:1 | Oq (`#FFFFFF`) | `#FEF3C7` | 15.93:1 ✅ |
| 9 | Olxo'ri | `#A21CAF` | **6.32:1** ✅ | 3.32:1 | Oq (`#FFFFFF`) | `#FAE8FF` | 15.25:1 ✅ |
| 10 | To'q shifer | `#334155` | **10.35:1** ✅ | 2.03:1 | Oq (`#FFFFFF`) | `#E2E8F0` | 14.39:1 ✅ |

> **Izoh:** Taqvim kartochkasida qabul **statusi** (chegara/ikonka/tag) va **shifokor** rangi chalkashmasligi uchun: taqvim ustuni sarlavhasi va kartochkaning chap chizig'i (`4px`) shifokor rangida, status esa kartochka ichidagi kichik belgi (`StatusTag` yoki ikonka) orqali beriladi.

---

## 5. Figma'ga ko'chirish va PR tekshiruvi

- Figma'da `01 Asoslar (tokenlar)` sahifasida yuqoridagi **Color Styles** (`Brand`, `Semantic`, `Neutral`, `AppointmentStatus`, `ToothStatus`, `Doctors`) va **Text Styles** (`Inter` 12 / 14 / 16 / 20 / 24 / 30) yaratiladi.
- Figma fayli **Anyone with the link → can view** ruxsati bilan ulashiladi va havola PR tavsifiga yoziladi.
- **Tayyor sharti:** Nurmuhammad shu faylga qarab `frontend/src/app/theme.ts` va `frontend/src/lib/labels.ts` ranglarini hech bir qo'shimcha savolsiz yangilay oladi.
