export const initDebug = (target: HTMLDivElement) =>
  function (args: string | string[]) {
    let debugStrings: string[] = [];
    typeof args === "string" ? debugStrings.push(args) : (debugStrings = args);
    const pDStrings = debugStrings.map((l) => `<p>${l}</p>`);

    // const lines = line: string => `<p>${line}</p>`
    const iDiv = document.createElement("div");
    iDiv.innerHTML = pDStrings.join("\n");

    target.append(iDiv);
  };

export const canvasDimDebugString = (canvas: HTMLCanvasElement) => [
  `canvas height / width (<b>att</b>/css): <b>${canvas.height}</b> / ${
    getComputedStyle(canvas).height
  } / <b>${canvas.width}</b> / ${getComputedStyle(canvas).width}`,
];

export const makeDebug = () => {
  const div = document.createElement("div");
  console.log(document);
  div.style.height = "100px";
  div.style.width = "100px";
  div.style.backgroundColor = "black";
  document.body.append("div");
};
