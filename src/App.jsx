import { useState, useEffect } from 'react'
import WeekView from './components/WeekView'
import MealSelector from './components/MealSelector'
import { fetchMeals, saveMeals, resetWeek } from './utils/api'
import './App.css'

// Lista pietanze disponibili
const AVAILABLE_MEALS = [
  'Pasta al pomodoro',
  'Pasta al pesto',
  'Pasta alla carbonara',
  'Risotto ai funghi',
  'Risotto alla milanese',
  'Pollo arrosto',
  'Pollo alla griglia',
  'Salmone al forno',
  'Pesce spada alla griglia',
  'Insalata Caesar',
  'Insalata mista',
  'Pizza margherita',
  'Pizza quattro stagioni',
  'Burger con patatine',
  'Zuppa di verdure',
  'Minestrone',
  'Lasagne al ragù',
  'Tortellini in brodo',
  'Cotoletta alla milanese',
  'Arrosto di vitello',
  'Spaghetti alle vongole',
  'Ravioli ricotta e spinaci'
]

function App() {
  const [weeklyMeals, setWeeklyMeals] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showSelector, setShowSelector] = useState(false)
  const [currentSlot, setCurrentSlot] = useState(null)

  // Carica i dati all'avvio
  useEffect(() => {
    loadMeals()
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
          <h1>Dieta Personale</h1>
          <p className="subtitle">Pianifica i tuoi pasti settimanali</p>
        </div>
        <div className="header-actions">
          <button className="reset-btn" onClick={handleReset}>
            Reset Settimana
          </button>
          {saving && <span className="save-indicator">Salvataggio...</span>}
        </div>
      </header>

      <div className="stats">
        <div className="stat-card">
          <span className="stat-number">{getUsedMeals().length}</span>
          <span className="stat-label">Pasti pianificati</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{getAvailableMeals().length}</span>
          <span className="stat-label">Pietanze disponibili</span>
        </div>
      </div>

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
    </div>
  )
}

export default App
