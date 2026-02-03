import { useState, useEffect, useMemo, useCallback } from 'react'
import { PLAYERS } from '../const'
import { checkWinner } from '../logic/board'
import confetti from 'canvas-confetti'

export function use3EnRaya() {
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

  const isDraw = useMemo(() => {
    return board.every(square => square !== null)
  }, [board])
  
  const updateBoard = useMemo(() => (index) => {
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
    if (isDraw) {
      setWinner(false)
      return
    }
    const newTurn = turn === PLAYERS.x ? PLAYERS.o : PLAYERS.x
    setTurn(newTurn)
  }, [board, turn, winner, isDraw])

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null))
    setTurn(PLAYERS.x)
    setWinner(null)
  }, [])
  return { board, turn, winner, updateBoard, resetGame }
}