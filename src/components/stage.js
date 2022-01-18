/**
 * @param {import("../classes").DisplayObject} contain
 */
export function contain(sprite, bounds, bounce = false) {
  let x = bounds.x;
  let y = bounds.y;
  let width = bounds.width;
  let height = bounds.height;
  let collision;
  let bounciness = 0.96;

  //* left
  if (sprite.x < 0) {
    if (bounce) sprite.vx *= -bounciness;
    if (sprite.mass) sprite.vx /= sprite.mass;
    sprite.x = x;
    collision = "left";
  }
  //* top
  if (sprite.y < y) {
    if (bounce) sprite.vy *= -bounciness;
    if (sprite.mass) sprite.vy /= sprite.mass;
    sprite.y = y;
    collision = "top";
  }
  //* right
  if (sprite.x + sprite.width > width) {
    if (bounce) sprite.vx *= -bounciness;
    if (sprite.mass) sprite.vx /= sprite.mass;
    sprite.x = width - sprite.width;
    collision = "right";
  }
  //* bottom
  if (sprite.y + sprite.height > height) {
    if (bounce) sprite.vy *= -bounciness;
    if (sprite.mass) sprite.vy /= sprite.mass;
    sprite.y = height - sprite.height;
    collision = "bottom";
  }

  return collision;
}
