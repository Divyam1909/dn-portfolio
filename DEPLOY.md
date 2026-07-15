# Deployment Guide — Vercel + Cloudflare Workers

This portfolio has two deployable pieces:
- **Frontend** (React app): Vercel — auto-deploys on `git push`
- **Chatbot** (Pixel): Cloudflare Workers — deployed with wrangler

| Service | URL |
|---------|-----|
| Frontend | https://divyam-n-portfolio.vercel.app |
| Chatbot | https://pixel-chatbot.demoaccdn01.workers.dev |

---

## Frontend changes (anything in `src/`, `public/`, `vercel.json`)

```bash
cd C:\Users\divya\Desktop\Portfolio
npm run build        # optional: verify the build locally
git add .
git commit -m "describe your changes"
git push             # Vercel auto-deploys
```

## Chatbot changes (anything in `cloudflare-chatbot/`)

```bash
cd C:\Users\divya\Desktop\Portfolio\cloudflare-chatbot
npx wrangler deploy
```

Changes are live immediately. Commit them to git as well so the repo matches
what is deployed.

## Update the Gemini API key

```bash
cd C:\Users\divya\Desktop\Portfolio\cloudflare-chatbot
npx wrangler secret put GEMINI_API_KEY
# paste the new key when prompted
```

Get a key at https://aistudio.google.com/apikey

---

## Chatbot security notes

- **CORS**: the worker only serves browser requests from
  `divyam-n-portfolio*.vercel.app`, `dn-portfolio.pages.dev`, and
  `localhost`. To add a domain, edit `ALLOWED_ORIGIN_PATTERNS` in
  `cloudflare-chatbot/src/index.js`.
- **Rate limit**: 20 requests/min per IP via the `CHAT_RATE_LIMITER` binding
  in `wrangler.toml`.
- **Input caps**: questions over 600 chars and history beyond 8 turns are
  truncated server-side.

---

## Troubleshooting

**"Page not found" on refresh** — Vercel SPA routing needs the catch-all
rewrite to `index.html` in `vercel.json` (already configured).

**Chatbot not responding**
1. Check Worker logs: `npx wrangler tail`
2. Verify the key is set: `npx wrangler secret list`
3. Rate-limited? The worker returns 429 after 20 requests/min per IP.

**Chatbot blocked in the browser (CORS)** — the site's origin must match
`ALLOWED_ORIGIN_PATTERNS` in the worker.

---

## Project structure

```
Portfolio/
├── cloudflare-chatbot/      # Pixel chatbot → Cloudflare Workers
│   ├── src/index.js
│   └── wrangler.toml
├── public/                  # static assets (incl. /uploads/divyam_resume.pdf)
├── src/                     # React app → Vercel
├── vercel.json              # SPA rewrite + security headers
└── build/                   # local build output (gitignored)
```

## Costs

| Service | Free tier |
|---------|-----------|
| Vercel | Hobby tier (static + serverless limits apply) |
| Cloudflare Workers | 100,000 requests/day |
| Gemini API | Free tier quota per model |
