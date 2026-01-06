import { useState, useEffect } from 'react'
import WeekView from './components/WeekView'
import MealSelector from './components/MealSelector'
import MilkTracker from './components/MilkTracker'
import { fetchMeals, saveMeals, resetWeek, fetchFeeds, addFeed, deleteFeed } from './utils/api'
import './App.css'

// Lista ingredienti disponibili con icone
const AVAILABLE_MEALS = [
  '🥩 Vitello',
  '🦃 Tacchino',
  '🐔 Pollo',
  '🐟 Platessa',
  '🐟 Merluzzo',
  '🥚 Uovo',
  '🫘 Lenticchie 1',
  '🫘 Lenticchie 2',
  '🫛 Piselli secchi',
  '🫘 Ceci secchi',
  '🧀 Ricotta',
  '🧀 Robiola',
  '🧀 Formaggio fuso',
  '🧀 Parmigiano',
  '🥦 Broccoli',
  '🎃 Zucca',
  '🍅 Pomodori'
]

function App() {
  const [activeTab, setActiveTab] = useState('dieta')
  const [weeklyMeals, setWeeklyMeals] = useState({})
  const [lastBathDate, setLastBathDate] = useState(null)
  const [milkFeeds, setMilkFeeds] = useState({})
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [feedsLoading, setFeedsLoading] = useState(true)
  const [feedsSaving, setFeedsSaving] = useState(false)
  const [showSelector, setShowSelector] = useState(false)
  const [currentSlot, setCurrentSlot] = useState(null)

  // Carica i dati all'avvio
  useEffect(() => {
    loadMeals()
    loadBathDate()
    loadFeeds()
  }, [])

  // Salva automaticamente quando cambiano i dati (con debounce)
  useEffect(() => {
    if (!loading && Object.keys(weeklyMeals).length > 0) {
      const timer = setTimeout(() => {
        saveData()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [weeklyMeals, loading])

  async function loadMeals() {
    setLoading(true)
    try {
      const data = await fetchMeals()
      setWeeklyMeals(data)
    } catch (error) {
      console.error('Error loading meals:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadBathDate() {
    try {
      const res = await fetch('/api/bath')
      if (res.ok) {
        const data = await res.json()
        setLastBathDate(data.lastBathDate)
      }
    } catch (error) {
      console.error('Error loading bath date:', error)
    }
  }

  async function updateBathDate(date) {
    try {
      const res = await fetch('/api/bath', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lastBathDate: date })
      })
      if (res.ok) {
        setLastBathDate(date)
      }
    } catch (error) {
      console.error('Error updating bath date:', error)
    }
  }

  function handleBathToday() {
    const today = new Date().toISOString()
    updateBathDate(today)
    setShowDatePicker(false)
  }

  function handleSaveCustomDate() {
    if (selectedDate) {
      const dateISO = new Date(selectedDate + 'T12:00:00').toISOString()
      updateBathDate(dateISO)
      setShowDatePicker(false)
      setSelectedDate('')
    }
  }

  function getDaysSinceBath() {
    if (!lastBathDate) return null
    const now = new Date()
    const bathDate = new Date(lastBathDate)
    const diffTime = Math.abs(now - bathDate)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  function formatBathDate() {
    if (!lastBathDate) return 'Mai registrato'
    const date = new Date(lastBathDate)
    return date.toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  // Milk Feeds functions
  async function loadFeeds() {
    setFeedsLoading(true)
    try {
      const data = await fetchFeeds()
      setMilkFeeds(data)
    } catch (error) {
      console.error('Error loading feeds:', error)
    } finally {
      setFeedsLoading(false)
    }
  }

  async function handleAddFeed(amount) {
    setFeedsSaving(true)
    try {
      const result = await addFeed(amount)
      setMilkFeeds(prev => ({
        ...prev,
        [result.date]: result.data
      }))
    } catch (error) {
      console.error('Error adding feed:', error)
      alert('Errore nel salvare la poppata')
    } finally {
      setFeedsSaving(false)
    }
  }

  async function handleDeleteFeed(date, time) {
    setFeedsSaving(true)
    try {
      const result = await deleteFeed(date, time)
      setMilkFeeds(prev => {
        const updated = { ...prev }
        if (result.data && result.data.feeds && result.data.feeds.length > 0) {
          updated[date] = result.data
        } else {
          delete updated[date]
        }
        return updated
      })
    } catch (error) {
      console.error('Error deleting feed:', error)
      alert('Errore nel cancellare la poppata')
    } finally {
      setFeedsSaving(false)
    }
  }

  async function saveData() {
    setSaving(true)
    try {
      await saveMeals(weeklyMeals)
    } catch (error) {
      console.error('Error saving meals:', error)
    } finally {
      setSaving(false)
    }
  }

  async function handleReset() {
    if (confirm('Vuoi davvero azzerare la settimana?')) {
      setLoading(true)
      try {
        const data = await resetWeek()
        setWeeklyMeals(data.data)
      } catch (error) {
        console.error('Error resetting week:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  function handleAddMeal(day, slotType) {
    setCurrentSlot({ day, slotType })
    setShowSelector(true)
  }

  function handleRemoveMeal(day, slotType) {
    setWeeklyMeals(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [slotType]: null
      }
    }))
  }

  function handleSelectMeal(meal) {
    if (currentSlot) {
      setWeeklyMeals(prev => ({
        ...prev,
        [currentSlot.day]: {
          ...prev[currentSlot.day],
          [currentSlot.slotType]: meal
        }
      }))
      setShowSelector(false)
      setCurrentSlot(null)
    }
  }

  // Calcola pietanze già usate
  function getUsedMeals() {
    const used = []
    Object.values(weeklyMeals).forEach(day => {
      if (day?.lunch) used.push(day.lunch)
      if (day?.dinner) used.push(day.dinner)
    })
    return used
  }

  // Filtra pietanze disponibili (non ancora usate)
  function getAvailableMeals() {
    const used = getUsedMeals()
    return AVAILABLE_MEALS.filter(meal => !used.includes(meal))
  }

  if (loading) {
    return (
      <div className="App">
        <div className="loading">Caricamento...</div>
      </div>
    )
  }

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>Diario Enea</h1>
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'dieta' ? 'active' : ''}`}
              onClick={() => setActiveTab('dieta')}
            >
              🍽️ Dieta
            </button>
            <button
              className={`tab ${activeTab === 'latte' ? 'active' : ''}`}
              onClick={() => setActiveTab('latte')}
            >
              🍼 Latte
            </button>
            <button
              className={`tab ${activeTab === 'bagno' ? 'active' : ''}`}
              onClick={() => setActiveTab('bagno')}
            >
              🛁 Bagno
            </button>
          </div>
        </div>
        {activeTab === 'dieta' && (
          <div className="header-actions">
            <button className="reset-btn" onClick={handleReset}>
              Reset Settimana
            </button>
            {saving && <span className="save-indicator">Salvataggio...</span>}
          </div>
        )}
      </header>

      {activeTab === 'dieta' && (
        <>
          <WeekView
            weeklyMeals={weeklyMeals}
            onAddMeal={handleAddMeal}
            onRemoveMeal={handleRemoveMeal}
          />

          {showSelector && (
            <MealSelector
              availableMeals={getAvailableMeals()}
              onSelect={handleSelectMeal}
              onClose={() => {
                setShowSelector(false)
                setCurrentSlot(null)
              }}
            />
          )}
        </>
      )}

      {activeTab === 'latte' && (
        feedsLoading ? (
          <div className="loading">Caricamento...</div>
        ) : (
          <MilkTracker
            feeds={milkFeeds}
            onAddFeed={handleAddFeed}
            onDeleteFeed={handleDeleteFeed}
            saving={feedsSaving}
          />
        )
      )}

      {activeTab === 'bagno' && (
        <div className="bath-tracker">
          <div className="bath-card">
            <h2 className="bath-title">🛁 Ultimo Bagno di Enea</h2>

            <div className="bath-info">
              <div className="bath-date-display">
                <span className="date-icon">📅</span>
                <div className="date-text">
                  <p className="date-label">Ultima volta</p>
                  <p className="date-value">{formatBathDate()}</p>
                </div>
              </div>

              {getDaysSinceBath() !== null && (
                <div className="days-since">
                  <span className="days-number">{getDaysSinceBath()}</span>
                  <span className="days-label">
                    {getDaysSinceBath() === 0 ? 'Oggi' :
                     getDaysSinceBath() === 1 ? 'giorno fa' : 'giorni fa'}
                  </span>
                </div>
              )}
            </div>

            <button className="bath-btn" onClick={handleBathToday}>
              Fatto Oggi
            </button>

            <button
              className="date-picker-toggle"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              {showDatePicker ? 'Nascondi' : 'Altra data'}
            </button>

            {showDatePicker && (
              <div className="custom-date-picker">
                <input
                  type="date"
                  className="date-input"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
                <button
                  className="save-date-btn"
                  onClick={handleSaveCustomDate}
                  disabled={!selectedDate}
                >
                  Salva Data
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
