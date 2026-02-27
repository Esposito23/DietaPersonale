# Regole Git e Deploy

- Commit message in italiano, concisi (max 72 char prima riga)
- Eseguire `npm run build` prima di ogni commit per verificare che non ci siano errori
- Eseguire `npm run lint` prima di commit
- Non committare mai file `.env`, `.env.local` o credenziali
- Il deploy su Vercel è automatico al push su main
