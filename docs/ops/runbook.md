# F-2 Staging Runbook

Staging serveri va CI/CD bo'yicha to'liq qo'llanma (QA / DevOps — Diyorbek).

---

## 1. Server talablari va dastlabki sozlash (VPS)

> **Eslatma:** Ushbu qism repo egasi / admin (Ilyos) tomonidan server ochilganda 1 marta bajariladi.

### 1.1 VPS parametrlari
- **OS:** Ubuntu 24.04 LTS (yoki 22.04 LTS)
- **Konfiguratsiya:** 2 vCPU, 4 GB RAM, 40+ GB SSD
- **Muhit:** Staging (faqat soxta/seed ma'lumotlar bilan ishlaydi)

### 1.2 Xavfsizlik va foydalanuvchi
```bash
# 1. Yangilanishlar va asosiy paketlar
sudo apt update && sudo apt upgrade -y
sudo apt install -y ufw fail2ban unattended-upgrades curl git

# 2. Alohida deploy foydalanuvchisi yaratish
sudo adduser --disabled-password --gecos "" deploy
sudo usermod -aG sudo deploy

# 3. SSH kalit orqali kirishni sozlash
sudo mkdir -p /home/deploy/.ssh
sudo cp /root/.ssh/authorized_keys /home/deploy/.ssh/
sudo chown -R deploy:deploy /home/deploy/.ssh
sudo chmod 700 /home/deploy/.ssh
sudo chmod 600 /home/deploy/.ssh/authorized_keys

# 4. SSH himoyasi (/etc/ssh/sshd_config):
# PermitRootLogin no
# PasswordAuthentication no
# PubkeyAuthentication yes
sudo sed -i 's/^#\?PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
sudo sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart ssh

# 5. UFW Firevol sozlash (Baza porti 5432 TASHQARIDAN BLOKLANGAN)
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# 6. fail2ban va unattended-upgrades yoqish
sudo systemctl enable --now fail2ban
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

### 1.3 Docker va Docker Compose o'rnatish
```bash
# Docker rasmiy omborini ulash va o'rnatish
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# deploy foydalanuvchisini docker guruhiga qo'shish
sudo usermod -aG docker deploy
```

---

## 2. Repozitoriy va Deploy Key sozlash (`/opt/f2`)

GitHub repo **public** bo'lgani sababli, serverga faqat o'qish huquqli **Deploy Key** ulanadi.

```bash
# deploy foydalanuvchisi sifatida:
sudo mkdir -p /opt/f2
sudo chown -R deploy:deploy /opt/f2

# SSH kalit yaratish (Deploy Key uchun)
ssh-keygen -t ed25519 -C "staging-deploy-key" -f ~/.ssh/id_staging_deploy -N ""
cat ~/.ssh/id_staging_deploy.pub
# Chiqqan ochiq kalitni GitHub Repo -> Settings -> Deploy keys -> "Add deploy key" (faqat read-only) ga qo'shing.

# Git klonlash
GIT_SSH_COMMAND="ssh -i ~/.ssh/id_staging_deploy" git clone git@github.com:suyunovdev/Dental.git /opt/f2
cd /opt/f2
```

---

## 3. GitHub Secrets (Ilyos tomonidan sozlanadi)

GitHub Repo -> **Settings** -> **Secrets and variables** -> **Actions** bo'limida quyidagi maxfiy o'zgaruvchilar kiritiladi:

| Maxfiy o'zgaruvchi | Tavsif | Misol |
| --- | --- | --- |
| `STAGING_HOST` | Staging server IP yoki domeni | `staging.domen.uz` |
| `STAGING_USER` | SSH foydalanuvchi | `deploy` |
| `STAGING_SSH_KEY` | Serverga kiruvchi private SSH kalit | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `STAGING_KNOWN_HOSTS` | `ssh-keyscan -H <STAGING_HOST>` natijasi | `staging.domen.uz ssh-ed25519 AAAAC3...` |

Shuningdek, **Variables** bo'limida:
- `STAGING_ENABLED` = `true` (server va secret'lar tayyor bo'lganda yoqiladi; aks holda `deploy-staging` workflow'i o'tkazib yuboriladi).

> **OGOHLANTIRISH:** Repo public bo'lgani sababli GitHub Actions loglarida hech qachon sirlar `echo` qilinmaydi.

---

## 4. Staging muhit o'zgaruvchilari (`/opt/f2/.env`)

Serverdagi `/opt/f2/.env` fayli lokal holda saqlanadi va repoga kirmaydi:

```env
# Baza
POSTGRES_USER=f2
POSTGRES_DB=dental
DB_PASSWORD=<openssl rand -hex 24>

# JWT kaliti (openssl rand -base64 48)
JWT_ACCESS_SECRET=<openssl rand -hex 32>

# Dastur parametrlari
NODE_ENV=staging
PORT=3000
COOKIE_SECURE=false
UPLOAD_DIR=/data/uploads
MAX_UPLOAD_MB=15

# Klinika ma'lumotlari (majburiy)
CLINIC_NAME=F-2 Stomatologiya
CLINIC_PHONE=+998901234567
CLINIC_TIMEZONE=Asia/Tashkent
```

---

## 5. SSL / TLS sozlash (Let's Encrypt Certbot)

Domen ulangach (`staging.<domen>`), bepul SSL sertifikat o'rnatiladi:

```bash
# Certbot o'rnatish
sudo apt install -y certbot

# Sertifikat olish (agar nginx to'xtatilgan bo'lsa)
sudo certbot certonly --standalone -d staging.<domen>
```

Yoki Nginx ichida SSL sertifikat yo'llarini ulab, 443 portga yo'naltirish.

---

## 6. Kundalik operatsiyalar va boshqaruv

### 6.1 Loyihani ishga tushirish (Deploy)
GitHub Actions har safar `main`ga kod tushganda avtomatik deploy qiladi. Qo'lda deploy qilish:
```bash
cd /opt/f2
git fetch origin
git checkout main
docker compose -f docker-compose.prod.yml up -d --build
```

### 6.2 Loglarni ko'rish
```bash
cd /opt/f2
# Backend loglari
docker compose -f docker-compose.prod.yml logs -f backend

# Nginx (veb) loglari
docker compose -f docker-compose.prod.yml logs -f web

# Baza loglari
docker compose -f docker-compose.prod.yml logs -f db
```

### 6.3 Qayta ishga tushirish
```bash
cd /opt/f2
docker compose -f docker-compose.prod.yml restart backend
docker compose -f docker-compose.prod.yml restart web
```

### 6.4 Orqaga qaytish (Rollback)
Agar so'nggi commit xato chiqsa, oldingi barqaror commit SHA'siga qaytariladi:
```bash
cd /opt/f2
git checkout <oldingi-barqaror-commit-sha>
docker compose -f docker-compose.prod.yml up -d --build
```

### 6.5 Seed ma'lumotlarni yangilash
```bash
cd /opt/f2
docker compose -f docker-compose.prod.yml exec backend npm run db:seed
```

---

## 7. QA / DevOps tekshiruv mezonlari (Verification)

1. **Baza porti tekshiruvi (5432 ochiq emasligi):**
   Tashqi kompyuterdan tekshiriladi:
   ```bash
   nc -zv <STAGING_HOST> 5432
   # Natija: Connection refused yoki Timeout bo'lishi shart.
   ```
2. **API Health tekshiruvi:**
   ```bash
   curl -i http://<STAGING_HOST>/api/health
   # HTTP/1.1 200 OK
   # {"status":"ok","db":"ok","version":"dev"}
   ```
3. **SPA statik sahifa tekshiruvi:**
   ```bash
   curl -i http://<STAGING_HOST>/
   # HTTP/1.1 200 OK
   # <title>Dental — Stomatologiya Klinikasi</title>
   ```
