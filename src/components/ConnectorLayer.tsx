import { cellCenter, cellEdgeToward, type BoardConfig } from '../lib/board'
import { connectorKind, type Connector } from '../lib/connectors'

interface Props {
  board: BoardConfig
  connectors: Connector[]
  draftFrom: number | null
  draftTo: number | null
  onSelect: (id: string) => void
  selectedId: string | null
}

function ladderPath(x1: number, y1: number, x2: number, y2: number): string {
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.hypot(dx, dy) || 1
  const px = (-dy / len) * 0.018
  const py = (dx / len) * 0.018
  const rungs = Math.max(3, Math.round(len * 12))
  let d = `M ${x1 + px} ${y1 + py} L ${x2 + px} ${y2 + py}`
  d += ` M ${x1 - px} ${y1 - py} L ${x2 - px} ${y2 - py}`
  for (let i = 1; i <= rungs; i++) {
    const t = i / (rungs + 1)
    const mx = x1 + dx * t
    const my = y1 + dy * t
    d += ` M ${mx + px} ${my + py} L ${mx - px} ${my - py}`
  }
  return d
}

function snakePath(x1: number, y1: number, x2: number, y2: number): string {
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.hypot(dx, dy) || 1
  const nx = -dy / len
  const ny = dx / len
  const amp = Math.min(0.035, len * 0.1)
  const mid1x = x1 + dx * 0.33 + nx * amp
  const mid1y = y1 + dy * 0.33 + ny * amp
  const mid2x = x1 + dx * 0.66 - nx * amp
  const mid2y = y1 + dy * 0.66 - ny * amp
  return `M ${x1} ${y1} C ${mid1x} ${mid1y}, ${mid2x} ${mid2y}, ${x2} ${y2}`
}

/** Start near the edge of the filled cell; end at the target centre. */
function endpoints(from: number, to: number, board: BoardConfig) {
  return {
    a: cellEdgeToward(from, to, board, 0.48),
    b: cellCenter(to, board),
  }
}

export function ConnectorLayer({
  board,
  connectors,
  draftFrom,
  draftTo,
  onSelect,
  selectedId,
}: Props) {
  return (
    <svg className="connector-layer" viewBox="0 0 1 1" preserveAspectRatio="none">
      {connectors.map((c) => {
        const { a, b } = endpoints(c.from, c.to, board)
        const kind = connectorKind(c)
        const selected = selectedId === c.id
        if (kind === 'ladder') {
          return (
            <path
              key={c.id}
              d={ladderPath(a.x, a.y, b.x, b.y)}
              className={`connector ladder${selected ? ' selected' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                onSelect(c.id)
              }}
            />
          )
        }
        return (
          <path
            key={c.id}
            d={snakePath(a.x, a.y, b.x, b.y)}
            className={`connector snake${selected ? ' selected' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              onSelect(c.id)
            }}
          />
        )
      })}
      {draftFrom != null && draftTo != null && draftFrom !== draftTo && (
        <path
          d={(() => {
            const { a, b } = endpoints(draftFrom, draftTo, board)
            return draftTo > draftFrom
              ? ladderPath(a.x, a.y, b.x, b.y)
              : snakePath(a.x, a.y, b.x, b.y)
          })()}
          className={`connector draft ${draftTo > draftFrom ? 'ladder' : 'snake'}`}
        />
      )}
    </svg>
  )
}
