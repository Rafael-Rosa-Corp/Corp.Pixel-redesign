// LOGO
import logo from '../data/logo.json';

export const LOGO = logo;

export function getLogoPixels(palette = logo.palette) {
  const pixels = [];
  logo.map.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (ch !== '.') pixels.push({ x, y, color: palette[ch] });
    });
  });
  return pixels;
}

export function drawLogo(canvas, palette = logo.palette) {
  canvas.width = logo.cols;
  canvas.height = logo.rows;
  const ctx = canvas.getContext('2d');
  getLogoPixels(palette).forEach(({ x, y, color }) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
  });
}
