import { useState } from 'react'
import { GameHub } from './components/GameHub'
import { BilbingoGame } from './games/BilbingoGame'
import { FemFeilGame } from './games/FemFeilGame'
import { LabyrintGame } from './games/LabyrintGame'
import { LudoGame } from './games/LudoGame'
import { MonopolGame } from './games/MonopolGame'
import { StigespillGame } from './games/StigespillGame'
import type { GameId } from './lib/games'
import './App.css'

export default function App() {
  const [game, setGame] = useState<GameId | null>(null)

  if (game == null) {
    return <GameHub onSelect={setGame} />
  }

  const back = () => setGame(null)

  switch (game) {
    case 'stigespill':
      return <StigespillGame onBack={back} />
    case 'ludo':
      return <LudoGame onBack={back} />
    case 'monopol':
      return <MonopolGame onBack={back} />
    case 'bilbingo':
      return <BilbingoGame onBack={back} />
    case 'labyrint':
      return <LabyrintGame onBack={back} />
    case 'femFeil':
      return <FemFeilGame onBack={back} />
  }
}
