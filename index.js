const State = function (old) {
  this.turn = '';
  this.oMovesCount = 0;
  this.result = 'still running';
  this.board = [];

  // create new state
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

  this.isWinner = function () {
    const B = this.board;

    // check rows
    for (let i = 0; i <= 6; i += 3) {
      if (B[i] !== 'E' && B[i] === B[i + 1] && B[i + 1] == B[i + 2]) {
        this.result = `${B[i]}-won`;
        return true;
      }
    }

    // check columns
    for (let i = 0; i <= 2; i++) {
      if (B[i] !== 'E' && B[i] === B[i + 3] && B[i + 3] === B[i + 6]) {
        this.result = `${B[i]}-won`;
        return true;
      }
    }

    // check diagonals
    for (let i = 0, j = 4; i <= 2; i += 2, j -= 2) {
      if (B[i] !== 'E' && B[i] == B[i + j] && B[i + j] === B[i + 2 * j]) {
        this.result = `${B[i]}-won`;
        return true;
      }
    }

    const available = this.emptyCells();
    if (available.length === 0) {
      this.result = 'draw';
      return true;
    }
    return false;
  };
};

const playerMove = function (pos) {
  this.movePosition = pos;
  this.minimaxVal = 0;

  this.applyTo = function (state) {
    const next = new State(state);

    // put the letter on the board
    next.board[this.movePosition] = state.turn;

    if (state.turn === 'O') {
      next.oMovesCount++;
    }

    next.advanceTurn();

    return next;
  };
};

const Game = function (autoPlayer) {
  // public : initialize the ai player for this game
  this.ai = autoPlayer;
  this.currentState = new State();
  console.log(this.currentState);

  this.currentState.board = [
    'E',
    'E',
    'E',
    'E',
    'E',
    'E',
    'E',
    'E',
    'E',
  ];

  this.currentState.turn = 'X';
  this.status = 'beginning';

  this.advanceTo = function (_state) {
    this.currentState = _state;
    if (_state.isWinner()) {
      this.status = 'ended';

      //   if (_state.result === 'X-won')
      //   // X won
      //   {
      //     ui.switchViewTo('won');
      //   } else if (_state.result === 'O-won')
      //   // X lost
      //   {
      //     ui.switchViewTo('lost');
      //   } else
      //   // it's a draw
      //   {
      //     ui.switchViewTo('draw');
      //   }
      // } else {
      //   // the game is still running
      //
      //   if (this.currentState.turn === 'X') {
      //     ui.switchViewTo('human');
      //   } else {
      //     ui.switchViewTo('robot');
      //
      //     // notify the AI player its turn has come up
      //     this.ai.notify('O');
      //   }
    }
  };

  this.start = function () {
    if (this.status = 'beginning') {
      this.advanceTo(this.currentState);
      this.status = 'running';
    }
  };
};

Game.score = function (_state) {
  if (_state.result === 'X-won') {
    // the x player won
    return 10 - _state.oMovesCount;
  } else if (_state.result === 'O-won') {
    // the x player lost
    return -10 + _state.oMovesCount;
  }
  // it's a draw
  return 0;
};

function minimaxValue(state) {
  if (state.isWinner()) {
    return Game.score(state);
  }
  let stateScore;

  if (state.turn === 'X')
  // X wants to maximize --> initialize to a value smaller than any possible score
  {
    stateScore = -1000;
  } else
  // O wants to minimize --> initialize to a value larger than any possible score
  {
    stateScore = 1000;
  }

  const availablePositions = state.emptyCells();

  // enumerate next available states using the info form available positions
  const availableNextStates = availablePositions.map((pos) => {
    const action = new AIAction(pos);

    const nextState = action.applyTo(state);

    return nextState;
  });

  availableNextStates.forEach((nextState) => {
    const nextScore = minimaxValue(nextState);
    if (state.turn === 'X') {
      if (nextScore > stateScore) {
        stateScore = nextScore;
      }
    } else if (nextScore < stateScore) {
      stateScore = nextScore;
    }
  });

  return stateScore;
}

const AIAction = function (pos) {
  this.movePosition = pos;
  this.minimaxVal = 0;

  this.applyTo = function (state) {
    const next = new State(state);

    // put the letter on the board
    next.board[this.movePosition] = state.turn;

    if (state.turn === 'O') {
      next.oMovesCount++;
    }

    next.advanceTurn();

    return next;
  };
};

AIAction.ASCENDING = function (firstAction, secondAction) {
  if (firstAction.minimaxVal < secondAction.minimaxVal) {
    return; // indicates that firstAction goes before secondAction
    -1;
  } else if (firstAction.minimaxVal > secondAction.minimaxVal) {
    return 1;
  } // indicates that secondAction goes before firstAction
  return 0; // indicates a tie
};

AIAction.DESCENDING = function (firstAction, secondAction) {
  if (firstAction.minimaxVal > secondAction.minimaxVal) {
    return; // indicates that firstAction goes before secondAction
    -1;
  } else if (firstAction.minimaxVal < secondAction.minimaxVal) {
    return 1;
  } // indicates that secondAction goes before firstAction
  return 0; // indicates a tie
};

function calcBest(turn) {
  const available = game.currentState.emptyCells();

  const availableActions = available.map((pos) => {
    const action = new AIAction(pos); // create the action object
    const next = action.applyTo(game.currentState); // get next state by applying the action
    action.minimaxVal = minimaxValue(next); // calculate and set the action's minmax value
    return action;
  });

  // sort the enumerated actions list by score
  if (turn === 'X') {
    availableActions.sort(AIAction.DESCENDING);
  } else {
    availableActions.sort(AIAction.ASCENDING);
  }

  const chosenAction = availableActions[0];
  const next = chosenAction.applyTo(game.currentState);

  // ui.insertAt(chosenAction.movePosition, turn);

  game.advanceTo(next);
  return chosenAction;
}

const game = new Game();

game.start();
console.log(game.currentState, 'game start');
calcBest('X');
console.log('best first move!!!!', game.currentState);
console.log('first move state', game.currentState);
let move = calcBest('O');
game.currentState.isWinner();
console.log('new game state:', game.currentState);
let Xmove = calcBest('X');
game.currentState.isWinner();
console.log('new game state:', game.currentState);
move = calcBest('O');
game.currentState.isWinner();
console.log('new game state:', game.currentState);
Xmove = calcBest('X');
game.currentState.isWinner();
console.log('new game state:', game.currentState);
move = calcBest('O');
game.currentState.isWinner();
console.log('new game state:', game.currentState);
Xmove = calcBest('X');
game.currentState.isWinner();
console.log('new game state:', game.currentState);
move = calcBest('O');
game.currentState.isWinner();
console.log('new game state:', game.currentState);
Xmove = calcBest('X');
game.currentState.isWinner();
console.log('new game state:', game.currentState);
