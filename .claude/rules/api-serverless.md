---
paths:
  - "api/**/*.js"
---

# Regole API Serverless

- Ogni endpoint esporta una funzione `default` async con `(request, response)`
- Includere sempre CORS headers: `Access-Control-Allow-Origin: *`
- Gestire OPTIONS per preflight CORS
- Import da `@vercel/kv` per persistenza
- Fallback a valori vuoti se la chiave KV non esiste
- Validare input prima di scrivere su KV
- Rispondere sempre con JSON
