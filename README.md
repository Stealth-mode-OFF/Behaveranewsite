# Echo Pulse Marketing Website

Production marketing site for Echo Pulse (Vite + React).

## Requirements
- Node.js 18+

## Setup
```bash
npm install
```

## Development
```bash
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Environment Variables
- `VITE_SUPABASE_URL` (optional, for CMS)
- `VITE_SUPABASE_ANON_KEY` (optional, for CMS)
- `VITE_ADMIN_ENABLED` (`true` to enable admin routes)
- `VITE_ADMIN_PASSWORD` (admin password, required if admin enabled)

## Deployment
Vercel build command: `npm run build`  
Vercel output directory: `dist`
