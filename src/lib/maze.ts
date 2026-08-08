/** Recursive-backtracker maze. Each cell has walls: N E S W. */

export interface MazeCell {
  n: boolean
  e: boolean
  s: boolean
  w: boolean
}

export type MazeGrid = MazeCell[][]

export function createMaze(rows: number, cols: number, seed = Date.now()): MazeGrid {
  const rnd = mulberry32(seed >>> 0)
  const grid: MazeGrid = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      n: true,
      e: true,
      s: true,
      w: true,
    })),
  )

  const visited = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => false),
  )

    function carve(r: number, c: number) {
    visited[r]![c] = true
    const dirs: Array<{
      dr: number
      dc: number
      wall: keyof MazeCell
      opp: keyof MazeCell
    }> = [
      { dr: 0, dc: -1, wall: 'w' as const, opp: 'e' as const },
      { dr: 0, dc: 1, wall: 'e' as const, opp: 'w' as const },
      { dr: -1, dc: 0, wall: 'n' as const, opp: 's' as const },
      { dr: 1, dc: 0, wall: 's' as const, opp: 'n' as const },
    ]
    dirs.sort(() => rnd() - 0.5)

    for (const { dr, dc, wall, opp } of dirs) {
      const nr = r + dr
      const nc = c + dc
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue
      if (visited[nr]![nc]) continue
      grid[r]![c]![wall] = false
      grid[nr]![nc]![opp] = false
      carve(nr, nc)
    }
  }

  carve(0, 0)
  // Open entrance / exit
  grid[0]![0]!.n = false
  grid[rows - 1]![cols - 1]!.s = false
  return grid
}

function mulberry32(a: number) {
  return function next() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
