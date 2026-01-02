import { useState } from 'react'
import './MealSelector.css'

function MealSelector({ availableMeals, onSelect, onClose }) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredMeals = availableMeals.filter(meal =>
    meal.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Seleziona Pietanza</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <input
          type="text"
          className="search-input"
          placeholder="Cerca pietanza..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus
        />

        <div className="meals-list">
          {filteredMeals.length > 0 ? (
            filteredMeals.map((meal) => (
              <button
                key={meal}
                className="meal-item"
                onClick={() => onSelect(meal)}
              >
                {meal}
              </button>
            ))
          ) : (
            <p className="no-meals">Nessuna pietanza disponibile</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default MealSelector
