import { Rectangle } from ".";
import { attachAnimation } from "../components";
import { checkDirection, Dir } from "../util";
import { DisplayObject } from "./dispObject";

export class Sprite extends DisplayObject {
  #circular;
  constructor(source, x = 0, y = 0) {
    super();
    Object.assign(this, { x, y });

    if (source instanceof Image) this.createFromImage(source);
    if (source.animationStates) this.createFromTaggedStateFrames(source);
    // if (source.frameTags) this.createFromFrameTags(source);
    if (source.frame) this.createFromAtlas(source);
    if (source instanceof Array) this.createFromAtlasFrames(source);

    this._currentFrame;
    this.playing = false;
    this.loop = true;
  }
  static frameDelay = 3;

  createFromImage(source) {
    this.source = source;
    this.sourceX = 0;
    this.sourceY = 0;
    this.width = source.width;
    this.height = source.height;
    this.sourceWidth = source.width;
    this.sourceHeight = source.height;
  }

  createFromAtlas(source) {
    this.tilesetFrame = source;
    this.source = this.tilesetFrame.source;
    this.sourceX = this.tilesetFrame.frame.x;
    this.sourceY = this.tilesetFrame.frame.y;
    this.width = this.tilesetFrame.frame.w;
    this.height = this.tilesetFrame.frame.h;
    this.sourceWidth = this.tilesetFrame.frame.w;
    this.sourceHeight = this.tilesetFrame.frame.h;
  }

  createFromAtlasFrames(source) {
    this.frames = source;
    this.source = source[0].source;
    this.sourceX = source[0].frame.x;
    this.sourceY = source[0].frame.y;
    this.width = source[0].frame.w;
    this.height = source[0].frame.h;
    this.sourceWidth = source[0].frame.w;
    this.sourceHeight = source[0].frame.h;
  }

  createFromFrameTags(source) {
    this.source = source.image;
    this.frameTags = source.frameTags;
    const frameTagKeys = Object.keys(this.frameTags)[0];
    this.sourceX = this.frameTags[frameTagKeys][0].frame.x;
    this.sourceY = this.frameTags[frameTagKeys][0].frame.y;
    this.width = this.sourceWidth = this.frameTags[frameTagKeys][0].frame.w;
    this.height = this.sourceHeight = this.frameTags[frameTagKeys][0].frame.h;
  }

  createFromTaggedStateFrames(source) {
    this.source = source.image;
    this.states = source.animationStates;
    this.frames = source.animationFrames;
    this.sourceX = this.frames[0].frame.x;
    this.sourceY = this.frames[0].frame.y;
    this.width = this.frames[0].frame.w;
    this.height = this.frames[0].frame.h;
    this.sourceWidth = this.frames[0].frame.w;
    this.sourceHeight = this.frames[0].frame.h;
  }

  showFrame(frameNumber = 0) {
    this.sourceX = this.frames[frameNumber].frame.x;
    this.sourceY = this.frames[frameNumber].frame.y;
    this.width = this.frames[frameNumber].frame.w;
    this.height = this.frames[frameNumber].frame.h;
    this.sourceHeight = this.frames[frameNumber].frame.h;
    this.sourceWidth = this.frames[frameNumber].frame.w;

    this._currentFrame = frameNumber;
  }

  // shouldUpdate() {
  //   return this.ticks % Sprite.frameDelay === 0;
  // }

  draw(ctx) {
    ctx.drawImage(
      this.source,
      this.sourceX,
      this.sourceY,
      this.sourceWidth,
      this.sourceHeight,
      -this.width * this.pivotX,
      -this.height * this.pivotY,
      this.width,
      this.height
    );
  }
}

const directions = ["Left", "Up", "Right", "Down"];

class Hero extends Sprite {
  #currentFrame;
  #state;
  #input;
  constructor(source, width = 120, height = 120) {
    super(source);
    this.hitbox = new Rectangle(width, height, "none", "none");
    this.#currentFrame = 0;
    this.addChild(this.hitbox);
    this.putCenter(this.hitbox);

    Object.assign(this, {
      x: 120,
      y: 120,
      shadow: true,
      friction: 0.8,
      acceleration: 1.5,
    });

    this.facing = "Down";
    this.animation = "moveShield";

    attachAnimation(this);
    this.state = "standing";
  }

