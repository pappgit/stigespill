import { connectorKind, type Connector } from '../lib/connectors'
import { PAPER_SIZES, type PaperId } from '../lib/paper'
import type { BoardConfig } from '../lib/board'

interface Props {
  paperId: PaperId
  board: BoardConfig
  connectors: Connector[]
  selectedId: string | null
  message: string | null
  onPaperChange: (id: PaperId) => void
  onGridChange: (rows: number, cols: number) => void
  onRemove: (id: string) => void
  onClear: () => void
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
  selectedId,
  message,
  onPaperChange,
  onGridChange,
  onRemove,
  onClear,
}: Props) {
  const paper = PAPER_SIZES.find((p) => p.id === paperId)!

  return (
    <aside className="sidebar">
      <header className="sidebar-brand">
        <p className="brand-name">Stigespill</p>
        <p className="brand-tag">Design ditt eget brett til trykk</p>
      </header>

      <section className="panel">
        <h2>Papirstørrelse</h2>
        <p className="hint">Bestemmer proporsjoner for trykkfilen.</p>
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
        <h2>Slik gjør du</h2>
        <ol className="steps">
          <li>Dra fra én rute til en annen.</li>
          <li>Oppover = stige, nedover = slange.</li>
          <li>Klikk en stige/slange for å slette.</li>
        </ol>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>På brettet</h2>
          {connectors.length > 0 && (
            <button type="button" className="text-btn" onClick={onClear}>
              Tøm
            </button>
          )}
        </div>
        {connectors.length === 0 ? (
          <p className="hint">Ingen stiger eller slanger ennå.</p>
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
                    onClick={() => onRemove(c.id)}
                    aria-label={`Fjern ${kind} ${c.from} til ${c.to}`}
                  >
                    Fjern
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {message && <p className="toast" role="status">{message}</p>}
    </aside>
  )
}
