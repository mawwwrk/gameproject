//Physics properties
baller.gravity = 0.3;
baller.frictionX = 1;
baller.frictionY = 0;
baller.mass = 1.3;

//? Apply gravity to the vertical velocity
baller.vy += baller.gravity;

//? Apply friction. `ball.frictionX` will be 0.96 if the ball is on the ground, and 1 if it's in the air
baller.vx *= baller.frictionX;

//? Move to new frame position by applying the new calculated velocity to previous x and y position
baller.x += baller.vx;
baller.y += baller.vy;

//? Bounce the ball off the canvas edges and slow it to a stop

//? Left
if (baller.x < 0) {
  baller.x = 0;
  baller.vx = -baller.vx / baller.mass;
}

//? Right
if (baller.x + baller.diameter > canvas.width) {
  baller.x = canvas.width - baller.diameter;
  baller.vx = -baller.vx / baller.mass;
}

//? Top
if (baller.y < 0) {
  baller.y = 0;
  baller.vy = -baller.vy / baller.mass;
}

//? Bottom
if (baller.y + baller.diameter > canvas.height) {
  //Position the ball inside the canvas
  baller.y = canvas.height - baller.diameter;
  //? Reverse its velocity to make it bounce, and dampen the effect with mass
  baller.vy = -baller.vy / baller.mass;
  //? Add some friction if it's on the ground
  baller.frictionX = 0.96;
} else {
  //? Remove friction if it's not on the ground
  baller.frictionX = 1;
}
