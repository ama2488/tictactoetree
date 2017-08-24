const State = function (old) {
  this.turn = '';
  this.oMovesCount = 0;
  this.result = 'still running';
  this.board = [];

  /* Begin Object Construction */
  if (typeof old !== 'undefined') {
    const length = old.board.length;
    this.board = new Array(length);
    for (let i = 0; i < length; i++) {
      this.board[i] = old.board[i];
    }
    this.oMovesCount = old.oMovesCount;
    this.result = old.result;
    this.turn = old.turn;
  }

  this.advanceTurn = function () {
    this.turn = (this.turn === 'X')
      ? 'O'
      : 'X';
  };

  this.emptyCells = function () {
    const cells = [];
    for (let i = 0; i < 9; i++) {
      if (this.board[i] === 'E') {
        cells.push(i);
      }
    }
    return cells;
  };

  /*
     * public  function that checks if the state is a terminal state or not
     * the state result is updated to reflect the result of the game
     * @returns [Boolean]: true if it's terminal, false otherwise
     */
  this.isWinner = function () {
    const B = this.board;

    // check rows
    for (let i = 0; i <= 6; i += 3) {
      if (B[i] !== 'E' && B[i] === B[i + 1] && B[i + 1] == B[i + 2]) {
        this.result = `${B[i]}-won`; // update the state result
        return true;
      }
    }

    // check columns
    for (let i = 0; i <= 2; i++) {
      if (B[i] !== 'E' && B[i] === B[i + 3] && B[i + 3] === B[i + 6]) {
        this.result = `${B[i]}-won`; // update the state result
        return true;
      }
    }

    // check diagonals
    for (let i = 0, j = 4; i <= 2; i += 2, j -= 2) {
      if (B[i] !== 'E' && B[i] == B[i + j] && B[i + j] === B[i + 2 * j]) {
        this.result = `${B[i]}-won`; // update the state result
        return true;
      }
    }

    const available = this.emptyCells();
    if (available.length === 0) {
      this.result = 'draw'; // update the state result
      return true;
    }
    return false;
  };
};
