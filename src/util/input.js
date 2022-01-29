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
    hero.facing = "Left";
    hero.textures = hero.animations["runLeft"];
    if (!hero.playing) hero.play();
    hero.vx = -velocity;
    hero.vy = 0;
  };
  left.release = () => {
    if (!right.isDown && hero.vy === 0) {
      hero.vx = 0;
      hero.textures = hero.animations["standLeft"];
      hero.gotoAndStop(0);
    }
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
  };
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
  };
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
