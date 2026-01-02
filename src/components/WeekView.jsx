import DaySlot from './DaySlot'
import './WeekView.css'

const DAYS = [
  { key: 'monday', label: 'Lunedì' },
  { key: 'tuesday', label: 'Martedì' },
  { key: 'wednesday', label: 'Mercoledì' },
  { key: 'thursday', label: 'Giovedì' },
  { key: 'friday', label: 'Venerdì' },
  { key: 'saturday', label: 'Sabato' },
  { key: 'sunday', label: 'Domenica' }
]

function WeekView({ weeklyMeals, onAddMeal, onRemoveMeal }) {
  return (
    <div className="week-view">
      {DAYS.map(({ key, label }) => (
        <div key={key} className="day-card">
          <h3 className="day-name">{label}</h3>
          <div className="day-slots">
            <DaySlot
              meal={weeklyMeals[key]?.lunch}
              slotType="lunch"
              onAdd={() => onAddMeal(key, 'lunch')}
              onRemove={() => onRemoveMeal(key, 'lunch')}
            />
            <DaySlot
              meal={weeklyMeals[key]?.dinner}
              slotType="dinner"
              onAdd={() => onAddMeal(key, 'dinner')}
              onRemove={() => onRemoveMeal(key, 'dinner')}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default WeekView
