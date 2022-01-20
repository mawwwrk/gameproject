import { randomInt } from "../util";
import { Sprite } from "./sprite";

const Axis = { Horizontal: 0, Vertical: 1 };

export class Enemy extends Sprite {
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
}

export class Blob extends Enemy {
  constructor(source, x, y) {
    super(source);
    Object.assign(this, {
      x: x,
      y: y,
      shadow: true,
      scaleX: 2,
      scaleY: 2,
      accelerationX: 1.5,
      accelerationY: 1.5,
      frictionX: 0.75,
      frictionY: 0.75,
      mass: 1,
    });
    this.actions = { idle: [4, 4, 5, 5, 6, 6, 5, 5] };
    this.state = "idle";
    // console.log(this);
  }
  #movingRandomly;
  act() {
    this.ticks++;

    if (this.shouldUpdate()) {
      if (!this.#movingRandomly)
        this.#movingRandomly = setTimeout(() => {
          this.newRandomDestination.call(this);
          this.#movingRandomly = false;
        }, randomInt(5000, 10000));
      ++this.currentFrame;
      //   if (this.state === "idle" && Math.random() > 0.8) this.shakeAround();
      //   if (this.state === "idle" && Math.random() > 0.92)
      this.move();
      this.currentAction = this.actions[this.state];
      this.actionFrameLength = this.currentAction.length;
      this.activeFrame = this.currentFrame % this.actionFrameLength;
      this.frameToShow = this.frames[this.currentAction[this.activeFrame]];
      this.showFrame();
    }
  }
}
