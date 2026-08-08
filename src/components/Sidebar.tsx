import { connectorKind, type Connector } from '../lib/connectors'
import { effectLabel, type CellEffect } from '../lib/effects'
import { PAPER_SIZES, type PaperId } from '../lib/paper'
import type { BoardConfig } from '../lib/board'

interface Props {
  paperId: PaperId
  board: BoardConfig
  connectors: Connector[]
  effects: CellEffect[]
  selectedId: string | null
  message: string | null
  onPaperChange: (id: PaperId) => void
  onGridChange: (rows: number, cols: number) => void
  onRemoveConnector: (id: string) => void
  onRemoveEffect: (id: string) => void
  onClear: () => void
  onBack?: () => void
}

const GRID_PRESETS = [
  { label: '8×8', rows: 8, cols: 8 },
  { label: '10×10', rows: 10, cols: 10 },
  { label: '12×12', rows: 12, cols: 12 },
]

export function Sidebar({
  paperId,
  board,
  connectors,
  effects,
  selectedId,
  message,
  onPaperChange,
  onGridChange,
  onRemoveConnector,
  onRemoveEffect,
  onClear,
  onBack,
}: Props) {
  const paper = PAPER_SIZES.find((p) => p.id === paperId)!
  const hasItems = connectors.length > 0 || effects.length > 0

  return (
    <aside className="sidebar">
      <header className="sidebar-brand">
        {onBack && (
          <button type="button" className="back-link" onClick={onBack}>
            ← Alle spill
          </button>
        )}
        <p className="brand-name">Stigespill</p>
        <p className="brand-tag">Design ditt eget brett til trykk</p>
      </header>

      <section className="panel">
        <h2>Papirstørrelse</h2>
        <div className="chip-row" role="group" aria-label="Papirstørrelse">
          {PAPER_SIZES.map((p) => (
            <button
              key={p.id}
              type="button"
              className={p.id === paperId ? 'chip active' : 'chip'}
              onClick={() => onPaperChange(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
        <p className="meta">
          {paper.widthMm} × {paper.heightMm} mm
        </p>
      </section>

      <section className="panel">
        <h2>Rutenett</h2>
        <div className="chip-row" role="group" aria-label="Rutenett">
          {GRID_PRESETS.map((g) => (
            <button
              key={g.label}
              type="button"
              className={
                board.rows === g.rows && board.cols === g.cols
                  ? 'chip active'
                  : 'chip'
              }
              onClick={() => onGridChange(g.rows, g.cols)}
            >
              {g.label}
            </button>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>På brettet</h2>
          {hasItems && (
            <button type="button" className="text-btn" onClick={onClear}>
              Tøm
            </button>
          )}
        </div>
        {!hasItems ? (
          <p className="hint">Ingen elementer ennå.</p>
        ) : (
          <ul className="connector-list">
            {connectors.map((c) => {
              const kind = connectorKind(c)
              return (
                <li
                  key={c.id}
                  className={selectedId === c.id ? 'selected' : undefined}
                >
                  <span className={`badge ${kind}`}>
                    {kind === 'ladder' ? 'Stige' : 'Slange'}
                  </span>
                  <span className="range">
                    {c.from} → {c.to}
                  </span>
                  <button
                    type="button"
                    className="text-btn"
                    onClick={() => onRemoveConnector(c.id)}
                  >
                    Fjern
                  </button>
                </li>
              )
            })}
            {effects.map((e) => (
              <li key={e.id}>
                <span className={`badge effect-${e.kind}`}>
                  {effectLabel(e.kind)}
                </span>
                <span className="range">Rute {e.cell}</span>
                <button
                  type="button"
                  className="text-btn"
                  onClick={() => onRemoveEffect(e.id)}
                >
                  Fjern
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {message && <p className="toast" role="status">{message}</p>}
    </aside>
  )
}
