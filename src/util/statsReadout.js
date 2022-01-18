export function statsReadout(
  windowWidth,
  ctx,
  hero,
  { timestamp, elapsed, totalElapsed, framesDrawn, updateCycles }
) {
  ctx.font = "13px sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 50%)";
  ctx.fillRect(windowWidth - 240, 20, 200, 110);
  ctx.fillStyle = "rgba(0,0,0,100%)";
  ctx.fillText(
    `linkVelocity:\t ${(hero.vX + hero.vY).toFixed(2)}, x: \t${Math.round(
      hero.x
    )},y: \t ${Math.round(hero.y)}`,
    windowWidth - 237,
    0 + 125
  );
  ctx.fillText(
    `timestamp:\t ${timestamp.toFixed(0).padStart(6)}`,
    windowWidth - 237,
    0 + 35
  );
  ctx.fillText(
    `elapsed:\t ${elapsed.toFixed(2).padStart(6)}`,
    windowWidth - 237,
    0 + 50
  );
  ctx.fillText(
    `totalElapsed:\t ${totalElapsed.toFixed(2).padStart(6)}`,
    windowWidth - 237,
    0 + 65
  );
  ctx.fillText(
    `framesDrawn:\t ${framesDrawn.toString().padStart(6)}`,
    windowWidth - 237,
    0 + 80
  );
  ctx.fillText(
    `fps:\t ${((1e3 * framesDrawn) / timestamp)
      .toFixed(2)
      .padStart(6)} updates/sec: \t${((1e3 * updateCycles) / timestamp)
      .toFixed(2)
      .padStart(6)}`,
    windowWidth - 237,
    0 + 110
  );
  ctx.fillText(
    `updatecycles:\t ${updateCycles.toString().padStart(6)}`,
    windowWidth - 237,
    0 + 95
  );
}
