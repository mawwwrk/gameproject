export function statsReadout(
  windowWidth,
  ctx,
  hero,
  { totalElapsed, framesDrawn, updateCycles }
) {
  return [
    `totalElapsed:\t ${totalElapsed.toFixed(2).padStart(6)}`,
    `framesDrawn:\t ${framesDrawn.toString().padStart(6)}`,
    `fps:\t ${((1e3 * framesDrawn) / totalElapsed)
      .toFixed(2)
      .padStart(6)} updates/sec: \t${((1e3 * updateCycles) / totalElapsed)
      .toFixed(2)
      .padStart(6)}`,
    `updatecycles:\t ${updateCycles.toString().padStart(6)}`,
    `linkVelocity:\t ${(hero.vX + hero.vY).toFixed(2)},\tx: ${Math.round(
      hero.x
    )}\ty: ${Math.round(hero.y)}`,
    `state:\t ${hero.state} ${hero.currentFrame} ${hero.loop} ${hero.doNotInterrupt}`,
    `state:\t ${hero.playing} `,
  ];
}
