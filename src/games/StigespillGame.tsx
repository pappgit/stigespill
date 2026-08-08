import { useState } from 'react'
import { Board } from '../components/Board'
import { Sidebar } from '../components/Sidebar'
import { ToolDock } from '../components/ToolDock'
import { PaperStage } from '../components/PaperStage'
import { useBoardEditor } from '../lib/useBoardEditor'

interface Props {
  onBack: () => void
}

export function StigespillGame({ onBack }: Props) {
  const {
    state,
    setPaper,
    setGrid,
    setTool,
    dragStart,
    dragCancel,
    dropConnector,
    placeEffect,
    eraseAt,
    removeConnector,
    removeEffect,
    clearAll,
  } = useBoardEditor()

  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <div className="app">
      <Sidebar
        paperId={state.paperId}
        board={state.board}
        connectors={state.connectors}
        effects={state.effects}
        selectedId={selectedId}
        message={state.message}
        onPaperChange={setPaper}
        onGridChange={setGrid}
        onBack={onBack}
        onRemoveConnector={(id) => {
          removeConnector(id)
          setSelectedId(null)
        }}
        onRemoveEffect={removeEffect}
        onClear={() => {
          clearAll()
          setSelectedId(null)
        }}
      />

      <PaperStage
        paperId={state.paperId}
        toolbar={<ToolDock activeTool={state.activeTool} onToolChange={setTool} />}
      >
        <Board
          board={state.board}
          connectors={state.connectors}
          effects={state.effects}
          activeTool={state.activeTool}
          dragFrom={state.dragFrom}
          onDragStart={dragStart}
          onDropConnector={dropConnector}
          onDragCancel={dragCancel}
          onPlaceEffect={placeEffect}
          onEraseAt={eraseAt}
          selectedId={selectedId}
          onSelectConnector={(id) => {
            if (id) {
              removeConnector(id)
              setSelectedId(null)
            } else {
              setSelectedId(null)
            }
          }}
        />
      </PaperStage>
    </div>
  )
}
