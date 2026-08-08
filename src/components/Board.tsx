import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { coordToNumber, type BoardConfig } from '../lib/board'
import type { Connector } from '../lib/connectors'
import type { CellEffect } from '../lib/effects'
import { getTool, isEffectTool, type EffectKind, type ToolId } from '../lib/tools'
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

const DOUBLE_TAP_MS = 450

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

function isTouchLike(pointerType: string): boolean {
  return pointerType === 'touch' || pointerType === 'pen'
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
  const armedFrom = useRef<number | null>(null)
  const lastTap = useRef<{ cell: number; at: number } | null>(null)
  const [hoverCell, setHoverCell] = useState<number | null>(null)
  const [armedCell, setArmedCell] = useState<number | null>(null)
  const [hint, setHint] = useState<string | null>(null)

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

  function clearArm() {
    armedFrom.current = null
    setArmedCell(null)
  }

  function armCell(n: number) {
    armedFrom.current = n
    setArmedCell(n)
    onDragStart(n)
    setHint('Start valgt — dra eller trykk på målruten')
  }

  function finishDraw(clientX: number, clientY: number) {
    const from = drawingFrom.current
    drawingFrom.current = null
    setHoverCell(null)

    if (from == null || !boardRef.current) {
      onDragCancel()
      clearArm()
      setHint(null)
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
      // Keep arm on touch so user can try again
      if (armedFrom.current != null) {
        onDragStart(armedFrom.current)
        setHint('Prøv igjen — dra eller trykk på en annen rute')
      } else {
        onDragCancel()
        setHint(null)
      }
      return
    }

    onDropConnector(from, to)
    clearArm()
    setHint(null)
    lastTap.current = null
  }

  function beginDraw(from: number, pointerId: number, hover: number) {
    boardRef.current?.setPointerCapture(pointerId)
    drawingFrom.current = from
    setHoverCell(hover)
    onDragStart(from)
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

  function handleConnectorPointerDown(
    e: ReactPointerEvent,
    n: number,
  ) {
    e.preventDefault()
    e.stopPropagation()

    // Mouse / trackpad: single press-drag (desktop)
    if (!isTouchLike(e.pointerType)) {
      clearArm()
      setHint(null)
      beginDraw(n, e.pointerId, n)
      return
    }

    const now = performance.now()
    const prev = lastTap.current
    const isDouble =
      prev != null && prev.cell === n && now - prev.at < DOUBLE_TAP_MS

    // Already armed: start drag from armed start toward this cell
    if (armedFrom.current != null) {
      if (armedFrom.current === n && isDouble) {
        // Double-tap armed cell again → cancel
        clearArm()
        onDragCancel()
        setHint('Valg avbrutt')
        lastTap.current = null
        return
      }
      beginDraw(armedFrom.current, e.pointerId, n)
      lastTap.current = null
      return
    }

    if (isDouble) {
      armCell(n)
      lastTap.current = null
      return
    }

    lastTap.current = { cell: n, at: now }
    setHint('Dobbelttrykk en rute for å starte stigen')
  }

  return (
    <div className="board-shell">
      {isConnectorMode && (
        <p className="board-hint" role="status">
          {hint ??
            'Mobil: dobbelttrykk start-rute, deretter dra eller trykk målrute. Mus: dra direkte.'}
        </p>
      )}
      <div
        ref={boardRef}
        className={[
          'board',
          dragFrom != null || armedCell != null ? 'board-drawing' : '',
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
          const cell = cellFromPoint(
            boardRef.current,
            e.clientX,
            e.clientY,
            board.cols,
            board.rows,
          )
          setHoverCell(cell)
        }}
        onPointerUp={(e) => {
          if (drawingFrom.current == null) return
          finishDraw(e.clientX, e.clientY)
        }}
        onPointerCancel={() => {
          if (drawingFrom.current == null) return
          drawingFrom.current = null
          setHoverCell(null)
          if (armedFrom.current != null) {
            onDragStart(armedFrom.current)
            setHint('Prøv igjen — dra eller trykk på en annen rute')
          } else {
            onDragCancel()
            setHint(null)
          }
        }}
      >
        {cells.map(({ n }) => {
          const isStart = n === 1
          const isEnd = n === board.rows * board.cols
          const isDragSource = dragFrom === n || armedCell === n
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
          const isArmed = armedCell === n && fillTone == null

          return (
            <div
              key={n}
              className={[
                'cell',
                isStart ? 'cell-start' : '',
                isEnd ? 'cell-end' : '',
                fillTone === 'ladder' ? 'cell-fill-ladder' : '',
                fillTone === 'snake' ? 'cell-fill-snake' : '',
                isArmed ? 'cell-armed' : '',
                effect ? `cell-effect cell-effect-${effect.kind}` : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onPointerDown={(e) => {
                if (e.button !== 0) return
                if (isConnectorMode) {
                  handleConnectorPointerDown(e, n)
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
                  <span className="cell-glyph">
                    {fillTone === 'ladder' ? '↑' : '↓'}
                  </span>
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
    </div>
  )
}
