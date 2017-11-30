import colormap from 'colormap';

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

export function getColorCategory(n) {
  const lightness = 0.5;
  const saturation = 0.8;

  let colorCategory = [];
  for (let i = 0; i < n; i += 1) {
    const hue = (1 / (n - 1)) * i;
    const rgb = hslToRgb((2 / 3) * (1 - hue), saturation, lightness);

    let colorString = '#';
    rgb.forEach((color) => {
      colorString += color.toString(16);
    });
    colorCategory.push(colorString);
  }

  // color_category = d3_scale.schemeCategory20c;
  const options = {
    colormap: 'hot',
    nshades: n + 2,
    format: 'hex',
    alpha: 1,
  };

  colorCategory = colormap(options);
  return colorCategory;
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
