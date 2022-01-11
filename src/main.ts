import './style.css';
import { Axis, CanvasAndWindow, Dimensions } from './types/types';
import { canvasDimDebugString, initDebug } from './utils/debugBox';
import { init } from './utils/helpers';

const app = document.querySelector('#app') as HTMLDivElement;

app.innerHTML = `
  <h1>Hello Vite!</h1>
`;
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const canvasWindowObj: CanvasAndWindow = { canvas, window };

const context = canvas.getContext('2d') as CanvasRenderingContext2D;

init(canvasWindowObj);

const background = new Image();
background.src = 'src/assets/bg-JagdAhli.png';
background.onload;

const addDebug = initDebug(document.getElementById('debug') as HTMLDivElement);
addDebug(canvasDimDebugString(canvasWindowObj));

type CircleParams = {
  x: number;
  y: number;
  radius: number;
  startAngle: number;
  endAngle: number;
};

class ObjAnimate {
  constructor(public newX: number = 0, public newY: number = 0) {
    this;
  }
  private static potentialPositions(obj: Dimensions, selectedAxis: Axis) {
    const prop = selectedAxis === Axis.Horizontal ? 'width' : 'height';
    return canvas[prop] - obj[prop];
  }
  public static randomSpawn(...args: [Dimensions, Axis]) {
    return Math.random() * ObjAnimate.potentialPositions(args[0], args[1]);
  }
  public static draw(obj: Circle) {
    if (obj instanceof Circle) {
      context.beginPath();
      context.arc(obj.x, obj.y, obj.radius, obj.startAngle, obj.endAngle);
      context.stroke();
      context.beginPath();
      context.arc(obj.x, obj.y, 5, obj.startAngle, obj.endAngle);
      context.fill();
    }
  }
  public static moveTo(obj: Shape) {
    const [dx, dy] = [obj.x - obj.newX, obj.y - obj.newY];
    obj.x -= dx / 70;
    obj.y -= dy / 70;
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

class Circle extends Shape {
  constructor(
    public radius = 50,
    public startAngle = 0,
    public endAngle = Math.PI * 2
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
    ObjAnimate.draw(this);
  }
}

const myCirc = new Circle();

function moveToClick(obj: Circle, x: number, y: number) {
  obj.newX = x;
  obj.newY = y;
}

canvas.addEventListener('click', (ev) =>
  moveToClick(myCirc, ev.offsetX, ev.offsetY)
);

let gameFrame = 0;

function animate() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(background, 0, 0, canvas.width, canvas.height);
  gameFrame++;
  myCirc.draw();
  requestAnimationFrame(animate);
}

animate();
