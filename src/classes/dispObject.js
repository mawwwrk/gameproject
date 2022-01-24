export class DisplayObject {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  #circular;
  diameter = undefined;
  radius = undefined;
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
    this.vX = 0;
    this.vY = 0;
    this.accelerationX = 0;
    this.accelerationY = 0;

    //? Physics properties
    this.frictionX = 0;
    this.frictionY = 0;
    this.gravity = 0;
    this.mass = 0;

    this.#circular = false;

    //? adding a shadow for depth
    this.shadow = false;
    this.shadowColor = "rgba(199, 199, 199, 0.72)";
    this.shadowOffsetX = 10;
    this.shadowOffsetY = 10;
    this.shadowBlur = 10;

    this.frames = [];
    this.loop = true;

    /**
     * @type { DisplayObject|undefined }
     */
    this.parent = undefined;
    /**
     * @type {DisplayObject[]}
     */
    this.children = [];
  }

  //! setting scale

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
  get scale() {
    if (this.scaleX === this.scaleY) {
      return this.scaleX;
    } else {
      return `scaleX: ${this.scaleX}; scaleY: ${this.scaleY}`;
    }
  }
  set scale(value) {
    if (this.scaleX !== this.scaleY) {
      console.log("scale X and Y are not equal, please supply two values");
      return;
    }
    this.scaleX = value;
    this.scaleY = value;
  }

  set acceleration(value) {
    this.accelerationX = value;
    this.accelerationY = value;
  }

  set friction(value) {
    this.frictionX = value;
    this.frictionY = value;
  }
  /**
   * @type { (x:number, y:number)=> void }
   */
  setPosition(x, y) {
    [this.x, this.y] = [x, y];
  }
  /** @type {number} */
  get gx() {
    //The sprite's global x position is a combination of its local x value and its parent's global x value
    if (this.parent) {
      return this.x + this.parent.gx;
    } else {
      return this.x;
    }
  }
  /**@type {number} */
  get gy() {
    if (this.parent) {
      return this.y + this.parent.gy;
    } else {
      return this.y;
    }
  }

  putCenter(b, xOffset = 0, yOffset = 0) {
    let a = this;
    b.x = a.x + a.halfWidth - b.halfWidth + xOffset;
    b.y = a.y + a.halfHeight - b.halfHeight + yOffset;
  }

  /**
   * @param {DisplayObject} sprite
   */
  addChild(sprite) {
    if (sprite.parent) {
      sprite.parent.removeChild(sprite);
    }
    sprite.parent = this;
    this.children.push(sprite);
  }

  /**
   * @param { DisplayObject} sprite
   */
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

export class Group extends DisplayObject {
  constructor(...spritesToGroup) {
    super();

    spritesToGroup.forEach((sprite) => this.addChild(sprite));
  }

  addChild(sprite) {
    if (sprite.parent) {
      sprite.parent.removeChild(sprite);
    }
    sprite.parent = this;
    this.children.push(sprite);

    this.calculateSize();
  }

  removeChild(sprite) {
    if (sprite.parent === this) {
      this.children.splice(this.children.indexOf(sprite), 1);

      this.calculateSize();
    } else {
      throw new Error(`${sprite} is not a child of ${this}`);
    }
  }

  calculateSize() {
    if (this.children.length > 0) {
      this._newWidth = 0;
      this._newHeight = 0;

      this.children.forEach((child) => {
        if (child.x + child.width > this._newWidth) {
          this._newWidth = child.x + child.width;
        }
        if (child.y + child.height > this._newHeight) {
          this._newHeight = child.y + child.height;
        }
      });

      this.width = this._newWidth;
      this.height = this._newHeight;
    }
  }
}