export function render(stage, canvas) {
  let ctx = canvas.ctx;
  ctx.clearRect(0, 0, canvas.width, canvas.height); //Loop through each sprite object in the stage's `children` array
  stage.children.forEach((sprite) => {
    displaySprite(sprite);
  });

  function displaySprite(sprite) {
    if (
      sprite.visible &&
      sprite.gx < canvas.width + sprite.width &&
      sprite.gx + sprite.width >= -sprite.width &&
      sprite.gy < canvas.height + sprite.height &&
      sprite.gy + sprite.height >= -sprite.height
    ) {
      ctx.save();
      ctx.translate(
        sprite.x + sprite.width * sprite.pivotX,
        sprite.y + sprite.height * sprite.pivotY
      );
      ctx.rotate(sprite.rotation);
      ctx.globalAlpha = sprite.alpha * sprite.parent.alpha;
      ctx.scale(sprite.scaleX, sprite.scaleY);
      if (sprite.draw) sprite.draw(ctx);

      if (sprite.children && sprite.children.length > 0) {
        ctx.translate(
          -sprite.width * sprite.pivotX,
          -sprite.height * sprite.pivotY
        );
        sprite.children.forEach((child) => {
          displaySprite(child);
        });
      }
      ctx.restore();
    }
  }
}
