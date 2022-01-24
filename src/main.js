import "https://cdn.skypack.dev/normalizecss";
import { assets } from "./assets";
import {
  AnimatedSprite,
  Blob,
  Circle,
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
  Direction,
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
    // "src/assets/music.mp3",
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

  // const music = assets["src/assets/music.mp3"];

  // music.play();

  const filler = document.querySelector(".modal");
  // filler.addEventListener("click", () => {
  // music.pause();
  filler.classList.add("hidden");
  // runGame();
  // });

  const backgroundImage = new Sprite(assets["outdoors.png"]);
  // backgroundImage.visible = false;

  const hero = new Hero(assets.customLink, 16, 26);
  // let mult = 1;
  // let point = [hero.attackRange.centerX, hero.attackRange.centerY];
  // hero.attackRange.draw = function draw() {
  //   ctx.beginPath();
  //   ctx.strokeStyle = "pink";
  //   ctx.moveTo(hero.pivotX, hero.pivotY);
  //   ctx.lineTo(Math.sin(mult * Math.PI + 1), Math.cos(mult * Math.PI - 1));
  //   ctx.arc(
  //     hero.pivotX,
  //     hero.pivotY,
  //     30,
  //     mult * Math.PI + 0.75,
  //     mult * Math.PI - 0.75,
  //     true
  //   );
  //   ctx.stroke();
  // };

  let message = new TextSprite("", "12px puzzler", "black", 8, 8);
  const groupObj = new Group();

  // backgroundImage.addChild(new Rectangle(200, 100, "white", "none", 0, 20, 20));
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
    //Give the enemy a random y position
    blob.circular = true;
    blob.radius = 26;
    enemies = [...enemies, blob];
    stage.addChild(blob);
  }

  const enemyGrp = new Group(enemies);

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

  const vkey = new Key("KeyV", () => console.log(hero.vX, hero.vY));

  console.log(stage.children);

  let input = {
    kb: {
      dir: Direction.None,

      left: new Key(
        ["ArrowLeft", "KeyA"],
        function leftPress() {
          input.kb.dir |= Direction.Left;
          hero.facing = "Left";
        },
        function leftRelease() {
          input.kb.dir &= ~Direction.Left;
        }
      ),

      up: new Key(
        ["ArrowUp", "KeyW"],
        function upPress() {
          input.kb.dir |= Direction.Up;
          hero.facing = "Up";
        },
        function upRelease() {
          input.kb.dir &= ~Direction.Up;
        }
      ),

      right: new Key(
        ["ArrowRight", "KeyD"],
        function rightPress() {
          input.kb.dir |= Direction.Right;
          hero.facing = "Right";
        },
        function rightRelease() {
          input.kb.dir &= ~Direction.Right;
        }
      ),
      down: new Key(
        ["ArrowDown", "KeyS"],
        function downPress() {
          input.kb.dir |= Direction.Down;
          hero.facing = "Down";
        },
        function downRelease() {
          input.kb.dir &= ~Direction.Down;
        }
      ),
    },
    mouse: {},
  };

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

  const preventDefaultKeys = new Set(["Space"]);
  addEventListener("contextmenu", (ev) => ev.preventDefault());
  addEventListener("keypress", (ev) => {
    if (preventDefaultKeys.has(ev.code)) ev.preventDefault;
  });

  function update() {
    stage.putCenter(backgroundImage);
    hero.update(input);
    enemies.forEach((ea) => ea.act());
    /* const hitBoxCollision = */
    contain(enemyGrp, stage.localBounds);
    contain(hero, stage.localBounds);

    let heroHit = hit(hero, enemies, true, true, null, (str, obj) => {
      if (hero.state === "attack") {
        hero.proxy.fillStyle = "rgba(0,200,0, 50%)";
        obj.proxy.fillStyle = "rgba(200,0,0,50%)";

        wait(1250).then(() => {
          hero.proxy.fillStyle = "none";
          obj.proxy.fillStyle = "none";
        });
        // obj.hp -= 2;sss
        // console.log(obj);
      }
    });

    enemies = enemies.filter((enemy) => {
      if (enemy.hp < 1) {
        remove(enemy);
        return false;
      }
      return true;
    });
    arrows = arrows.filter((arrow) => {
      let didhit = hit(arrow, enemies, true, true, null, (str, obj) => {
        obj.hp -= 1;
        console.log(obj);
      });
      didhit ? console.log(didhit) : 1;
      arrow.x += arrow.vx;
      arrow.y += arrow.vy;

      let collision = outsideBounds(arrow, stage.localBounds);

      if (collision) {
        // message.content = "The arrow hit the " + collision;
        remove(arrow);
        return false;
      }
      return true;
    });

    ++updateCycles;
  }
  stage.children.forEach((sprite) => {
    if (sprite instanceof AnimatedSprite) {
      let proxy,
        {
          x,
          y,
          centreX,
          centreY,
          height,
          width,
          radius,
          diameter,
          halfWidth,
          halfHeight,
          pivotX,
          pivotY,
        } = sprite;
      console.log(sprite);

      if (sprite.circular) {
        proxy = new Circle(diameter, "none", "black", 1);
      } else {
        proxy = new Rectangle(
          width,
          height,
          "none",
          "black",
          1
          // centreX,
          // centreY
        );
      }
      Object.assign(proxy, { pivotX, pivotY });
      // proxy
      sprite.addChild(proxy);
      sprite.proxy = proxy;
      // sprite.putCenter(proxy);

      // ? ctx.arc(centreX, centreY, radius, 0, Math.PI * 2)
      // : ctx.rect(centreX, centreY, width, height);
    }
  });
  // render(stage, canvas);
  runGame();
  function runGame(timestamp) {
    if (!timestamp) timestamp = 0;
    let elapsed = timestamp - previousTime;
    totalElapsed += elapsed;
    // console.log(1);
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
