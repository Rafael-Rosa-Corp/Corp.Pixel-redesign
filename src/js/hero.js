// =========================================================
// HERO — pixels espalhados que se montam no polvo com o scroll
// =========================================================
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { getLogoPixels, LOGO } from './logo.js';

// Ajustes finos da animação
const SETTINGS = {
  maxDelay: 0.35,          // atraso máximo entre pixels (0 a 1 do scroll)
  pinDesktop: '+=160%',    // quanto scroll dura a montagem no desktop
  pinMobile: '+=90%',      // ... e no celular
  logoMaxWidth: 0.86,      // largura máxima do polvo (fração da tela)
};

const lerp = (a, b, t) => a + (b - a) * t;
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

export function initHero({ isMobile, reduceMotion }) {
  const stage = document.querySelector('.hero__stage');
  const canvas = stage.querySelector('.hero__canvas');
  const content = stage.querySelector('.hero__content');
  const title = stage.querySelector('.hero__title');
  const hint = stage.querySelector('.hero__hint');
  const ctx = canvas.getContext('2d');

  const pixels = getLogoPixels().map((px) => ({
    ...px,
    rx: Math.random(),
    ry: Math.random(),
    startScale: lerp(0.3, 1.8, Math.random()),
    startAlpha: lerp(0.15, 0.7, Math.random()),
    delay: Math.random() * SETTINGS.maxDelay,
  }));

  const state = { progress: reduceMotion ? 1 : 0 };
  let layout = null;
  let frame = 0;

  // Calcula tamanho do pixel e posições com base no tamanho da tela
  function measure() {
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const headerH = document.querySelector('.site-header').offsetHeight;
    const contentTop = content.offsetTop;
    const available = Math.max(contentTop - headerH - 24, 80);
    const cell = Math.max(2, Math.floor(Math.min(
      (width * SETTINGS.logoMaxWidth) / LOGO.cols,
      available / LOGO.rows
    )));
    const ox = Math.round((width - cell * LOGO.cols) / 2);
    const oy = Math.round(headerH + (available - cell * LOGO.rows) / 2);

    // Espalhamento: tela toda no desktop, mais contido no celular
    const spreadX = isMobile ? width * 0.7 : width * 1.1;
    const spreadY = isMobile ? height * 0.6 : height * 1.0;

    pixels.forEach((px) => {
      px.tx = ox + px.x * cell;
      px.ty = oy + px.y * cell;
      px.sx = width / 2 + (px.rx - 0.5) * spreadX;
      px.sy = height / 2 + (px.ry - 0.5) * spreadY;
    });

    layout = { width, height, cell };
  }

  function draw() {
    frame = 0;
    if (!layout) return;
    const { width, height, cell } = layout;
    const span = 1 - SETTINGS.maxDelay;
    ctx.clearRect(0, 0, width, height);

    for (const px of pixels) {
      const t = Math.min(Math.max((state.progress - px.delay) / span, 0), 1);
      const e = easeOut(t);
      const size = cell * lerp(px.startScale, 1, e);
      const x = lerp(px.sx, px.tx, e) + (cell - size) / 2;
      const y = lerp(px.sy, px.ty, e) + (cell - size) / 2;

      ctx.globalAlpha = lerp(px.startAlpha, 1, e);
      ctx.fillStyle = px.color;
      // +0.5 no fim evita frestas entre pixels vizinhos
      ctx.fillRect(x, y, size + (t === 1 ? 0.5 : 0), size + (t === 1 ? 0.5 : 0));
    }
    ctx.globalAlpha = 1;
  }

  const requestDraw = () => {
    if (!frame) frame = requestAnimationFrame(draw);
  };

  const onRefresh = () => {
    measure();
    draw();
  };

  measure();
  draw();
  ScrollTrigger.addEventListener('refresh', onRefresh);

  // Movimento reduzido: polvo montado, sem pin
  if (reduceMotion) {
    gsap.set(hint, { autoAlpha: 0 });
    return () => ScrollTrigger.removeEventListener('refresh', onRefresh);
  }

  const split = SplitText.create(title, { type: 'words,chars', mask: 'chars' });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: stage,
      start: 'top top',
      end: isMobile ? SETTINGS.pinMobile : SETTINGS.pinDesktop,
      pin: true,
      scrub: isMobile ? 0.6 : true,
    },
  });

  tl.to(state, { progress: 1, duration: 1, ease: 'none', onUpdate: requestDraw }, 0)
    .to(hint, { autoAlpha: 0, duration: 0.12, ease: 'none' }, 0)
    .from(split.chars, { yPercent: 110, duration: 0.25, stagger: 0.012, ease: 'power3.out' }, 0.68);

  return () => {
    ScrollTrigger.removeEventListener('refresh', onRefresh);
    cancelAnimationFrame(frame);
  };
}