  set state(value) {
    this.switchState(value);
    this.#state = value;
  }
  get state() {
    return this.#state;
  }

  switchState(state) {
    switch (state) {
      case "standing":
        this.playing = false;
        this.animation = "moveShield";
        this.show(this.states[`${this.animation}${this.facing}`][0]);
        break;
      case "moving":
        this.animation = "moveShield";
        this.loop = true;
        this.playSequence(this.states[`${this.animation}${this.facing}`]);
        break;
      case "swing":
        let i = this.#input.mouse.button + 1;
        console.log(this.#input.mouse.button);
        this.#input.mouse.button = undefined;
        if (this.state === "swing") return;
        this.stopAnimation();
        this.onComplete = () => {
          this.loop = true;
          this.playing = false;
          this.show(this.states[`moveShield${this.facing}`][0]);
          this.onComplete = null;
        };
        this.loop = false;
        this.playSequence(this.states[`swing${this.facing}${i}`]);
        break;
    }
  }

  standing() {
    if (this.#input.mouse.button in [1, 2]) this.state = "swing";
    if (this.#input.kb.dir !== Dir.None) this.state = "moving";
  }

  moving() {
    if (this.#input.kb.dir & ~Dir[`${this.facing}`]) this.state = "moving";
    if (this.#input.mouse.button in [1, 2]) {
      this.state = "swing";
      return;
    }
    if (this.#input.kb.dir === Dir.None) {
      this.state = "standing";
      return;
    }

    this.move(this.#input.kb.dir);
  }
  swing() {
    if (this.playing) return;
    this.state = "standing";
  }
  // doAction() {
  //   if (this.playing) return;
  //   this.onComplete = () => {
  //     this.loop = true;
  //     this.playing = false;
  //     this.show(this.states[`moveShield${this.facing}`][0]);
  //     this.onComplete = null;
  //   };
  //   this.loop = false;
  //   this.playing = true;
  //   this.playAnimation(this.states[`swing${this.facing}1`]);
  // }
  // doSwordAttack() {
  //   this.loop = false;
  //   this.play();
  // }
  // changeState(env) {
  //   // console.log(env);
  //   switch (this.state) {
  //     case "standing":
  //       this.facing = env.input.key;
  //       if (env.input.dir !== Dir.None) this.state = "moving";
  //       if (env.input.mouseaction) {
  //         this.state = "attackWithSword";
  //       }
  //       break;
  //     case "moving":
  //       this.facing = env.input.key;
  //       if (env.input.dir === Dir.None) {
  //         this.state = "standing";
  //         this.stop();
  //       }
  //       if (env.mouseaction === "click") {
  //         this.state = "attackingWithSword";
  //         this.doSwordAttack();
  //       }
  //       break;
  //     case "attackWithSword":
  //       console.log(this.state);
  //       if (this.currentFrame === this.frames.length) {
  //         this.state = "standing";
  //         this.playing = false;
  //         this.loop = true;
  //         this.reset();
  //       }
  //       break;
  //     default:
  //       break;
  //   }
  // }
  act(env) {
    // this.changeState(env);
    // if (this.state === "moving") {
    //   if (!this.playing) this.play();
    //   this.move(env.input.dir);
    // }
    this.update();
  }

  move(dir) {
    checkDirection(dir, {
      ifUp: () => (this.vY -= this.accelerationY),
      ifDown: () => (this.vY += this.accelerationY),
      ifLeft: () => (this.vX -= this.accelerationX),
      ifRight: () => (this.vX += this.accelerationX),
    });
  }

  update(input) {
    this.#input = input;
    this[`${this.state}`]();
    this.vX *= this.frictionX;
    this.vY *= this.frictionY;
    this.x = this.x + this.vX;
    this.y = this.y + this.vY;
  }
}

export { Hero };
