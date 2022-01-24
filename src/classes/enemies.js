import { attachAnimation } from "../components";
import { randomInt } from "../util";
import { DisplayObject } from "./dispObject";
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
  act() {
    if (this.state === "idle" && !this.playing)
      this.playAnimation(this.randomiseActions());
    if (!this.movingRandomly)
      this.movingRandomly = setTimeout(() => {
        this.newRandomDestination.call(this);
        this.movingRandomly = false;
      }, randomInt(5000, 10000));
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
    this.actions = { idle: [4, 4, 5, 5, 6, 6, 5, 5] };
    this.randomiseActions();
    this.state = "idle";
    this.currentFrame = 0;
    this.fps = 6;
    attachAnimation(this);
  }

  randomiseActions() {
    return [randomInt(3, 7), randomInt(3, 7)];
  }
}
