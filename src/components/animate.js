export function attachAnimation(sprite) {
  let frameCounter = 0,
    numberOfFrames = 0,
    startFrame = 0,
    endFrame = 0,
    timerInterval = undefined;

  function show(frameNumber) {
    reset();
    sprite.showFrame(frameNumber);
  }
  function reset() {
    // if (sprite.playing && timerInterval !== undefined)
    sprite.playing = false;
    frameCounter = 0;
    startFrame = 0;
    endFrame = 0;
    numberOfFrames = 0;
    clearInterval(timerInterval);
  }
  function playAnimation() {
    playSequence([0, sprite.frames.length - 1]);
  } //The `stop` function stops the animation at the current frame

  function stopAnimation() {
    reset();
    sprite.showFrame(sprite._currentFrame);
  }
  function playSequence(sequence) {
    reset();

    startFrame = sequence[0];
    endFrame = sequence[1];
    numberOfFrames = endFrame - startFrame;
    //Compensate for two edge cases:

    //1. If the `startFrame` happens to be `0`
    if (startFrame === 0) {
      numberOfFrames += 1;
      frameCounter += 1;
    }

    //2. If only a two-frame sequence was provided
    if (numberOfFrames === 1) {
      numberOfFrames = 2;
      frameCounter += 1;
    }

    //Calculate the frame rate. Set the default fps to 12
    if (!sprite.fps) sprite.fps = 12;
    let frameRate = 1000 / sprite.fps;

    //Set the sprite to the starting frame
    sprite.showFrame(startFrame);

    //If the state isn't already `playing`, start it
    if (!sprite.playing) {
      timerInterval = setInterval(advanceFrame.bind(this), frameRate);
      sprite.playing = true;
    }
  }

  //`advanceFrame` is called by `setInterval` to display the next frame
  //in the sequence based on the `frameRate`. When the frame sequence
  //reaches the end, it will either stop or loop
  function advanceFrame() {
    //Advance the frame if `frameCounter` is less than
    //the state's total frames
    if (frameCounter < numberOfFrames) {
      //Advance the frame
      sprite.showFrame(sprite._currentFrame + 1);

      //Update the frame counter
      frameCounter += 1;

      //If we've reached the last frame and `loop`
      //is `true`, then start from the first frame again
    } else {
      if (sprite.loop) {
        sprite.showFrame(startFrame);
        frameCounter = 1;
      }
      if (this?.onComplete) this.onComplete();
    }
  }

  Object.assign(sprite, {
    show,
    playAnimation,
    stopAnimation,
    playSequence,
  });
}
