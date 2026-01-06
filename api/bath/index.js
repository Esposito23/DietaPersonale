import { kv } from '@vercel/kv'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    if (req.method === 'GET') {
      const lastBathDate = await kv.get('last-bath-date')
      return res.status(200).json({ lastBathDate: lastBathDate || null })
    }

    if (req.method === 'POST') {
      const { lastBathDate } = req.body
      await kv.set('last-bath-date', lastBathDate)
      return res.status(200).json({ success: true, lastBathDate })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: 'Internal server error', message: error.message })
  }
}
