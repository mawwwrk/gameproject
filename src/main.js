import "https://cdn.skypack.dev/normalizecss";
import { dispObj } from "./classes";
import { makeCanvas, resizeObserver } from "./components/canvas";
import "./style.css";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
/** @type {HTMLDivElement} */ //@ts-ignore
const app = document.getElementById("app");

const canvas = makeCanvas();
resizeObserver.observe(canvas);

const ctx = canvas.ctx;

let x = 0,
  y = 0,
  clickx = 0,
  clicky = 0;

function move() {
  if (x != clickx) x += (clickx - x) / 10;
  if (y != clicky) y += (clicky - y) / 10;
}

const p = document.createElement("p");
p.textContent = 0;
document.getElementById("debug")?.append(p);

const updateP = (v) => (p.textContent = v);

const drawable = new dispObj();

let lastTime,
  deltaTime = 41.666666666666664;

function drawACircle(timestamp) {
  let counter = timestamp * 8e-3,
    startA = counter,
    endA = startA + 1;
  // updateP(`${timestamp}, ${counter.toFixed(4)}`);
  if (lastTime === undefined) lastTime = timestamp;
  // console.log(timestamp - lastTime);
  lastTime = timestamp;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  move();
  ctx.beginPath();
  ctx.arc(x, y, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  // ctx.moveTo(x, y);
  ctx.arc(x, y, 25, startA, endA);
  // ctx.closePath();
  ctx.stroke();
  requestAnimationFrame(drawACircle);
}
drawACircle(0);

document.addEventListener("click", (ev) => {
  clickx = ev.x - 13;
  clicky = ev.y - 59;
  console.group();
  console.log(x, y);
  console.log(clickx, clicky);
  console.log(ev.x, ev.y);
  console.groupEnd();
});
