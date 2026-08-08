import { totalCells, type BoardConfig } from './board'
import type { Connector } from './connectors'
import { getTool, type EffectKind } from './tools'

export interface CellEffect {
  id: string
  cell: number
  kind: EffectKind
}

export function createEffectId(): string {
  return `e-${crypto.randomUUID()}`
}

export function effectLabel(kind: EffectKind): string {
  return getTool(kind).label
}

export function validateEffectPlacement(
  cell: number,
  config: BoardConfig,
  connectors: Connector[],
  effects: CellEffect[],
  excludeId?: string,
): { ok: true } | { ok: false; reason: string } {
  const max = totalCells(config)

  if (cell < 1 || cell > max) {
    return { ok: false, reason: 'Rutenummer utenfor brettet.' }
  }
  if (cell === 1 || cell === max) {
    return { ok: false, reason: 'Kan ikke legge effekt på start eller mål.' }
  }

  for (const c of connectors) {
    if (c.from === cell || c.to === cell) {
      return { ok: false, reason: 'Ruten er allerede brukt av en stige eller slange.' }
    }
  }

  for (const e of effects) {
    if (excludeId && e.id === excludeId) continue
    if (e.cell === cell) {
      return { ok: false, reason: 'Ruten har allerede en effekt.' }
    }
  }

  return { ok: true }
}

export function upsertEffect(
  effects: CellEffect[],
  cell: number,
  kind: EffectKind,
  config: BoardConfig,
  connectors: Connector[],
): { effects: CellEffect[]; error?: string } {
  const check = validateEffectPlacement(cell, config, connectors, effects)
  if (!check.ok) {
    return { effects, error: check.reason }
  }
  return {
    effects: [...effects, { id: createEffectId(), cell, kind }],
  }
}
