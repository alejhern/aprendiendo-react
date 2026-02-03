import { use3EnRaya } from './hooks/use3EnRaya'
import { Square } from './components/Square'
import { Board } from './components/Board'
import { PLAYERS } from './const'
import './App.css'

function App() {
  const { board, turn, winner, updateBoard, resetGame } = use3EnRaya()

  return (
    <main className="board">
      <h1>3 EN RAYA</h1>
      <button className='reset-button' onClick={resetGame}>Reiniciar juego</button>
      <Board board={board} updateBoard={updateBoard} />
      <section className="turn">
        <Square isSelected={turn === PLAYERS.x}>{PLAYERS.x}</Square>
        <Square isSelected={turn === PLAYERS.o}>{PLAYERS.o}</Square>
      </section>
      {winner !== null && (
        <section className="winner">
            <h2>
              {
                winner == false ? 'Empate' : 'Hay un ganador'
              }
            </h2>
            <header className="win">
              {winner && <Square>{winner}</Square>}
            </header>
        </section>
      )}
    </main>
  )
}

export default App
