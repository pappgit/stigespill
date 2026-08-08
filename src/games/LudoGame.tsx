import { useMemo, useState } from 'react'
import { GameShell } from '../components/GameShell'
import { PaperStage } from '../components/PaperStage'
import {
  buildLudoGrid,
  DEFAULT_LUDO_PLAYERS,
  type LudoPlayer,
} from '../lib/ludo'
import type { PaperId } from '../lib/paper'

interface Props {
  onBack: () => void
}

export function LudoGame({ onBack }: Props) {
  const [paperId, setPaperId] = useState<PaperId>('A4')
  const [players, setPlayers] = useState<LudoPlayer[]>(() =>
    DEFAULT_LUDO_PLAYERS.map((p) => ({ ...p })),
  )
  const [title, setTitle] = useState('Ludo')

  const grid = useMemo(() => buildLudoGrid(players), [players])

  function updatePlayer(id: LudoPlayer['id'], name: string) {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)))
  }

  function colorFor(player?: LudoPlayer['id']) {
    return players.find((p) => p.id === player)?.color
  }

  return (
    <div className="app">
      <GameShell
        paperId={paperId}
        title="Ludo"
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
        </section>

        <section className="panel">
          <h2>Spillere</h2>
          <p className="hint">Gi lagene egne navn til trykk.</p>
          {players.map((p) => (
            <label key={p.id} className="player-field">
              <span
                className="player-swatch"
                style={{ background: p.color }}
                aria-hidden
              />
              <input
                className="field-input"
                value={p.name}
                onChange={(e) => updatePlayer(p.id, e.target.value)}
              />
            </label>
          ))}
        </section>

        <section className="panel">
          <h2>Slik spiller du</h2>
          <p className="hint">
            Klassisk ludo-brett med fire hjem, sikkerhetsruter og midtfelt.
            Skriv ut og spill med egne brikker.
          </p>
        </section>
      </GameShell>

      <PaperStage paperId={paperId}>
        <div className="ludo-board">
          <p className="ludo-title">{title}</p>
          <div className="ludo-grid">
            {grid.map((row, r) =>
              row.map((cell, c) => {
                const bg =
                  cell.kind === 'yard' ||
                  cell.kind === 'home-stretch' ||
                  cell.kind === 'safe'
                    ? colorFor(cell.player)
                    : undefined
                return (
                  <div
                    key={`${r}-${c}`}
                    className={`ludo-cell ludo-${cell.kind}`}
                    style={
                      bg
                        ? {
                            background: `color-mix(in srgb, ${bg} 55%, #f3efe6)`,
                          }
                        : undefined
                    }
                  />
                )
              }),
            )}
          </div>
          <div className="ludo-legend">
            {players.map((p) => (
              <span key={p.id} className="ludo-legend-item">
                <i style={{ background: p.color }} />
                {p.name}
              </span>
            ))}
          </div>
        </div>
      </PaperStage>
    </div>
  )
}
