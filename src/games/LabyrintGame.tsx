import { useMemo, useState } from 'react'
import { GameShell } from '../components/GameShell'
import { PaperStage } from '../components/PaperStage'
import { createMaze } from '../lib/maze'
import type { PaperId } from '../lib/paper'

interface Props {
  onBack: () => void
}

const DIFFS = [
  { label: 'Lett', rows: 8, cols: 8 },
  { label: 'Middels', rows: 12, cols: 12 },
  { label: 'Vanskelig', rows: 16, cols: 16 },
  { label: 'Ekspert', rows: 20, cols: 20 },
]

export function LabyrintGame({ onBack }: Props) {
  const [paperId, setPaperId] = useState<PaperId>('A4')
  const [diffIndex, setDiffIndex] = useState(1)
  const [seed, setSeed] = useState(() => Date.now())
  const diff = DIFFS[diffIndex]!

  const maze = useMemo(
    () => createMaze(diff.rows, diff.cols, seed),
    [diff.rows, diff.cols, seed],
  )

  const wall = 0.08
  const paths: string[] = []
  for (let r = 0; r < diff.rows; r++) {
    for (let c = 0; c < diff.cols; c++) {
      const cell = maze[r]![c]!
      const x = c
      const y = r
      if (cell.n) paths.push(`M ${x} ${y} h 1`)
      if (cell.w) paths.push(`M ${x} ${y} v 1`)
      if (r === diff.rows - 1 && cell.s) paths.push(`M ${x} ${y + 1} h 1`)
      if (c === diff.cols - 1 && cell.e) paths.push(`M ${x + 1} ${y} v 1`)
    }
  }

  return (
    <div className="app">
      <GameShell
        paperId={paperId}
        title="Labyrint"
        onPaperChange={setPaperId}
        onBack={onBack}
      >
        <section className="panel">
          <h2>Vanskelighet</h2>
          <div className="chip-row">
            {DIFFS.map((d, i) => (
              <button
                key={d.label}
                type="button"
                className={diffIndex === i ? 'chip active' : 'chip'}
                onClick={() => {
                  setDiffIndex(i)
                  setSeed(Date.now())
                }}
              >
                {d.label}
              </button>
            ))}
          </div>
          <p className="meta">
            {diff.rows}×{diff.cols} celler
          </p>
          <button
            type="button"
            className="chip"
            style={{ marginTop: '0.55rem' }}
            onClick={() => setSeed(Date.now())}
          >
            Ny labyrint
          </button>
        </section>

        <section className="panel">
          <h2>Slik spiller du</h2>
          <p className="hint">
            Start øverst til venstre, mål nederst til høyre. Skriv ut og løs med
            blyant.
          </p>
        </section>
      </GameShell>

      <PaperStage paperId={paperId}>
        <div className="maze-board">
          <svg
            className="maze-svg"
            viewBox={`-0.05 -0.05 ${diff.cols + 0.1} ${diff.rows + 0.1}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <path
              d={paths.join(' ')}
              fill="none"
              stroke="currentColor"
              strokeWidth={wall}
              strokeLinecap="square"
            />
            <circle cx={0.5} cy={0.5} r={0.22} className="maze-start" />
            <circle
              cx={diff.cols - 0.5}
              cy={diff.rows - 0.5}
              r={0.22}
              className="maze-end"
            />
          </svg>
        </div>
      </PaperStage>
    </div>
  )
}
