import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { Square } from './components/Square'
import { Board } from './components/Board'
import { checkWinner } from './logic/board'
import './App.css'

const PLAYERS = {
  x: '❌',
  o: '⭕'
}  


function App() {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')
    return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null)
  })
  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ? turnFromStorage : PLAYERS.x
  })
  const [winner, setWinner] = useState(null)
  
  useEffect(() => {
    window.localStorage.setItem('board', JSON.stringify(board))
    window.localStorage.setItem('turn', turn)
  }, [turn, board])

  useEffect(() => {
    if (winner === null) return
    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')
  }, [winner])

  const isDraw = (newBoard) => {
    return newBoard.every(square => square !== null)
  }
  
  const updateBoard = (index) => {
    if (board[index] || winner) return
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)
    const newWinner = checkWinner(newBoard)
    if (newWinner) {
      setWinner(newWinner)
      confetti() 
      return
    }
    if (isDraw(newBoard)) {
      setWinner(false)
      return
    }
    const newTurn = turn === PLAYERS.x ? PLAYERS.o : PLAYERS.x
    setTurn(newTurn)
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(PLAYERS.x)
    setWinner(null)
  }

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
