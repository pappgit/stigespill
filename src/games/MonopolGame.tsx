import { useState } from 'react'
import { GameShell } from '../components/GameShell'
import {
  iconGroupFor,
  isPropertyGroup,
  MonoIcon,
  monopolEdge,
} from '../components/MonoIcons'
import { PaperStage } from '../components/PaperStage'
import {
  defaultMonopolBoard,
  monopolCellPosition,
  type MonoSpace,
} from '../lib/monopol'
import type { PaperId } from '../lib/paper'

interface Props {
  onBack: () => void
}

export function MonopolGame({ onBack }: Props) {
  const [paperId, setPaperId] = useState<PaperId>('A3')
  const [spaces, setSpaces] = useState<MonoSpace[]>(() => defaultMonopolBoard())
  const [title, setTitle] = useState('OSLO')
  const [subtitle, setSubtitle] = useState('Eiendomsbrett')
  const [selected, setSelected] = useState<number | null>(null)

  function updateSpace(index: number, patch: Partial<MonoSpace>) {
    setSpaces((prev) =>
      prev.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    )
  }

  const selectedSpace = selected != null ? spaces[selected] : null

  return (
    <div className="app">
      <GameShell
        paperId={paperId}
        title="Monopol"
        onPaperChange={setPaperId}
        onBack={onBack}
      >
        <section className="panel">
          <h2>Brett</h2>
          <input
            className="field-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tittel i midten"
          />
          <input
            className="field-input"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Undertittel"
          />
          <p className="hint">Eget eiendomsbrett — ikke et offisielt Monopoly-produkt.</p>
        </section>

        <section className="panel">
          <h2>Rute</h2>
          {selectedSpace == null ? (
            <p className="hint">Trykk en rute på brettet for å redigere.</p>
          ) : (
            <>
              <p className="meta">Rute {selected! + 1} · {selectedSpace.group}</p>
              <input
                className="field-input"
                value={selectedSpace.name}
                onChange={(e) => updateSpace(selected!, { name: e.target.value })}
                placeholder="Navn"
              />
              <input
                className="field-input"
                value={selectedSpace.price}
                onChange={(e) => updateSpace(selected!, { price: e.target.value })}
                placeholder="Pris (valgfritt)"
              />
            </>
          )}
          <button
            type="button"
            className="chip"
            style={{ marginTop: '0.45rem' }}
            onClick={() => {
              setSpaces(defaultMonopolBoard())
              setSelected(null)
              setTitle('OSLO')
              setSubtitle('Eiendomsbrett')
            }}
          >
            Tilbakestill Oslo-tema
          </button>
        </section>
      </GameShell>

      <PaperStage paperId={paperId}>
        <div className="mono-board">
          <div className="mono-center">
            <img
              className="mono-center-art"
              src={`${import.meta.env.BASE_URL}monopol-center.jpg`}
              alt=""
            />
            <div className="mono-center-veil" aria-hidden />
            <div className="mono-center-copy">
              <p className="mono-center-kicker">Pappgit</p>
              <p className="mono-center-title">{title}</p>
              <p className="mono-center-sub">{subtitle}</p>
            </div>
          </div>

          {spaces.map((space, index) => {
            const { row, col } = monopolCellPosition(index)
            const edge = monopolEdge(index)
            const isCorner = space.group === 'corner'
            const icon = iconGroupFor(space)
            const property = isPropertyGroup(space.group)

            return (
              <button
                key={space.id}
                type="button"
                className={[
                  'mono-cell',
                  `mono-edge-${edge}`,
                  isCorner ? 'corner' : '',
                  property ? 'property' : 'special',
                  `g-${space.group}`,
                  selected === index ? 'selected' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={{
                  gridRow: row + 1,
                  gridColumn: col + 1,
                  ['--mono-color' as string]: space.color,
                }}
                onClick={() => setSelected(index)}
              >
                <span className="mono-cell-inner">
                  {property && <span className="mono-stripe" />}
                  {icon && (
                    <span className="mono-icon-wrap">
                      <MonoIcon group={icon} className="mono-icon" />
                    </span>
                  )}
                  <span className="mono-name">{space.name}</span>
                  {space.price ? (
                    <span className="mono-price">{space.price}</span>
                  ) : null}
                </span>
              </button>
            )
          })}
        </div>
      </PaperStage>
    </div>
  )
}
