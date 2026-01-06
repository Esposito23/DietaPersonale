const API_BASE = '/api'

export async function fetchMeals() {
  try {
    const res = await fetch(`${API_BASE}/meals`)
    if (!res.ok) throw new Error('Failed to fetch meals')
    return await res.json()
  } catch (error) {
    console.error('Error fetching meals:', error)
    // Fallback a stato vuoto se API non disponibile
    return {
      monday: { lunch: null, dinner: null },
      tuesday: { lunch: null, dinner: null },
      wednesday: { lunch: null, dinner: null },
      thursday: { lunch: null, dinner: null },
      friday: { lunch: null, dinner: null },
      saturday: { lunch: null, dinner: null },
      sunday: { lunch: null, dinner: null }
    }
  }
}

export async function saveMeals(weeklyMeals) {
  try {
    const res = await fetch(`${API_BASE}/meals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(weeklyMeals)
    })
    if (!res.ok) throw new Error('Failed to save meals')
    return await res.json()
  } catch (error) {
    console.error('Error saving meals:', error)
    throw error
  }
}

export async function resetWeek() {
  try {
    const res = await fetch(`${API_BASE}/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (!res.ok) throw new Error('Failed to reset week')
    return await res.json()
  } catch (error) {
    console.error('Error resetting week:', error)
    throw error
  }
}

// Milk Feeds API
export async function fetchFeeds() {
  try {
    const res = await fetch(`${API_BASE}/feeds`)
    if (!res.ok) throw new Error('Failed to fetch feeds')
    return await res.json()
  } catch (error) {
    console.error('Error fetching feeds:', error)
    return {}
  }
}

export async function addFeed(amount) {
  try {
    const res = await fetch(`${API_BASE}/feeds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount })
    })
    if (!res.ok) throw new Error('Failed to add feed')
    return await res.json()
  } catch (error) {
    console.error('Error adding feed:', error)
    throw error
  }
}

export async function deleteFeed(date, time) {
  try {
    const res = await fetch(`${API_BASE}/feeds`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ date, time })
    })
    if (!res.ok) throw new Error('Failed to delete feed')
    return await res.json()
  } catch (error) {
    console.error('Error deleting feed:', error)
    throw error
  }
}
