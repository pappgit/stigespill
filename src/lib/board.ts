/**
 * Classic snakes-and-ladders grid: rows × cols cells, numbered 1..N
 * in boustrophedon (zigzag) order starting bottom-left.
 */

export interface BoardConfig {
  rows: number
  cols: number
}

export interface CellCoord {
  row: number
  col: number
}

/** 1-based cell number → row/col (row 0 = top visually). */
export function numberToCoord(n: number, config: BoardConfig): CellCoord {
  const { rows, cols } = config
  const total = rows * cols
  if (n < 1 || n > total) {
    throw new Error(`Cell ${n} out of range 1..${total}`)
  }
  const indexFromBottom = n - 1
  const rowFromBottom = Math.floor(indexFromBottom / cols)
  const row = rows - 1 - rowFromBottom
  const posInRow = indexFromBottom % cols
  const leftToRight = rowFromBottom % 2 === 0
  const col = leftToRight ? posInRow : cols - 1 - posInRow
  return { row, col }
}

/** row/col → 1-based cell number. */
export function coordToNumber(coord: CellCoord, config: BoardConfig): number {
  const { rows, cols } = config
  const rowFromBottom = rows - 1 - coord.row
  const leftToRight = rowFromBottom % 2 === 0
  const posInRow = leftToRight ? coord.col : cols - 1 - coord.col
  return rowFromBottom * cols + posInRow + 1
}

export function totalCells(config: BoardConfig): number {
  return config.rows * config.cols
}

/** Centre of a cell as fraction of board (0–1), for SVG overlays. */
export function cellCenter(n: number, config: BoardConfig): { x: number; y: number } {
  const { row, col } = numberToCoord(n, config)
  return {
    x: (col + 0.5) / config.cols,
    y: (row + 0.5) / config.rows,
  }
}

/**
 * Point near the edge of a cell, in the direction of another cell.
 * `pad` is how far from center as a fraction of cell size (0.45 ≈ near edge).
 */
export function cellEdgeToward(
  from: number,
  to: number,
  config: BoardConfig,
  pad = 0.45,
): { x: number; y: number } {
  const a = cellCenter(from, config)
  const b = cellCenter(to, config)
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy) || 1
  const cellSize = Math.min(1 / config.cols, 1 / config.rows)
  const dist = cellSize * pad
  return {
    x: a.x + (dx / len) * dist,
    y: a.y + (dy / len) * dist,
  }
}

export const DEFAULT_BOARD: BoardConfig = { rows: 10, cols: 10 }
