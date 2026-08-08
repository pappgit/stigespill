export type ToolId =
  | 'connector'
  | 'diceGate'
  | 'backToStart'
  | 'extraTurn'
  | 'skipTurn'
  | 'boost'
  | 'erase'

export type EffectKind = Exclude<ToolId, 'connector' | 'erase'>

export interface ToolDef {
  id: ToolId
  label: string
  short: string
  description: string
  /** Shown on the cell when placed. */
  glyph: string
}

export const TOOLS: ToolDef[] = [
  {
    id: 'connector',
    label: 'Stige / slange',
    short: 'Stige',
    description:
      'Dobbelttrykk start-rute, deretter dra eller trykk målrute. På mus kan du også dra direkte.',
    glyph: '⇅',
  },
  {
    id: 'diceGate',
    label: 'Terningport',
    short: 'Terning',
    description: 'Må slå over 4 for å gå videre fra denne ruten.',
    glyph: '⚄',
  },
  {
    id: 'backToStart',
    label: 'Tilbake til start',
    short: 'Start',
    description: 'Spilleren sendes tilbake til rute 1.',
    glyph: '↩',
  },
  {
    id: 'extraTurn',
    label: 'Ekstra kast',
    short: 'Ekstra',
    description: 'Spilleren får kaste terningen på nytt.',
    glyph: '+',
  },
  {
    id: 'skipTurn',
    label: 'Mist en tur',
    short: 'Pause',
    description: 'Spilleren mister neste tur.',
    glyph: '⊘',
  },
  {
    id: 'boost',
    label: 'Hopp frem',
    short: '+3',
    description: 'Spilleren hopper tre ruter frem.',
    glyph: '»',
  },
  {
    id: 'erase',
    label: 'Viskelær',
    short: 'Slett',
    description: 'Trykk på en rute for å fjerne effekt, stige eller slange.',
    glyph: '×',
  },
]

export const EFFECT_TOOLS: EffectKind[] = [
  'diceGate',
  'backToStart',
  'extraTurn',
  'skipTurn',
  'boost',
]

export function getTool(id: ToolId): ToolDef {
  const tool = TOOLS.find((t) => t.id === id)
  if (!tool) throw new Error(`Unknown tool: ${id}`)
  return tool
}

export function isEffectTool(id: ToolId): id is EffectKind {
  return EFFECT_TOOLS.includes(id as EffectKind)
}
