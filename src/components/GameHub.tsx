import { GAMES, type GameId } from '../lib/games'

interface Props {
  onSelect: (id: GameId) => void
}

export function GameHub({ onSelect }: Props) {
  return (
    <div className="hub">
      <header className="hub-hero">
        <p className="hub-brand">Pappgit</p>
        <h1 className="hub-title">Spill til trykk</h1>
        <p className="hub-lead">
          Velg spill, papirstørrelse og innhold — lag ark klare for nedlasting
          og trykkeri.
        </p>
      </header>

      <ul className="hub-grid">
        {GAMES.map((game) => (
          <li key={game.id}>
            <button
              type="button"
              className="hub-card"
              onClick={() => onSelect(game.id)}
            >
              <span className="hub-glyph" aria-hidden>
                {game.glyph}
              </span>
              <span className="hub-card-copy">
                <span className="hub-card-title">{game.title}</span>
                <span className="hub-card-blurb">{game.blurb}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
