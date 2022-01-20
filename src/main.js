import "https://cdn.skypack.dev/normalizecss";
import { assets } from "./assets";
import { Blob, DisplayObject, Hero, Sprite } from "./classes";
import { contain, makeCanvas, statsReadout } from "./components";
import "./style.css";
import {
  Dir,
  filterPropsIn,
  frameInterval,
  Key,
  proxiedResizeObserver,
  render,
} from "./util";

assets
  .load([
    "src/assets/link_master.json",
    "src/assets/bg.json",
    "src/assets/enemies.json",
    "src/assets/blob.json",
  ])
  .then(() => setup());

function setup() {
  console.log(assets);

  let input = { key: "Down", dir: Dir.None };
  const [[akey, left], [dkey, right], [wkey, up_], [skey, down]] = [
    ["KeyA", "Left"],
    ["KeyD", "Right"],
    ["KeyW", "Up"],
    ["KeyS", "Down"],
  ].map((codes) => {
    let [key, keyDir] = codes;
    let arrow = `Arrow${keyDir}`;
    return [key, arrow].map(
      (ea) =>
        new Key(
          `${ea}`,
          () => {
            input.dir |= Dir[keyDir];
            input.key = keyDir;
          },
          () => {
            input.dir &= ~Dir[keyDir];
            // if (input.dir !== inputDir.None) input.key = 1;
          }
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
  let enemies = [];

  const blob = new Blob(filterPropsIn(assets)("pinkblob"), 100, 100);

  enemies = [...enemies, blob];
  const linkSprite = new Hero(assets.link_master, 16, 26);

  linkSprite.setScale(1.5);

  [backgroundImage, linkSprite, blob].forEach((ea) => stage.addChild(ea));

  canvas.addEventListener("click", (ev) => {
    ev.preventDefault();
    blob.newX = ev.clientX;
    blob.newY = ev.clientY;
    console.log(blob);
  });

  let ctx = canvas.ctx,
    previousTime = 0,
    framesDrawn = 0,
    updateCycles = 0,
    totalElapsed = 0;

  function update() {
    stage.putCenter(backgroundImage);

    blob.act();
    linkSprite.act(input);

    /* const hitBoxCollision = */ contain(linkSprite, stage.localBounds);

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
