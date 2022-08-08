// gameBoard - Module Pattern

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

// Player - Factory Function

const Player = (function (name, piece) {
  function getName() {
    return name
  }

  function getPiece() {
    return piece
  }

  return {
    getName,
    getPiece
  }
})

// gameController - Module Pattern

const gameController = (function () {
  const players = []
  const table = document.querySelector('.table')
  const playerOne = document.querySelector('#playerOne')
  const playerTwo = document.querySelector('#playerTwo')
  const error = document.querySelector('.error')
  error.style.display = 'none'
  table.style.display = 'none'
  const form = document.querySelector('form')
  form.addEventListener('submit', submitForm)
  const comment = document.querySelector('.comment')
  const squareNodeList = document.querySelectorAll('.square')
  const reset = document.querySelector('.reset')
  reset.addEventListener('click', resetGame)

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

  function submitForm(e) {
    e.preventDefault()
    if (playerOne.value === '' || playerTwo.value === '') {
      error.style.display = 'block'
      return
    }
    players['X'] = Player(playerOne.value)
    players['O'] = Player(playerTwo.value)
    startGame()
  }

  function resetGame() {
    table.style.display = 'none'
    form.style.display = 'block'
  }

  function startGame() {
    move = 0
    gameOver = false
    table.style.display = 'block'
    form.style.display = 'none'
    playerOne.value = ''
    playerTwo.value = ''
    error.style.display = 'none'
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
      return
    } else if (move >= 9) {
      endGame()
      return
    }
    addMove()
  }

  function addMove() {
    move++
    comment.textContent = `${players[getCurrentPiece()].getName()}'s turn...`
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
    comment.textContent = piece ? `${players[getCurrentPiece()].getName()}'s wins!` : 'Draw!'
  }

  return {
    startGame
  }
})()