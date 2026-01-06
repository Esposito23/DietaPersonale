# Diario Enea

Applicazione React + Vite pronta per deploy su Vercel.

## Setup Locale

```bash
npm install
npm run dev
```

## Deploy su Vercel

### Via Dashboard

1. Pusha il codice su GitHub
2. Vai su [vercel.com](https://vercel.com) e importa il repository
3. Vercel rileverà automaticamente Vite e deployerà

### Via CLI

```bash
npm install -g vercel
vercel --prod
```

## Comandi

- `npm run dev` - Server di sviluppo (localhost:5173)
- `npm run build` - Build di produzione
- `npm run preview` - Anteprima build locale