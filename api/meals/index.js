import { kv } from '@vercel/kv'

const EMPTY_WEEK = {
  monday: { lunch: null, dinner: null },
  tuesday: { lunch: null, dinner: null },
  wednesday: { lunch: null, dinner: null },
  thursday: { lunch: null, dinner: null },
  friday: { lunch: null, dinner: null },
  saturday: { lunch: null, dinner: null },
  sunday: { lunch: null, dinner: null }
}

export default async function handler(req, res) {
  // Enable CORS for local development
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    if (req.method === 'GET') {
      // Recupera lo stato settimanale
      let weeklyMeals = await kv.get('weekly-meals')

      // Se non esiste, inizializza con settimana vuota
      if (!weeklyMeals) {
        weeklyMeals = EMPTY_WEEK
        await kv.set('weekly-meals', weeklyMeals)
      }

      return res.status(200).json(weeklyMeals)
    }

    if (req.method === 'POST') {
      // Salva nuovo stato settimanale
      const weeklyMeals = req.body

      await kv.set('weekly-meals', weeklyMeals)

      return res.status(200).json({ success: true, data: weeklyMeals })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: 'Internal server error', message: error.message })
  }
}
