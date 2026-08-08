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
 * Point slightly inset from cell center toward another cell,
 * so connector strokes clear the glyph in the filled start cell.
 */
export function cellEdgeToward(
  from: number,
  to: number,
  config: BoardConfig,
  inset = 0.32,
): { x: number; y: number } {
  const a = cellCenter(from, config)
  const b = cellCenter(to, config)
  return {
    x: a.x + (b.x - a.x) * inset,
    y: a.y + (b.y - a.y) * inset,
  }
}

export const DEFAULT_BOARD: BoardConfig = { rows: 10, cols: 10 }
