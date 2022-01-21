import { DisplayObject, Rectangle, Sprite } from "../classes";

export const proxiedResizeObserver = (/** @type {DisplayObject} */ alias) =>
  new ResizeObserver(resizeCallback(resizeProxy(alias)));

export const resizeCallback =
  (/** @type {ProxyHandler<any>} */ proxyHandler) =>
  (
    /** @type {{ contentRect: { width: any; height: any; }; target: any; }[]} */ entries
  ) => {
    entries.forEach(
      (
        /** @type {{ contentRect: { width: any; height: any; }; target: any; }} */ entry
      ) => {
        let target = entry.target;
        if (entry === entries[0]) {
          target = new Proxy(target, proxyHandler);
        }

        let { width, height } = entry.contentRect;
        // target.width;
        Object.assign(target, { width, height });
      }
    );
  };

export const resizeProxy = (
  /** @type {import("../classes").DisplayObject} */ alias
) => ({
  /**
   * @param {object} target
   * @param {PropertyKey} prop
   * @param {any} value
   */
  set(target, prop, value) {
    const origWidth = target.width;
    if (prop === "width" || prop === "height") {
      alias[prop] = value;
    }
    if (prop === "width") {
      const childSprites = alias.children;
      const background = childSprites[0];
      let [, ...restOfThem] = childSprites;
      let mod = value / origWidth;

      const aspectRatio = background.height / background.width;
      background.width = alias.width;
      background.height = alias.width * aspectRatio;

      if (origWidth !== 256)
        restOfThem.forEach((ea) => {
          let { x, y, scaleX } = ea;
          ea.setPosition(x * mod, y * mod);
          ea.scale = scaleX * mod;
        });
    }
    return Reflect.set(target, prop, value);
  },
});

/**
 * @param {number} min
 * @param {number} max
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @param {number} min
 * @param {number} max
 */
export function randomFloat(min, max) {
  return min + Math.random() * (max - min);
}

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

export function filterPropsIn(assets) {
  return (filename) => {
    return Object.keys(assets)
      .filter((x) => x.match(`${filename}_`))
      .map((x) => assets[x]);
  };
}

export const projectile =
  (stage, assets) =>
  (source, height = 2, width = 8) => {
    const projectile = new Sprite(source);
    stage.addChild(projectile);
    let { x, y } = projectile.frames[projectile.states.arrowRight[0]].frame;
    projectile.sourceX = x;
    projectile.sourceY = y;
    projectile.hitbox = new Rectangle(height, width, "none", "none");
    projectile.addChild(projectile.hitbox);
    projectile.putCenter(projectile.hitbox);
    return (props) => Object.assign(projectile, props);
  };

export function wait(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export function shoot(
  shooter,
  angle,
  offsetFromCenter,
  projectileSpeed,
  projectileArray,
  projectileSprite
) {
  //Make a new sprite using the user-supplied `bulletSprite` function
  let projectile = projectileSprite(); //Set the bullet's start point
  projectile.rotation = angle;
  projectile.x =
    shooter.centerX - projectile.halfWidth + offsetFromCenter * Math.cos(angle);
  projectile.y =
    shooter.centerY -
    projectile.halfHeight +
    offsetFromCenter * Math.sin(angle); //Set the bullet's velocity

  projectile.vx = Math.cos(angle) * projectileSpeed;
  projectile.vy = Math.sin(angle) * projectileSpeed; //Push the bullet into the `bulletArray`

  projectileArray.push(projectile);
}

export function remove(...spritesToRemove) {
  spritesToRemove.forEach((sprite) => {
    sprite.parent.removeChild(sprite);
  });
}

export function outsideBounds(sprite, bounds, extra = undefined) {
  let x = bounds.x,
    y = bounds.y,
    width = bounds.width,
    height = bounds.height;

  let collision;

  if (sprite.x < x - sprite.width) {
    collision = "left";
  }
  if (sprite.y < y - sprite.height) {
    collision = "top";
  }
  if (sprite.x > width) {
    collision = "right";
  }
  if (sprite.y > height) {
    collision = "bottom";
  }
  if (collision && extra) extra(collision);

  return collision;
}
