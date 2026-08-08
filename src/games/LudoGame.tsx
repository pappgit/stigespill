import { useMemo, useState } from 'react'
import { GameShell } from '../components/GameShell'
import { PaperStage } from '../components/PaperStage'
import {
  buildLudoGrid,
  DEFAULT_LUDO_PLAYERS,
  LUDO_YARDS,
  type LudoArrow,
  type LudoPlayer,
} from '../lib/ludo'
import type { PaperId } from '../lib/paper'

interface Props {
  onBack: () => void
}

function ArrowGlyph({ dir }: { dir: LudoArrow }) {
  const points =
    dir === 'up'
      ? '12,4 20,18 4,18'
      : dir === 'down'
        ? '4,6 20,6 12,20'
        : dir === 'left'
          ? '18,4 18,20 4,12'
          : '6,4 20,12 6,20'

  return (
    <svg className="ludo-arrow" viewBox="0 0 24 24" aria-hidden>
      <polygon points={points} />
    </svg>
  )
}

function StarGlyph() {
  return (
    <svg className="ludo-star" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 2.4l2.7 6.2 6.7.6-5.1 4.4 1.6 6.5L12 16.8 6.1 20.1l1.6-6.5L2.6 9.2l6.7-.6L12 2.4z" />
    </svg>
  )
}

function CenterHub({ players }: { players: LudoPlayer[] }) {
  const byId = (id: LudoPlayer['id']) =>
    players.find((p) => p.id === id)?.color ?? '#888'

  return (
    <div className="ludo-center-hub" aria-hidden>
      <svg className="ludo-center-svg" viewBox="0 0 100 100">
        <polygon points="50,50 0,0 100,0" fill={byId('green')} />
        <polygon points="50,50 100,0 100,100" fill={byId('blue')} />
        <polygon points="50,50 100,100 0,100" fill={byId('yellow')} />
        <polygon points="50,50 0,100 0,0" fill={byId('red')} />
        <circle cx="50" cy="50" r="11" className="ludo-center-disc" />
        <text x="50" y="53.5" textAnchor="middle" className="ludo-center-label">
          HJEM
        </text>
      </svg>
    </div>
  )
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
            Klassisk ludo-brett med fire hjem, stjerneruter og midtfelt. Skriv
            ut og spill med egne brikker.
          </p>
        </section>
      </GameShell>

      <PaperStage paperId={paperId}>
        <div className="ludo-board">
          <header className="ludo-masthead">
            <p className="ludo-kicker">Pappgit</p>
            <p className="ludo-title">{title}</p>
          </header>

          <div className="ludo-playfield">
            <div className="ludo-grid">
              {grid.map((row, r) =>
                row.map((cell, c) => {
                  if (cell.kind === 'yard' || cell.kind === 'center') {
                    return (
                      <div
                        key={`${r}-${c}`}
                        className={`ludo-cell ludo-${cell.kind}`}
                      />
                    )
                  }

                  const tone = cell.player ? colorFor(cell.player) : undefined
                  const style =
                    cell.kind === 'home-stretch' && tone
                      ? {
                          background: `color-mix(in srgb, ${tone} 72%, #fff8f0)`,
                          borderColor: `color-mix(in srgb, ${tone} 55%, var(--ink))`,
                        }
                      : cell.kind === 'safe' && tone
                        ? {
                            background: `color-mix(in srgb, ${tone} 58%, #fff8f0)`,
                            borderColor: `color-mix(in srgb, ${tone} 45%, var(--ink))`,
                          }
                        : undefined

                  return (
                    <div
                      key={`${r}-${c}`}
                      className={`ludo-cell ludo-${cell.kind}${cell.star ? ' ludo-has-star' : ''}${cell.arrow ? ' ludo-has-arrow' : ''}`}
                      style={style}
                    >
                      {cell.arrow ? <ArrowGlyph dir={cell.arrow} /> : null}
                      {cell.star && !cell.arrow ? <StarGlyph /> : null}
                      {cell.star && cell.arrow ? (
                        <span className="ludo-start-mark">
                          <StarGlyph />
                        </span>
                      ) : null}
                    </div>
                  )
                }),
              )}
            </div>

            {LUDO_YARDS.map((yard) => {
              const player = players.find((p) => p.id === yard.player)!
              return (
                <div
                  key={yard.player}
                  className={`ludo-homebase ludo-homebase-${yard.player}`}
                  style={{ ['--yard' as string]: player.color }}
                >
                  <div className="ludo-homebase-frame">
                    <div className="ludo-homebase-inner">
                      <p className="ludo-homebase-name">{player.name}</p>
                      <div className="ludo-pads" aria-hidden>
                        {Array.from({ length: 4 }, (_, i) => (
                          <span key={i} className="ludo-pad" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            <CenterHub players={players} />
          </div>

          <footer className="ludo-legend">
            {players.map((p) => (
              <span key={p.id} className="ludo-legend-item">
                <i style={{ background: p.color }} />
                {p.name}
              </span>
            ))}
          </footer>
        </div>
      </PaperStage>
    </div>
  )
}
