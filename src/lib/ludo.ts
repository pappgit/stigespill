export type LudoColor = 'red' | 'green' | 'yellow' | 'blue'

export interface LudoPlayer {
  id: LudoColor
  name: string
  color: string
}

export const DEFAULT_LUDO_PLAYERS: LudoPlayer[] = [
  { id: 'red', name: 'Rød', color: '#b33a2b' },
  { id: 'green', name: 'Grønn', color: '#2f6b4f' },
  { id: 'yellow', name: 'Gul', color: '#c9a227' },
  { id: 'blue', name: 'Blå', color: '#3d6b8f' },
]

/** 15×15 classic Ludo layout cell kinds. */
export type LudoCellKind =
  | 'void'
  | 'yard'
  | 'path'
  | 'safe'
  | 'home-stretch'
  | 'center'

export interface LudoCell {
  kind: LudoCellKind
  player?: LudoColor
}

export function buildLudoGrid(players: LudoPlayer[]): LudoCell[][] {
  const n = 15
  const grid: LudoCell[][] = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => ({ kind: 'void' as const })),
  )

  const yards: Array<{ r: number; c: number; player: LudoColor }> = [
    { r: 0, c: 0, player: 'red' },
    { r: 0, c: 9, player: 'green' },
    { r: 9, c: 0, player: 'yellow' },
    { r: 9, c: 9, player: 'blue' },
  ]

  for (const y of yards) {
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 6; c++) {
        grid[y.r + r]![y.c + c] = { kind: 'yard', player: y.player }
      }
    }
  }

  // Cross path: rows 6-8 and cols 6-8
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
    grid[7]![i] = { kind: 'home-stretch', player: 'red' } // from left
    grid[i]![7] = { kind: 'home-stretch', player: 'green' } // from top
    grid[7]![14 - i] = { kind: 'home-stretch', player: 'blue' } // from right
    grid[14 - i]![7] = { kind: 'home-stretch', player: 'yellow' } // from bottom
  }

  // Safe / start cells
  grid[6]![1] = { kind: 'safe', player: 'red' }
  grid[1]![8] = { kind: 'safe', player: 'green' }
  grid[8]![13] = { kind: 'safe', player: 'blue' }
  grid[13]![6] = { kind: 'safe', player: 'yellow' }

  // Center
  for (let r = 6; r <= 8; r++) {
    for (let c = 6; c <= 8; c++) {
      grid[r]![c] = { kind: 'center' }
    }
  }

  void players
  return grid
}
