export type LudoColor = 'red' | 'green' | 'yellow' | 'blue'

export interface LudoPlayer {
  id: LudoColor
  name: string
  color: string
}

export const DEFAULT_LUDO_PLAYERS: LudoPlayer[] = [
  { id: 'red', name: 'Rød', color: '#c43c2c' },
  { id: 'green', name: 'Grønn', color: '#2a7a52' },
  { id: 'yellow', name: 'Gul', color: '#d4a017' },
  { id: 'blue', name: 'Blå', color: '#2f6f9a' },
]

/** 15×15 classic Ludo layout cell kinds. */
export type LudoCellKind =
  | 'void'
  | 'yard'
  | 'path'
  | 'safe'
  | 'home-stretch'
  | 'center'

export type LudoArrow = 'up' | 'down' | 'left' | 'right'

export interface LudoCell {
  kind: LudoCellKind
  player?: LudoColor
  /** Direction marker on start / entry cells. */
  arrow?: LudoArrow
  /** True for the four classic star-safe squares. */
  star?: boolean
}

export interface LudoYard {
  player: LudoColor
  /** Top-left cell of the 6×6 yard. */
  row: number
  col: number
}

export const LUDO_YARDS: LudoYard[] = [
  { player: 'red', row: 0, col: 0 },
  { player: 'green', row: 0, col: 9 },
  { player: 'yellow', row: 9, col: 0 },
  { player: 'blue', row: 9, col: 9 },
]

export function buildLudoGrid(_players: LudoPlayer[]): LudoCell[][] {
  const n = 15
  const grid: LudoCell[][] = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => ({ kind: 'void' as const })),
  )

  for (const y of LUDO_YARDS) {
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 6; c++) {
        grid[y.row + r]![y.col + c] = { kind: 'yard', player: y.player }
      }
    }
  }

  // Cross path: rows 6–8 and cols 6–8
  for (let i = 0; i < n; i++) {
    for (const r of [6, 7, 8]) {
      grid[r]![i] = { kind: 'path' }
    }
    for (const c of [6, 7, 8]) {
      grid[i]![c] = { kind: 'path' }
    }
  }

  // Home stretches toward center
  for (let i = 1; i <= 5; i++) {
    grid[7]![i] = { kind: 'home-stretch', player: 'red' }
    grid[i]![7] = { kind: 'home-stretch', player: 'green' }
    grid[7]![14 - i] = { kind: 'home-stretch', player: 'blue' }
    grid[14 - i]![7] = { kind: 'home-stretch', player: 'yellow' }
  }

  // Start / safe cells with direction into the track
  grid[6]![1] = { kind: 'safe', player: 'red', arrow: 'right', star: true }
  grid[1]![8] = { kind: 'safe', player: 'green', arrow: 'down', star: true }
  grid[8]![13] = { kind: 'safe', player: 'blue', arrow: 'left', star: true }
  grid[13]![6] = { kind: 'safe', player: 'yellow', arrow: 'up', star: true }

  // Extra classic safe stars on the outer track
  grid[8]![2] = { kind: 'safe', star: true }
  grid[2]![6] = { kind: 'safe', star: true }
  grid[6]![12] = { kind: 'safe', star: true }
  grid[12]![8] = { kind: 'safe', star: true }

  // Center hub (rendered as wedges overlay; cells keep kind for layout)
  for (let r = 6; r <= 8; r++) {
    for (let c = 6; c <= 8; c++) {
      grid[r]![c] = { kind: 'center' }
    }
  }

  return grid
}
