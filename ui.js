$(document).ready(() => {
  $('.cell').click((e) => {
    $('#start').hide();
    let player = game.currentState.turn;
    const $cell = $(e.target);
    const index = $cell.attr('data-indx');

    // add players move to board
    const move = new playerMove(index);
    const newState = move.applyTo(game.currentState);
    game.advanceTo(newState);
    let newMove = $('<h3/>', { text: `${player}` });
    $cell.append(newMove);
    $('#human').hide();
    displayWinner(game.currentState);

    // add AI move to board
    if (!game.currentState.isWinner()) {
      player = game.currentState.turn;
      const AIplay = calcBest('O');
      const AIindex = AIplay.movePosition.toString();
      newMove = $('<h3/>', { text: `${player}` });
      const $moveCell = $(`[data-indx=${AIindex}]`);
      window.setTimeout(() => {
        $moveCell.append(newMove);
        $('#ai').hide();
        displayWinner(game.currentState);
      }, 5000);
    }
  });

  function displayWinner(state) {
    if (state.isWinner()) {
      $('#replay').toggle();
      if (state.result === 'X-won') {
        $('#won').toggle();
      } else if (state.result === 'O-won') {
        $('#lost').toggle();
      } else {
        $('#draw').toggle();
      }
    } else if (state.turn === 'X') {
      $('#human').toggle();
    } else {
      $('#ai').toggle();
    }
  }

  $('#replay').click(() => {
    window.location.reload();
  });
});
