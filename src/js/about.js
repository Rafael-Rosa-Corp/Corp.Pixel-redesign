// =========================================================
// SOBRE — a linha no meio da tela acende e mostra o comentário
// =========================================================
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initAbout({ reduceMotion }) {
  if (reduceMotion) return; // todas as linhas visíveis (CSS)

  const section = document.querySelector('.about');
  const lines = [...section.querySelectorAll('.about__line')];
  section.classList.add('is-interactive');

  const triggers = lines.map((line) => ScrollTrigger.create({
    trigger: line,
    start: 'top 60%',
    end: 'bottom 60%',
    onToggle: (self) => line.classList.toggle('is-active', self.isActive),
  }));

  return () => {
    triggers.forEach((t) => t.kill());
    section.classList.remove('is-interactive');
    lines.forEach((line) => line.classList.remove('is-active'));
  };
}
