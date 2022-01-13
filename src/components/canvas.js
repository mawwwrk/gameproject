import { resizeCallback } from "../util";

export function makeCanvas(width = 256, height = 256) {
  //Make the canvas element and add it to the DOM

  const canvas = document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  document.body.insertBefore(
    canvas,
    document.querySelectorAll("body > :last-child")[0]
  );
  canvas.ctx = canvas.getContext("2d");
  return canvas;
}

export const resizeObserver = new ResizeObserver(resizeCallback);
