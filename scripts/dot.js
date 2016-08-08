function Dot(color, position) {
  this.color = color;
  this.position = position;
}

Dot.prototype.sameColor = function (anotherDot) {
  return this.color === anotherDot.color;
};

module.exports = Dot;
