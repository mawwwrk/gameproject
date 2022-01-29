export class Key {
  constructor(
    code,
    press = () => console.log(`${code} pressed`),
    release = () => console.log(`${code} released`)
  ) {
    this.code = code;
    this.isDown = false;
    this.isUp = true;
    this.press = press;
    this.release = release;
    this.test;
    if (this.code instanceof Array) {
      let codes = new Set(this.code);
      this.test = (evcode) => codes.has(evcode);
    } else {
      this.test = (evcode) => evcode === this.code;
    }

    window.addEventListener("keydown", this.downHandler.bind(this));
    window.addEventListener("keyup", this.upHandler.bind(this));
  }

  downHandler(ev) {
    if (this.test(ev.code)) {
      if (this.isUp) this.press();
      this.isDown = true;
      this.isUp = false;
      ev.preventDefault();
    }
  }
  upHandler(ev) {
    if (this.test(ev.code)) {
      if (this.isDown) this.release();
      this.isUp = true;
      this.isDown = false;
      ev.preventDefault();
    }
  }
  unsubscribe = () => {
    window.removeEventListener("keydown", this.downHandler);
    window.removeEventListener("keyup", this.upHandler);
  };
}

const velocity = 2.4;

export function applyHandlers([left, up, right, down], hero) {
  left.press = () => {
    //Play the sprite’s `walkLeft` animation
    //sequence and set the sprite’s velocity
    hero.facing = "Left";
    hero.textures = hero.animations["runLeft"];
    if (!hero.playing) hero.play();
    hero.vx = -velocity;
    hero.vy = 0;
  }; //Left arrow key `release` method
  left.release = () => {
    //If the left arrow has been released, and the right arrow isn’t down,
    //and the sprite isn’t moving vertically, stop the sprite from moving
    //by setting its velocity to zero. Then display the sprite’s static
    //`left` state.
    if (!right.isDown && hero.vy === 0) {
      hero.vx = 0;
      hero.textures = hero.animations["standLeft"];
      hero.gotoAndStop(0);
    } //The rest of the arrow keys follow the same format //Up
  };
  up.press = () => {
    hero.facing = "Up";
    hero.textures = hero.animations["runUp"];
    if (!hero.playing) hero.play();
    hero.vy = -velocity;
    hero.vx = 0;
  };
  up.release = () => {
    if (!down.isDown && hero.vx === 0) {
      hero.vy = 0;
      hero.textures = hero.animations["standUp"];
      hero.gotoAndStop(0);
    }
  }; //Right
  right.press = () => {
    hero.facing = "Right";
    hero.textures = hero.animations["runRight"];
    if (!hero.playing) hero.play();
    hero.vx = velocity;
    hero.vy = 0;
  };
  right.release = () => {
    if (!left.isDown && hero.vy === 0) {
      hero.vx = 0;
      hero.textures = hero.animations["standRight"];
      hero.gotoAndStop(0);
    }
  }; //Down
  down.press = () => {
    hero.facing = "Down";
    hero.textures = hero.animations["runDown"];
    if (!hero.playing) hero.play();
    hero.vy = velocity;
    hero.vx = 0;
  };
  down.release = () => {
    if (!up.isDown && hero.vx === 0) {
      hero.vy = 0;
      hero.textures = hero.animations["standDown"];
      hero.gotoAndStop(0);
    }
  };
}

export const keys = (keys, press, release) =>
  keys.forEach((key) => {
    new Key(key, press, release);
  });
const Directions = ["Left", "Up", "Right", "Down"];

/** @type {Object<string, number>} inputDir */
export const Direction = {
  None: 0,
  [Directions[0]]: 1 << 0,
  [Directions[1]]: 1 << 1,
  [Directions[2]]: 1 << 2,
  [Directions[3]]: 1 << 3,
};

let keyPress = Direction.None;

export const input = {
  kb: {
    dir: Direction.None,

    left: new Key(
      ["ArrowLeft", "KeyA"],
      function leftPress() {
        input.kb.dir |= Direction.Left;
      },
      function leftRelease() {
        input.kb.dir &= ~Direction.Left;
      }
    ),

    up: new Key(
      ["ArrowUp", "KeyW"],
      function upPress() {
        input.kb.dir |= Direction.Up;
      },
      function upRelease() {
        input.kb.dir &= ~Direction.Up;
      }
    ),

    right: new Key(
      ["ArrowRight", "KeyD"],
      function rightPress() {
        input.kb.dir |= Direction.Right;
      },
      function rightRelease() {
        input.kb.dir &= ~Direction.Right;
      }
    ),
    down: new Key(
      ["ArrowDown", "KeyS"],
      function downPress() {
        input.kb.dir |= Direction.Down;
      },
      function downRelease() {
        input.kb.dir &= ~Direction.Down;
      }
    ),
  },
  mouse: {},
  gamestate: undefined,
};

export function checkDirection(
  valueToCheck,
  { ifUp: doUp, ifDown: doDown, ifLeft: doLeft, ifRight: doRight }
) {
  if (valueToCheck & Direction.Up) doUp();
  if (valueToCheck & Direction.Right) doRight();
  if (valueToCheck & Direction.Down) doDown();
  if (valueToCheck & Direction.Left) doLeft();
}

function mouseEvListener(ev) {
  {
    ev.preventDefault();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!(ev.target.nodeName === "CANVAS")) return;
    let { offsetX, offsetY } = ev,
      [dx, dy] = [offsetX - targetObj.x, offsetY - targetObj.y];
    // targetObj.rotation = Math.atan2(dy, dx);
    // targetObj.setPosition(offsetX, offsetY);
  }
}

/**
 * @typedef {PointerEvent} SpecialEvt
 * @property {EventTarget}
 *
 * */

/** @param {import("../classes").DisplayObject} targetObj */
export function initControl(targetObj = undefined) {
  document.addEventListener("click", (ev) => {
    ev.preventDefault();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // if (!(ev.target.nodeName === "CANVAS")) return;
    // let { offsetX, offsetY } = ev;
    // targetObj.setPosition(offsetX, offsetY);
  });
  document.addEventListener("mousemove", (ev) => {
    ev.preventDefault();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // if (!(ev.target.nodeName === "CANVAS")) return;
    // let { offsetX, offsetY } = ev,
    //   [dx, dy] = [offsetX - targetObj.x, offsetY - targetObj.y];
    // targetObj.rotation = Math.atan2(dy, dx);
  });

  document.addEventListener("keydown", (ev) => {
    console.log(ev);
    let match = (/** @type {RegExp} */ rg) => rg.test(ev.code);
    if (!match(/^Ar|y[WASD]$/)) return;
    ev.preventDefault();
    switch (true) {
      case match(/[yU][Wp]$/):
        keyPress |= Direction.Up;
        break;
      case match(/[yw][Sn]$/):
        keyPress |= Direction.Down;
        break;
      case match(/[yh][Dt]$/):
        keyPress |= Direction.Right;
        break;
      case match(/[yf][At]$/):
        keyPress |= Direction.Left;
        break;
    }
  });
}
