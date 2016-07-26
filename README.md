# Pop

Pop is a browser-based JavaScript game.  The point of the game is to pop the most dots in the time limit.  Dots are popped by dragging across two or more dots of the same color.

![Pop](/images/pop.png?raw=true "Pop")


## Features & Implementation

The game relies heavily on jQuery and JavaScript to respond to user interaction.  A concern at the beginning was having the dots hide gracefully after they were "popped."  This was accomplished by setting the jQuery hide method to slowly shrink the dot, removing it after the shrinking was completed.

`Board.prototype.removeDot = function (pos) {
  let newPos = $(pos).attr('pos');
  this.setDot(undefined, newPos);
  $(pos).hide('medium', () =>{
    $(pos).remove();
    this.resetBoard();
  });
};`

Another design tactic was to create dots above the board and have them fall into place (think Connect 4).  This worked quite well with apart from the fact that the game border was then clearly defined as dots passed it.  To overcome this unoptimized transition, whenever a dot is created, it slowly fades into the frame, allowing it enough time to pass the top border and fall into place.  This makes for a clean transition and smoother gameplay.
