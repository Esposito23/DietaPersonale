import { useState } from 'react'
import './MilkTracker.css'

function MilkTracker({ feeds, onAddFeed, onDeleteFeed, saving }) {
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')

  // Ottieni data corrente in formato YYYY-MM-DD
  function getTodayKey() {
    return new Date().toISOString().split('T')[0]
  }

  // Ottieni poppate di oggi
  function getTodayFeeds() {
    const todayKey = getTodayKey()
    const todayData = feeds[todayKey]
    if (!todayData || !todayData.feeds) return []

    // Ordina per orario (più recente prima)
    return [...todayData.feeds].sort((a, b) =>
      new Date(b.time) - new Date(a.time)
    )
  }

  // Ottieni totale di oggi
  function getTodayTotal() {
    const todayKey = getTodayKey()
    return feeds[todayKey]?.total || 0
  }

  // Ottieni giorni passati
  function getPastDays() {
    const todayKey = getTodayKey()

    return Object.entries(feeds)
      .filter(([date]) => date < todayKey)
      .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
      .map(([date, data]) => ({
        date,
        total: data.total,
        dateLabel: formatDate(date)
      }))
  }

  // Formatta orario
  function formatTime(isoString) {
    const date = new Date(isoString)
    return date.toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Formatta data
  function formatDate(dateKey) {
    const [year, month, day] = dateKey.split('-')
    const date = new Date(year, month - 1, day)
    return date.toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long'
    })
  }

  // Gestisci aggiunta poppata
  async function handleAddFeed(e) {
    e.preventDefault()
    setError('')

    // Validazione
    const amountNum = Number(amount)
    if (!amount || isNaN(amountNum)) {
      setError('Inserisci un numero valido')
      return
    }
    if (amountNum <= 0) {
      setError('La quantità deve essere maggiore di zero')
      return
    }
    if (amountNum > 500) {
      setError('Quantità troppo elevata')
      return
    }

    try {
      await onAddFeed(amountNum)
      setAmount('')
      setError('')
    } catch (err) {
      setError('Errore nel salvare la poppata')
    }
  }

  // Gestisci eliminazione poppata
  async function handleDeleteFeed(time) {
    if (!confirm('Vuoi eliminare questa poppata?')) return

    const todayKey = getTodayKey()
    try {
      await onDeleteFeed(todayKey, time)
    } catch (err) {
      alert('Errore nell\'eliminare la poppata')
    }
  }

  const todayFeeds = getTodayFeeds()
  const todayTotal = getTodayTotal()
  const pastDays = getPastDays()

  return (
    <div className="milk-tracker">
      {/* Sezione Oggi */}
      <div className="milk-today">
        <h2 className="milk-section-title">Oggi</h2>

        {/* Totale giornaliero */}
        <div className="milk-total-card">
          <div className="milk-total-label">Totale</div>
          <div className="milk-total-value">{todayTotal} ml</div>
        </div>

        {/* Form aggiungi poppata */}
        <form className="milk-add-form" onSubmit={handleAddFeed}>
          <div className="form-group">
            <input
              type="number"
              className="milk-input"
              placeholder="Quantità (ml)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={saving}
              min="1"
              max="500"
            />
            {error && <div className="milk-error">{error}</div>}
          </div>
          <button
            type="submit"
            className="milk-add-btn"
            disabled={saving || !amount}
          >
            {saving ? 'Salvataggio...' : 'Aggiungi'}
          </button>
        </form>

        {/* Lista poppate di oggi */}
        {todayFeeds.length > 0 ? (
          <div className="milk-feed-list">
            <h3 className="milk-list-title">Poppate di Oggi</h3>
            {todayFeeds.map((feed) => (
              <div key={feed.time} className="milk-feed-item">
                <div className="feed-info">
                  <span className="feed-time">⏰ {formatTime(feed.time)}</span>
                  <span className="feed-amount">{feed.amount} ml</span>
                </div>
                <button
                  className="feed-delete-btn"
                  onClick={() => handleDeleteFeed(feed.time)}
                  disabled={saving}
                  title="Elimina"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="milk-empty">
            <p>Nessuna poppata registrata oggi</p>
          </div>
        )}
      </div>

      {/* Sezione Giorni Precedenti */}
      {pastDays.length > 0 && (
        <div className="milk-history">
          <h2 className="milk-section-title">Giorni Precedenti</h2>
          <div className="milk-history-list">
            {pastDays.map(({ date, total, dateLabel }) => (
              <div key={date} className="milk-history-item">
                <span className="history-date">📅 {dateLabel}</span>
                <span className="history-total">{total} ml</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MilkTracker
