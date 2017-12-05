import blackBodyColormap from './black-body-colormap';

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
export function hslToRgb(h, s, l) {
  let r;
  let g;
  let b;

  if (s === 0) {
    r = l;
    g = l;
    b = l;
  } else {
    const hue2rgb = (p, q, tt) => {
      let t = tt;
      if (t < 0) {
        t += 1;
      }
      if (t > 1) {
        t -= 1;
      }
      if (t < 1 / 6) {
        return p + ((q - p) * 6 * t);
      }
      if (t < 1 / 2) {
        return q;
      }
      if (t < 2 / 3) {
        return p + ((q - p) * ((2 / 3) - t) * 6);
      }
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : (l + s) - (l * s);
    const p = (2 * l) - q;
    r = hue2rgb(p, q, h + (1 / 3));
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - (1 / 3));
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

export function getBlackBodyColormap(colormapSize) {
  const componentToHex = (c) => {
    // ref: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    const hex = c.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };

  const originalColormapSize = blackBodyColormap.n;
  const colorInterval = originalColormapSize / colormapSize;

  const newColormap = [];
  for (let i = 0; i < colormapSize; i += 1) {
    const r = blackBodyColormap.r[Math.floor(i * colorInterval)];
    const g = blackBodyColormap.g[Math.floor(i * colorInterval)];
    const b = blackBodyColormap.b[Math.floor(i * colorInterval)];
    const colorHex = `#${componentToHex(r) + componentToHex(g) + componentToHex(b)}`;
    newColormap.push(colorHex);
  }
  return newColormap;
}

export function drawFrame(canvas, ctx) {
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(canvas.width, 0);
  ctx.lineTo(canvas.width, canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.lineTo(0, 0);
  ctx.stroke();
}
