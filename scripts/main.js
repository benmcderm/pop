const $ = require('jquery');
const Board = require('./board.js')

$('document').ready(function() {
  let board = new Board();
  board.populate();

  document.addEventListener("mousedown", board.onStartDragging.bind(board), false);
  document.addEventListener("mouseup", board.onStopDragging.bind(board), false);
  
});
