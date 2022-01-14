import "https://cdn.skypack.dev/normalizecss";
import { dispObj } from "./classes";
import { makeCanvas, resizeObserver } from "./components/canvas";
import "./style.css";
import { fps, initControl, testHelper } from "./util";

const bgCanvas = makeCanvas("bg");
const appCanvas = makeCanvas("app");
resizeObserver.observe(appCanvas, bgCanvas);

const ctx = appCanvas.ctx;

const drawable = new dispObj();
initControl(drawable);

drawable.circular = true;
drawable.diameter = 50;
drawable.setPosition(100, 100);

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
    x = appCanvas.width - 120,
    y = 65,
    radius = 25;
  if (elapsed >= deltaTime) {
    lastFrameTime += deltaTime;
    frame += 1;
    // updateP(`${timestamp}, ${counter.toFixed(4)}`);
    // if (lastTime === undefined) lastTime = timestamp;
    // console.log(timestamp - lastTime);

    ctx.clearRect(0, 0, appCanvas.width, appCanvas.height);
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
