// =========================================================
// BOTÃO DO WHATSAPP — pixels preenchem o botão
// - Desktop: preenche no hover, desfaz ao sair
// - Celular: preenche ao tocar
// - Quando o formulário fica completo: "acende" uma vez
// Só funciona com o formulário completo (botão desabilitado não reage).
// =========================================================
import { gsap } from 'gsap';

const PIXEL = 8;            // tamanho de cada pixel (px)
const COLOR = '#EDEAE6';    // cor dos pixels (o texto vira escuro por cima)
const FILL_TIME = 0.4;      // segundos para preencher/desfazer

export function initCtaPixels({ finePointer, reduceMotion }) {
  if (reduceMotion) return;

  const form = document.querySelector('[data-briefing]');
  const cta = form.querySelector('[data-briefing-cta]');
  const canvas = document.createElement('canvas');
  canvas.className = 'briefing__cta-pixels';
  canvas.setAttribute('aria-hidden', 'true');
  cta.prepend(canvas);
  const ctx = canvas.getContext('2d');

  const state = { p: 0 };
  let cells = [];

  // Grade de pixels em ordem aleatória (cada célula acende na sua vez)
  function measure() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = cta.offsetWidth;
    const h = cta.offsetHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cells = [];
    for (let y = 0; y < h; y += PIXEL) {
      for (let x = 0; x < w; x += PIXEL) cells.push([x, y]);
    }
    for (let i = cells.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [cells[i], cells[j]] = [cells[j], cells[i]];
    }
    draw();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const count = Math.round(state.p * cells.length);
    ctx.fillStyle = COLOR;
    for (let i = 0; i < count; i += 1) {
      ctx.fillRect(cells[i][0], cells[i][1], PIXEL, PIXEL);
    }
    cta.classList.toggle('is-filled', state.p >= 0.55);
  }

  const enabled = () => cta.getAttribute('aria-disabled') !== 'true';
  const to = (p, duration = FILL_TIME) => gsap.to(state, {
    p, duration, ease: 'none', overwrite: true, onUpdate: draw,
  });

  // Desktop: hover
  const onEnter = () => { if (enabled()) to(1); };
  const onLeave = () => to(0);
  // Celular: toque (não impede o link de abrir o WhatsApp)
  const onTap = () => {
    if (!enabled()) return;
    gsap.killTweensOf(state);
    gsap.timeline()
      .to(state, { p: 1, duration: 0.25, ease: 'none', onUpdate: draw })
      .to(state, { p: 0, duration: 0.5, ease: 'none', onUpdate: draw }, '+=0.4');
  };
  // Formulário completo: acende e apaga uma vez
  const onComplete = () => {
    gsap.killTweensOf(state);
    gsap.timeline()
      .to(state, { p: 1, duration: 0.35, ease: 'none', onUpdate: draw })
      .to(state, { p: 0, duration: 0.45, ease: 'none', onUpdate: draw }, '+=0.15');
  };

  if (finePointer) {
    cta.addEventListener('pointerenter', onEnter);
    cta.addEventListener('pointerleave', onLeave);
    cta.addEventListener('focus', onEnter);
    cta.addEventListener('blur', onLeave);
  } else {
    cta.addEventListener('pointerdown', onTap);
  }
  form.addEventListener('briefing:complete', onComplete);

  const resize = new ResizeObserver(measure);
  resize.observe(cta);
  measure();

  return () => {
    gsap.killTweensOf(state);
    resize.disconnect();
    cta.removeEventListener('pointerenter', onEnter);
    cta.removeEventListener('pointerleave', onLeave);
    cta.removeEventListener('focus', onEnter);
    cta.removeEventListener('blur', onLeave);
    cta.removeEventListener('pointerdown', onTap);
    form.removeEventListener('briefing:complete', onComplete);
    cta.classList.remove('is-filled');
    canvas.remove();
  };
}
