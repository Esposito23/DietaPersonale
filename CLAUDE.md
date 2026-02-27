# Diario Enea - Dieta Personale

App React per gestire la dieta settimanale, le poppate e i bagni di Enea.

## Stack

- **Frontend:** React 18 + Vite 6 (JavaScript, ES modules)
- **Backend:** Vercel Serverless Functions (`api/`)
- **Database:** Vercel KV (Redis)
- **Deploy:** Vercel

## Comandi

- `npm run dev` — Dev server su localhost:5173
- `npm run build` — Build produzione in `dist/`
- `npm run lint` — ESLint (zero warnings)
- `npm run preview` — Preview build locale

## Struttura

```
src/components/   → Componenti React (.jsx + .css)
src/utils/api.js  → Client API (fetch wrapper)
api/              → Serverless functions (Vercel KV)
```

## Convenzioni

- Lingua UI e commenti: **italiano**
- Commit message: **italiano**, formato conciso
- CSS: file `.css` separati per ogni componente (no CSS-in-JS)
- API: REST semplice, ogni endpoint in `api/<nome>/index.js`
- Vercel KV: import da `@vercel/kv`, gestire sempre il fallback se dato assente
- No TypeScript (progetto in JavaScript puro)

## Endpoint API

| Path | Metodi | Descrizione |
|------|--------|-------------|
| `/api/meals` | GET, POST | Piano pasti settimanale |
| `/api/feeds` | GET, POST, DELETE | Poppate latte |
| `/api/bath` | GET, POST | Tracking bagni |
| `/api/reset` | POST | Reset settimana |

## Attenzione

- Non duplicare pietanze nella stessa settimana
- Auto-save con debounce 500ms sul piano pasti
- Sempre CORS headers nelle serverless functions
- Build deve passare senza errori prima di commit
