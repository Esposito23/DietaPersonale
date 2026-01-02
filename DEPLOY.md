# Guida Deploy su Vercel con KV

## Setup Vercel KV Database

### Step 1: Deploy su Vercel

1. Pusha il codice su GitHub:
```bash
git add .
git commit -m "Implementa app pianificazione pasti"
git push
```

2. Vai su [vercel.com](https://vercel.com/dashboard)
3. Clicca "Add New Project"
4. Importa il repository GitHub
5. Vercel rileverà automaticamente il progetto Vite
6. Clicca "Deploy"

### Step 2: Aggiungi Vercel KV Storage

1. Vai sul tuo progetto Vercel
2. Clicca sulla tab "Storage"
3. Clicca "Create Database"
4. Seleziona "KV" (Redis-based key-value store)
5. Scegli un nome per il database (es. "dieta-personale-kv")
6. Clicca "Create"

### Step 3: Collega KV al Progetto

1. Nella pagina del database KV, clicca "Connect to Project"
2. Seleziona il tuo progetto "DietaPersonale"
3. Le environment variables verranno configurate automaticamente:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`
   - `KV_URL`

### Step 4: Redeploy

1. Vercel farà automaticamente un redeploy con le nuove variabili
2. Oppure vai su "Deployments" e clicca "Redeploy"

### Step 5: Testa l'App

1. Vai all'URL del tuo progetto (es. `dieta-personale.vercel.app`)
2. L'app dovrebbe caricarsi e funzionare
3. Aggiungi alcuni pasti e verifica che vengano salvati
4. Apri l'app da un altro browser/dispositivo e verifica la sincronizzazione

## Testing Locale con Vercel Dev

Per testare localmente con Vercel KV:

```bash
# Installa Vercel CLI se non presente
npm install -g vercel

# Collega il progetto locale a Vercel
vercel link

# Scarica le environment variables
vercel env pull

# Avvia dev server con API routes
vercel dev
```

L'app sarà disponibile su `http://localhost:3000`

## Troubleshooting

### "Failed to fetch meals"
- Verifica che Vercel KV sia configurato
- Controlla le environment variables nel dashboard Vercel
- Verifica che il database sia collegato al progetto

### API routes non funzionano in locale
- Usa `vercel dev` invece di `npm run dev`
- Assicurati di aver eseguito `vercel link` e `vercel env pull`

### Dati non sincronizzano tra dispositivi
- Verifica che entrambi i dispositivi stiano accedendo allo stesso URL Vercel
- Controlla che le API routes stiano salvando correttamente (vedi Network tab)
- Verifica che non ci siano errori nella console

## Free Tier Limits

Vercel KV Free Tier include:
- 256 MB storage
- 3000 requests/day
- Sufficiente per uso personale/familiare

## Note

- I dati sono persistenti in Vercel KV
- Backup automatico di Vercel
- Latenza bassa (edge network)
- Sicuro (HTTPS + autenticazione automatica)
