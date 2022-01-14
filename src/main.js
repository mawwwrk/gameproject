import "https://cdn.skypack.dev/normalizecss";
import { Circle, DisplayObj } from "./classes";
import { makeCanvas, resizeObserver } from "./components/canvas";
import "./style.css";
import { fps, initControl, testHelper } from "./util";

// const bgCanvas = makeCanvas("bg");
const canvas = makeCanvas("app");
resizeObserver.observe(canvas /* , bgCanvas */);

const ctx = canvas.ctx;

const drawable = new DisplayObj();
initControl(drawable);

drawable.circular = true;
drawable.diameter = 50;

drawable.setPosition(100, 100);

const bBall = new Circle(96, 128, 20);
[bBall.vx, bBall.vy] = [3, 2];

const deltaTime = fps[120];
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

    /*  */
    //Move the ball
    bBall.x += bBall.vx;
    bBall.y += bBall.vy;
    //Bounce the ball off the canvas edges.
    //Left and right
    if (bBall.x < 0 || bBall.x + bBall.diameter > canvas.width) {
      bBall.vx = -bBall.vx;
    }
    //Top and bottom
    if (bBall.y < 0 || bBall.y + bBall.diameter > canvas.height) {
      bBall.vy = -bBall.vy;
    }
    /*  */
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bBall.draw(ctx);
    const drawCirc = testHelper(ctx, x, y);
    drawCirc(radius * 0.1, "fill");
    drawCirc(radius, "stroke", startA, endA);

    const drawDrawable = testHelper(ctx, drawable.x, drawable.y);
    drawDrawable(drawable.radius * 0.5, "fill");
    drawDrawable(drawable.radius, "stroke", startA, endA);

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
  // const drawCirc = testHelper(ctx, x - 80, y);
  // drawCirc(radius * 0.1, "fill");
  // drawCirc(radius, "stroke", startA, endA);
}
draw(0);
