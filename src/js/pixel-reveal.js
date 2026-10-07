// =========================================================
// PIXEL REVEAL — imagens dos cases entram pixeladas
// e ganham nitidez (no desktop, repete no hover)
// =========================================================
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Tamanho do "pixel" em cada passo (px). O último (1) = imagem nítida.
const STEPS = [48, 32, 22, 16, 11, 8, 5, 3, 2, 1];

function setupReveal(figure, { hover }) {
  const img = figure.querySelector('img');
  const canvas = document.createElement('canvas');
  canvas.className = 'pixel-reveal__canvas';
  canvas.setAttribute('aria-hidden', 'true');
  figure.append(canvas);
  const ctx = canvas.getContext('2d');
  const state = { step: 0 };
  let ready = false;
  let revealed = false;
  let pendingPlay = false;

  // Desenha a imagem em baixa resolução (efeito "object-fit: cover")
  function draw() {
    if (!ready) return;
    const block = STEPS[Math.round(state.step)];
    canvas.classList.toggle('is-hidden', block === 1);
    if (block === 1) return;
    const w = figure.clientWidth;
    const h = figure.clientHeight;
    const cw = Math.max(1, Math.ceil(w / block));
    const ch = Math.max(1, Math.ceil(h / block));
    if (canvas.width !== cw || canvas.height !== ch) {
      canvas.width = cw;
      canvas.height = ch;
    }
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    ctx.imageSmoothingEnabled = true;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
  }

  function play(from = 0, duration = 1.2) {
    if (!ready) {
      pendingPlay = true;
      return;
    }
    gsap.killTweensOf(state);
    state.step = from;
    draw();
    gsap.to(state, {
      step: STEPS.length - 1,
      duration,
      ease: 'power1.in',
      onUpdate: draw,
      onComplete: () => { revealed = true; },
    });
  }

  img.decode()
    .catch(() => {})
    .then(() => {
      if (!img.naturalWidth) return;
      ready = true;
      draw();
      if (pendingPlay) play();
    });

  const trigger = ScrollTrigger.create({
    trigger: figure,
    start: 'top 80%',
    once: true,
    onEnter: () => play(),
  });

  const onEnter = () => { if (revealed) play(4, 0.6); };
  if (hover) figure.addEventListener('pointerenter', onEnter);

  const onResize = () => draw();
  window.addEventListener('resize', onResize);

  return () => {
    trigger.kill();
    gsap.killTweensOf(state);
    figure.removeEventListener('pointerenter', onEnter);
    window.removeEventListener('resize', onResize);
    canvas.remove();
  };
}

export function initPixelReveal({ reduceMotion, finePointer }) {
  if (reduceMotion) return;
  const cleanups = [...document.querySelectorAll('[data-pixel-reveal]')]
    .map((figure) => setupReveal(figure, { hover: finePointer }));
  return () => cleanups.forEach((fn) => fn());
}
