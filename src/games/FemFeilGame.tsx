import { useState } from 'react'
import { GameShell } from '../components/GameShell'
import { PaperStage } from '../components/PaperStage'
import {
  createDiffId,
  defaultScene,
  SCENE_COLORS,
  type DiffKind,
  type Difference,
  type SceneItem,
} from '../lib/femFeil'
import type { PaperId } from '../lib/paper'

interface Props {
  onBack: () => void
}

function SceneSvg({
  items,
  diffs,
  side,
  onItemClick,
}: {
  items: SceneItem[]
  diffs: Difference[]
  side: 'left' | 'right'
  onItemClick?: (id: string) => void
}) {
  const visible = items.filter((item) => {
    if (side === 'left') return true
    const diff = diffs.find((d) => d.itemId === item.id)
    if (diff?.kind === 'missing') return false
    return true
  })

  const extras =
    side === 'right'
      ? diffs
          .filter((d) => d.kind === 'extra')
          .map((d) => {
            const base = items.find((i) => i.id === d.itemId)
            if (!base) return null
            return {
              ...base,
              id: `extra-${d.id}`,
              x: d.x ?? Math.min(0.9, base.x + 0.12),
              y: d.y ?? Math.min(0.9, base.y + 0.08),
              color: d.color ?? '#b33a2b',
            } satisfies SceneItem
          })
          .filter(Boolean)
      : []

  const draw = [...visible, ...(extras as SceneItem[])]

  return (
    <svg className="scene-svg" viewBox="0 0 1 1" preserveAspectRatio="none">
      <rect width="1" height="1" className="scene-sky" />
      <rect y="0.72" width="1" height="0.28" className="scene-ground" />
          {draw.map((item) => {
        const sourceId = item.id.startsWith('extra-')
          ? diffs.find((d) => `extra-${d.id}` === item.id)?.itemId
          : item.id
        const diff = sourceId
          ? diffs.find((d) => d.itemId === sourceId)
          : undefined
        const color =
          side === 'right' && diff?.kind === 'recolor' && diff.color
            ? diff.color
            : item.color
        return (
          <g
            key={item.id}
            transform={`translate(${item.x} ${item.y})`}
            className="scene-item"
            onClick={(e) => {
              e.stopPropagation()
              if (sourceId) onItemClick?.(sourceId)
            }}
            style={{ cursor: onItemClick ? 'pointer' : 'default' }}
          >
            <ItemShape kind={item.kind} color={color} />
          </g>
        )
      })}
    </svg>
  )
}

function ItemShape({
  kind,
  color,
}: {
  kind: SceneItem['kind']
  color: string
}) {
  switch (kind) {
    case 'sun':
      return <circle r="0.07" fill={color} />
    case 'cloud':
      return (
        <g fill={color}>
          <circle cx="-0.04" cy="0" r="0.035" />
          <circle cx="0.02" cy="-0.015" r="0.04" />
          <circle cx="0.06" cy="0.01" r="0.03" />
        </g>
      )
    case 'house':
      return (
        <g>
          <rect x="-0.06" y="-0.02" width="0.12" height="0.1" fill={color} />
          <polygon points="-0.075,-0.02 0,-0.1 0.075,-0.02" fill="#5a3a28" />
        </g>
      )
    case 'tree':
      return (
        <g>
          <rect x="-0.012" y="0.02" width="0.024" height="0.07" fill="#5a3a28" />
          <circle cy="-0.01" r="0.055" fill={color} />
        </g>
      )
    case 'car':
      return (
        <g fill={color}>
          <rect x="-0.07" y="-0.01" width="0.14" height="0.045" rx="0.01" />
          <rect x="-0.04" y="-0.04" width="0.08" height="0.035" rx="0.008" />
          <circle cx="-0.04" cy="0.04" r="0.018" fill="#1a2e28" />
          <circle cx="0.04" cy="0.04" r="0.018" fill="#1a2e28" />
        </g>
      )
    case 'bird':
      return (
        <path
          d="M -0.04 0 Q 0 -0.04 0.04 0 Q 0 -0.015 -0.04 0"
          fill="none"
          stroke={color}
          strokeWidth="0.012"
          strokeLinecap="round"
        />
      )
  }
}

