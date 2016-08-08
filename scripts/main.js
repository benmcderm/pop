const $ = require('jquery');
const Board = require('./board.js');

$('document').ready(function() {
  const board = new Board();
  board.createGame();

  document.addEventListener('mousedown', board.onStartDragging.bind(board), false);
  document.addEventListener('mouseup', board.onStopDragging.bind(board), false);
});
