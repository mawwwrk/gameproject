let n = 0;
export function makeCanvas(selector = "canvas", width = 384, height = 384) {
  //Make the canvas element and add it to the DOM
  /**
   * @type {{ctx: CanvasRenderingContext2D} extends HTMLCanvasElement} canvas
   */
  const canvas = document.createElement("canvas");
  ++n;
  selector === "canvas"
    ? canvas.classList.add(`${selector}${n}`)
    : (canvas.id = selector);

  canvas.width = width;
  canvas.height = height;

  document.body.insertBefore(
    canvas,
    document.querySelectorAll("body > :last-child")[0]
  );
  canvas.ctx = canvas.getContext("2d");
  return canvas;
}
