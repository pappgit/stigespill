import { getTool, TOOLS, type ToolId } from '../lib/tools'

interface Props {
  activeTool: ToolId
  onToolChange: (tool: ToolId) => void
}

export function ToolDock({ activeTool, onToolChange }: Props) {
  const active = getTool(activeTool)

  const placeHint =
    activeTool === 'connector'
      ? active.description
      : activeTool === 'erase'
        ? 'Trykk på en rute for å slette det som ligger der.'
        : `Trykk på en rute for å plassere «${active.label}».`

  return (
    <div className="tool-dock">
      <div className="tool-dock-head">
        <h2>Verktøy</h2>
        <p className="tool-dock-hint">{placeHint}</p>
      </div>
      <div className="tool-dock-scroller" role="toolbar" aria-label="Brettverktøy">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            type="button"
            className={`tool-dock-btn tool-${tool.id}${activeTool === tool.id ? ' active' : ''}`}
            aria-pressed={activeTool === tool.id}
            onClick={() => onToolChange(tool.id)}
          >
            <span className="tool-dock-glyph" aria-hidden>
              {tool.glyph}
            </span>
            <span className="tool-dock-label">{tool.short}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
