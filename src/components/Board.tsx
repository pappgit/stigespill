import { useState } from 'react'
import { coordToNumber, type BoardConfig } from '../lib/board'
import type { Connector } from '../lib/connectors'
import { ConnectorLayer } from './ConnectorLayer'

interface Props {
  board: BoardConfig
  connectors: Connector[]
  dragFrom: number | null
  onDragStart: (from: number) => void
  onDrop: (to: number) => void
  onDragCancel: () => void
  selectedId: string | null
  onSelectConnector: (id: string | null) => void
}

export function Board({
  board,
  connectors,
  dragFrom,
  onDragStart,
  onDrop,
  onDragCancel,
  selectedId,
  onSelectConnector,
}: Props) {
  const [hoverCell, setHoverCell] = useState<number | null>(null)
  const occupied = new Set<number>()
  for (const c of connectors) {
    occupied.add(c.from)
    occupied.add(c.to)
  }

  const cells: { n: number; row: number; col: number }[] = []
  for (let row = 0; row < board.rows; row++) {
    for (let col = 0; col < board.cols; col++) {
      cells.push({ n: coordToNumber({ row, col }, board), row, col })
    }
  }

  return (
    <div
      className="board"
      style={{
        gridTemplateColumns: `repeat(${board.cols}, 1fr)`,
        gridTemplateRows: `repeat(${board.rows}, 1fr)`,
      }}
      onClick={() => onSelectConnector(null)}
    >
      {cells.map(({ n }) => {
        const isStart = n === 1
        const isEnd = n === board.rows * board.cols
        const isDragSource = dragFrom === n
        const isHover = hoverCell === n && dragFrom != null && dragFrom !== n
        const hasConnector = occupied.has(n)

        return (
          <div
            key={n}
            className={[
              'cell',
              isStart ? 'cell-start' : '',
              isEnd ? 'cell-end' : '',
              isDragSource ? 'cell-drag-source' : '',
              isHover ? 'cell-drop-target' : '',
              hasConnector ? 'cell-linked' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', String(n))
              e.dataTransfer.effectAllowed = 'link'
              onDragStart(n)
            }}
            onDragEnd={() => onDragCancel()}
            onDragOver={(e) => {
              e.preventDefault()
              e.dataTransfer.dropEffect = 'link'
              setHoverCell(n)
            }}
            onDragLeave={() => {
              setHoverCell((h) => (h === n ? null : h))
            }}
            onDrop={(e) => {
              e.preventDefault()
              setHoverCell(null)
              onDrop(n)
            }}
          >
            <span className="cell-number">{n}</span>
          </div>
        )
      })}

      <ConnectorLayer
        board={board}
        connectors={connectors}
        draftFrom={dragFrom}
        draftTo={hoverCell}
        selectedId={selectedId}
        onSelect={onSelectConnector}
      />
    </div>
  )
}
