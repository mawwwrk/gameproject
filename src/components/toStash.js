/**
 * @param { CanvasRenderingContext2D } ctx
 * @param {number} x
 * @param {number} y
 */
export function testHelper(ctx, x, y) {
  return function (
    /** @type {number} */ radius,
    /** @type {keyof typeof ctx} */ drawFunc,
    startAngle = 0,
    endAngle = Math.PI * 2
  ) {
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle);
    /** @type {Function} */ (ctx[drawFunc])();
  };
}
export function point(centreX, centreY, radius, angle) {
  let x, y;
  x = centreX + radius * Math.cos(angle);
  y = centreY + radius * Math.sin(angle);

  return { x: x, y: y };
}

export function drawPoint(obj) {
  const offset = (45 / 180) * Math.PI;
  const compAngles = [obj.rotation - offset, obj.rotation + offset];
  const path = new Path2D();
  path.moveTo(obj.x, obj.y);
  const compPoints = compAngles.map((a) =>
    point(obj.x, obj.y, obj.radius * 0.35, a)
  );
  path.lineTo(compPoints[0].x, compPoints[0].y);
  const targetPoint = point(obj.x, obj.y, obj.radius, obj.rotation);
  path.lineTo(targetPoint.x, targetPoint.y);
  path.lineTo(compPoints[1].x, compPoints[1].y);
  return path;
}

export const projectile =
  (stage, assets) =>
  (source, height = 2, width = 8) => {
    const projectile = new Sprite(source);
    stage.addChild(projectile);
    let { x, y } = projectile.frames[6].frame;
    projectile.broken = [projectile.frames[7], projectile.frames[8]];
    projectile.sourceX = x;
    projectile.sourceY = y;
    projectile.hitbox = new Rectangle(height, width, "none", "none");
    projectile.addChild(projectile.hitbox);
    projectile.putCenter(projectile.hitbox);
    return (props) => Object.assign(projectile, props);
  };

export function shoot(
  shooter,
  angle,
  offsetFromCenter,
  projectileSpeed,
  projectileArray,
  projectileSprite
) {
  //Make a new sprite using the user-supplied `bulletSprite` function
  let projectile = projectileSprite();
  //Set the bullet's start point
  projectile.inFlight = true;
  projectile.rotation = angle;
  projectile.x =
    shooter.centerX - projectile.halfWidth + offsetFromCenter * Math.cos(angle);
  projectile.y =
    shooter.centerY -
    projectile.halfHeight +
    offsetFromCenter * Math.sin(angle);
  //Set the bullet's velocity
  projectile.friction = 0.985;
  projectile.vx = Math.cos(angle) * projectileSpeed;
  projectile.vy = Math.sin(angle) * projectileSpeed;
  //Push the bullet into the `bulletArray`

  projectileArray.push(projectile);
}

export function remove(...spritesToRemove) {
  spritesToRemove.forEach((sprite) => {
    sprite.parent.removeChild(sprite);
  });
}
let checkDirection, Direction, randomInt, Circle, Rectangle, AnimatedSprite;

export class Hero extends AnimatedSprite {
  #currentFrame;
  #state;
  #input;
  constructor(source, width = 120, height = 120) {
    super(source);
    this.hitbox = new Rectangle(width, height, "none", "none");
    this.#currentFrame = 0;
    this.addChild(this.hitbox);
    this.putCenter(this.hitbox, 0, 4);

    this.attackRange = new Circle(40, "none", "none", 3);
    this.addChild(this.attackRange);
    this.putCenter(this.attackRange);

    // console.log(this.attackRange);

    Object.assign(this, {
      x: 120,
      y: 120,
      shadow: true,
      friction: 0.72,
      acceleration: 3,
    });

    this.facing = "Down";
    this.animation = "shield";

    this.state = "standing";
  }

  set state(value) {
    this.switchState(value);
    this.#state = value;
  }
  get state() {
    return this.#state;
  }

