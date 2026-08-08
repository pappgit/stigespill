import { useState } from 'react'
import { Board } from './components/Board'
import { Sidebar } from './components/Sidebar'
import { getPaper } from './lib/paper'
import { useBoardEditor } from './lib/useBoardEditor'
import './App.css'

export default function App() {
  const {
    state,
    setPaper,
    setGrid,
    dragStart,
    dragCancel,
    drop,
    remove,
    clearConnectors,
  } = useBoardEditor()

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const paper = getPaper(state.paperId)

  return (
    <div className="app">
      <Sidebar
        paperId={state.paperId}
        board={state.board}
        connectors={state.connectors}
        selectedId={selectedId}
        message={state.message}
        onPaperChange={setPaper}
        onGridChange={setGrid}
        onRemove={(id) => {
          remove(id)
          setSelectedId(null)
        }}
        onClear={() => {
          clearConnectors()
          setSelectedId(null)
        }}
      />

      <main className="stage">
        <div
          className="paper-frame"
          style={{ aspectRatio: `${paper.widthMm} / ${paper.heightMm}` }}
          data-paper={paper.id}
        >
          <div className="paper-label">
            {paper.id} · {paper.widthMm}×{paper.heightMm} mm
          </div>
          <div className="board-wrap">
            <Board
              board={state.board}
              connectors={state.connectors}
              dragFrom={state.dragFrom}
              onDragStart={dragStart}
              onDrop={drop}
              onDragCancel={dragCancel}
              selectedId={selectedId}
              onSelectConnector={(id) => {
                if (id) {
                  remove(id)
                  setSelectedId(null)
                } else {
                  setSelectedId(null)
                }
              }}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
