/**
 * @param {import("../classes").DisplayObject} contain
 */
export function contain(sprite, bounds, bounce = false) {
  let x = bounds.x,
    y = bounds.y,
    width = bounds.width,
    height = bounds.height;
  let collision;
  let bounciness = 0.96;

  let target = {};
  if (sprite.hitbox) {
    target.x = sprite.hitbox.gx;
    target.y = sprite.hitbox.gy;
    target.width = sprite.hitbox.width;
    target.height = sprite.hitbox.height;
  } else {
    target.x = sprite.x;
    target.y = sprite.y;
    target.width = sprite.width;
    target.height = sprite.height;
  }

  let offsetWidth = sprite.hitbox
    ? (sprite.width - sprite.hitbox.width) / 2
    : 0;
  let offsetHeight = sprite.hitbox
    ? (sprite.height - sprite.hitbox.height) / 2
    : 0;
  //* left
  if (target.x < 0) {
    if (bounce) sprite.vx *= -bounciness;
    if (sprite.mass) sprite.vx /= sprite.mass;
    sprite.x = x - offsetWidth;
    collision = "left";
  }
  //* top
  if (target.y < y) {
    if (bounce) sprite.vy *= -bounciness;
    if (sprite.mass) sprite.vy /= sprite.mass;
    sprite.y = y - offsetHeight;
    collision = "top";
  }
  //* right
  if (target.x + target.width > width) {
    if (bounce) target.vx *= -bounciness;
    if (sprite.mass) sprite.vx /= sprite.mass;
    sprite.x = width - sprite.width + offsetWidth;
    collision = "right";
  }
  //* bottom
  if (target.y + target.height > height) {
    if (bounce) sprite.vy *= -bounciness;
    if (sprite.mass) sprite.vy /= sprite.mass;
    sprite.y = height - sprite.height + offsetHeight;
    collision = "bottom";
  }

  return collision;
}
