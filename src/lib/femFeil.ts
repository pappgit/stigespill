export type DiffKind = 'missing' | 'recolor' | 'extra'

export interface SceneItem {
  id: string
  kind: 'house' | 'tree' | 'car' | 'sun' | 'bird' | 'cloud'
  x: number
  y: number
  color: string
}

export interface Difference {
  id: string
  itemId: string
  kind: DiffKind
  /** For recolor */
  color?: string
  /** For extra — position override */
  x?: number
  y?: number
}

export const SCENE_COLORS = ['#2f6b4f', '#c45c26', '#3d6b8f', '#8a6a1f', '#b33a2b', '#5a4a7a']

export function defaultScene(): SceneItem[] {
  return [
    { id: 'sun', kind: 'sun', x: 0.82, y: 0.14, color: '#d4a017' },
    { id: 'cloud', kind: 'cloud', x: 0.22, y: 0.16, color: '#dfe8e4' },
    { id: 'house', kind: 'house', x: 0.28, y: 0.58, color: '#c45c26' },
    { id: 'tree', kind: 'tree', x: 0.62, y: 0.55, color: '#2f6b4f' },
    { id: 'car', kind: 'car', x: 0.7, y: 0.78, color: '#3d6b8f' },
    { id: 'bird', kind: 'bird', x: 0.48, y: 0.28, color: '#1a2e28' },
    { id: 'tree2', kind: 'tree', x: 0.12, y: 0.62, color: '#3d7a55' },
  ]
}

export function createDiffId(): string {
  return `d-${crypto.randomUUID()}`
}
