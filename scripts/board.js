const $ = require('jquery');
const Dot = require('./dot.js');
const colors = ['red', 'blue', 'yellow', 'green', 'purple'];
let selectedDots = [];
let candidates = [];
let currentUser;
let highScore = 0;
let userName;

function Board() {
  this.grid = [];
  this.dragging = false;
  this.score = 0;
}

function randomColor() {
  return colors[Math.floor(Math.random() * (colors.length))];
}

function getPlayerName() {
  const playerName = prompt("Please choose your player's name");
  return playerName;
}

Board.prototype.resetBoard = () => {
  $('li').removeAttr('pos');
  $('ul').each(i => {
    $(this).children().each(j => {
      $(this).attr('pos', `${i}, ${j}`);
    });
  });
};

Board.prototype.createGame = () => {
  auth.onAuthStateChanged(user => {
    if (user) {
      database.ref().child(`users/${user.uid}`).once('value').
      then(userData => {
        if (userData.exists()) {
          highScore = userData.val().score;
          userName = userData.val().name;
          currentUser = auth.currentUser;
          $('.high-score').append(`<div class="current-high">${highScore}</div>`);
        } else {
          console.log('We have a user but no data.');
        }
      });
    } else {
      auth.signInAnonymously().catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
      }).then(user => {
        userName = getPlayerName();
        database.ref().child(`users/${user.uid}`).set({
          name: userName,
          score: 0,
        });
        currentUser = auth.currentUser;
      });
    }
  });

  database.ref().child('users').orderByChild('score').limitToLast(10).
  on('value', highScores => {
    $('.all-scores li').empty();
    highScores.forEach((user) => {
      $('.all-scores').prepend(`<li class="individual-high-score">
      ${user.val().name}: ${user.val().score}</li>`);
    });
  });

  this.populate();
};


Board.prototype.populate = () => {
  for (let i = 0; i < 6; i++) {
    $('.board').append(`<ul class='column id${i}'>`);
    this.grid[i] = [];
    for (let j = 0; j < 6; j++) {
      const classColor = randomColor();
      this.addDot(classColor, [i, j]);
    }
  }

  $('.score').append(`<div class="current-score">${this.score}</div>`);
};

Board.prototype.addDot = (color, pos) => {
  this.setDot(new Dot(color, pos), pos);
  const stringPosition = `${pos[0]},${pos[1]}`;
  const dotElement = $(`<li pos="${stringPosition}" class='dot ${color}'>`);
  dotElement.hover(this.onDotHover.bind(this));
  $(`.id${pos[0]}`).append(dotElement);
};

Board.prototype.removeDot = pos => {
  const newPos = $(pos).attr('pos');
  this.setDot(undefined, newPos);
  $(pos).hide('medium', () => {
    $(pos).remove();
    this.resetBoard();
  });
};

Board.prototype.getDot = pos => {
  const y = pos[0];
  const x = pos[1];
  return this.grid[y][x];
};

Board.prototype.setDot = (dot, pos) => {
  const y = pos[0];
  const x = pos[1];
  this.grid[y][x] = dot;
};

Board.prototype.onStartDragging = e => {
  e.preventDefault();
  this.dragging = true;
};

function isAdjacentTo(dot) {
  if (candidates.length === 1) {
    return true;
  }
  let adjacent = false;
  const directions = [[0, 1], [1, 0], [-1, 0], [0, -1]];
  const dotx = $(dot).attr('pos').slice(0, 1);
  const doty = $(dot).attr('pos').slice(2);

  for (let i = 0; i < candidates.length; i++) {
    const candidatex = $(candidates[i]).attr('pos').slice(0, 1);
    const candidatey = $(candidates[i]).attr('pos').slice(2);

    for (let j = 0; j < directions.length; j++) {
      if (directions[j][0] === (dotx - candidatex) && directions[j][1] === (doty - candidatey)) {
        adjacent = true;
      }
    }
  }
  return adjacent;
}

function checkForSimilarity(dots) {
  for (let i = 0; i < dots.length - 1; i++) {
    if ($(dots[i]).attr('class').slice(3) !== $(dots[i + 1]).attr('class').slice(3)) {
      return false;
    }
  }
  return true;
}

Board.prototype.onDotHover = e => {
  if (this.dragging) {
    if (!candidates.includes(e.currentTarget)) {
      candidates.push(e.currentTarget);
      if (isAdjacentTo(e.currentTarget)) {
        if (checkForSimilarity(candidates)) {
          selectedDots.push(e.currentTarget);
          $(e.currentTarget).attr('linked', 'true');
        }
      } else {
        candidates.pop();
      }
    }
  }
};

function extractPos(dot) {
  const sdotx = parseInt($(dot).attr('pos').slice(0, 1), 10);
  const sdoty = parseInt($(dot).attr('pos').slice(2), 10);
  return [sdotx, sdoty];
}

function checkForSquare() {
  const sD = [[0, -1], [1, -1], [1, 0]];

  for (let i = 0; i < selectedDots.length; i++) {
    const [x1, y1] = extractPos(selectedDots[i]);

    const isSquare = sD.every(delta => {
      const [dx, dy] = delta;
      return selectedDots.some(dot => {
        const [x2, y2] = extractPos(dot);
        return x1 + dx === x2 && y1 + dy === y2;
      });
    });

    if (isSquare) {
      return true;
    }
  }
  return false;
}

Board.prototype.onStopDragging = function () {
  this.dragging = false;
  for (let i = 0; i < selectedDots.length; i++) {
    $(selectedDots[i]).removeAttr('linked');
  }
  if (selectedDots.length < 2) {
    selectedDots = [];
    candidates = [];
    return;
  }
  if (checkForSimilarity(selectedDots)) {
    if (checkForSquare()) {
      this.score += 4;
    }
    selectedDots.forEach((dot) => {
      const columnNumber = $(dot).attr('pos').slice(0, 1);
      const rowNumber = 5;
      this.addDot(randomColor(), [columnNumber, rowNumber]);
      this.score += 1;
      $('.current-score').text(`${this.score}`);
      this.removeDot(dot);

      if (this.score > highScore) {
        database.ref().child("users/" + currentUser.uid).update({
          score: this.score,
        });
        $('.current-high').empty();
        $('.current-high').text(this.score);
      }
    });
  }

  selectedDots = [];
  candidates = [];
};

module.exports = Board;
