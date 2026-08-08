import { totalCells, type BoardConfig } from './board'

export type ConnectorKind = 'ladder' | 'snake'

export interface Connector {
  id: string
  from: number
  to: number
}

export function connectorKind(c: Connector): ConnectorKind {
  return c.to > c.from ? 'ladder' : 'snake'
}

export function createConnectorId(): string {
  return `c-${crypto.randomUUID()}`
}

export interface ValidationResult {
  ok: boolean
  reason?: string
}

export function validateConnector(
  from: number,
  to: number,
  config: BoardConfig,
  existing: Connector[],
  excludeId?: string,
): ValidationResult {
  const max = totalCells(config)

  if (from === to) {
    return { ok: false, reason: 'Start og slutt må være ulike ruter.' }
  }
  if (from < 1 || from > max || to < 1 || to > max) {
    return { ok: false, reason: 'Rutenummer utenfor brettet.' }
  }
  if (from === max || to === 1) {
    return { ok: false, reason: 'Kan ikke starte på siste rute eller ende på start.' }
  }

  const occupied = new Set<number>()
  for (const c of existing) {
    if (excludeId && c.id === excludeId) continue
    occupied.add(c.from)
    occupied.add(c.to)
  }
  if (occupied.has(from) || occupied.has(to)) {
    return { ok: false, reason: 'En av rutene har allerede en stige eller slange.' }
  }

  return { ok: true }
}

export function upsertConnector(
  connectors: Connector[],
  from: number,
  to: number,
  config: BoardConfig,
): { connectors: Connector[]; error?: string } {
  const check = validateConnector(from, to, config, connectors)
  if (!check.ok) {
    return { connectors, error: check.reason }
  }
  return {
    connectors: [...connectors, { id: createConnectorId(), from, to }],
  }
}
