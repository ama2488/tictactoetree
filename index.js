const State = function (old) {
  this.turn = '';
  this.oMovesCount = 0;
  this.result = 'still running';
  this.board = [];

  // construct state
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

const playerMove = function (pos) {
  // public : the position on the board that the action would put the letter on
  this.movePosition = pos;

  // public : the minimax value of the state that the action leads to when applied
  this.minimaxVal = 0;

  /*
  * public : applies the action to a state to get the next state
  * @param state [State]: the state to apply the action to
  * @return [State]: the next state
  */
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

  // public : initialize the game current state to empty board configuration
  this.currentState = new State();
  console.log(this.currentState);

  // "E" stands for empty board cell
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

  this.currentState.turn = 'X'; // X plays first

  /*
  * initialize game status to beginning
  */
  this.status = 'beginning';

  /*
  * public function that advances the game to a new state
  * @param _state [State]: the new state to advance the game to
  */
  this.advanceTo = function (_state) {
    this.currentState = _state;
    // if (_state.isTerminal()) {
    //   this.status = 'ended';
    //
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
    // }
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

const game = new Game();

function minimaxValue(state) {
  if (state.isTerminal()) {
    // a terminal game state is the base case
    return Game.score(state);
  }
  let stateScore; // this stores the minimax value we'll compute

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

  /* calculate the minimax value for all available next states
             * and evaluate the current state's value */
  availableNextStates.forEach((nextState) => {
    const nextScore = minimaxValue(nextState);
    if (state.turn === 'X') {
      // X wants to maximize --> update stateScore iff nextScore is larger
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
  // public : the position on the board that the action would put the letter on
  this.movePosition = pos;

  // public : the minimax value of the state that the action leads to when applied
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

  // enumerate and calculate the score for each avaialable actions to the ai player
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

  // take the first action as it's the optimal
  const chosenAction = availableActions[0];
  const next = chosenAction.applyTo(game.currentState);

  // ui.insertAt(chosenAction.movePosition, turn);

  game.advanceTo(next);
}

game.start();
console.log(game.currentState);
// console.log(Game.currentState.board);
