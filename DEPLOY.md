# Put the portfolio online for free

Free services used (all have a free plan, no payment needed at the time of writing; check each site's current limits):

| Part | Service | Why |
| --- | --- | --- |
| Website (React) | **Vercel** (or Netlify / Cloudflare Pages) | free static hosting, auto-deploys from GitHub |
| API (Spring Boot) | **Render** | free web service that runs the Dockerfile |
| Database (PostgreSQL) | **Neon** | free PostgreSQL |

> **Good to know:** Render's free service goes to sleep after ~15 minutes without visitors and takes up to a minute to wake up.
> The website handles this: if the API doesn't answer within 4 seconds it shows the same content from `public/portfolio-data.json`, so visitors never wait.

## Fastest option (website only, 5 minutes)

Do **Step 1** and **Step 4** only, and leave `VITE_API_URL` empty. The site works fully from `portfolio-data.json`.
Then add Steps 2-3 whenever you want the live Spring Boot + PostgreSQL part running.

---

## Step 1 — Put the code on GitHub

```bash
cd safdar-portfolio
git init
git add .
git commit -m "Portfolio"
git branch -M main
git remote add origin https://github.com/Safdar7262/safdar-portfolio.git   # create this empty repo on github.com first
git push -u origin main
```

## Step 2 — Database on Neon

1. Sign up at **neon.tech** and create a project (any name, pick the region closest to you).
2. Open **Connection details** and note the **host**, **database**, **user** and **password**.
3. Build the Java address from them:

   ```
   DB_URL      = jdbc:postgresql://<host>/<database>?sslmode=require
   DB_USER     = <user>
   DB_PASSWORD = <password>
   ```

   Example: `jdbc:postgresql://ep-cool-name-123456.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`

## Step 3 — API on Render

1. Sign up at **render.com** with GitHub.
2. **New → Blueprint** → choose your repository. Render reads `render.yaml` and creates `safdar-portfolio-api`.
3. Fill the environment variables: `DB_URL`, `DB_USER`, `DB_PASSWORD` (from Step 2). Leave `CORS_ORIGINS` as `*` for now.
4. Deploy. The first build takes a few minutes. Then open `https://<your-service>.onrender.com/api/portfolio` — you should see JSON. (The first request after a sleep can take ~50 seconds.)

## Step 4 — Website on Vercel

1. Sign up at **vercel.com** with GitHub → **Add New → Project** → pick your repository.
2. Set **Root Directory** to `frontend`. Framework: **Vite** (auto-detected). Build command `npm run build`, output `dist`.
3. Add the environment variable `VITE_API_URL` = your Render URL (e.g. `https://safdar-portfolio-api.onrender.com`, no trailing slash). Skip it for the "fastest option".
4. Deploy. You get a link like `https://safdar-portfolio.vercel.app`.

## Step 5 — Allow the website to call the API

In Render → your service → **Environment**, set `CORS_ORIGINS` to your Vercel address (for example `https://safdar-portfolio.vercel.app`) and save. Render redeploys.

Done. Open the Vercel link.

---

## Updating the site later

* Change text: edit `backend/src/main/resources/portfolio-data.json`, run `npm run sync-data` inside `frontend/` (copies it to `frontend/public/portfolio-data.json`), commit and push. Vercel and Render redeploy by themselves.
* Change photo or resume: replace the files as described in the README, commit, push.

## Optional

* **Keep the API awake:** a free monitor such as UptimeRobot can ping `/api/portfolio` every 5 minutes.
* **Own domain:** add it in Vercel → Settings → Domains (the domain itself costs money).
* **Other free hosts for the website:** Netlify (base directory `frontend`, publish `frontend/dist`) or Cloudflare Pages work the same way.
