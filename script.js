const gameBoard = (function () {
  let state = []

  function initialise(nodeList) {
    state = ["", "", "", "", "", "", "", "", ""]
    nodeList.forEach(square => {
      square.textContent = state[square.dataset.index]
    })
  }

  function getState() {
    return state
  }

  function setState(index, piece) {
    state[index] = piece
  }

  function render(nodeList) {
    nodeList.forEach(square => {
      square.textContent = state[square.dataset.index]
    })
  }

  return {
    initialise,
    getState,
    setState,
    render
  }
})()

const gameController = (function () {
  const comment = document.querySelector('.comment')
  const squareNodeList = document.querySelectorAll('.square')
  const reset = document.querySelector('.reset')
  reset.addEventListener('click', startGame)

  squareNodeList.forEach(square => {
    square.addEventListener('click', updateState)
  })

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [0, 4, 8],
    [2, 4, 6]
  ]

  function startGame() {
    move = 0
    gameOver = false
    gameBoard.initialise(squareNodeList)
    addMove()
    gameBoard.render(squareNodeList)
  }

  function checkLines(piece) {
    const state = gameBoard.getState()
    const hasWon = winningCombinations.some(line => {
      return state[line[0]] === piece && state[line[1]] === piece && state[line[2]] === piece
    })
    if (hasWon) {
      endGame(piece)
    } else if (move >= 9) {
      endGame()
    } else {
      addMove()
    }
  }

  function addMove() {
    move++
    comment.textContent = `${getCurrentPiece()}'s turn...`
  }

  function updateState(e) {
    if (gameOver) return
    const index = e.target.dataset.index
    const state = gameBoard.getState()
    const piece = getCurrentPiece()

    if (state[index] !== '') return

    gameBoard.setState(index, piece)
    gameBoard.render(squareNodeList)
    checkLines(piece)
  }

  function getCurrentPiece() {
    return move % 2 === 1 ? 'X' : 'O'
  }

  function endGame(piece = false) {
    gameOver = true
    comment.textContent = piece ? `${piece}'s wins!` : 'Draw!'
  }

  return {
    startGame
  }
})()

gameController.startGame()