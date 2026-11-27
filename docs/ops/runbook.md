# F-2 Staging Runbook

## Serverga kirish

SSH kalit bilan:

```bash
ssh deploy@<staging-host>
```

Root kirish o'chiq. Baza porti (5432) tashqariga ochilmaydi.

## Deploy

`main`ga merge bo'lganda GitHub Actions avtomatik deploy qiladi:

```bash
# Qo'lda deploy kerak bo'lsa:
cd /opt/f2
git fetch
git checkout <sha>
docker compose -f docker-compose.prod.yml up -d --build
```

## Loglar

```bash
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f web
docker compose -f docker-compose.prod.yml logs -f db
```

## Qayta ishga tushirish

```bash
docker compose -f docker-compose.prod.yml restart backend
docker compose -f docker-compose.prod.yml restart web
```

## Orqaga qaytish (rollback)

Oldingi versiyaga qaytish:

```bash
cd /opt/f2
git checkout <old-sha>
docker compose -f docker-compose.prod.yml up -d --build
```

## Seedni yangilash

```bash
docker compose -f docker-compose.prod.yml exec backend npm run db:seed
```

## Xavfsizlik

- `db` porti tashqaridan ochilmaydi (ufw bilan bloklanadi)
- Barcha sirlar GitHub Secrets'da saqlanadi, repoda yo'q
- JWT siri va baza paroli staging va production uchun alohida
