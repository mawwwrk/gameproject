export class DisplayObject {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  #circular;
  /**
   * @type {number}
   */
  radius;
  /**
   * @type {number}
   */
  diameter;
  constructor() {
    //? position and size
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;

    this.pivotX = 0.5;
    this.pivotY = 0.5;

    this.rotation = 0;
    this.alpha = 1;
    this.visible = true;
    this.scaleX = 1;
    this.scaleY = 1;

    //? velocity and acceleration
    this.vx = 0;
    this.vy = 0;
    this.accelerationX = 0;
    this.accelerationY = 0;

    //? Physics properties
    this.frictionX = 0;
    this.frictionY = 0;
    this.gravity = 0;
    this.mass = 0;

    this.#circular = false;

    this.parent = undefined;
    this.children = [];
  }
  get halfWidth() {
    return this.width * 0.5;
  }
  get halfHeight() {
    return this.height * 0.5;
  }
  get centerX() {
    return this.x + this.halfWidth;
  }
  get centerY() {
    return this.y + this.halfHeight;
  }
  get position() {
    return { x: this.x, y: this.y };
  }
  /**
   * @param {number} x
   * @param {number} y
   */
  setPosition(x, y) {
    [this.x, this.y] = [x, y];
  }
  get gx() {
    //The sprite's global x position is a combination of its local x value and its parent's global x value
    if (this.parent) {
      return this.x + this.parent.gx;
    } else {
      return this.x;
    }
  }
  get gy() {
    if (this.parent) {
      return this.y + this.parent.gy;
    } else {
      return this.y;
    }
  }

  addChild(sprite) {
    if (sprite.parent) {
      sprite.parent.removeChild(sprite);
    }
    sprite.parent = this;
    this.children.push(sprite);
  }

  removeChild(sprite) {
    if (sprite.parent === this) {
      this.children.splice(this.children.indexOf(sprite), 1);
    } else {
      throw new Error(sprite + "is not a child of " + this);
    }
  }
  get localBounds() {
    return {
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
    };
  }
  get globalBounds() {
    return {
      x: this.gx,
      y: this.gy,
      width: this.gx + this.width,
      height: this.gy + this.height,
    };
  }
  get circular() {
    return this.#circular;
  }
  set circular(setting) {
    if (setting === true && this.#circular === false) {
      Object.defineProperties(this, {
        diameter: {
          get() {
            return this.width;
          },
          set(value) {
            this.width = value;
            this.height = value;
          },
          enumerable: true,
          configurable: true,
        },
        radius: {
          get() {
            return this.halfWidth;
          },
          set(value) {
            this.width = value * 2;
            this.height = value * 2;
          },
          enumerable: true,
          configurable: true,
        },
      });
      this.#circular = true;
    }
    if (setting === false && this.#circular === true) {
      delete this.diameter;
      delete this.radius;
      this.#circular = false;
    }
  }
}
