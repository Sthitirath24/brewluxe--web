- Frontend deployment notes — generate `public/config.js` from env var

Quick summary
- Deploy backend (Render) and get its public URL.
- Add BREWLUXE_BACKEND_URL in Vercel (or CI) pointing to the backend URL.
- Run `node scripts/generate-config.js` during build to create `public/config.js`.
- Deploy the `public` folder as your static site (Vercel or similar).

Goal
- Create `public/config.js` at build time so the static frontend knows the production backend URL.

What the script does
- `scripts/generate-config.js` reads environment variables and writes `public/config.js` containing:
  window.APP_CONFIG = { API_BASE_URL: 'https://your-backend.../api' };

Env vars the script checks (first present wins)
- BREWLUXE_BACKEND_URL
- NEXT_PUBLIC_BREWLUXE_BACKEND_URL
- VERCEL_ENV_BREWLUXE_BACKEND_URL

Local test (PowerShell)
1) Set the env var and run the script:

$env:BREWLUXE_BACKEND_URL = 'https://your-backend.onrender.com'
node .\scripts\generate-config.js

2) Inspect the file:
Get-Content .\public\config.js

Vercel (recommended) — build-time generation
- In your Vercel project settings > Environment Variables add:
  Key: BREWLUXE_BACKEND_URL
  Value: https://your-backend.onrender.com
  Environment: Production

- Set the "Build Command" to run the script before deploying the static folder. Example (project root):

node scripts/generate-config.js

- Set the "Output Directory" to `public` (Vercel will serve that folder).

Notes:
- The script will append `/api` automatically if you provide a URL without it. So provide either `https://your-backend.onrender.com` or `https://your-backend.onrender.com/api`.
- If you prefer meta-tag based config, you can instead edit `public/index.html` and add:
  <meta name="brewluxe-api" content="https://your-backend.onrender.com/api">

Render (backend)
- Deploy your backend using Render. After successful deployment copy the Render service URL (e.g., https://your-backend.onrender.com) and set it in the frontend env var (BREWLUXE_BACKEND_URL) as above.

CI / GitHub Actions example (snippet)
- name: Generate frontend config
  run: node scripts/generate-config.js
  env:
    BREWLUXE_BACKEND_URL: ${{ secrets.BREWLUXE_BACKEND_URL }}

- Then continue with your usual static site deploy step.

If you want, I can:
- Commit & push these files to your repo (I already created them locally in the workspace). You will need to run the git push because I cannot access your remote credentials.
- Update `public/index.html` to include `<script src="/config.js"></script>` before the main inline script so window.APP_CONFIG is available when the page script runs. If you'd like that, I can update the file now.