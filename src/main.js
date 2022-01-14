import "https://cdn.skypack.dev/normalizecss";
import { Circle, DisplayObject } from "./classes";
import { makeCanvas } from "./components/canvas";
import { contain } from "./components/stage";
import "./style.css";
import {
  fps,
  initControl,
  proxiedResizeObserver,
  randomInt,
  testHelper,
} from "./util";

// const bgCanvas = makeCanvas("bg");
const canvas = makeCanvas("app");
const stage = new DisplayObject();
stage.height = canvas.height;
stage.width = canvas.width;
const resizeObserver = proxiedResizeObserver(stage);
resizeObserver.observe(canvas);

const ctx = canvas.ctx;

const drawable = new DisplayObject();
initControl(drawable);

drawable.circular = true;
drawable.diameter = 50;

drawable.setPosition(100, 100);

const baller = new Circle(96, 128, 6);
baller.vx = randomInt(5, 15);
baller.vy = randomInt(5, 15);

console.log(baller);
baller.gravity = 0.3;
baller.frictionX = 1;
baller.frictionY = 0;

const deltaTime = fps[60];
let lastFrameTime = 0,
  frame = 0;
/**
 * @param {number} timestamp
 */
function draw(timestamp) {
  let elapsed = timestamp - lastFrameTime;
  let counter = timestamp * 8e-3,
    startA = counter,
    endA = startA + 1,
    x = canvas.width - 120,
    y = 65,
    radius = 25;
  if (elapsed >= deltaTime) {
    lastFrameTime += deltaTime;
    frame += 1;

    //? Apply gravity to the vertical velocity
    // baller.vy += baller.gravity;

    //? Apply friction. `ball.frictionX` will be 0.96 if the ball is on the ground, and 1 if it's in the air
    // baller.vx *= baller.frictionX;

    //? Move to new frame position by applying the new calculated velocity to previous x and y position
    baller.vy += baller.gravity;
    baller.vx *= baller.frictionX;

    baller.x += baller.vx;
    baller.y += baller.vy;
    let collision = contain(baller, stage.localBounds, true);
    if (collision === "bottom") {
      //Slow the ball down if it hits the bottom
      baller.frictionX = 0.96;
    } else {
      baller.frictionX = 1;
    }
    /*  */
    /*  */
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    baller.draw(ctx);

    // while (lastFrameTime < 500) {
    // console.log(baller);
    // }

    const drawCirc = testHelper(ctx, x, y);
    drawCirc(radius * 0.1, "fill");
    drawCirc(radius, "stroke", startA, endA);

    const drawDrawable = testHelper(ctx, drawable.x, drawable.y);
    drawDrawable(drawable.radius * 0.5, "fill");
    drawDrawable(drawable.radius, "stroke", 0, 1);

    ctx.font = "20px Ubuntu";
    ctx.fillText(
      `${lastFrameTime.toFixed(0)}, ${elapsed.toFixed(2)}`,
      x - 50,
      y + 50
    );
    ctx.fillText(
      `${(timestamp * 1e-3).toFixed(2)}, ${deltaTime.toFixed(2)}`,
      x - 50,
      y + 75
    );
    ctx.fillText(
      `${frame}, ${((1e3 * frame) / timestamp).toFixed(2)}`,
      x - 50,
      y + 100
    );
  }
  requestAnimationFrame(draw);
}
draw(0);
