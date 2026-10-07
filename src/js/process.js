// =========================================================
// PROCESSO — a seção trava e a "câmera" anda para a direita.
// Cards (frente) andam rápido; texto de fundo anda devagar.
// =========================================================
import { gsap } from 'gsap';

const BG_SPEED = 0.35; // velocidade da camada de fundo (0 = parada, 1 = igual aos cards)

export function initProcess({ isMobile, reduceMotion }) {
  if (reduceMotion) return; // fica a rolagem lateral nativa (CSS)

  const section = document.querySelector('.process');
  const stage = section.querySelector('.process__stage');
  const track = section.querySelector('.process__track');
  const bg = section.querySelector('.process__bg');
  const dots = [...section.querySelectorAll('.process__dot')];
  const count = section.querySelector('.process__count');
  const total = dots.length;
  const pad = (n) => String(n).padStart(2, '0');

  section.classList.add('is-animated');
  gsap.set(bg, { yPercent: -50, y: 0 });

  // Quanto o trilho precisa andar para o último card chegar na tela
  const distance = () => Math.max(0, track.scrollWidth - stage.clientWidth);

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
      onUpdate: (self) => setActive(self.progress),
    },
  });

  tl.to(track, { x: () => -distance(), ease: 'none' }, 0);
  if (!isMobile) {
    tl.to(bg, { x: () => -distance() * BG_SPEED, ease: 'none' }, 0);
  }

  setActive(0);

  return () => {
    section.classList.remove('is-animated');
  };
}
