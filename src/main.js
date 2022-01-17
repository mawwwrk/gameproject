import "https://cdn.skypack.dev/normalizecss";
import { assets } from "./assets";
import { Circle, DisplayObject, Sprite } from "./classes";
import { makeCanvas } from "./components/canvas";
import { contain } from "./components/stage";
import "./style.css";
import { proxiedResizeObserver, render } from "./util";

assets
  .load([
    "src/assets/link_master.json",
    "src/assets/bg.json",
    "src/assets/enemies.json",
  ])
  .then(() => setup());

function setup() {
  console.log(assets);
  // const bgCanvas = makeCanvas("bg");
  const canvas = makeCanvas("app");
  const stage = new DisplayObject();
  [stage.width, stage.height] = [canvas.width, canvas.height];
  proxiedResizeObserver(stage).observe(canvas);

  const bg = new Sprite(assets["outdoors.png"]);
  const ball = new Circle(2, 96, 64);
  ball.vx = 3;
  ball.vy = 2;
  // stage.addChild(bg);
  [ball, bg].forEach((ea) => stage.addChild(ea));
  let collision = contain(ball, stage.localBounds);
  gameLoop();

  function gameLoop() {
    requestAnimationFrame(gameLoop); //Move the ball

    ball.x += ball.vx;
    ball.y += ball.vy; //Bounce the ball off the canvas edges. //Left and right

    if (ball.x < 0 || ball.x + ball.diameter > canvas.width) {
      ball.vx = -ball.vx;
    } //Top and bottom

    if (ball.y < 0 || ball.y + ball.diameter > canvas.height) {
      ball.vy = -ball.vy;
    } //Render the animation

    render(stage, canvas);
  }
}

// const drawable = new DisplayObject();
// initControl(drawable);

// drawable.circular = true;
// drawable.diameter = 50;

// drawable.setPosition(100, 100);

// const baller = new Circle(96, 128, 6);
// baller.vx = randomInt(5, 15);
// baller.vy = randomInt(5, 15);

// // console.log(baller);
// baller.gravity = 0.3;
// baller.frictionX = 1;
// baller.frictionY = 0;

/* loadingbg */

// let bgisloaded = false;

// const bg = new Image();
// bg.addEventListener("load", () => (bgisloaded = true));
// bg.src = "src/assets/bg.png";

// console.log(bg);

// console.log(assets);

/* loadingbg */

/* //! laodingsprite */

// const fetchign = fetch("src/assets/link_master.json")
//   .then((res) => res.json())
//   .then((jsonBody) => {
//     console.log(jsonBody);
//     return jsonBody;
//   });
// console.log(fetchign);

// console.log(ref.meta.frameTags);

// const movementTags = ref.meta.frameTags.filter((x) => x.name.match(/move/i));
// console.log(movementTags);

// console.log(Object.keys(ref.frames));

// const frames = [];
// for (let frame in ref.frames) {
//   frames.push(ref.frames[frame]);
// }
// console.log(frames);

// const myImage = new Image();
// myImage.addEventListener("load", (_) => loadHandler("link"));
// myImage.src = "src/assets/link_master.png";

// let imgisloaded = false;
// //The loadHandler is called when the image has loaded
// /**
//  * @param {string} which
//  */
// function loadHandler(which) {
//   // "frame": { "x": 94, "y": 186, "w": 44, "h": 44 },
//   if (which === "link") imgisloaded = true;
//   if (which === "bg") bgisloaded = true;
// }

// /* //! laodingsprite */

// // stage.addChild(drawable);
// // stage.addChild(baller);

// let mainangle = 0.5 + Math.PI;

// const deltaTime = fps[60];
// let lastFrameTime = 0,
//   frame = 0;
// /**
//  * @param {number} timestamp
//  */
// function draw(timestamp) {
//   let elapsed = timestamp - lastFrameTime;
//   let counter = timestamp * 8e-3,
//     startA = counter,
//     endA = startA + 1,
//     x = canvas.width - 120,
//     y = 65,
//     radius = 25;
//   if (elapsed >= deltaTime) {
//     lastFrameTime += deltaTime;
//     frame += 1;

//     //? Apply gravity to the vertical velocity
//     // baller.vy += baller.gravity;

//     //? Apply friction. `ball.frictionX` will be 0.96 if the ball is on the ground, and 1 if it's in the air
//     // baller.vx *= baller.frictionX;

//     //? Move to new frame position by applying the new calculated velocity to previous x and y position
//     // baller.vy += baller.gravity;
//     // baller.vx *= baller.frictionX;

//     // baller.x += baller.vx;
//     // baller.y += baller.vy;
//     // let collision = contain(baller, stage.localBounds, true);
//     // if (collision === "bottom") {
//     //   //Slow the ball down if it hits the bottom
//     //   baller.frictionX = 0.96;
//     // } else {
//     //   baller.frictionX = 1;
//     // }
//     // /*  */
//     // /*  */
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     // const sizemod = canvas.width / 480;
//     // if (bgisloaded)
//     //   ctx.drawImage(bg, 0, 0, 960, 480, 0, 0, canvas.width, canvas.height);
//     // if (imgisloaded)
//     //   ctx.drawImage(
//     //     myImage,
//     //     94,
//     //     182,
//     //     44,
//     //     44,
//     //     100,
//     //     100,
//     //     44 * sizemod,
//     //     44 * sizemod
//     //   );

//     // while (lastFrameTime < 500) {
//     // console.log(baller);
//     // }

//     const drawCirc = testHelper(ctx, x, y);
//     drawCirc(radius * 0.1, "fill");
//     drawCirc(radius, "stroke", startA, endA);

//     // let drbl = drawable;
//     // const drawDrawable = testHelper(ctx, drbl.x, drbl.y);
//     // drawDrawable(drbl.radius * 0.35, "fill");
//     // drawDrawable(
//     //   drbl.radius,
//     //   "stroke",
//     //   drbl.rotation - Math.PI - 0.5,
//     //   drbl.rotation - Math.PI + 0.5
//     // );

//     // ctx.stroke(drawPoint(drbl));

//     // const angleDegrees = {
//     //   main: mainangle,
//     //   comp1: mainangle - 45,
//     //   comp2: mainangle + 45,
//     // };
//     // const circPoint = point(
//     //   drbl.x,
//     //   drbl.y,
//     //   drbl.radius,
//     //   180 + (0.5 / Math.PI) * 180
//     // );

//     // point on circ 0.5 rad

//     ctx.font = "20px Ubuntu";
//     ctx.fillStyle = "rgb(255, 255, 255, 50%)";
//     ctx.fillRect(600, 80, 200, 110);
//     ctx.fillStyle = "black";
//     ctx.fillText(
//       `${lastFrameTime.toFixed(0)}, ${elapsed.toFixed(2)}`,
//       x - 50,
//       y + 50
//     );
//     ctx.fillText(
//       `${(timestamp * 1e-3).toFixed(2)}, ${deltaTime.toFixed(2)}`,
//       x - 50,
//       y + 75
//     );
//     ctx.fillText(
//       `${frame}, ${((1e3 * frame) / timestamp).toFixed(2)}`,
//       x - 50,
//       y + 100
//     );
//   }
//   requestAnimationFrame(draw);
// }
// // draw(0);
