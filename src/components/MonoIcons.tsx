import type { MonoSpace } from '../lib/monopol'

/** Decorative icons for special Monopol spaces. */
export function MonoIcon({ group, className }: { group: string; className?: string }) {
  const common = {
    className,
    viewBox: '0 0 48 48',
    fill: 'none',
    'aria-hidden': true as const,
  }

  switch (group) {
    case 'corner-go':
      return (
        <svg {...common}>
          <path
            d="M8 34 L24 10 L40 34 Z"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M18 34 V40 H30 V34" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="24" cy="26" r="3" fill="currentColor" />
        </svg>
      )
    case 'corner-jail':
      return (
        <svg {...common}>
          <rect x="10" y="12" width="28" height="26" rx="2" stroke="currentColor" strokeWidth="2.5" />
          <path
            d="M18 12 V38 M24 12 V38 M30 12 V38"
            stroke="currentColor"
            strokeWidth="2.2"
          />
          <circle cx="24" cy="28" r="4" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    case 'corner-park':
      return (
        <svg {...common}>
          <circle cx="24" cy="18" r="8" stroke="currentColor" strokeWidth="2.5" />
          <path d="M24 26 V40 M16 34 H32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path
            d="M12 20 Q18 10 24 18 Q30 10 36 20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'corner-gojail':
      return (
        <svg {...common}>
          <path
            d="M10 30 L24 14 L38 30"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M24 18 V36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M16 36 H32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="34" cy="14" r="5" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    case 'chance':
      return (
        <svg {...common}>
          <rect x="10" y="8" width="28" height="34" rx="3" stroke="currentColor" strokeWidth="2.5" />
          <path
            d="M18 20 Q24 12 30 20 Q24 26 24 30"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="24" cy="36" r="2" fill="currentColor" />
        </svg>
      )
    case 'tax':
      return (
        <svg {...common}>
          <path
            d="M12 36 L24 8 L36 36 Z"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M20 28 H28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      )
    case 'rail':
      return (
        <svg {...common}>
          <path d="M8 32 H40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M12 32 V38 M24 32 V38 M36 32 V38" stroke="currentColor" strokeWidth="2.2" />
          <rect x="14" y="14" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="18" cy="32" r="3.5" fill="currentColor" />
          <circle cx="30" cy="32" r="3.5" fill="currentColor" />
        </svg>
      )
    case 'util':
      return (
        <svg {...common}>
          <path
            d="M26 6 L14 26 H24 L20 42 L36 20 H26 Z"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinejoin="round"
            fill="currentColor"
            fillOpacity="0.15"
          />
        </svg>
      )
    default:
      return null
  }
}

export function iconGroupFor(space: MonoSpace): string | null {
  if (space.id === 'go') return 'corner-go'
  if (space.id === 'jail') return 'corner-jail'
  if (space.id === 'park') return 'corner-park'
  if (space.id === 'gojail') return 'corner-gojail'
  if (space.group === 'chance') return 'chance'
  if (space.group === 'tax') return 'tax'
  if (space.group === 'rail') return 'rail'
  if (space.group === 'util') return 'util'
  return null
}

/** Which board edge a cell sits on — for text orientation. */
export function monopolEdge(index: number): 'bottom' | 'right' | 'top' | 'left' {
  if (index <= 10) return 'bottom'
  if (index <= 20) return 'right'
  if (index <= 30) return 'top'
  return 'left'
}

export function isPropertyGroup(group: string): boolean {
  return [
    'brown',
    'lightblue',
    'pink',
    'orange',
    'red',
    'yellow',
    'green',
    'darkblue',
  ].includes(group)
}
