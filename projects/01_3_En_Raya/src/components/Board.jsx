import { Square } from './Square'

export const Board = ({ board, updateBoard }) => {
  return (
    <section className="game-board">
      {board.map((value, index) => (
        <Square key={index} index={index} updateBoard={updateBoard}>
          {value}
        </Square>
      ))}
    </section>
  )
}
