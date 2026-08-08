export const BILBINGO_PRESETS = [
  'Rød bil',
  'Blå bil',
  'Svart bil',
  'Hvit bil',
  'Motorsykkel',
  'Buss',
  'Lastebil',
  'Traktor',
  'Ambulanse',
  'Politi',
  'Brannbil',
  'Taxi',
  'Campervogn',
  'Syklist',
  'Fotgjenger',
  'Trafikklys',
  'Rundkjøring',
  'Bro',
  'Tunnel',
  'Kirke',
  'Bensinstasjon',
  'Butikk',
  'McDonald’s',
  'Fartsskilt',
  'Ku',
  'Hest',
  'Hund',
  'Elg-skilt',
  'Tog',
  'Båt',
  'Fly',
  'Anleggskjøretøy',
] as const

export type BingoSize = 3 | 4 | 5

export function emptyBingoCells(size: BingoSize): string[] {
  return Array.from({ length: size * size }, () => '')
}

export function fillBingoFromPool(size: BingoSize, pool: readonly string[]): string[] {
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  const cells = emptyBingoCells(size)
  for (let i = 0; i < cells.length; i++) {
    cells[i] = shuffled[i % shuffled.length] ?? ''
  }
  // Free center on odd sizes
  if (size % 2 === 1) {
    cells[Math.floor(cells.length / 2)] = 'GRATIS'
  }
  return cells
}
