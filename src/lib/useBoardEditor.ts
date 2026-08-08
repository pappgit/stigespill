import { useCallback, useReducer } from 'react'
import { DEFAULT_BOARD, type BoardConfig } from './board'
import { upsertConnector, type Connector } from './connectors'
import { upsertEffect, type CellEffect } from './effects'
import type { PaperId } from './paper'
import { isEffectTool, type EffectKind, type ToolId } from './tools'

export interface EditorState {
  paperId: PaperId
  board: BoardConfig
  connectors: Connector[]
  effects: CellEffect[]
  activeTool: ToolId
  dragFrom: number | null
  message: string | null
}

type Action =
  | { type: 'setPaper'; paperId: PaperId }
  | { type: 'setGrid'; rows: number; cols: number }
  | { type: 'setTool'; tool: ToolId }
  | { type: 'dragStart'; from: number }
  | { type: 'dragCancel' }
  | { type: 'dropConnector'; from: number; to: number }
  | { type: 'placeEffect'; cell: number; kind: EffectKind }
  | { type: 'eraseAt'; cell: number }
  | { type: 'removeConnector'; id: string }
  | { type: 'removeEffect'; id: string }
  | { type: 'clearAll' }
  | { type: 'clearMessage' }

const initialState: EditorState = {
  paperId: 'A4',
  board: DEFAULT_BOARD,
  connectors: [],
  effects: [],
  activeTool: 'connector',
  dragFrom: null,
  message: null,
}

function reducer(state: EditorState, action: Action): EditorState {
  switch (action.type) {
    case 'setPaper':
      return { ...state, paperId: action.paperId, message: null }
    case 'setGrid':
      return {
        ...state,
        board: { rows: action.rows, cols: action.cols },
        connectors: [],
        effects: [],
        dragFrom: null,
        message: 'Rutenett endret — brettet er nullstilt.',
      }
    case 'setTool':
      return {
        ...state,
        activeTool: action.tool,
        dragFrom: null,
        message: null,
      }
    case 'dragStart':
      return { ...state, dragFrom: action.from, message: null }
    case 'dragCancel':
      return { ...state, dragFrom: null }
    case 'dropConnector': {
      const result = upsertConnector(
        state.connectors,
        action.from,
        action.to,
        state.board,
        state.effects,
      )
      return {
        ...state,
        connectors: result.connectors,
        dragFrom: null,
        message: result.error ?? null,
      }
    }
    case 'placeEffect': {
      const result = upsertEffect(
        state.effects,
        action.cell,
        action.kind,
        state.board,
        state.connectors,
      )
      return {
        ...state,
        effects: result.effects,
        message: result.error ?? null,
      }
    }
    case 'eraseAt': {
      const connectors = state.connectors.filter(
        (c) => c.from !== action.cell && c.to !== action.cell,
      )
      const effects = state.effects.filter((e) => e.cell !== action.cell)
      const removed =
        connectors.length !== state.connectors.length ||
        effects.length !== state.effects.length
      return {
        ...state,
        connectors,
        effects,
        message: removed ? null : 'Ingenting å slette på denne ruten.',
      }
    }
    case 'removeConnector':
      return {
        ...state,
        connectors: state.connectors.filter((c) => c.id !== action.id),
        message: null,
      }
    case 'removeEffect':
      return {
        ...state,
        effects: state.effects.filter((e) => e.id !== action.id),
        message: null,
      }
    case 'clearAll':
      return {
        ...state,
        connectors: [],
        effects: [],
        dragFrom: null,
        message: null,
      }
    case 'clearMessage':
      return { ...state, message: null }
    default:
      return state
  }
}

export function useBoardEditor() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const setPaper = useCallback((paperId: PaperId) => {
    dispatch({ type: 'setPaper', paperId })
  }, [])

  const setGrid = useCallback((rows: number, cols: number) => {
    dispatch({ type: 'setGrid', rows, cols })
  }, [])

  const setTool = useCallback((tool: ToolId) => {
    dispatch({ type: 'setTool', tool })
  }, [])

  const dragStart = useCallback((from: number) => {
    dispatch({ type: 'dragStart', from })
  }, [])

  const dragCancel = useCallback(() => {
    dispatch({ type: 'dragCancel' })
  }, [])

  const dropConnector = useCallback((from: number, to: number) => {
    dispatch({ type: 'dropConnector', from, to })
  }, [])

  const placeEffect = useCallback((cell: number, kind: EffectKind) => {
    dispatch({ type: 'placeEffect', cell, kind })
  }, [])

  const placeActiveEffect = useCallback(
    (cell: number) => {
      if (!isEffectTool(state.activeTool)) return
      dispatch({ type: 'placeEffect', cell, kind: state.activeTool })
    },
    [state.activeTool],
  )

  const eraseAt = useCallback((cell: number) => {
    dispatch({ type: 'eraseAt', cell })
  }, [])

  const removeConnector = useCallback((id: string) => {
    dispatch({ type: 'removeConnector', id })
  }, [])

  const removeEffect = useCallback((id: string) => {
    dispatch({ type: 'removeEffect', id })
  }, [])

  const clearAll = useCallback(() => {
    dispatch({ type: 'clearAll' })
  }, [])

  const clearMessage = useCallback(() => {
    dispatch({ type: 'clearMessage' })
  }, [])

  return {
    state,
    setPaper,
    setGrid,
    setTool,
    dragStart,
    dragCancel,
    dropConnector,
    placeEffect,
    placeActiveEffect,
    eraseAt,
    removeConnector,
    removeEffect,
    clearAll,
    clearMessage,
  }
}
