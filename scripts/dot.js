function Dot(color, position) {
  this.color = color;
  this.position = position;
}

Dot.prototype.sameColor = anotherDot => {
  return this.color === anotherDot.color;
};

module.exports = Dot;
