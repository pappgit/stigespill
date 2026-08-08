import { useState } from 'react'
import { GameShell } from '../components/GameShell'
import { PaperStage } from '../components/PaperStage'
import {
  defaultMonopolBoard,
  monopolCellPosition,
  type MonoSpace,
} from '../lib/monopol'
import type { PaperId } from '../lib/paper'

interface Props {
  onBack: () => void
}

export function MonopolGame({ onBack }: Props) {
  const [paperId, setPaperId] = useState<PaperId>('A3')
  const [spaces, setSpaces] = useState<MonoSpace[]>(() => defaultMonopolBoard())
  const [title, setTitle] = useState('Monopol')
  const [selected, setSelected] = useState<number | null>(null)

  function updateSpace(index: number, patch: Partial<MonoSpace>) {
    setSpaces((prev) =>
      prev.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    )
  }

  const selectedSpace = selected != null ? spaces[selected] : null

  return (
    <div className="app">
      <GameShell
        paperId={paperId}
        title="Monopol"
        onPaperChange={setPaperId}
        onBack={onBack}
      >
        <section className="panel">
          <h2>Tittel</h2>
          <input
            className="field-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <p className="hint">Eget eiendomsbrett — ikke et offisielt Monopoly-produkt.</p>
        </section>

        <section className="panel">
          <h2>Rute</h2>
          {selectedSpace == null ? (
            <p className="hint">Trykk en rute på brettet for å redigere.</p>
          ) : (
            <>
              <input
                className="field-input"
                value={selectedSpace.name}
                onChange={(e) => updateSpace(selected!, { name: e.target.value })}
                placeholder="Navn"
              />
              <input
                className="field-input"
                value={selectedSpace.price}
                onChange={(e) => updateSpace(selected!, { price: e.target.value })}
                placeholder="Pris (valgfritt)"
              />
            </>
          )}
          <button
            type="button"
            className="chip"
            style={{ marginTop: '0.45rem' }}
            onClick={() => {
              setSpaces(defaultMonopolBoard())
              setSelected(null)
            }}
          >
            Tilbakestill Oslo-tema
          </button>
        </section>
      </GameShell>

      <PaperStage paperId={paperId}>
        <div className="mono-board">
          <div className="mono-center">
            <p className="mono-center-title">{title}</p>
            <p className="mono-center-sub">Egendefinert eiendomsbrett</p>
          </div>
          {spaces.map((space, index) => {
            const { row, col } = monopolCellPosition(index)
            const isCorner = space.group === 'corner'
            return (
              <button
                key={space.id}
                type="button"
                className={`mono-cell${selected === index ? ' selected' : ''}${isCorner ? ' corner' : ''}`}
                style={{
                  gridRow: row + 1,
                  gridColumn: col + 1,
                  ['--mono-color' as string]: space.color,
                }}
                onClick={() => setSelected(index)}
              >
                {!isCorner && space.group !== 'chance' && space.group !== 'tax' && space.group !== 'rail' && space.group !== 'util' && (
                  <span className="mono-stripe" />
                )}
                <span className="mono-name">{space.name}</span>
                {space.price ? (
                  <span className="mono-price">{space.price}</span>
                ) : null}
              </button>
            )
          })}
        </div>
      </PaperStage>
    </div>
  )
}
