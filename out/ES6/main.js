import './style.css';
import { Axis } from './types/types';
import { canvasDimDebugString, initDebug } from './utils/debugBox';
import { init } from './utils/helpers';
// const app = document.querySelector('#app') as HTMLDivElement;
/* app.innerHTML = `
  <h1>Hello Vite!</h1>
`; */
const canvas = document.getElementById('canvas');
const canvasWindowObj = { canvas, window };
const context = canvas.getContext('2d');
init(canvasWindowObj);
const background = new Image();
background.src = 'src/assets/bg-JagdAhli.png';
background.onload;
console.log(background.width, background.height);
const addDebug = initDebug(document.getElementById('debug'));
addDebug(canvasDimDebugString(canvasWindowObj));
// type CircleParams = {
//   x: number;
//   y: number;
//   radius: number;
//   startAngle: number;
//   endAngle: number;
// };
class ObjAnimate {
    constructor(newX = 0, newY = 0) {
        Object.defineProperty(this, "newX", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: newX
        });
        Object.defineProperty(this, "newY", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: newY
        });
        this;
    }
    static potentialPositions(obj, selectedAxis) {
        const prop = selectedAxis === Axis.Horizontal ? 'width' : 'height';
        return canvas[prop] - obj[prop];
    }
    static randomSpawn(...args) {
        return Math.random() * ObjAnimate.potentialPositions(args[0], args[1]);
    }
    static draw(obj, fillStyleString) {
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
    static drawActor(obj) {
        const sprite = new Image();
        sprite.src = obj.imgsrc;
    }
    static moveTo(obj) {
        const [dx, dy] = [obj.x - obj.newX, obj.y - obj.newY];
        obj.x -= dx / 70;
        obj.y -= dy / 70;
    }
    static moveToRandom(obj) {
        if (Math.random() <= 0.1 / 60) {
            obj.newX = obj.x + Math.round(Math.random() * 400) - 200;
            obj.newY = obj.y + Math.round(Math.random() * 400) - 200;
        }
    }
    static drawSwing(obj) {
        context.beginPath();
        context.arc(obj.x, obj.y, obj.radius, obj.startAngle - 15, obj.startAngle + 15);
        context.fill();
    }
}
class Shape extends ObjAnimate {
    constructor(width = 100, height = 100) {
        super();
        Object.defineProperty(this, "width", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: width
        });
        Object.defineProperty(this, "height", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: height
        });
        Object.defineProperty(this, "x", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "y", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.x = this.newX = ObjAnimate.randomSpawn(this, Axis.Horizontal);
        this.y = this.newY = ObjAnimate.randomSpawn(this, Axis.Vertical);
    }
}
class Actor extends ObjAnimate {
    constructor(imgsrc) {
        super();
        Object.defineProperty(this, "imgsrc", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: imgsrc
        });
        Object.defineProperty(this, "x", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "y", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        (this.x = this.newX = 10), (this.y = this.newY = 10);
    }
}
// const myDude = new Actor('src/assets/FighterAlpha.png');
class Circle extends Shape {
    constructor(radius = 25, startAngle = 0, endAngle = Math.PI * 2, fillStyleString) {
        super();
        Object.defineProperty(this, "radius", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: radius
        });
        Object.defineProperty(this, "startAngle", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: startAngle
        });
        Object.defineProperty(this, "endAngle", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: endAngle
        });
        Object.defineProperty(this, "fillStyleString", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: fillStyleString
        });
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
const myCirc = new Circle(25, 0, Math.PI * 2, 'rgba(0,0,255,0.6)');
function moveToAction(obj, x, y) {
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
function modKeyPressMod(key, type) {
    let mod = 0;
    switch (key) {
        case 'ArrowUp':
            mod = arrowUp;
            console.log('\u{02191}');
            break;
        case 'ArrowDown':
            mod = arrowDown;
            console.log('\u{02193}');
            break;
        case 'ArrowLeft':
            mod = arrowLeft;
            console.log('\u{02190}');
            break;
        case 'ArrowRight':
            mod = arrowRight;
            console.log('\u{02192}');
            break;
    }
    if (type == 'keydown')
        keysPressed |= mod;
    if (type == 'keyup')
        keysPressed &= ~mod;
    console.log(keysPressed);
}
window.addEventListener('keydown', (ev) => {
    modKeyPressMod(ev.key, ev.type);
    ev.preventDefault();
});
window.addEventListener('keyup', (ev) => {
    modKeyPressMod(ev.key, ev.type);
    ev.preventDefault();
});
canvas.addEventListener('click', () => ObjAnimate.drawSwing(myCirc));
function keyMove(targetObj) {
    const speed = 3;
    let [modX, modY] = [0, 0];
    const { newX: curNewX, newY: curNewY } = targetObj;
    if (keysPressed & arrowUp)
        modY -= speed;
    if (keysPressed & arrowDown)
        modY += speed;
    if (keysPressed & arrowLeft)
        modX -= speed;
    if (keysPressed & arrowRight)
        modX += speed;
    moveToAction(myCirc, curNewX + modX, curNewY + modY);
}
const otherCirc = new Circle(25, 0, Math.PI * 2, 'rgba(255,0,0,0.6)');
// let frameCounter = 0;
const scale = 1.8;
const bgW = background.width * (canvas.width / background.width) * scale;
const bgH = background.height * (canvas.height / background.height) * scale;
const bgWOffset = (bgW - canvas.width) * 0.5;
const bgHOffset = (bgH - canvas.height) * 0.5;
console.log(bgW, bgH);
function animate() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(background, -bgWOffset, -bgHOffset, bgW, bgH);
    // ++frameCounter;
    Shape.moveToRandom(otherCirc);
    otherCirc.draw();
    keyMove(myCirc);
    myCirc.draw();
    requestAnimationFrame(animate);
}
animate();
//# sourceMappingURL=main.js.map