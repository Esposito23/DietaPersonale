import './DaySlot.css'

function DaySlot({ meal, slotType, onAdd, onRemove }) {
  const slotLabel = slotType === 'lunch' ? 'Pranzo' : 'Cena'

  return (
    <div className="day-slot">
      <div className="slot-header">
        <span className="slot-label">{slotLabel}</span>
      </div>
      {meal ? (
        <div className="meal-badge" onClick={onRemove}>
          <span className="meal-name">{meal}</span>
          <button className="remove-btn" title="Rimuovi">×</button>
        </div>
      ) : (
        <button className="add-btn" onClick={onAdd}>
          <span className="plus-icon">+</span>
        </button>
      )}
    </div>
  )
}

export default DaySlot
