// PROCESSO
import { gsap } from 'gsap';

const BG_SPEED = 0.35;

const DEPTH = {
  blur: 4,
  scale: 0.08,
  rotate: 2.5,
  y: 18,
  opacity: 0.35
};

const DEPTH_MOBILE = {
  blur: 0,
  scale: 0.06,
  rotate: 2,
  y: 12,
  opacity: 0.4
};

export function initProcess({ isMobile, reduceMotion }) {
  if (reduceMotion) return;

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

  const distance = () => Math.max(0, track.scrollWidth - stage.clientWidth);

  const depth = isMobile ? DEPTH_MOBILE : DEPTH;
  function setDepth(progress) {
    const focus = progress * (cards.length - 1);
    cards.forEach((card, i) => {
      const d = Math.min(Math.max(Math.abs(i - focus) - 0.15, 0) / 0.85, 1);
      const side = i < focus ? -1 : 1;
      gsap.set(card, {
        filter: depth.blur && d > 0.01 ? `blur(${(d * depth.blur).toFixed(2)}px)` : 'none',
        scale: 1 - d * depth.scale,
        rotation: side * d * depth.rotate,
        y: d * depth.y,
        opacity: 1 - d * depth.opacity,
      });
    });
  }

  let current = -1;
  function setActive(progress) {
    const index = Math.round(progress * (total - 1));
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
        setDepth(self.progress);
      },
    },
  });

  tl.to(track, { x: () => -distance(), ease: 'none' }, 0);
  if (!isMobile) {
    tl.to(bg, { x: () => -distance() * BG_SPEED, ease: 'none' }, 0);
  }

  setActive(0);
  setDepth(0);

  return () => {
    gsap.set(cards, { clearProps: 'filter,transform,opacity' });
    section.classList.remove('is-animated');
  };
}
