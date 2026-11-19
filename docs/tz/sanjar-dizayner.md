# TZ: Sanjar — Dizayner

| | |
| --- | --- |
| **Rol** | Wireframe, UI kit, barcha ekranlar dizayni, UI tekshiruvi, demo materiallari |
| **Ishlaydigan joy** | Figma (bitta umumiy fayl), GitHub issue'lar (`ui-review`) |
| **Kim bilan ko'p ishlaysiz** | Jahongir va Nurmuhammad (dizayn qilinishi mumkinmi), Ilyos (talablar va klinika) |
| **Albatta o'qing** | [arxitektura.md](../arxitektura.md) — 5.1 (sahifalar), 7 (biznes qoidalar), 9 (rollar); [api.md](../api.md) — 3 (`Receipt` tipi) |

Frontend **Ant Design 6** ustida quriladi. Demak, siz chizgan hamma narsa AntD komponentlari va tema tokenlari bilan qilinadigan bo'lishi kerak. Ular ichida esa ko'rinish bizniki bo'lsin: standart AntD ko'ki va "har qanday SaaS'ga o'xshash" ko'rinish emas, klinikaga xos, xotirjam va ishonchli dizayn.

**Foydalanuvchilarni tasavvur qiling:**

| Kim | Qayerda, qanday ishlaydi | Dizayndan nima kutadi |
| --- | --- | --- |
| Registrator | Qabulxona kompyuteri, telefon qulog'ida | Tezlik, klaviatura, zich ma'lumot, bir qarashda bo'sh vaqt |
| Shifokor | Kreslo yonidagi planshet yoki kompyuter | Katta tugmalar, kam matn, bemorga e'tibor, allergiya darhol ko'rinadi |
| Kassir | Kassa kompyuteri, chek printeri | Raqamlar aniq va tekis, xato qilib bo'lmaydigan to'lov oynasi |
| Rahbar | Noutbuk yoki telefon | Bugungi holat bir qarashda |

## Tasklar

| ID | Task | Muddat | Kim kutadi |
| --- | --- | --- | --- |
| T-11 | Asosiy ekranlar wireframe'i | 23.11 | Jahongir, Nurmuhammad, Ilyos |
| T-12 | UI kit (tokenlar va komponentlar) | qoralama 24.11, yakuniy 25.11 | Nurmuhammad (T-13) |
| T-25 | Bemor kartasi va qabul taqvimi (yakuniy) | 30.11 | Jahongir (T-31), Nurmuhammad (T-22, T-32, T-42) |
| T-34 | Tish formulasi, davolash rejasi, to'lov ekranlari | 07.12 | Jahongir (T-41, T-43, T-50), Nurmuhammad (T-42) |
| T-44 | Dashboard, hisobotlar, bo'sh va xato holatlari | 14.12 | Nurmuhammad (T-51) |
| T-53 | Dizayn tekshiruvi (UI review) | 21.12 | Jahongir (T-57), Nurmuhammad (T-59) |
| T-64 | Demo taqdimot va ekran rasmlari | 29.12 | Ilyos (T-65) |

**Figma fayli tuzilmasi:** `00 Muqova` · `01 Asoslar (tokenlar)` · `02 Komponentlar` · `03 Oqimlar` · `04 Wireframe` · `05 Ekranlar` (modul bo'yicha) · `06 Prototip` · `07 Holatlar katalogi`.

---

## T-11 · Asosiy ekranlar wireframe'i · 23.11

1. **Chizishdan oldin:** `arxitektura.md` 5.1 (sahifalar), 7 (qoidalar), 9 (rollar)ni o'qing; Ilyosning 21.11 dagi klinika intervyusi yozuvini oling. Imkon bo'lsa, klinikaga borib qabulxona ishini 30 daqiqa kuzating.
2. **Oqimlar** (`03 Oqimlar`):
   1. registrator: qo'ng'iroq → bemorni topish yoki qo'shish → qabulga yozish;
   2. bemor keldi → navbat;
   3. shifokor: qabulni boshlash → tish formulasi → xizmatlar → yakunlash;
   4. kassir: to'lanmagan tashrif → to'lov → chek;
   5. rahbar: bugungi holat.
3. **Wireframe'lar** (kulrang, past aniqlikda), 8–10 ekran:
   1. Kirish
   2. Asosiy layout — 4 rol uchun menyu
   3. Qabul taqvimi — kun ko'rinishi, shifokorlar ustunlarda
   4. Qabulga yozish oynasi
   5. Bugungi navbat
   6. Bemorlar ro'yxati + forma
   7. Bemor kartasi (tablar)
   8. Shifokor ish stoli + tashrif sahifasi (tish formulasi joyi bilan)
   9. Kassa + to'lov oynasi + chek
   10. Dashboard
4. Ant Design'ning rasmiy Figma kit'idan (Figma Community) foydalaning — chizilgan har narsa AntD bilan quriladigan bo'lsin.
5. Qabulga yozish oqimi uchun bosiladigan prototip (tavsiya etiladi).
6. 23.11 da 30 daqiqalik ko'rib chiqish: Jahongir (qilsa bo'ladimi?) va Ilyos (talablarga mosmi?).

