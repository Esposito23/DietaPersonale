import { kv } from '@vercel/kv'

const KV_KEY = 'milk-feeds'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    if (req.method === 'GET') {
      // Recupera tutti i dati poppate
      const feeds = await kv.get(KV_KEY)
      return res.status(200).json(feeds || {})
    }

    if (req.method === 'POST') {
      // Aggiungi nuova poppata
      const { amount, date } = req.body

      // Validazione
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Quantità non valida' })
      }

      // Data e ora correnti
      const now = new Date()
      const dateKey = date || now.toISOString().split('T')[0] // YYYY-MM-DD
      const time = now.toISOString()

      // Recupera dati esistenti
      const allFeeds = await kv.get(KV_KEY) || {}
      const dayData = allFeeds[dateKey] || { feeds: [], total: 0 }

      // Aggiungi nuova poppata
      dayData.feeds.push({ time, amount: Number(amount) })
      dayData.total = dayData.feeds.reduce((sum, f) => sum + f.amount, 0)

      // Salva
      allFeeds[dateKey] = dayData
      await kv.set(KV_KEY, allFeeds)

      return res.status(200).json({
        success: true,
        date: dateKey,
        data: dayData
      })
    }

    if (req.method === 'DELETE') {
      // Rimuovi poppata specifica
      const { date, time } = req.body

      if (!date || !time) {
        return res.status(400).json({ error: 'Data e ora richieste' })
      }

      // Recupera dati esistenti
      const allFeeds = await kv.get(KV_KEY) || {}
      const dayData = allFeeds[date]

      if (!dayData) {
        return res.status(404).json({ error: 'Giorno non trovato' })
      }

      // Rimuovi poppata
      dayData.feeds = dayData.feeds.filter(f => f.time !== time)
      dayData.total = dayData.feeds.reduce((sum, f) => sum + f.amount, 0)

      // Se non ci sono più poppate, rimuovi il giorno
      if (dayData.feeds.length === 0) {
        delete allFeeds[date]
      } else {
        allFeeds[date] = dayData
      }

      await kv.set(KV_KEY, allFeeds)

      return res.status(200).json({
        success: true,
        data: dayData.feeds.length > 0 ? dayData : null
      })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    })
  }
}
