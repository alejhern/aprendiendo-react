export const checkWinner = (board) => {
  let winner

  // Filas y columnas
  for (let i = 0; i < 3; i++) {

    // Comprobar fila i
    winner = board[i * 3]
    for (let j = 1; winner && j < 3; j++) {
      if (board[i * 3 + j] !== winner) {
        winner = null
      }
    }
    if (winner) return winner

    // Comprobar columna i
    winner = board[i]
    for (let j = 1; winner && j < 3; j++) {
      if (board[i + j * 3] !== winner) {
        winner = null
      }
    }
    if (winner) return winner
  }

  // Diagonal principal
  winner = board[0]
  for (let i = 1; winner && i < 3; i++) {
    if (board[i * 4] !== winner) {
      winner = null
    }
  }
  if (winner) return winner

  // Diagonal secundaria
  winner = board[2]
  for (let i = 1; winner && i < 3; i++) {
    if (board[i * 2 + 2] !== winner) {
      winner = null
    }
  }
  if (winner) return winner

  return null
}