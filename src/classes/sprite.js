import { attachAnimation } from "../components";
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
    this.shadow = true;
    this.shadowColor = "rbga(20,20,20,80%)";
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

export class AnimatedSprite extends Sprite {
  constructor(source, x = 0, y = 0) {
    super(source, x, y);
    this.playing = false;
    this.loop = false;
    attachAnimation(this);
  }
}