**Qabul mezoni**

- [ ] Figma'da 8–10 ta asosiy ekran chizmasi
- [ ] 5 ta asosiy oqim chizilgan
- [ ] Jahongir va Ilyos ko'rib chiqqan, izohlar tuzatilgan

## T-12 · UI kit · qoralama 24.11, yakuniy 25.11

1. **Dizayn yo'nalishi** (1 sahifa, `01 Asoslar`): mahsulot kimga, qanday kayfiyat (xotirjam, ishonchli, toza, aniq), nima **emas** (ko'k-binafsha gradient, ortiqcha soya va yumaloqlik, bezak uchun ikonka, bir xil statistika kartalari). Klinikaning logotipi va brend rangi bo'lsa — Ilyos T-01 da so'raydi, asos qilib olinadi.
2. **Tokenlar** — AntD temasiga to'g'ridan-to'g'ri o'tadiganlari:
   - **Ranglar:** asosiy rang (AntD standart `#1677ff` emas — klinikaga xos), success, warning, error, info, neytral kulranglar (matn, chegara, fon);
   - **Shrift:** o'zbek lotin harflarini (o', g', ʻ, ') to'g'ri ko'rsatadigan va raqamlari bir xil kenglikdagi (tabular figures — summalar ustunda tekis turishi uchun) shrift. Shkala: 12 / 14 / 16 / 20 / 24 / 30; asosiy matn 14 yoki 15 px;
   - **Bo'shliq:** 4/8 px tizimi; `borderRadius`; `controlHeight` — oddiy ekranlarda 32, planshet ekranlarida 40.
