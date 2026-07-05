# Deploying jitu-nath backend to an Ubuntu VPS

API domain: **https://pickluapi.zamansheikh.com**

## 0. DNS
Point an **A record** for `pickluapi` → your VPS public IP, at the `zamansheikh.com` DNS host.
```
Type  Host       Value
A     pickluapi  <YOUR_VPS_IP>
```
Wait until `ping pickluapi.zamansheikh.com` resolves to your IP before running certbot.

## 1. Server prerequisites (run as root / sudo)
```bash
sudo apt update && sudo apt upgrade -y

# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Nginx, git, PM2
sudo apt install -y nginx git
sudo npm install -g pm2

# Firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```
> MongoDB: use **MongoDB Atlas** (managed) and put its URI in `DATABASE_URL`.
> If Atlas, whitelist the VPS IP in Atlas Network Access.

## 2. Get the code
```bash
cd /var/www            # or /home/<user>/apps
sudo git clone <YOUR_REPO_URL> jitu-nath-backend
cd jitu-nath-backend
```

## 3. Environment file
```bash
cp .env.example .env
nano .env               # fill in real values (see below)
```
Generate JWT secrets:
```bash
openssl rand -hex 64    # run twice, one for each JWT secret
```
Required values: `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`,
the `EMAIL_*` SMTP creds, and `CORS_ORIGINS` (your live frontend domain).
Keep `PORT=5001` unless you change the Nginx `proxy_pass`.

## 4. Build & start
```bash
npm ci                  # clean install from lockfile
npm run build           # compiles src -> dist
pm2 start ecosystem.config.js
pm2 save
pm2 startup             # run the command it prints, to auto-start on reboot
```
Check it: `pm2 logs jitu-nath-api` should show `app is listening on port 5001`.
Local smoke test: `curl http://127.0.0.1:5001/` → `{"message":"Welcome to jitu-nath"}`.

## 5. Nginx reverse proxy
```bash
sudo cp deploy/nginx-pickluapi.conf /etc/nginx/sites-available/pickluapi.zamansheikh.com
sudo ln -s /etc/nginx/sites-available/pickluapi.zamansheikh.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 6. HTTPS (Let's Encrypt)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d pickluapi.zamansheikh.com
```
Certbot edits the Nginx config to serve HTTPS and auto-renews.
Test: open `https://pickluapi.zamansheikh.com/` in a browser.

## 7. Redeploy after code changes
```bash
cd /var/www/jitu-nath-backend
git pull
npm ci
npm run build
pm2 restart jitu-nath-api
```

## Notes
- `trust proxy` is already enabled in the app, so it reads the real client IP
  from the `X-Forwarded-*` headers Nginx sets.
- Add your production frontend origin to `CORS_ORIGINS` in `.env`
  (comma-separated) — no code change needed.
- `vercel.json` is only for Vercel and is ignored on the VPS; you can keep it.
