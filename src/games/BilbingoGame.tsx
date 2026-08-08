import { useState } from 'react'
import { GameShell } from '../components/GameShell'
import { PaperStage } from '../components/PaperStage'
import {
  BILBINGO_PRESETS,
  emptyBingoCells,
  fillBingoFromPool,
  type BingoSize,
} from '../lib/bilbingo'
import type { PaperId } from '../lib/paper'

interface Props {
  onBack: () => void
}

const SIZES: BingoSize[] = [3, 4, 5]

export function BilbingoGame({ onBack }: Props) {
  const [paperId, setPaperId] = useState<PaperId>('A4')
  const [size, setSize] = useState<BingoSize>(4)
  const [cells, setCells] = useState(() => fillBingoFromPool(4, BILBINGO_PRESETS))
  const [selected, setSelected] = useState<number | null>(null)

  function changeSize(next: BingoSize) {
    setSize(next)
    setCells(fillBingoFromPool(next, BILBINGO_PRESETS))
    setSelected(null)
  }

  function setCell(index: number, value: string) {
    setCells((prev) => prev.map((c, i) => (i === index ? value : c)))
  }

  return (
    <div className="app">
      <GameShell
        paperId={paperId}
        title="Bilbingo"
        onPaperChange={setPaperId}
        onBack={onBack}
      >
        <section className="panel">
          <h2>Rutenett</h2>
          <div className="chip-row">
            {SIZES.map((s) => (
              <button
                key={s}
                type="button"
                className={size === s ? 'chip active' : 'chip'}
                onClick={() => changeSize(s)}
              >
                {s}×{s}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="chip"
            style={{ marginTop: '0.5rem' }}
            onClick={() => {
              setCells(fillBingoFromPool(size, BILBINGO_PRESETS))
              setSelected(null)
            }}
          >
            Fyll tilfeldig
          </button>
          <button
            type="button"
            className="text-btn"
            style={{ marginTop: '0.55rem', alignSelf: 'start' }}
            onClick={() => {
              setCells(emptyBingoCells(size))
              setSelected(null)
            }}
          >
            Tøm brett
          </button>
        </section>

        <section className="panel">
          <h2>Innhold</h2>
          <p className="hint">Trykk en rute, deretter et forslag — eller skriv selv.</p>
          {selected != null && (
            <input
              className="field-input"
              value={cells[selected] ?? ''}
              onChange={(e) => setCell(selected, e.target.value)}
              placeholder="Tekst i ruten"
              autoFocus
            />
          )}
          <div className="preset-cloud">
            {BILBINGO_PRESETS.map((label) => (
              <button
                key={label}
                type="button"
                className="preset-chip"
                disabled={selected == null}
                onClick={() => {
                  if (selected == null) return
                  setCell(selected, label)
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </section>
      </GameShell>

      <PaperStage paperId={paperId}>
        <div
          className="bingo-board"
          style={{
            gridTemplateColumns: `repeat(${size}, 1fr)`,
            gridTemplateRows: `repeat(${size}, 1fr)`,
          }}
        >
          {cells.map((text, i) => (
            <button
              key={i}
              type="button"
              className={`bingo-cell${selected === i ? ' selected' : ''}${text === 'GRATIS' ? ' free' : ''}`}
              onClick={() => setSelected(i)}
            >
              <span className="bingo-text">{text || '…'}</span>
            </button>
          ))}
        </div>
      </PaperStage>
    </div>
  )
}
