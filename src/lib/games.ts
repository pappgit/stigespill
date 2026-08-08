export type GameId =
  | 'stigespill'
  | 'bilbingo'
  | 'labyrint'
  | 'femFeil'
  | 'ludo'
  | 'monopol'

export interface GameDef {
  id: GameId
  title: string
  blurb: string
  glyph: string
}

export const GAMES: GameDef[] = [
  {
    id: 'stigespill',
    title: 'Stigespill',
    blurb: 'Lag stiger, slanger og spesialruter på papirformat til trykk.',
    glyph: '⇅',
  },
  {
    id: 'ludo',
    title: 'Ludo',
    blurb: 'Premium ludo-brett med egne lagnavn, farger og midttittel.',
    glyph: '✦',
  },
  {
    id: 'monopol',
    title: 'Monopol',
    blurb: 'Eget eiendomsbrett — rediger gatenavn og priser.',
    glyph: '⌂',
  },
  {
    id: 'bilbingo',
    title: 'Bilbingo',
    blurb: 'Reisebingo til bilen — velg rutenett og kryss av det dere ser.',
    glyph: '▣',
  },
  {
    id: 'labyrint',
    title: 'Labyrint',
    blurb: 'Generer en labyrint i valgt størrelse og papirformat.',
    glyph: '⧉',
  },
  {
    id: 'femFeil',
    title: 'Finn fem feil',
    blurb: 'To bilder side om side — plasser opptil fem forskjeller.',
    glyph: '5',
  },
]

export function getGame(id: GameId): GameDef {
  const game = GAMES.find((g) => g.id === id)
  if (!game) throw new Error(`Unknown game: ${id}`)
  return game
}
