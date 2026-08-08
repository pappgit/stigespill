import { useRef, useState } from 'react'
import { coordToNumber, type BoardConfig } from '../lib/board'
import type { Connector } from '../lib/connectors'
import type { CellEffect } from '../lib/effects'
import { getTool, isEffectTool, TOOL_MIME, type EffectKind, type ToolId } from '../lib/tools'
import { ConnectorLayer } from './ConnectorLayer'

interface Props {
  board: BoardConfig
  connectors: Connector[]
  effects: CellEffect[]
  activeTool: ToolId
  dragFrom: number | null
  onDragStart: (from: number) => void
  onDropConnector: (from: number, to: number) => void
  onDragCancel: () => void
  onPlaceEffect: (cell: number, kind: EffectKind) => void
  onEraseAt: (cell: number) => void
  selectedId: string | null
  onSelectConnector: (id: string | null) => void
}

function cellFromPoint(
  boardEl: HTMLElement,
  clientX: number,
  clientY: number,
  cols: number,
  rows: number,
): number | null {
  const rect = boardEl.getBoundingClientRect()
  if (rect.width <= 0 || rect.height <= 0) return null
  const x = (clientX - rect.left) / rect.width
  const y = (clientY - rect.top) / rect.height
  if (x < 0 || x >= 1 || y < 0 || y >= 1) return null
  const col = Math.min(cols - 1, Math.floor(x * cols))
  const row = Math.min(rows - 1, Math.floor(y * rows))
  return coordToNumber({ row, col }, { rows, cols })
}

export function Board({
  board,
  connectors,
  effects,
  activeTool,
  dragFrom,
  onDragStart,
  onDropConnector,
  onDragCancel,
  onPlaceEffect,
  onEraseAt,
  selectedId,
  onSelectConnector,
}: Props) {
  const boardRef = useRef<HTMLDivElement>(null)
  const drawingFrom = useRef<number | null>(null)
  const [hoverCell, setHoverCell] = useState<number | null>(null)
  const [paletteHover, setPaletteHover] = useState<number | null>(null)

  const effectByCell = new Map(effects.map((e) => [e.cell, e]))
  const connectorFromByCell = new Map<number, 'ladder' | 'snake'>()
  for (const c of connectors) {
    connectorFromByCell.set(c.from, c.to > c.from ? 'ladder' : 'snake')
  }

  const cells: { n: number; row: number; col: number }[] = []
  for (let row = 0; row < board.rows; row++) {
    for (let col = 0; col < board.cols; col++) {
      cells.push({ n: coordToNumber({ row, col }, board), row, col })
    }
  }

  const isConnectorMode = activeTool === 'connector'
  const isEraseMode = activeTool === 'erase'

  function finishDraw(clientX: number, clientY: number) {
    const from = drawingFrom.current
    drawingFrom.current = null
    setHoverCell(null)

    if (from == null || !boardRef.current) {
      onDragCancel()
      return
    }

    const to = cellFromPoint(
      boardRef.current,
      clientX,
      clientY,
      board.cols,
      board.rows,
    )

    if (to == null || to === from) {
      onDragCancel()
      return
    }

    onDropConnector(from, to)
  }

  function applyToolToCell(cell: number, tool: ToolId) {
    if (tool === 'erase') {
      onEraseAt(cell)
      return
    }
    if (isEffectTool(tool)) {
      onPlaceEffect(cell, tool)
    }
  }

  return (
    <div
      ref={boardRef}
      className={[
        'board',
        dragFrom != null ? 'board-drawing' : '',
        `tool-${activeTool}`,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        gridTemplateColumns: `repeat(${board.cols}, 1fr)`,
        gridTemplateRows: `repeat(${board.rows}, 1fr)`,
      }}
      onClick={() => {
        if (drawingFrom.current == null) onSelectConnector(null)
      }}
      onPointerMove={(e) => {
        if (drawingFrom.current == null || !boardRef.current) return
        const n = cellFromPoint(
          boardRef.current,
          e.clientX,
          e.clientY,
          board.cols,
          board.rows,
        )
        setHoverCell(n)
      }}
      onPointerUp={(e) => {
        if (drawingFrom.current == null) return
        finishDraw(e.clientX, e.clientY)
      }}
      onPointerCancel={() => {
        if (drawingFrom.current == null) return
        drawingFrom.current = null
        setHoverCell(null)
        onDragCancel()
      }}
      onDragOver={(e) => {
        const types = [...e.dataTransfer.types]
        if (!types.includes(TOOL_MIME) && !types.includes('text/plain')) return
        e.preventDefault()
        e.dataTransfer.dropEffect = 'copy'
        if (!boardRef.current) return
        setPaletteHover(
          cellFromPoint(
            boardRef.current,
            e.clientX,
            e.clientY,
            board.cols,
            board.rows,
          ),
        )
      }}
      onDragLeave={() => setPaletteHover(null)}
      onDrop={(e) => {
        const raw =
          e.dataTransfer.getData(TOOL_MIME) ||
          e.dataTransfer.getData('text/plain')
        if (!raw) return
        e.preventDefault()
        setPaletteHover(null)
        if (!boardRef.current) return
        const cell = cellFromPoint(
          boardRef.current,
          e.clientX,
          e.clientY,
          board.cols,
          board.rows,
        )
        if (cell == null) return
        applyToolToCell(cell, raw as ToolId)
      }}
    >
      {cells.map(({ n }) => {
        const isStart = n === 1
        const isEnd = n === board.rows * board.cols
        const isDragSource = dragFrom === n
        const effect = effectByCell.get(n)
        const placedTone = connectorFromByCell.get(n)

        let dragTone: 'ladder' | 'snake' | null = null
        if (
          isConnectorMode &&
          isDragSource &&
          dragFrom != null &&
          hoverCell != null &&
          hoverCell !== dragFrom
        ) {
          dragTone = hoverCell > dragFrom ? 'ladder' : 'snake'
        }

        const fillTone = dragTone ?? placedTone ?? null
        const isPaletteTarget = paletteHover === n

        return (
          <div
            key={n}
            className={[
              'cell',
              isStart ? 'cell-start' : '',
              isEnd ? 'cell-end' : '',
              fillTone === 'ladder' ? 'cell-fill-ladder' : '',
              fillTone === 'snake' ? 'cell-fill-snake' : '',
              effect ? `cell-effect cell-effect-${effect.kind}` : '',
              isPaletteTarget ? 'cell-palette-target' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onPointerDown={(e) => {
              if (e.button !== 0) return
              if (isConnectorMode) {
                e.preventDefault()
                boardRef.current?.setPointerCapture(e.pointerId)
                drawingFrom.current = n
                setHoverCell(n)
                onDragStart(n)
                return
              }
              if (isEraseMode || isEffectTool(activeTool)) {
                e.preventDefault()
                applyToolToCell(n, activeTool)
              }
            }}
          >
            {effect && (
              <span className="cell-fill" title={getTool(effect.kind).label}>
                <span className="cell-glyph">{getTool(effect.kind).glyph}</span>
              </span>
            )}
            {fillTone && !effect && (
              <span className="cell-fill" aria-hidden>
                <span className="cell-glyph">{fillTone === 'ladder' ? '↑' : '↓'}</span>
              </span>
            )}
            <span className="cell-number">{n}</span>
          </div>
        )
      })}

      <ConnectorLayer
        board={board}
        connectors={connectors}
        draftFrom={isConnectorMode ? dragFrom : null}
        draftTo={isConnectorMode ? hoverCell : null}
        selectedId={selectedId}
        onSelect={onSelectConnector}
      />
    </div>
  )
}
