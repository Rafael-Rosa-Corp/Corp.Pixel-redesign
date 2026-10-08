// =========================================================
// SOBRE — a linha no meio da tela acende e mostra o comentário
// =========================================================
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initAbout({ reduceMotion }) {
  if (reduceMotion) return; // todas as linhas visíveis (CSS)

  const section = document.querySelector('.about');
  const lines = [...section.querySelectorAll('.about__line')];
  const wraps = lines.map((line) => line.querySelector('.about__comment-wrap'));
  section.classList.add('is-interactive');

  // Abre/fecha o comentário medindo a altura real do texto.
  // (O GSAP calcula o "auto" na hora, então não corta linha em nenhum navegador.)
  function setActive(line, wrap, active) {
    line.classList.toggle('is-active', active);
    gsap.to(wrap, {
      height: active ? 'auto' : 0,
      duration: 0.45,
      ease: 'power3.out',
      overwrite: true,
    });
  }

  // Uma linha "marca" a 60% da altura da tela: acende a linha que estiver nela.
  // É calculado ao vivo, então continua certo mesmo quando os comentários
  // abrem e empurram as linhas de baixo.
  let current = -1;
  function pick() {
    const mark = window.innerHeight * 0.6;
    let index = -1;
    lines.forEach((line, i) => {
      if (line.getBoundingClientRect().top <= mark) index = i;
    });
    if (index === current) return;
    if (current > -1) setActive(lines[current], wraps[current], false);
    if (index > -1) setActive(lines[index], wraps[index], true);
    current = index;
  }

  function clear() {
    if (current > -1) setActive(lines[current], wraps[current], false);
    current = -1;
  }

  const list = section.querySelector('.about__lines');
  const trigger = ScrollTrigger.create({
    trigger: list,
    start: 'top 60%',
    end: 'bottom 60%',
    onUpdate: pick,
    onEnter: pick,
    onEnterBack: pick,
    onLeaveBack: clear, // voltou para cima da lista: apaga tudo
    // ao passar da lista para baixo, a última linha continua acesa
  });

  return () => {
    trigger.kill();
    gsap.killTweensOf(wraps);
    gsap.set(wraps, { clearProps: 'height' });
    section.classList.remove('is-interactive');
    lines.forEach((line) => line.classList.remove('is-active'));
  };
}
