export interface MonoSpace {
  id: string
  name: string
  price: string
  group: string
  color: string
}

/** Classic 40-space board order: GO → … clockwise. */
export function defaultMonopolBoard(): MonoSpace[] {
  return [
    { id: 'go', name: 'START', price: '', group: 'corner', color: '#1a2e28' },
    { id: 'b1', name: 'Storgata', price: '60', group: 'brown', color: '#6b3a2a' },
    { id: 'c1', name: 'Premie', price: '', group: 'chance', color: '#3d6b8f' },
    { id: 'b2', name: 'Kirkegata', price: '60', group: 'brown', color: '#6b3a2a' },
    { id: 'tax1', name: 'Skatt', price: '200', group: 'tax', color: '#4a635c' },
    { id: 'r1', name: 'T-bane', price: '200', group: 'rail', color: '#1a2e28' },
    { id: 'lb1', name: 'Grünerløkka', price: '100', group: 'lightblue', color: '#7eb6d9' },
    { id: 'c2', name: 'Sjanse', price: '', group: 'chance', color: '#c45c26' },
    { id: 'lb2', name: 'Torshov', price: '100', group: 'lightblue', color: '#7eb6d9' },
    { id: 'lb3', name: 'Sagene', price: '120', group: 'lightblue', color: '#7eb6d9' },
    { id: 'jail', name: 'FENGSEL', price: '', group: 'corner', color: '#1a2e28' },
    { id: 'p1', name: 'Majorstuen', price: '140', group: 'pink', color: '#c45a8a' },
    { id: 'u1', name: 'Strøm', price: '150', group: 'util', color: '#8a6a1f' },
    { id: 'p2', name: 'Frogner', price: '140', group: 'pink', color: '#c45a8a' },
    { id: 'p3', name: 'Bygdøy', price: '160', group: 'pink', color: '#c45a8a' },
    { id: 'r2', name: 'Trikk', price: '200', group: 'rail', color: '#1a2e28' },
    { id: 'o1', name: 'Grønland', price: '180', group: 'orange', color: '#c45c26' },
    { id: 'c3', name: 'Premie', price: '', group: 'chance', color: '#3d6b8f' },
    { id: 'o2', name: 'Tøyen', price: '180', group: 'orange', color: '#c45c26' },
    { id: 'o3', name: 'Kampen', price: '200', group: 'orange', color: '#c45c26' },
    { id: 'park', name: 'PARKERING', price: '', group: 'corner', color: '#1a2e28' },
    { id: 'r3', name: 'Karl Johan', price: '220', group: 'red', color: '#b33a2b' },
    { id: 'c4', name: 'Sjanse', price: '', group: 'chance', color: '#c45c26' },
    { id: 'r4', name: 'Aker Brygge', price: '220', group: 'red', color: '#b33a2b' },
    { id: 'r5', name: 'Operaen', price: '240', group: 'red', color: '#b33a2b' },
    { id: 'r6', name: 'Buss', price: '200', group: 'rail', color: '#1a2e28' },
    { id: 'y1', name: 'Holmenkollen', price: '260', group: 'yellow', color: '#c9a227' },
    { id: 'y2', name: 'Vigelandsparken', price: '260', group: 'yellow', color: '#c9a227' },
    { id: 'u2', name: 'Vann', price: '150', group: 'util', color: '#8a6a1f' },
    { id: 'y3', name: 'Fornebu', price: '280', group: 'yellow', color: '#c9a227' },
    { id: 'gojail', name: 'GÅ I FENGSEL', price: '', group: 'corner', color: '#1a2e28' },
    { id: 'g1', name: 'Bjørvika', price: '300', group: 'green', color: '#2f6b4f' },
    { id: 'g2', name: 'Sørenga', price: '300', group: 'green', color: '#2f6b4f' },
    { id: 'c5', name: 'Premie', price: '', group: 'chance', color: '#3d6b8f' },
    { id: 'g3', name: 'Barcode', price: '320', group: 'green', color: '#2f6b4f' },
    { id: 'r7', name: 'Ferge', price: '200', group: 'rail', color: '#1a2e28' },
    { id: 'c6', name: 'Sjanse', price: '', group: 'chance', color: '#c45c26' },
    { id: 'db1', name: 'Slottsparken', price: '350', group: 'darkblue', color: '#2a3d6b' },
    { id: 'tax2', name: 'Luksus', price: '100', group: 'tax', color: '#4a635c' },
    { id: 'db2', name: 'Slottet', price: '400', group: 'darkblue', color: '#2a3d6b' },
  ]
}

/**
 * Map board index 0..39 to CSS grid row/col on an 11×11 board.
 * GO at bottom-left, then clockwise: bottom → right → top → left.
 */
export function monopolCellPosition(index: number): { row: number; col: number } {
  if (index < 0 || index > 39) throw new Error('Bad monopol index')
  if (index <= 10) {
    return { row: 10, col: index }
  }
  if (index <= 20) {
    return { row: 10 - (index - 10), col: 10 }
  }
  if (index <= 30) {
    return { row: 0, col: 10 - (index - 20) }
  }
  return { row: index - 30, col: 0 }
}