  switchState(state) {
    let attack;
    switch (state) {
      case "standing":
        this.playing = false;
        this.animation = "shield";
        this.show(this.states[`${this.animation}${this.facing}`][0]);
        break;
      case "moving":
        this.animation = "shield";
        this.loop = true;
        this.playSequence(this.states[`${this.animation}${this.facing}`]);
        break;
      case "attack":
        // console.log(this.#input.mouse.button);
        if (this.#input.mouse.button === 2) {
          if (Math.abs(this.#input.mouse.atan2) > 2) {
            this.facing = "Left";
          } else if (Math.abs(this.#input.mouse.atan2) < 1) {
            this.facing = "Right";
          } else {
            this.#input.mouse.atan2 < 0
              ? (this.facing = "Up")
              : (this.facing = "Down");
          }
        }
        if (
          this.vX * this.vY > this.accelerationX * this.accelerationY &&
          this.#input.mouse.button === 0
        ) {
          attack = "dash";
        } else {
          attack = ["stab", ["swipe", "swing"][randomInt(0, 1)], "bow"][
            this.#input.mouse.button
          ];
        }
        this.#input.mouse.button = undefined;
        if (this.state === "attack") return;
        this.stopAnimation();
        this.fps = 24;
        this.onComplete = () => {
          this.loop = true;
          this.playing = false;
          this.fps = 12;
          this.show(this.states[`shield${this.facing}`][0]);
          this.onComplete = null;
        };
        this.loop = false;
        this.playSequence(this.states[`${attack}${this.facing}`]);
        break;
    }
  }

  standing() {
    if (!this.#input.gamestate === "inTown") {
      if (this.#input.mouse.button in [1, 2, 3]) this.state = "attack";
    }
    if (this.#input.kb.dir !== Direction.None) this.state = "moving";
  }

  moving() {
    /* console.log(
      this.#input.kb.dir,
      Direction[`${this.facing}`],
      !(this.#input.kb.dir & Direction[`${this.facing}`])
    ); */
    // if (this.#input.kb.dir & ~Direction[`${this.facing}`])
    //   this.state = "moving";

    if (this.#input.mouse.button in [1, 2, 3]) {
      this.state = "attack";
      return;
    }
    if (this.#input.kb.dir === Direction.None) {
      this.state = "standing";
      return;
    }

    this.move(this.#input.kb.dir);
  }
  attack() {
    if (this.playing) {
      return;
    } else {
      this.state = "standing";
    }
  }
  // doAction() {
  //   if (this.playing) return;
  //   this.onComplete = () => {
  //     this.loop = true;
  //     this.playing = false;
  //     this.show(this.states[`moveShield${this.facing}`][0]);
  //     this.onComplete = null;
  //   };
  //   this.loop = false;
  //   this.playing = true;
  //   this.playAnimation(this.states[`swing${this.facing}1`]);
  // }
  // doSwordAttack() {
  //   this.loop = false;
  //   this.play();
  // }
  // changeState(env) {
  //   // console.log(env);
  //   switch (this.state) {
  //     case "standing":
  //       this.facing = env.input.key;
  //       if (env.input.dir !== Direction.None) this.state = "moving";
  //       if (env.input.mouseaction) {
  //         this.state = "attackWithSword";
  //       }
  //       break;
  //     case "moving":
  //       this.facing = env.input.key;
  //       if (env.input.dir === Direction.None) {
  //         this.state = "standing";
  //         this.stop();
  //       }
  //       if (env.mouseaction === "click") {
  //         this.state = "attackingWithSword";
  //         this.doSwordAttack();
  //       }
  //       break;
  //     case "attackWithSword":
  //       console.log(this.state);
  //       if (this.currentFrame === this.frames.length) {
  //         this.state = "standing";
  //         this.playing = false;
  //         this.loop = true;
  //         this.reset();
  //       }
  //       break;
  //     default:
  //       break;
  //   }
  // }
  act(env) {
    // this.changeState(env);
    // if (this.state === "moving") {
    //   if (!this.playing) this.play();
    //   this.move(env.input.dir);
    // }
    this.update();
  }

  move(dir) {
    checkDirection(dir, {
      ifUp: () => (this./* y  */ vY -= this.accelerationY),
      ifDown: () => (this./* y  */ vY += this.accelerationY),
      ifLeft: () => (this./* x  */ vX -= this.accelerationX),
      ifRight: () => (this./* x  */ vX += this.accelerationX),
    });
  }

  update(input) {
    this.#input = input;
    this[`${this.state}`]();
    this.vX *= this.frictionX;
    this.vY *= this.frictionY;
    this.x = this.x + this.vX;
    this.y = this.y + this.vY;
  }
}
