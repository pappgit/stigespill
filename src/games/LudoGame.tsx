import { useMemo, useState, type CSSProperties } from 'react'
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
      ? '12,3.5 21,19 3,19'
      : dir === 'down'
        ? '3,5 21,5 12,20.5'
        : dir === 'left'
          ? '19,3 19,21 3.5,12'
          : '5,3 20.5,12 5,21'

  return (
    <svg className="ludo-arrow" viewBox="0 0 24 24" aria-hidden>
      <polygon points={points} />
    </svg>
  )
}

function StarGlyph() {
  return (
    <svg className="ludo-star" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 1.8l2.95 6.55 7.15.68-5.4 4.7 1.7 6.95L12 17.2 5.6 20.68l1.7-6.95-5.4-4.7 7.15-.68L12 1.8z" />
    </svg>
  )
}

/** Bold outline of the classic Ludo cross path. */
function PathCrossOutline() {
  // 15×15 grid units; path occupies rows/cols 6–8 (0-indexed)
  const a = (6 / 15) * 100
  const b = (9 / 15) * 100
  const d = `M0 ${a}H${a}V0H${b}V${a}H100V${b}H${b}V100H${a}V${b}H0Z`
  return (
    <svg className="ludo-cross-outline" viewBox="0 0 100 100" aria-hidden>
      <path d={d} className="ludo-cross-fill" />
      <path d={d} className="ludo-cross-stroke" />
    </svg>
  )
}

function CenterHub({
  players,
  title,
  subtitle,
}: {
  players: LudoPlayer[]
  title: string
  subtitle: string
}) {
  const byId = (id: LudoPlayer['id']) =>
    players.find((p) => p.id === id)?.color ?? '#888'

  const wedges: Array<{ player: LudoPlayer['id']; points: string }> = [
    { player: 'green', points: '50,50 0,0 100,0' },
    { player: 'blue', points: '50,50 100,0 100,100' },
    { player: 'yellow', points: '50,50 100,100 0,100' },
    { player: 'red', points: '50,50 0,100 0,0' },
  ]

  const label = (title || 'Ludo').trim()
  const sub = subtitle.trim()
  // Fit long titles by shrinking letter-spacing / size via class
  const titleLen = label.length

  return (
    <div className="ludo-center-hub" aria-hidden>
      <svg className="ludo-center-svg" viewBox="0 0 100 100">
        {wedges.map((w) => (
          <polygon
            key={w.player}
            points={w.points}
            fill={byId(w.player)}
            className="ludo-center-wedge"
          />
        ))}
        <line x1="50" y1="50" x2="0" y2="0" className="ludo-center-seam" />
        <line x1="50" y1="50" x2="100" y2="0" className="ludo-center-seam" />
        <line x1="50" y1="50" x2="100" y2="100" className="ludo-center-seam" />
        <line x1="50" y1="50" x2="0" y2="100" className="ludo-center-seam" />

        <circle cx="50" cy="50" r="27" className="ludo-center-ring-outer" />
        <circle cx="50" cy="50" r="25.2" className="ludo-center-disc" />
        <circle cx="50" cy="50" r="23.4" className="ludo-center-ring-inner" />

        <text
          x="50"
          y={sub ? 43.5 : 47}
          textAnchor="middle"
          className="ludo-svg-kicker"
        >
          Pappgit
        </text>
        <text
          x="50"
          y={sub ? 56 : 58}
          textAnchor="middle"
          className={
            titleLen > 10 ? 'ludo-svg-title ludo-svg-title-long' : 'ludo-svg-title'
          }
        >
          {label.toUpperCase()}
        </text>
        {sub ? (
          <text x="50" y="65.5" textAnchor="middle" className="ludo-svg-sub">
            {sub.toUpperCase()}
          </text>
        ) : null}
      </svg>
    </div>
  )
}

