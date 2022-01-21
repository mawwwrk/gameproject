import "https://cdn.skypack.dev/normalizecss";
import { assets } from "./assets";
import { Blob, DisplayObject, Group, Hero, Sprite } from "./classes";
import { contain, makeCanvas } from "./components";
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
    "src/assets/silver.ttf",
  ])
  .then(() => setup());
function setup() {
  console.log(assets);

  const canvas = makeCanvas("app");
  let ctx = canvas.ctx,
    previousTime = 0,
    framesDrawn = 0,
    updateCycles = 0,
    totalElapsed = 0;

  const stage = new DisplayObject();
  [stage.width, stage.height] = [canvas.width, canvas.height];
  proxiedResizeObserver(stage).observe(canvas);

  const backgroundImage = new Sprite(assets["outdoors.png"]);

  let enemies = [];
  const blob = new Blob(filterPropsIn(assets)("pinkblob"), 100, 100);
  enemies = [...enemies, blob];

  const hero = new Hero(assets.link_master, 16, 26);
  hero.scale = 1.5;

  const groupObj = new Group();

  [backgroundImage, hero, blob, groupObj].forEach((ea) => stage.addChild(ea));

  let input = { kb: {}, mouse: {} },
    left,
    up,
    right,
    down;
  input.kb.dir = Dir.None;

  left = new Key(
    ["ArrowLeft", "KeyA"],
    function leftPress() {
      input.kb.dir |= Dir.Left;
      hero.facing = "Left";
          },
    function leftRelease() {
      input.kb.dir &= ~Dir.Left;
          }
        )
    );

  up = new Key(
    ["ArrowUp", "KeyW"],
    function upPress() {
      input.kb.dir |= Dir.Up;
      hero.facing = "Up";
    },
    function upRelease() {
      input.kb.dir &= ~Dir.Up;
    }
  );

  right = new Key(
    ["ArrowRight", "KeyD"],
    function rightPress() {
      input.kb.dir |= Dir.Right;
      hero.facing = "Right";
    },
    function rightRelease() {
      input.kb.dir &= ~Dir.Right;
    }
  );
  down = new Key(
    ["ArrowDown", "KeyS"],
    function downPress() {
      input.kb.dir |= Dir.Down;
      hero.facing = "Down";
    },
    function downRelease() {
      input.kb.dir &= ~Dir.Down;
    }
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

  let mousedownTime, mouseaction;
  addEventListener("pointerdown", (ev) => {
    ev.preventDefault();
    input.mouse.button = ev.button;
    mousedownTime = performance.now();
  });
  addEventListener("pointerup", (ev) => {
    ev.preventDefault();
    input.mouse.button = undefined;
    mousedownTime = performance.now() - mousedownTime;
  });

  let ctx = canvas.ctx,
    previousTime = 0,
    framesDrawn = 0,
    updateCycles = 0,
    totalElapsed = 0;

  function update() {
    stage.putCenter(backgroundImage);
    hero.update(input);
    blob.act();
    /* const hitBoxCollision = */ contain(hero, stage.localBounds);
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
