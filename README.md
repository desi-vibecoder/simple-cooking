# simple-cooking — Indian Universal Cooking Guide

A mobile-portrait interactive Indian cooking web app with animated frying-pan visuals for all 23 steps, real-time background timers, lid reminders, and customizable accent themes.

## GitHub Pages Deployment

This project is pre-configured for **GitHub Pages** (`base: './'` in `vite.config.ts`, `public/.nojekyll`, and `.github/workflows/deploy.yml`):

1. Push this repository to GitHub (`.aistudio/` is automatically excluded via `.gitignore`).
2. In your GitHub repository, open **Settings → Pages**.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
4. Every push to `main` or `master` automatically builds `./dist` and publishes your live GitHub Page at:
   `https://<your-username>.github.io/simple-cooking/`

## Local Development

```bash
npm install
npm run dev
```

## Static Build

```bash
npm run build
```
