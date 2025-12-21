# Deployment Guide - Vercel + Render (+ Cloudflare Workers)

This guide covers deploying your portfolio website with:
- **Frontend**: Vercel (easy Git deploy + global CDN)
- **Backend API**: Render (free tier, no credit card)
- **Chatbot**: Cloudflare Workers (free tier) (optional)

---

## 🎉 Current Deployment Status

| Service | URL | Status |
|---------|-----|--------|
| Frontend | https://divyam-n-portfolio.vercel.app | ✅ Live |
| Backend API | https://dn-portfolio.onrender.com | ✅ Live |
| Chatbot | https://pixel-chatbot.demoaccdn01.workers.dev | ✅ Live |

---

## 🌐 Initial Deployment (Already Done)

### Frontend → Vercel
Recommended: connect your GitHub repo to Vercel (Dashboard) so it auto-deploys on every `git push`.

```bash
cd C:\Users\divya\Desktop\Portfolio
npm run build
# Optional (CLI): deploy using Vercel CLI
# npx vercel --prod
```

### Backend → Render
Deployed via Render dashboard, auto-deploys on `git push`.

### Chatbot → Cloudflare Workers
```bash
cd C:\Users\divya\Desktop\Portfolio\cloudflare-chatbot
npx wrangler secret put GEMINI_API_KEY   # Add your API key
npm run deploy
```

---

## ✅ Verification Checklist

- [x] Render backend is running (`/api/portfolio` returns data)
- [x] Cloudflare Worker chatbot responds to POST `/chat`
- [x] Vercel site loads
- [x] Chatbot works on the live site
- [x] All pages load correctly (SPA routing works)

---

## 🔄 Making Changes (CLI Only)

### 1️⃣ Frontend Changes (React App)

When you modify files in `src/` folder:

```bash
# Step 1: Navigate to project root
cd C:\Users\divya\Desktop\Portfolio

# Step 2: Build the React app (optional for local verification)
npm run build

# Step 3: Deploy
# - If using Git integration: commit + push and Vercel auto-deploys
# - If using CLI: npx vercel --prod
```

**That's it!** Your changes will be live at https://divyam-n-portfolio.vercel.app

---

### 2️⃣ Backend Changes (Express API)

When you modify files in `backend/` folder:

```bash
# Step 1: Navigate to backend folder
cd C:\Users\divya\Desktop\Portfolio\backend

# Step 2: Commit your changes
git add .
git commit -m "describe your changes"

# Step 3: Push to GitHub (Render auto-deploys)
git push origin main
```

**Note:** Render automatically redeploys when you push to GitHub.

---

### 3️⃣ Chatbot Changes (Cloudflare Worker)

When you modify files in `cloudflare-chatbot/` folder:

```bash
# Step 1: Navigate to chatbot folder
cd C:\Users\divya\Desktop\Portfolio\cloudflare-chatbot

# Step 2: Deploy the worker
npx wrangler deploy
```

**That's it!** Your chatbot changes are live immediately.

---

### 4️⃣ Update Chatbot API Key

If you need to change the Gemini API key:

```bash
cd C:\Users\divya\Desktop\Portfolio\cloudflare-chatbot
npx wrangler secret put GEMINI_API_KEY
# Paste your new API key when prompted
```

---

### 📋 Quick Reference

| What Changed | Commands |
|--------------|----------|
| Frontend (`src/`) | `git add .` → `git commit -m "msg"` → `git push` (Vercel auto-deploy) |
| Backend (`backend/`) | `git add .` → `git commit -m "msg"` → `git push origin main` |
| Chatbot (`cloudflare-chatbot/`) | `cd cloudflare-chatbot` → `npx wrangler deploy` |

---

## 💰 Cost Breakdown

| Service | Free Tier |
|---------|-----------|
| Vercel | ✅ generous hobby tier (static + serverless limits apply) |
| Cloudflare Workers | ✅ 100,000 requests/day |
| Render | ✅ 750 hours/month (spins down after 15min inactivity) |
| MongoDB Atlas | ✅ 512MB free tier |

**Total: $0/month** - No credit card required!

---

## 🐛 Troubleshooting

### "Page not found" on refresh
For Vercel SPA routing, make sure `vercel.json` includes a catch-all route to `index.html` (this repo already has it).

### Chatbot not responding
1. Check Worker logs: `npx wrangler tail`
2. Verify GEMINI_API_KEY is set: `npx wrangler secret list`

### Backend slow on first request
Render free tier spins down after 15 minutes of inactivity. First request takes ~30 seconds to "wake up".

### API calls failing
1. Check CORS settings in backend
2. Verify `REACT_APP_API_URL` is correct
3. Check Render logs for errors

---

## 📁 Project Structure

```
Portfolio/
├── backend/                 # → Render (https://dn-portfolio.onrender.com)
│   └── src/server.js
├── cloudflare-chatbot/      # → Cloudflare Workers
│   ├── src/index.js
│   ├── wrangler.toml
│   └── package.json
├── public/
│   ├── _redirects          # (legacy) Cloudflare Pages SPA routing
│   └── _headers            # (legacy) Cloudflare Pages headers
├── src/                    # React app
├── .env.production         # Production environment variables
└── build/                  # local build output (gitignored)
```

---

## 🔗 Useful Links

- **Live Site**: https://divyam-n-portfolio.vercel.app
- **Backend API**: https://dn-portfolio.onrender.com
- **Chatbot Worker**: https://pixel-chatbot.demoaccdn01.workers.dev
- [MongoDB Atlas](https://cloud.mongodb.com/) (database management)
- [Get Gemini API Key](https://aistudio.google.com/apikey)
