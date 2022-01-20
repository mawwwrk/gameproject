import { Rectangle } from ".";
import { checkDirection, Dir } from "../util";
import { DisplayObject } from "./dispObject";

export class Sprite extends DisplayObject {
  constructor(source, x = 0, y = 0) {
    super();
    Object.assign(this, { x, y });

    this.facing = "";
    this.state = "";
    this.currentFrame = 0;
    this.ticks = 0;

    if (source instanceof Image) this.createFromImage(source);
    if (source.frameTags) this.createFromFrameTags(source);
    if (source.frame) this.createFromAtlas(source);
    if (source instanceof Array) this.createFromAtlasFrames(source);
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
    const ref = Object.keys(this.frameTags)[0];
    this.sourceX = this.frameTags[ref][0].x;
    this.sourceY = this.frameTags[ref][0].y;
    this.width = this.sourceWidth = this.frameTags[ref][0].w;
    this.height = this.sourceHeight = this.frameTags[ref][0].h;
  }

  advanceFrames(frameTagName, startFrame = 0) {
    const frames = this.frameTags[frameTagName];
    ++this.currentFrame;
    this.currentFrame =
      startFrame + (this.currentFrame % (frames.length - startFrame));
  }

  showFrame(frameTagName = undefined, frameNumber = 0) {
    let frame;
    if (this.frameTags) frame = this.frameTags[frameTagName][frameNumber];
    if (this.actions) frame = this.frameToShow.frame;
    this.sourceX = frame.x;
    this.sourceY = frame.y;
    this.width = frame.w;
    this.height = frame.h;
    this.sourceHeight = frame.h;
    this.sourceWidth = frame.w;
  }

  shouldUpdate() {
    return this.ticks % Sprite.frameDelay === 0;
  }

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

export class Hero extends Sprite {
  constructor(source, width = 120, height = 120) {
    super(source);
    this.hitbox = new Rectangle(width, height, "none", "none");
    this.addChild(this.hitbox);
    this.putCenter(this.hitbox);

    Object.assign(this, {
      x: 120,
      y: 120,
      shadow: true,
      frictionX: 0.75,
      frictionY: 0.75,
      accelerationX: 1.5,
      accelerationY: 1.5,
    });

    this.facing = "Down";
    this.stillFrames = {
      [Dir.Up]: "moveShieldUp",
      [Dir.Right]: "moveShieldRight",
      [Dir.Down]: "moveShieldDown",
      [Dir.Left]: "moveShieldLeft",
    };
    this.state = "idle";
    this.actionFrames = {
      idle: "moveShield",
      moving: "moveShield",
    };
  }

  act(input) {
    this.ticks++;
    if (input.dir !== Dir.None) this.state = "moving";
    if (
      Math.min(this.accelerationX, this.accelerationY) >
      Math.abs(this.vX) + Math.abs(this.vY)
    )
      this.state = "idle";
    this.facing = input.key;

    const frameTag = this.actionFrames[this.state] + this.facing;

    if (this.state === "idle") this.currentFrame = 0;
    if (this.state === "moving" && this.shouldUpdate())
      this.advanceFrames(frameTag, 1);

    this.showFrame(frameTag, this.currentFrame);
    this.move(input.dir);
  }

  move(dir) {
    checkDirection(dir, {
      ifUp: () => (this.vY -= this.accelerationY),
      ifDown: () => (this.vY += this.accelerationY),
      ifLeft: () => (this.vX -= this.accelerationX),
      ifRight: () => (this.vX += this.accelerationX),
    });
    this.vX *= this.frictionX;
    this.vY *= this.frictionY;
    this.x = this.x + this.vX;
    this.y = this.y + this.vY;
  }
}
