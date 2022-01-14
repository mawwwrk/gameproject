import "https://cdn.skypack.dev/normalizecss";
import { Circle, DisplayObj } from "./classes";
import { makeCanvas, resizeObserver } from "./components/canvas";
import "./style.css";
import { fps, initControl, randomInt, testHelper } from "./util";

// const bgCanvas = makeCanvas("bg");
const canvas = makeCanvas("app");
resizeObserver.observe(canvas /* , bgCanvas */);

const ctx = canvas.ctx;

const drawable = new DisplayObj();
initControl(drawable);

drawable.circular = true;
drawable.diameter = 50;

drawable.setPosition(100, 100);

const baller = new Circle(96, 128, 6);
[baller.vx, baller.vy] = [0, 0];
baller.vx = randomInt(5, 15);
baller.vy = randomInt(5, 15);

console.log(baller);

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

    baller.gravity = 0.3;
    baller.frictionX = 1;
    baller.frictionY = 0;
    baller.mass = 1.3;
    baller.vy += baller.gravity;

    baller.vx *= baller.frictionX;
    baller.x += baller.vx;
    baller.y += baller.vy;

    if (baller.x < 0) {
      baller.x = 0;
      baller.vx = -baller.vx / baller.mass;
    }

    if (baller.x + baller.diameter > canvas.width) {
      baller.x = canvas.width - baller.diameter;
      baller.vx = -baller.vx / baller.mass;
    }
    if (baller.y < 0) {
      baller.y = 0;
      baller.vy = -baller.vy / baller.mass;
    }
    if (baller.y + baller.diameter > canvas.height) {
      baller.y = canvas.height - baller.diameter;
      baller.vy = -baller.vy / baller.mass;
      baller.frictionX = 0.96;
    } else {
      baller.frictionX = 1;
    }

    /*  */
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    baller.draw(ctx);

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
