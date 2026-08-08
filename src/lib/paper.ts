/** ISO 216 paper sizes in millimetres (portrait). */
export type PaperId = 'A5' | 'A4' | 'A3' | 'A2' | 'A1'

export interface PaperSize {
  id: PaperId
  label: string
  widthMm: number
  heightMm: number
}

export const PAPER_SIZES: PaperSize[] = [
  { id: 'A5', label: 'A5', widthMm: 148, heightMm: 210 },
  { id: 'A4', label: 'A4', widthMm: 210, heightMm: 297 },
  { id: 'A3', label: 'A3', widthMm: 297, heightMm: 420 },
  { id: 'A2', label: 'A2', widthMm: 420, heightMm: 594 },
  { id: 'A1', label: 'A1', widthMm: 594, heightMm: 841 },
]

export function getPaper(id: PaperId): PaperSize {
  const paper = PAPER_SIZES.find((p) => p.id === id)
  if (!paper) throw new Error(`Unknown paper size: ${id}`)
  return paper
}

/** Aspect ratio height / width for portrait orientation. */
export function paperAspect(paper: PaperSize): number {
  return paper.heightMm / paper.widthMm
}