export function FemFeilGame({ onBack }: Props) {
  const [paperId, setPaperId] = useState<PaperId>('A4')
  const [items] = useState(() => defaultScene())
  const [diffs, setDiffs] = useState<Difference[]>([])
  const [kind, setKind] = useState<DiffKind>('missing')
  const [recolor, setRecolor] = useState(SCENE_COLORS[1]!)
  const [message, setMessage] = useState<string | null>(null)

  function applyDiff(itemId: string) {
    const existing = diffs.find((d) => d.itemId === itemId)
    if (existing) {
      setDiffs((prev) => prev.filter((d) => d.itemId !== itemId))
      setMessage('Forskjell fjernet')
      return
    }
    if (diffs.length >= 5) {
      setMessage('Maks fem feil — fjern en først.')
      return
    }
    const next: Difference = {
      id: createDiffId(),
      itemId,
      kind,
      color: kind === 'recolor' || kind === 'extra' ? recolor : undefined,
    }
    setDiffs((prev) => [...prev, next])
    setMessage(null)
  }

  return (
    <div className="app">
      <GameShell
        paperId={paperId}
        title="Finn fem feil"
        onPaperChange={setPaperId}
        onBack={onBack}
      >
        <section className="panel">
          <h2>Type forskjell</h2>
          <div className="chip-row">
            {(
              [
                ['missing', 'Fjern'],
                ['recolor', 'Ny farge'],
                ['extra', 'Ekstra'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={kind === id ? 'chip active' : 'chip'}
                onClick={() => setKind(id)}
              >
                {label}
              </button>
            ))}
          </div>
          {(kind === 'recolor' || kind === 'extra') && (
            <div className="chip-row" style={{ marginTop: '0.45rem' }}>
              {SCENE_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={recolor === c ? 'chip active' : 'chip'}
                  style={{ background: recolor === c ? c : undefined }}
                  onClick={() => setRecolor(c)}
                  aria-label={c}
                >
                  ■
                </button>
              ))}
            </div>
          )}
          <p className="hint" style={{ marginTop: '0.55rem' }}>
            Trykk et objekt i høyre bilde for å legge til/fjerne feil.
          </p>
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>Feil ({diffs.length}/5)</h2>
            {diffs.length > 0 && (
              <button type="button" className="text-btn" onClick={() => setDiffs([])}>
                Tøm
              </button>
            )}
          </div>
          {diffs.length === 0 ? (
            <p className="hint">Ingen forskjeller ennå.</p>
          ) : (
            <ul className="connector-list">
              {diffs.map((d) => {
                const item = items.find((i) => i.id === d.itemId)
                return (
                  <li key={d.id}>
                    <span className="badge effect-diceGate">{d.kind}</span>
                    <span className="range">{item?.kind ?? d.itemId}</span>
                    <button
                      type="button"
                      className="text-btn"
                      onClick={() =>
                        setDiffs((prev) => prev.filter((x) => x.id !== d.id))
                      }
                    >
                      Fjern
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
          {message && <p className="toast">{message}</p>}
        </section>
      </GameShell>

      <PaperStage paperId={paperId}>
        <div className="femfeil-board">
          <div className="femfeil-panel">
            <p className="femfeil-label">Original</p>
            <SceneSvg items={items} diffs={diffs} side="left" />
          </div>
          <div className="femfeil-panel">
            <p className="femfeil-label">Finn fem feil</p>
            <SceneSvg
              items={items}
              diffs={diffs}
              side="right"
              onItemClick={applyDiff}
            />
          </div>
        </div>
      </PaperStage>
    </div>
  )
}
