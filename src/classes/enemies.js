import { attachAnimation } from "../components";
import { randomInt } from "../util";
import { AnimatedSprite } from "./sprite";

const Axis = { Horizontal: 0, Vertical: 1 };

export class Enemy extends AnimatedSprite {
  movingRandomly;
  #potentialPosition(selectedAxis) {
    let prop;
    if (selectedAxis === Axis.Horizontal) prop = "width";
    if (selectedAxis === Axis.Vertical) prop = "height";
    return this.parent[prop] - this[prop];
  }
  #randomPosition(selectedAxis) {
    return Math.random() * this.#potentialPosition(selectedAxis);
  }
  shakeAround() {
    this.x += randomInt(-2, 2);
    this.y += randomInt(-2, 2);
  }
  newRandomDestination() {
    this.newX = this.#randomPosition(Axis.Horizontal);
    this.newY = this.#randomPosition(Axis.Vertical);
  }
  move() {
    let [dx, dy] = [this.x - this.newX, this.y - this.newY];
    if (dx || dy) {
      this.vX += this.accelerationX * Math.sign(dx);
      this.vY += this.accelerationY * Math.sign(dy);
    }
    this.vX *= this.frictionX;
    this.vY *= this.frictionY;

    this.x -= this.vX;
    this.y -= this.vY;
  }

  aggro(target) {
    target.x = this.newX;
    target.y = this.newY;
    this.state = "aggro";
    let dx = target.x - this.x;
    let dy = target.y - this.y;
    if (Math.abs(dx) < 30 || Math.abs(dy) < 30) this.attack(target);
  }
  attack(target) {
    this.state = "attacking";
    this.onComplete = () => {
      this.state = "idle";
      this.fps = 12;
      this.onComplete = undefined;
    };
    this.fps = 8;
    this.playSequence([3, 4]);
  }

  act() {
    if (this.state === "idle" && !this.playing) this.playAnimation([0, 2]);
    if (!this.movingRandomly)
      this.movingRandomly = setTimeout(() => {
        this.newRandomDestination.call(this);
        this.movingRandomly = false;
      }, randomInt(5000, 10000));
    if (this.state === "aggro") this.aggro(this.target);
    this.move();
    // this.showFrame(0);
  }
}

export class Blob extends Enemy {
  constructor(source, x, y) {
    super(source);
    this.hp = 3;
    Object.assign(this, {
      x: x,
      y: y,
      shadow: true,
      accelerationX: 1,
      accelerationY: 1,
      frictionX: 0.75,
      frictionY: 0.75,
      loop: true,
      mass: 1,
    });
    this.state = "idle";
    this.currentFrame = 0;
    this.fps = 6;
    attachAnimation(this);
  }
}
