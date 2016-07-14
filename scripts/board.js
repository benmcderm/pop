const $ = require('jquery');
const Dot = require('./dot.js');
const colors = ['red', 'blue', 'yellow', 'green', 'purple'];
let selectedDots = [];
let candidates = [];


function Board() {
  this.grid = [];
  this.dragging = false;
  this.score = 0;
};

function randomColor() {
  return colors[Math.floor(Math.random() * (colors.length))]
};

Board.prototype.resetBoard = function () {
  $(`li`).removeAttr('pos');
  $(`ul`).each(function (i) {
    $(this).children().each(function(j) {
      $(this).attr('pos', `${i},${j}`);
    })
  });
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
  $('.score').append(`<div>${this.score}</div>`)
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
  $(pos).hide('slow', () =>{
    $(pos).remove();
    this.resetBoard();
  });
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
    if (!candidates.includes(e.currentTarget)) {
      candidates.push(e.currentTarget);
      if (isAdjacentTo(e.currentTarget)) {
        if (checkForSimilarity(candidates)) {
          selectedDots.push(e.currentTarget)
          $(e.currentTarget).attr('linked', 'true')
        }
      } else {
        candidates.pop();
      }
    }
  }
};

// function checkForSquare(dot) {
//   let sD = [[0,-1], [1,-1], [1,0]];
//
//   for (var i = 0; i < selectedDots.length; i++) {
//     let sdotx = $(selectedDots[i]).attr('pos').slice(0,1)
//     let sdoty = $(selectedDots[i]).attr('pos').slice(2)
//
//     for (var j = 0; j < sD.length; j++) {
//       if ((sdotx + sD[i][j]) !== 0 && (sdoty + sD[i][j]) !== 0) {
//         console.log("not square!");
//       return false;
//       }
//     }
//   }
//   return true;
// };

function checkForSimilarity (dots) {
  for (var i = 0; i < dots.length - 1; i++) {
    if($(dots[i]).attr('class').slice(3) !== $(dots[i+1]).attr('class').slice(3)) {
      return false;
    }
  }
  return true;
};

function isAdjacentTo(dot) {
  if (candidates.length === 1) {
    return true;
  }
  let adjacent = false;
  let directions = [[0,1], [1,0], [-1,0], [0,-1]];
  let dotx = $(dot).attr('pos').slice(0,1);
  let doty = $(dot).attr('pos').slice(2);

  for (let i = 0; i < candidates.length; i++) {

    let candidatex = $(candidates[i]).attr('pos').slice(0,1)
    let candidatey = $(candidates[i]).attr('pos').slice(2)

    for (let j = 0; j < directions.length; j++) {
      if (directions[j][0] === (dotx - candidatex) && directions[j][1] === (doty - candidatey)) {
        adjacent = true;
      }
    }
  }
  return adjacent;
};

Board.prototype.onStopDragging = function () {
  this.dragging = false;
  for (var i = 0; i < selectedDots.length; i++) {
    $(selectedDots[i]).removeAttr('linked');
  }
  if (selectedDots.length < 2) {
    selectedDots = [];
    candidates = [];
    return;
  }
  if (checkForSimilarity(selectedDots)) {
    selectedDots.forEach((dot) => {
      // if (checkForSquare(dot)) {
      //   score += 3;
      // }
      let columnNumber = $(dot).attr('pos').slice(0,1);
      let rowNumber = 5;
      this.addDot(randomColor(), [columnNumber, rowNumber])
      this.score += 1;
      $('.score').text(`${this.score}`)
      this.removeDot(dot);
    });
  }

  selectedDots = [];
  candidates = [];
};

module.exports = Board;