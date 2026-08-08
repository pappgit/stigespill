import type { ReactNode } from 'react'
import { PAPER_SIZES, type PaperId } from '../lib/paper'

interface Props {
  paperId: PaperId
  title: string
  onPaperChange: (id: PaperId) => void
  onBack: () => void
  children?: ReactNode
}

export function GameShell({
  paperId,
  title,
  onPaperChange,
  onBack,
  children,
}: Props) {
  const paper = PAPER_SIZES.find((p) => p.id === paperId)!

  return (
    <aside className="sidebar">
      <header className="sidebar-brand">
        <button type="button" className="back-link" onClick={onBack}>
          ← Alle spill
        </button>
        <p className="brand-name">{title}</p>
        <p className="brand-tag">Design til trykk</p>
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

      {children}
    </aside>
  )
}