export function LudoGame({ onBack }: Props) {
  const [paperId, setPaperId] = useState<PaperId>('A3')
  const [players, setPlayers] = useState<LudoPlayer[]>(() =>
    DEFAULT_LUDO_PLAYERS.map((p) => ({ ...p })),
  )
  const [title, setTitle] = useState('Ludo')
  const [subtitle, setSubtitle] = useState('Familiebrett')

  const grid = useMemo(() => buildLudoGrid(players), [players])

  function updatePlayer(
    id: LudoPlayer['id'],
    patch: Partial<Pick<LudoPlayer, 'name' | 'color'>>,
  ) {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
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
          <h2>Brett</h2>
          <input
            className="field-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tittel i midten"
          />
          <input
            className="field-input"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Undertittel"
          />
        </section>

        <section className="panel">
          <h2>Spillere</h2>
          <p className="hint">Navn og farger til trykk.</p>
          {players.map((p) => (
            <label key={p.id} className="player-field">
              <input
                type="color"
                className="player-color"
                value={p.color}
                onChange={(e) => updatePlayer(p.id, { color: e.target.value })}
                aria-label={`Farge for ${p.name}`}
              />
              <input
                className="field-input"
                value={p.name}
                onChange={(e) => updatePlayer(p.id, { name: e.target.value })}
              />
            </label>
          ))}
          <button
            type="button"
            className="chip"
            style={{ marginTop: '0.25rem' }}
            onClick={() => {
              setPlayers(DEFAULT_LUDO_PLAYERS.map((p) => ({ ...p })))
              setTitle('Ludo')
              setSubtitle('Familiebrett')
            }}
          >
            Tilbakestill
          </button>
        </section>

        <section className="panel">
          <h2>Slik spiller du</h2>
          <ol className="steps">
            <li>Slå 6 for å få brikke ut fra hjem.</li>
            <li>Stjerneruter er trygge for alle.</li>
            <li>Første lag med alle fire hjemme vinner.</li>
          </ol>
        </section>
      </GameShell>

      <PaperStage paperId={paperId}>
        <div
          className="ludo-board"
          style={
            {
              ['--ludo-red' as string]: colorFor('red'),
              ['--ludo-green' as string]: colorFor('green'),
              ['--ludo-yellow' as string]: colorFor('yellow'),
              ['--ludo-blue' as string]: colorFor('blue'),
            } as CSSProperties
          }
        >
          <div className="ludo-board-wash" aria-hidden />
          <span className="ludo-frame-chip ludo-frame-chip-red" aria-hidden />
          <span className="ludo-frame-chip ludo-frame-chip-green" aria-hidden />
          <span className="ludo-frame-chip ludo-frame-chip-yellow" aria-hidden />
          <span className="ludo-frame-chip ludo-frame-chip-blue" aria-hidden />

          <div className="ludo-playfield">
            <PathCrossOutline />

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
                  const isStretch = cell.kind === 'home-stretch'
                  const isStart =
                    cell.kind === 'safe' && !!cell.arrow && !cell.star
                  const style =
                    (isStretch || isStart) && tone
                      ? ({
                          ['--cell' as string]: tone,
                        } as CSSProperties)
                      : undefined

                  return (
                    <div
                      key={`${r}-${c}`}
                      className={[
                        'ludo-cell',
                        `ludo-${cell.kind}`,
                        cell.star ? 'ludo-has-star' : '',
                        isStart ? 'ludo-start' : '',
                        isStretch ? 'ludo-stretch' : '',
                        isStretch && cell.stretchStep === 5
                          ? 'ludo-stretch-end'
                          : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      style={style}
                    >
                      {isStart && cell.arrow ? (
                        <ArrowGlyph dir={cell.arrow} />
                      ) : null}
                      {isStretch &&
                      cell.arrow &&
                      cell.stretchStep &&
                      cell.stretchStep % 2 === 1 ? (
                        <ArrowGlyph dir={cell.arrow} />
                      ) : null}
                      {cell.star ? <StarGlyph /> : null}
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
                      <div className="ludo-homebase-banner">
                        <p className="ludo-homebase-name">{player.name}</p>
                      </div>
                      <div className="ludo-pads" aria-hidden>
                        {Array.from({ length: 4 }, (_, i) => (
                          <span key={i} className="ludo-pad">
                            <span className="ludo-pad-core" />
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            <CenterHub players={players} title={title} subtitle={subtitle} />
          </div>
        </div>
      </PaperStage>
    </div>
  )
}
