export function drawGrid(graphics, input, fillStyle) {
  graphics.clear();
  graphics.beginTextureFill(fillStyle);
  for (let i = 0; i < input.length; i++) {
    let { rect } = input[i];
    graphics.drawShape(rect);
  }
}
export function drawGridConditional(graphics, input, condition, fillStyle) {
  graphics.clear();
  graphics.beginTextureFill(fillStyle);
  for (let i = 0; i < input.length; i++) {
    let { rect } = input[i];
    if (condition(input[i])) graphics.drawShape(rect);
  }
}
export function drawHitBox(graphics, input, fillStyle) {
  graphics.clear();
  graphics.beginTextureFill(fillStyle);
  graphics.drawShape(input);
}
