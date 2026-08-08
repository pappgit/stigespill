import type { ReactNode } from 'react'
import { getPaper, type PaperId } from '../lib/paper'

interface Props {
  paperId: PaperId
  children: ReactNode
  toolbar?: ReactNode
}

export function PaperStage({ paperId, children, toolbar }: Props) {
  const paper = getPaper(paperId)

  return (
    <main className="stage">
      {toolbar}
      <div
        className="paper-frame"
        style={{ aspectRatio: `${paper.widthMm} / ${paper.heightMm}` }}
        data-paper={paper.id}
      >
        <div className="paper-label">
          {paper.id} · {paper.widthMm}×{paper.heightMm} mm
        </div>
        <div className="board-wrap">{children}</div>
      </div>
    </main>
  )
}
