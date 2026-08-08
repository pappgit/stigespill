import { useCallback, useReducer } from 'react'
import { DEFAULT_BOARD, type BoardConfig } from './board'
import {
  upsertConnector,
  type Connector,
} from './connectors'
import type { PaperId } from './paper'

export interface EditorState {
  paperId: PaperId
  board: BoardConfig
  connectors: Connector[]
  /** Cell being dragged from (1-based), or null. */
  dragFrom: number | null
  message: string | null
}

type Action =
  | { type: 'setPaper'; paperId: PaperId }
  | { type: 'setGrid'; rows: number; cols: number }
  | { type: 'dragStart'; from: number }
  | { type: 'dragCancel' }
  | { type: 'drop'; to: number }
  | { type: 'remove'; id: string }
  | { type: 'clearConnectors' }
  | { type: 'clearMessage' }

const initialState: EditorState = {
  paperId: 'A4',
  board: DEFAULT_BOARD,
  connectors: [],
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
        dragFrom: null,
        message: 'Rutenett endret — stiger/slanger er nullstilt.',
      }
    case 'dragStart':
      return { ...state, dragFrom: action.from, message: null }
    case 'dragCancel':
      return { ...state, dragFrom: null }
    case 'drop': {
      if (state.dragFrom == null) return state
      const result = upsertConnector(
        state.connectors,
        state.dragFrom,
        action.to,
        state.board,
      )
      return {
        ...state,
        connectors: result.connectors,
        dragFrom: null,
        message: result.error ?? null,
      }
    }
    case 'remove':
      return {
        ...state,
        connectors: state.connectors.filter((c) => c.id !== action.id),
        message: null,
      }
    case 'clearConnectors':
      return { ...state, connectors: [], message: null }
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

  const dragStart = useCallback((from: number) => {
    dispatch({ type: 'dragStart', from })
  }, [])

  const dragCancel = useCallback(() => {
    dispatch({ type: 'dragCancel' })
  }, [])

  const drop = useCallback((to: number) => {
    dispatch({ type: 'drop', to })
  }, [])

  const remove = useCallback((id: string) => {
    dispatch({ type: 'remove', id })
  }, [])

  const clearConnectors = useCallback(() => {
    dispatch({ type: 'clearConnectors' })
  }, [])

  const clearMessage = useCallback(() => {
    dispatch({ type: 'clearMessage' })
  }, [])

  return {
    state,
    setPaper,
    setGrid,
    dragStart,
    dragCancel,
    drop,
    remove,
    clearConnectors,
    clearMessage,
  }
}
