import "./style.css";
import { Axis, CanvasAndWindow, Dimensions } from "./types/types";
import { canvasDimDebugString, initDebug } from "./utils/debugBox";
import { init } from "./utils/helpers";

// makeDebug();
// const app = document.querySelector('#app') as HTMLDivElement;

/* app.innerHTML = `
  <h1>Hello Vite!</h1>
`; */
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const canvasWindowObj: CanvasAndWindow = { canvas, window };

const context = canvas.getContext("2d") as CanvasRenderingContext2D;

init(canvasWindowObj);

const background = new Image();
background.src = "src/assets/bg-JagdAhli.png";
background.onload;

console.log(background.width, background.height);
const addDebug = initDebug(document.getElementById("debug") as HTMLDivElement);
addDebug(canvasDimDebugString(canvas));

// type CircleParams = {
//   x: number;
//   y: number;
//   radius: number;
//   startAngle: number;
//   endAngle: number;
// };

class ObjAnimate {
  constructor(public newX: number = 0, public newY: number = 0) {
    this;
  }
  private static potentialPositions(obj: Dimensions, selectedAxis: Axis) {
    const prop = selectedAxis === Axis.Horizontal ? "width" : "height";
    return canvas[prop] - obj[prop];
  }
  public static randomSpawn(...args: [Dimensions, Axis]) {
    return Math.random() * ObjAnimate.potentialPositions(args[0], args[1]);
  }
  public static draw(
    obj: Circle,
    fillStyleString: string | CanvasGradient | CanvasPattern
  ) {
    if (obj instanceof Circle) {
      context.beginPath();
      context.arc(obj.x, obj.y, obj.radius, obj.startAngle, obj.endAngle);
      context.fillStyle = fillStyleString;
      context.fill();
      context.beginPath();
      context.arc(obj.x, obj.y, 5, obj.startAngle, obj.endAngle);
      context.stroke();
    }
  }
  public static drawActor(obj: Actor) {
    const sprite = new Image();
    sprite.src = obj.imgsrc;
  }
  public static moveTo(obj: Shape) {
    const [dx, dy] = [obj.x - obj.newX, obj.y - obj.newY];
    obj.x -= dx / 70;
    obj.y -= dy / 70;
  }
  public static moveToRandom(obj: Shape) {
    if (Math.random() <= 0.1 / 60) {
      obj.newX = obj.x + Math.round(Math.random() * 400) - 200;
      obj.newY = obj.y + Math.round(Math.random() * 400) - 200;
    }
  }
  public static drawSwing(obj: Circle) {
    context.beginPath();
    context.arc(
      obj.x,
      obj.y,
      obj.radius + 20,
      obj.startAngle + 15,
      obj.startAngle + 30
    );
    context.stroke();
  }
}

class Shape extends ObjAnimate {
  public x;
  y;
  constructor(public width = 100, public height = 100) {
    super();
    this.x = this.newX = ObjAnimate.randomSpawn(this, Axis.Horizontal);
    this.y = this.newY = ObjAnimate.randomSpawn(this, Axis.Vertical);
  }
}

class Actor extends ObjAnimate {
  public x;
  y;
  constructor(public imgsrc: string) {
    super();
    (this.x = this.newX = 10), (this.y = this.newY = 10);
  }
}

// const myDude = new Actor('src/assets/FighterAlpha.png');

class Circle extends Shape {
  constructor(
    public radius = 25,
    public startAngle = 0,
    public endAngle = Math.PI * 2,
    public fillStyleString: string
  ) {
    super();
    this.width = this.height = this.radius * 2;
  }
  update() {
    if (this.x !== this.newX || this.y !== this.newY) {
      ObjAnimate.moveTo(this);
    }
  }
  draw() {
    this.update();
    ObjAnimate.draw(this, this.fillStyleString);
  }
}

const myCirc = new Circle(25, 0, Math.PI * 2, "rgba(0,0,255,0.6)");

function moveToAction(obj: Circle, x: number, y: number) {
  obj.newX = x;
  obj.newY = y;
}

let keysPressed = 0;

const [arrowUp, arrowDown, arrowLeft, arrowRight] = [
  1 << 0,
  1 << 1,
  1 << 2,
  1 << 3,
];

function modKeyPressMod(key: string, type: string) {
  let mod = 0;
  switch (key) {
    case "ArrowUp":
      mod = arrowUp;
      console.log("\u{02191}");
      break;
    case "ArrowDown":
      mod = arrowDown;
      console.log("\u{02193}");
      break;
    case "ArrowLeft":
      mod = arrowLeft;
      console.log("\u{02190}");
      break;
    case "ArrowRight":
      mod = arrowRight;
      console.log("\u{02192}");
      break;
  }
  if (type == "keydown") keysPressed |= mod;
  if (type == "keyup") keysPressed &= ~mod;
  console.log(keysPressed);
}

window.addEventListener("keydown", (ev) => {
  modKeyPressMod(ev.key, ev.type);
  ev.preventDefault();
});

window.addEventListener("keyup", (ev) => {
  modKeyPressMod(ev.key, ev.type);
  ev.preventDefault();
});

canvas.addEventListener("click", () => ObjAnimate.drawSwing(myCirc));
function keyMove(targetObj: Circle) {
  const speed = 3;
  let [modX, modY] = [0, 0];
  const { newX: curNewX, newY: curNewY } = targetObj;

  if (keysPressed & arrowUp) modY -= speed;
  if (keysPressed & arrowDown) modY += speed;
  if (keysPressed & arrowLeft) modX -= speed;
  if (keysPressed & arrowRight) modX += speed;

  moveToAction(myCirc, curNewX + modX, curNewY + modY);
}

const otherCirc = new Circle(25, 0, Math.PI * 2, "rgba(255,0,0,0.6)");

// let frameCounter = 0;
const scale = 1.8;
const bgW = background.width * (canvas.width / background.width) * scale;
const bgH = background.height * (canvas.height / background.height) * scale;
const bgWOffset = (bgW - canvas.width) * 0.5;
const bgHOffset = (bgH - canvas.height) * 0.5;

console.log(bgW, bgH);

const dT = 16.666666666666;
let start, prevTimestamp;
function animate(timestamp) {
  start = start === undefined ? timestamp : start;
  const elapsed = timestamp - start;

  // console.log(1000 / (timestamp - prevTimestamp));
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(background, -bgWOffset, -bgHOffset, bgW, bgH);

  // ++frameCounter;
  Shape.moveToRandom(otherCirc);
  otherCirc.draw();

  keyMove(myCirc);
  myCirc.draw();
  ObjAnimate.drawSwing(myCirc);
  prevTimestamp = timestamp;
  requestAnimationFrame(animate);
}

background.onload = () => requestAnimationFrame(animate);
