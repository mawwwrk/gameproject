import "./ctstyle.css";

const [canv1, canv2] = ["canv1", "canv2"].map((el) =>
  document.getElementById(el)
) as [HTMLCanvasElement, HTMLCanvasElement];

const { height: canvas_height, width: canvas_width } = getComputedStyle(
  document.querySelector(".canvas-container") as HTMLDivElement
);

canv1.height = canv2.height = parseInt(canvas_height);
canv1.width = canv2.width = parseInt(canvas_width);

const [ctx1, ctx2] = [canv1, canv2].map((el) => el.getContext("2d")) as [
  CanvasRenderingContext2D,
  CanvasRenderingContext2D
];

// ctx1.fillRect(20, 20, 50, 50);

const [slider1, slider2, slider3, slider4] = [
  "slider1",
  "slider2",
  "slider3",
  "slider4",
].map((el) => document.getElementById(el));

//Equation of a Circle: (parametric coordinates)
//?    for a circle with origin (j, k) and radius r:
//?      x(t) = r cos(t) + j       y(t) = r sin(t) + k

let start, end, span;

const degree = Math.PI / 180;
let tmaybe: string | number;

slider1?.addEventListener("input", (ev) => {
  tmaybe = ev.target.value;
  if (typeof tmaybe === "string") tmaybe = parseInt(tmaybe);
  draw();
});

let [x, y, radius] = [80, 80, 50];
function draw() {
  // ctx2?.clearRect(0, 0, canv2.width, canv2.height);
  ctx2?.beginPath();
  // ctx2?.moveTo(x, y);
  // ctx2?.lineTo(
  //   radius * Math.cos(tmaybe * degree) + x,
  //   radius * Math.sin(tmaybe * degree) + y
  // );
  ctx2?.arc(x, y, radius, tmaybe * degree, (parseInt(tmaybe) + 60) * degree);
  // ctx2?.lineTo(x, y);
  ctx2?.stroke();

  /* smaller arc */
  // ctx2?.beginPath();
  // ctx2?.moveTo(x, y);
  // ctx2?.lineTo(
  //   0.3 * radius * Math.cos(tmaybe * degree) + x,
  //   0.3 * radius * Math.sin(tmaybe * degree) + y
  // );
  // ctx2?.arc(x, y, 0.3 * radius, (tmaybe - 5) * degree, (tmaybe + 70) * degree);
  // ctx2?.lineTo(x, y);

  // ctx2?.fill();

  //   ctx2?.beginPath();
  //   ctx2?.arc(x, y, radius, 0, degree * 360);
  //   ctx2?.stroke();
}

const degToRad = (n) => (n / 360) * (Math.PI * 2);

function circOffsetPoint(radius, degreesInRad) {
  x = radius * Math.cos(degreesInRad);
  y = radius * Math.sin(degreesInRad);
  return { x, y };
}

function drawCone(x, y, radius, start, endOffset) {
  const [startAngle, endAngle] = [start, start + endOffset].map((x) =>
    degToRad(x)
  );

  const [sectorStart, sectorEnd] = [startAngle, endAngle].map((v) =>
    circOffsetPoint(radius, v)
  );

  const inset = ({ x, y }, inset = 0.5) => ({ x: x * inset, y: y * inset });
  const insetStartSector = inset(sectorStart);

  // const arc
  ctx2.beginPath();
  ctx2.moveTo(x + insetStartSector.x, y + insetStartSector.y);
  ctx2.arc(x, y, radius * 0.4, startAngle, endAngle);
  ctx2.lineTo(x + sectorEnd.x, y + sectorEnd.y);
  ctx2.arc(x, y, radius, endAngle, startAngle, true);
  ctx2.closePath();
  // ctx2.fillStyle = "rgba(0, 0, 0, 40%)";
  ctx2.fill();

  const path1 = new Path2D();
  let x1 = x + 300;

  // path1.moveTo(x1 + insetStartSector.x, y + insetStartSector.y);

  path1.arc(x1, y, radius * 0.4, startAngle, endAngle);
  // path1.lineTo(x1 + sectorEnd.x, y + sectorEnd.y);
  path1.arc(x1, y, radius, endAngle, startAngle, true);
  // path1.closePath();
  ctx1.fill(path1);
}

drawCone(100, 100, 100, 55, 20);
