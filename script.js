const GameBoard = function() {
  const board = [];
  const rows = 3;
  const columns = 3;
  const emptyCell = ' ';


  for(let i = 0; i < rows; i++){
    board.push([]);
    for(let j = 0; j < columns; j++){
      board[i].push(emptyCell);
    }
  }

  const clearBoard = () =>{
    for(let i = 0; i < rows; i++){
      board[i].fill(emptyCell, 0)
    }
  }

  const getBoard = () => board;

  const addSymbol = (symbol, row, column) => board[row][column] = symbol;

  const canAddCell = (row, column) => {
    if(board[row][column] === emptyCell){
      return true;
    } else{
      console.log('invalid cell');
      return false;
    }
  }

  const printBoard =  (DOMBoard, addCell, createDiv, addToGameBoard) =>{
    DOMBoard.innerHTML = '';
    let rowIndex = 0;
    let container
    board.map((row, index) => {
      rowIndex = index
      container = createDiv();
      row.map((el, colIndex) => {
        addCell(el,index,colIndex,container);
      })
    addToGameBoard(container);
    })
  }
  
  return {addSymbol, getBoard, printBoard, clearBoard, canAddCell};
};

const GameController = (playerOneName = 'Player One', playerTwoName = 'playerTwo',DOMText,DOMBoard,addCellToDOM, DOMWinText, DOMWinMenu, createDiv, addToGameBoard, renderScores) => {
  const players = [
  {
    name:playerOneName,
    symbol:'X',
    score: 0
  },
  {
    name:playerTwoName,
    symbol:'O',
    score: 0
  }
  ];
  const board = GameBoard();
  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0]? players[1]:players[0];
  };

  const printNewRound = () => {
    DOMText.textContent = `${activePlayer.name} turn with the symbol: ${activePlayer.symbol}`;
    board.printBoard(DOMBoard,addCellToDOM, createDiv, addToGameBoard);
    renderScores(players);
  }

  const resetGame = () => {
    board.clearBoard();
  };

  const checkWinner = () =>{
    const flatBoard = board.getBoard().flat();
    const winConditions = [[0,1,2],[3,4,5],[6,7,8],
                           [0,3,6],[1,4,7],[2,5,8],
                           [0,4,8],[2,4,6]];
    let firstVal = '';
    let secondVal = '';
    let thirdVal = '';
    for(let i = 0; i < winConditions.length; i++){
      firstVal = flatBoard[winConditions[i][0]];
      secondVal = flatBoard[winConditions[i][1]];
      thirdVal = flatBoard[winConditions[i][2]];

      if(firstVal === secondVal && secondVal === thirdVal && firstVal !== ' '){
        DOMWinText.textContent = `The winner is ${activePlayer.name} with ${activePlayer.symbol}`;
        DOMWinMenu.showModal();
        board.printBoard(DOMBoard,addCellToDOM, createDiv, addToGameBoard);
        activePlayer.score += 1;
        resetGame();
        renderScores(players);
        switchPlayerTurn();
        return true
      }
    }
    if(flatBoard.every((el) => el !== ' ')){
      DOMWinText.textContent ='Draw';
      DOMWinMenu.showModal();
      board.printBoard(DOMBoard,addCellToDOM, createDiv, addToGameBoard);
      resetGame();
      renderScores(players);
      switchPlayerTurn();
      return true
    }
    return false
    }

  const playRound = (row,column) =>{
    if(row > 2 || column > 2){
      console.log('invalid row or column');
      return 
    } 
    
    if(board.canAddCell(row,column)){
      board.addSymbol(activePlayer.symbol,row, column);
      if(!checkWinner()){
        switchPlayerTurn();
        printNewRound();
      }
    }
      
  }
  printNewRound();

  return {playRound, printNewRound}
}

const UIGameController = () => {
  const startBtn = document.getElementById('startBtn');
  const playerOneInput = document.getElementById('playerOneName');
  const playerTwoInput = document.getElementById('playerTwoName');
  const playerOneScore = document.getElementById('playerOneScore');
  const playerTwoScore = document.getElementById('playerTwoScore');
  const startMenu = document.getElementById('startMenu');
  const gameBoard = document.getElementById('board');
  const gameText = document.getElementById('text');
  const winMenu = document.getElementById('winWindow');
  const winText = document.getElementById('winText');
  const continueBtn = document.getElementById('continue');
  const newGameBtn = document.getElementById('newGame');
  let game

  startMenu.showModal();

  const addCell = (el,row,col,container) => {
    const cell = document.createElement('p');
    cell.textContent = el;
    cell.classList.add('cell');
    cell.addEventListener('click', () =>{
    const boardIndex = [row,col];
    game.playRound(boardIndex[0],boardIndex[1]);
    })
    container.appendChild(cell);
  }

  const createDiv = () =>{
    const div = document.createElement('div');
    div.classList.add('cellRow');
    return div;
  }

  const addToGameBoard = (nodeEl) => {
    gameBoard.appendChild(nodeEl);
  }

  const renderScores = (players) =>{
      playerOneScore.textContent = `${players[0].name} Score: ${players[0].score}`;
      playerTwoScore.textContent = `${players[1].name} Score: ${players[1].score}`;
  }

  startBtn.addEventListener('click', () =>{
    const playerOneName = playerOneInput.value? playerOneInput.value: undefined;
    const playerTwoName = playerTwoInput.value? playerTwoInput.value: undefined;
    console.log(playerOneName,playerTwoName)
    game = GameController(playerOneName, playerTwoName,gameText,gameBoard,addCell,winText, winMenu,createDiv, addToGameBoard, renderScores);
    startMenu.close();
  });

  newGameBtn.addEventListener('click',()=>{
    winMenu.close();
    startMenu.showModal();
  })

  continueBtn.addEventListener('click',()=>{
    game.printNewRound();
    winMenu.close();
  })
}

UIGameController();
