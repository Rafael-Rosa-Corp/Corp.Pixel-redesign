// =========================================================
// PROCESSO — a seção trava e a "câmera" anda para a direita.
// Cards (frente) andam rápido; texto de fundo anda devagar.
// =========================================================
import { gsap } from 'gsap';

const BG_SPEED = 0.35; // velocidade da camada de fundo (0 = parada, 1 = igual aos cards)

// Profundidade dos cards fora de foco (só desktop)
const DEPTH = {
  blur: 4,      // desfoque máximo (px)
  scale: 0.08,  // quanto diminui (0.08 = 8%)
  rotate: 2.5,  // inclinação máxima (graus)
  y: 18,        // deslocamento para baixo (px)
  opacity: 0.35 // quanto apaga
};

export function initProcess({ isMobile, reduceMotion }) {
  if (reduceMotion) return; // fica a rolagem lateral nativa (CSS)

  const section = document.querySelector('.process');
  const stage = section.querySelector('.process__stage');
  const track = section.querySelector('.process__track');
  const bg = section.querySelector('.process__bg');
  const dots = [...section.querySelectorAll('.process__dot')];
  const count = section.querySelector('.process__count');
  const cards = [...section.querySelectorAll('.process-card')];
  const total = dots.length;
  const pad = (n) => String(n).padStart(2, '0');

  section.classList.add('is-animated');
  gsap.set(bg, { yPercent: -50, y: 0 });

  // Quanto o trilho precisa andar para o último card chegar na tela
  const distance = () => Math.max(0, track.scrollWidth - stage.clientWidth);

  // O card em foco acompanha o progresso (o 1º no começo, o último no fim).
  // Os outros ficam desfocados, menores e levemente tortos, conforme a distância.
  function setDepth(progress) {
    const focus = progress * (cards.length - 1);
    cards.forEach((card, i) => {
      // pequena "zona de foco": o card fica nítido um pouco antes e depois do centro
      const d = Math.min(Math.max(Math.abs(i - focus) - 0.15, 0) / 0.85, 1);
      const side = i < focus ? -1 : 1;
      gsap.set(card, {
        filter: d > 0.01 ? `blur(${(d * DEPTH.blur).toFixed(2)}px)` : 'none',
        scale: 1 - d * DEPTH.scale,
        rotation: side * d * DEPTH.rotate,
        y: d * DEPTH.y,
        opacity: 1 - d * DEPTH.opacity,
      });
    });
  }

  let current = -1;
  function setActive(progress) {
    const index = Math.min(total - 1, Math.floor(progress * total));
    if (index === current) return;
    current = index;
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i <= index));
    count.textContent = `${pad(index + 1)} / ${pad(total)}`;
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: stage,
      start: 'top top',
      end: () => `+=${distance()}`,
      pin: true,
      scrub: isMobile ? 0.6 : true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        setActive(self.progress);
        if (!isMobile) setDepth(self.progress);
      },
    },
  });

  tl.to(track, { x: () => -distance(), ease: 'none' }, 0);
  if (!isMobile) {
    tl.to(bg, { x: () => -distance() * BG_SPEED, ease: 'none' }, 0);
  }

  setActive(0);
  if (!isMobile) setDepth(0);

  return () => {
    gsap.set(cards, { clearProps: 'filter,transform,opacity' });
    section.classList.remove('is-animated');
  };
}
