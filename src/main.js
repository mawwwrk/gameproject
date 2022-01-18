import "https://cdn.skypack.dev/normalizecss";
import { assets } from "./assets";
import { DisplayObject, Hero, Sprite } from "./classes";
import { makeCanvas } from "./components/canvas";
import { contain } from "./components/stage";
import "./style.css";
import { proxiedResizeObserver, render, statsReadout } from "./util";
import { inputDir, Key } from "./util/input";

assets
  .load([
    "src/assets/link_master.json",
    "src/assets/bg.json",
    "src/assets/enemies.json",
  ])
  .then(() => setup());

function setup() {
  console.log(assets);
  let keypress = inputDir.None;
  const [[akey, left], [dkey, right], [wkey, up_], [skey, down]] = [
    ["KeyA", "Left"],
    ["KeyD", "Right"],
    ["KeyW", "Up"],
    ["KeyS", "Down"],
  ].map((codes) => {
    let [key, dir] = codes;
    let arrow = `Arrow${dir}`;
    return [key, arrow].map(
      (ea) =>
        new Key(
          `${ea}`,
          () => (keypress |= inputDir[dir]),
          () => (keypress &= ~inputDir[dir])
        )
    );
  });

  let space = new Key(
    "KeyV",
    () => console.log(linkSprite.x, linkSprite.y),
    () => console.log(linkSprite.hitbox.gx, linkSprite.hitbox.gy)
  );

  const canvas = makeCanvas("app");
  const stage = new DisplayObject();
  [stage.width, stage.height] = [canvas.width, canvas.height];
  proxiedResizeObserver(stage).observe(canvas);

  const backgroundImage = new Sprite(assets["outdoors.png"]);
  const linkSprite = new Hero(assets.link_master, 16, 26);

  linkSprite.setScale(1.2);

  [backgroundImage, linkSprite].forEach((ea) => stage.addChild(ea));

  let fps = 30,
    frameInterval = 1000 / fps,
    ctx = canvas.ctx,
    w = window.innerWidth,
    h = window.innerHeight,
    previousTime = 0,
    framesDrawn = 0,
    updateCycles = 0,
    totalElapsed = 0;

  function update() {
    stage.putCenter(backgroundImage);

    let friction = 0.75;
    let maxVelocity = 6;
    linkSprite.accelerationX = linkSprite.accelerationY = 1.5;
    if (!(Math.abs(linkSprite.vX + linkSprite.vY) >= maxVelocity)) {
      if (keypress & inputDir.Up) linkSprite.vY -= linkSprite.accelerationY;
      if (keypress & inputDir.Down) linkSprite.vY += linkSprite.accelerationY;
      if (keypress & inputDir.Left) linkSprite.vX -= linkSprite.accelerationX;
      if (keypress & inputDir.Right) linkSprite.vX += linkSprite.accelerationX;
    }
    linkSprite.vY *= friction;
    linkSprite.vX *= friction;

    const hitBoxCollision = contain(linkSprite, stage.localBounds);

    linkSprite.x = linkSprite.x + linkSprite.vX;
    linkSprite.y = linkSprite.y + linkSprite.vY;

    ++updateCycles;
  }

  runGame();

  function runGame(timestamp) {
    if (!timestamp) timestamp = 0;
    let elapsed = timestamp - previousTime;
    totalElapsed += elapsed;

    while (totalElapsed >= frameInterval) {
      update();
      totalElapsed -= frameInterval;
    }
    render(stage, canvas);
    ++framesDrawn;
    // while (elapsed > fps) update(timestamp);

    statsReadout(window.innerWidth, ctx, linkSprite, {
      timestamp,
      elapsed,
      totalElapsed,
      framesDrawn,
      updateCycles,
    });

    previousTime = timestamp;
    requestAnimationFrame(runGame);
  }
}
