import "./ctstyle.css";

const [canv1, canv2] = ["canv1", "canv2"].map((el) =>
  document.getElementById(el)
) as [HTMLCanvasElement, HTMLCanvasElement];

const [ctx1, ctx2] = [canv1, canv2].map((el) => el.getContext("2d"));

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
let tmaybe: number = 30;

slider1?.addEventListener("input", (ev) => {
  tmaybe = ev.target.value;
  draw();
});

let [x, y, radius] = [80, 80, 50];
function draw() {
  ctx2?.clearRect(0, 0, canv2.width, canv2.height);
  ctx2?.beginPath();
  ctx2?.moveTo(x, y);
  ctx2?.lineTo(
    radius * Math.cos(tmaybe * degree) + x,
    radius * Math.sin(tmaybe * degree) + y
  );
  ctx2?.arc(x, y, radius, tmaybe * degree, (parseInt(tmaybe) + 60) * degree);
  ctx2?.lineTo(x, y);
  ctx2?.stroke();
  /*  */
  ctx2?.beginPath();
  ctx2?.moveTo(x, y);
  ctx2?.lineTo(
    0.3 * radius * Math.cos(tmaybe * degree) + x,
    0.3 * radius * Math.sin(tmaybe * degree) + y
  );
  ctx2?.arc(
    x,
    y,
    0.3 * radius,
    (parseInt(tmaybe) - 5) * degree,
    (parseInt(tmaybe) + 70) * degree
  );
  ctx2?.lineTo(x, y);

  ctx2?.fill();

  //   ctx2?.beginPath();
  //   ctx2?.arc(x, y, radius, 0, degree * 360);
  //   ctx2?.stroke();
}