3. **Ma'noli ranglar** (Nurmuhammad `lib/labels.ts` ga ko'chiradi): qabul statuslari (6 ta), tish holatlari (9 ta — rang + harf kodi: C, Pl, P, Pt, R, K, I, 0), to'lov usullari, reja bandi holatlari. Rang yonida doim matn yoki kod — rangni farqlay olmaydigan odam ham tushunsin.
4. **Shifokorlar palitrasi:** 10 ta bir-biridan aniq farq qiladigan rang. Har birida matn kontrasti tekshirilgan (taqvimda qabul kartochkasining foni bo'ladi).
5. **Komponentlar** (AntD kit + tokenlar): tugmalar (asosiy, ikkinchi darajali, xavfli), forma maydonlari (oddiy, xato, o'chirilgan), jadval (zich va oddiy), teglar, modal, drawer, ogohlantirish (allergiya uchun qizil `Alert`), bo'sh va xato holati, tish tugmasi.
6. **Kontrast:** oddiy matn uchun kamida 4.5:1 (WCAG AA). Figma plaginida tekshiring.
7. **Topshirish:** tokenlar jadvali (nom → qiymat) — Nurmuhammad `theme.ts` ga ko'chiradi. 24.11 da qoralama, 25.11 da yakuniy.

**Qabul mezoni**

- [ ] Figma'da komponentlar kutubxonasi tayyor
- [ ] Tokenlar jadvali 24.11 da Nurmuhammadga berilgan
- [ ] Status va tish holatlari rang + matn yoki kod bilan
- [ ] Kontrast tekshirilgan

## T-25 · Bemor kartasi va qabul taqvimi (yakuniy) · 30.11

1. **Yuqori aniqlikdagi ekranlar:** taqvim (kun — shifokorlar ustunlarda; hafta — bitta shifokor), qabul kartochkasi (har statusda), qabul tafsiloti (drawer), qabulga yozish oynasi, bemor kartasi (hamma tablar), bemor formasi.
2. **Har ekranda holatlar:** yuklanmoqda (skeleton), bo'sh, xato, ruxsat yo'q (403), "shifokor band" xabari (409), uzun ism (40+ belgi), bir vaqtda ko'p qabul, bekor qilingan va kelmagan qabullar, ish vaqtidan tashqari kataklar, o'tgan vaqt.
3. **O'lchamlar:** 1440 (desktop), 1280 (noutbuk), 1024 (planshet).
4. **Taqvim cheklovi:** taqvim `react-big-calendar` kutubxonasida quriladi. Kataklar to'ri va ustunlar tuzilishi kutubxonaniki — rang, shrift, kartochka ichini o'zgartirsa bo'ladi, umumiy tuzilishni emas. 27.11 da Jahongir bilan tekshiring.
5. **Topshirish:** Figma Dev Mode, qatlamlar nomlangan, ikonkalar AntD Icons'dan (o'zingiz chizgan ikonka — SVG eksport bilan).

**Qabul mezoni**

- [ ] Ekranlar barcha holatlari bilan tayyor
- [ ] Jahongir taqvim dizayni kutubxona bilan qilinishini tasdiqlagan
- [ ] Nurmuhammad karta va formaga kerakli hamma narsani Figma'dan topa oladi

## T-34 · Tish formulasi, davolash rejasi, to'lov ekranlari · 07.12

1. **Tish formulasi:** FDI joylashuvi (jadval — [Jahongir TZ'i, T-41](jahongir-frontend-1.md#t-41--tish-formulasi-ui--1512-kontrakt-1012-dizayn-0712)), doimiy va sut tishlari almashtirgichi, 9 holat (rang + kod), tanlangan tish, tish oynasi (holat, tarix, xizmat qo'shish), izohlar (legend), faqat ko'rish rejimi. Planshetda har tish ≥ 40 px.
2. **Tashrif sahifasi:** bemor sarlavhasi (allergiya ogohlantirishi), shikoyat va tashxis, tish formulasi, xizmatlar jadvali, "Yakunlash" tasdiqlash oynasi, yakunlangan holat.
3. **Shifokor ish stoli:** bugungi qabullar, "Kutmoqda" ajratilgan.
4. **Davolash rejasi:** bosqichlar, bandlar (xizmat, tish, narx, holat), bosqich jami va umumiy jami.
5. **Kassa:** to'lanmaganlar jadvali, to'lov oynasi (summa, usul), chegirma oynasi, qaytarish oynasi, muvaffaqiyat holati.
6. **Chek (80 mm):** faqat qora, ~72 mm kenglik, mazmuni — `api.md` dagi `Receipt` tipi. Pastida: "Ichki kvitansiya — fiskal chek emas".
7. 07.12 da Jahongir bilan 30 daqiqalik topshirish uchrashuvi.

**Qabul mezoni**

- [ ] Ekranlar frontendga topshirilgan (uchrashuv o'tgan)
- [ ] Tish formulasi doimiy va sut tishlari bilan, hamma holatlarda
- [ ] Chek 80 mm shablonida

## T-44 · Dashboard, hisobotlar, bo'sh va xato holatlari · 14.12

1. **Dashboard:** bugungi tushum, tashriflar, qabullar holati, yangi bemorlar, qarz; 30 kunlik grafik; shifokorlar bo'yicha bugungi qabullar. "Bir xil to'rtta statistika kartasi" qolipidan qoching: eng muhimi (bugungi tushum) birinchi va kattaroq, qolganlari unga bo'ysunadi.
2. **Hisobotlar:** 3 tab (kunlik tushum, shifokorlar, qarzdorlar), davr tanlash, jadval + grafik, "Excel" tugmasining joyi.
3. **Grafik qoidalari:** o'qda qisqa ko'rinish ("1,2 mln"), tooltip, to'lov usullari ranglari, ma'lumot yo'q holati.
4. **Holatlar katalogi** (`07 Holatlar katalogi`): bo'sh ro'yxat, qidiruv natijasiz, 403, 404, internet yo'q, server xatosi, yuklanmoqda. Har biriga qisqa o'zbekcha matn va keyingi qadam ("Qayta urinish", "Bosh sahifaga").

**Qabul mezoni**

- [ ] Ekranlar frontendga topshirilgan
- [ ] Holatlar katalogi matnlari bilan tayyor

## T-53 · Dizayn tekshiruvi (UI review) · 21.12

1. Staging'da har ekranni Figma bilan solishtiring — desktop va planshet o'lchamida.
2. Har farq — GitHub issue (`ui-review` belgisi): skrinshot, Figma havolasi, nima kutilgan edi, ustuvorlik (**albatta tuzatiladi** / **yaxshi bo'lardi**).
3. Matnlarni ham tekshiring: imlo, faqat lotin (kirill yo'q), bir xil atamalar (hamma joyda "Qabul" bo'lsa, bir joyda "Yozuv" emas).
4. 21.12 da Jahongir va Nurmuhammad bilan ro'yxatni ko'rib chiqing: nima T-57 va T-59 ga kiradi.

**Qabul mezoni**

- [ ] Farqlar ro'yxati frontendga berilgan
- [ ] Har issue'da skrinshot va ustuvorlik bor

## T-64 · Demo taqdimot va ekran rasmlari · 29.12

1. 8–12 slayd: muammo (qog'oz va Excel), yechim, har rol uchun 1–2 ekran, natija (pilot raqamlari — Ilyosdan), keyingi versiya rejasi.
2. Skrinshotlar **faqat staging'dagi soxta ma'lumot** bilan. Production'dan skrinshot olinmaydi — bu tibbiy sir.
3. 2–3 daqiqalik ekran yozuvi: bemorni yozish → tashrif → to'lov (ixtiyoriy).

**Qabul mezoni**

- [ ] Taqdimot tayyor
- [ ] Hech bir rasmda haqiqiy bemor ma'lumoti yo'q
