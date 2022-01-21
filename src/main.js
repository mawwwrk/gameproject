import "https://cdn.skypack.dev/normalizecss";
import { assets } from "./assets";
import {
  Blob,
  DisplayObject,
  Group,
  Hero,
  Rectangle,
  Sprite,
  TextSprite,
} from "./classes";
import { contain, makeCanvas } from "./components";
import "./style.css";
import {
  Dir,
  filterPropsIn,
  frameInterval,
  hit,
  Key,
  makePointer,
  outsideBounds,
  projectile,
  proxiedResizeObserver,
  randomInt,
  remove,
  render,
  shoot,
  wait,
} from "./util";

assets
  .load([
    "src/assets/link_master.json",
    "src/assets/bg.json",
    "src/assets/enemies.json",
    "src/assets/blob.json",
    "src/assets/ammo.json",
    "src/assets/customLink.json",
    "src/assets/silver.ttf",
    "src/assets/music.mp3",
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

  const music = assets["src/assets/music.mp3"];
  // music.play();

  const backgroundImage = new Sprite(assets["outdoors.png"]);
  backgroundImage.scale = 1;

  const hero = new Hero(assets.customLink, 16, 26);

  let message = new TextSprite("", "12px puzzler", "black", 8, 8);
  const groupObj = new Group();

  backgroundImage.addChild(new Rectangle(200, 100, "white", "none", 0, 20, 20));
  [backgroundImage, hero, groupObj, message].forEach((ea) =>
    stage.addChild(ea)
  );
  let enemies = [],
    spacing = 48,
    xOffset = 150;
  for (let i = 0; i < 6; i++) {
    const blob = new Blob(
      filterPropsIn(assets)("pinkblob"),
      spacing * i + xOffset,
      randomInt(0, canvas.height - 20)
    );
    //Give the enemy a random y position

    enemies = [...enemies, blob];
    stage.addChild(blob);
  }

  let arrows = [];
  const arrow = () =>
    projectile(stage, assets)(assets.ammo)({ scale: stage.children[1].scale });
  const fire = (shooter, angle) => {
    if (fire.reloading) return;
    shoot(shooter, angle, 0, 20, arrows, arrow);
    fire.reloading = true;
  };

  // const bigmessage = new TextSprite(
  //   "Game Over!",
  //   "64px Futura",
  //   "black",
  //   20,
  //   20
  // );
  // bigmessage.x = 120;
  // bigmessage.y = canvas.height / 2 - 64;

  // const gameOverScene = new Group(bigmessage);

  // stage.addChild(bigmessage);
  // stage.addChild(gameOverScene);

  // gameOverScene.visible = true;

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

  const pointer = makePointer(canvas);
  pointer.press = (event) => {
    input.mouse.button = event.button;
    if (fire.reloading && input.mouse.button === 2)
      input.mouse.button === undefined;
    if (event.button === 2 && !fire.reloading) {
      fire(
        hero,
        Math.atan2(pointer.centerY - hero.y, pointer.centerX - hero.x)
      );
      wait(600).then(() => (fire.reloading = false));
    }
    input.mouse.atan2 = Math.atan2(
      pointer.centerY - hero.y,
      pointer.centerX - hero.x
    );
    // console.log(input.mouse.atan2);
  };
  pointer.release = (event) => {
    input.mouse.button = undefined;
  };

  let mousedownTime, mouseaction;

  const preventDefaultKeys = new Set(["Space"]);
  addEventListener("contextmenu", (ev) => ev.preventDefault());
  addEventListener("keypress", (ev) => {
    if (preventDefaultKeys.has(ev.code)) ev.preventDefault;
  });

  function update() {
    stage.putCenter(backgroundImage);
    hero.update(input);
    enemies.forEach((ea) => ea.act());
    /* const hitBoxCollision = */ contain(hero, stage.localBounds);

    arrows = arrows.filter((arrow) => {
      arrow.x += arrow.vx;
      arrow.y += arrow.vy;

      let collision = outsideBounds(arrow, stage.localBounds);
      let didhit = hit(arrow, enemies, false, true);
      didhit ? console.log(didhit) : "";

      if (collision) {
        message.content = "The arrow hit the " + collision;
        remove(arrow);
        return false;
      }
      return true;
    });

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

    previousTime = timestamp;
    requestAnimationFrame(runGame);
  }
}
