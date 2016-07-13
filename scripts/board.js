const $ = require('jquery');
const Dot = require('./dot.js');
const colors = ['red', 'blue', 'yellow', 'green', 'purple'];
let selectedDots = [];

function Board() {
  this.grid = [];
  this.dragging = false;
};

function randomColor() {
  return colors[Math.floor(Math.random() * (colors.length - 1))]
};

Board.prototype.populate = function () {
  for (var i = 0; i < 6; i++) {
    $('.board').append(`<ul class='column id${i}'>`);
    this.grid[i] = [];
    for (var j = 0; j < 6; j++) {
      let classColor = randomColor();
      this.addDot(classColor, [i,j]);
    }
  }
};

Board.prototype.addDot = function (color, pos) {
  this.setDot(new Dot(color, pos), pos);
  let stringPosition = `${pos[0]},${pos[1]}`;
  let dotElement = $(`<li pos="${stringPosition}" class='dot ${color}'>`);
  dotElement.hover(this.onDotHover.bind(this));
  $(`.id${pos[0]}`).append(dotElement);
};

Board.prototype.removeDot = function (pos) {
  let newPos = $(pos).attr('pos');
  this.setDot(undefined, newPos);
  $(pos).hide('slow', function(){ $(pos).remove(); });
};

Board.prototype.getDot = function(pos) {
  let y = pos[0];
  let x = pos[1];
  this.grid[y][x];
};

Board.prototype.setDot = function(dot, pos) {
  let y = pos[0];
  let x = pos[1];
  this.grid[y][x] = dot;
};

Board.prototype.onStartDragging = function (e) {
  e.preventDefault();
  this.dragging = true;
};

Board.prototype.onDotHover = function (e) {
  if (this.dragging) {
    if (!selectedDots.includes(e.currentTarget)) {
      selectedDots.push(e.currentTarget);
    }
  }
};

function checkForSimilarity (dots) {
  for (var i = 0; i < dots.length - 1; i++) {
    if($(dots[i]).attr('class').slice(3) !== $(dots[i+1]).attr('class').slice(3)) {
      return false;
    }
  }
  return true;
};

function isAdjacentTo(pos1, pos2) {
  
};

Board.prototype.onStopDragging = function () {
  this.dragging = false;
  if (checkForSimilarity(selectedDots)) {
    selectedDots.forEach((dot) => {
      let columnNumber = $(dot).attr('pos').slice(0,1);
      let rowNumber = 5;
      this.addDot(randomColor(), [columnNumber, rowNumber])
      this.removeDot(dot);
    });
    selectedDots = [];
  } else {
    selectedDots = [];
  }
};

module.exports = Board;
