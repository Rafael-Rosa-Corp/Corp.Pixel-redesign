// =========================================================
// SOBRE — a linha ativa acende e mostra o comentário
//
// Desktop: a lista trava no meio da tela e cada linha ganha um
//          "pedaço" fixo de rolagem (LINE_SCROLL), então uma rolagem
//          leve não pula duas linhas.
// Celular: sem trava; acende a linha que passa pela marca de 60% da tela.
// =========================================================
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Quanto rolar para trocar de linha no desktop (fração da altura da tela)
const LINE_SCROLL = 0.45;

export function initAbout({ isDesktop, reduceMotion }) {
  if (reduceMotion) return; // todas as linhas visíveis (CSS)

  const section = document.querySelector('.about');
  const list = section.querySelector('.about__lines');
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

  let current = -1;
  function activate(index) {
    if (index === current) return;
    if (current > -1) setActive(lines[current], wraps[current], false);
    if (index > -1) setActive(lines[index], wraps[index], true);
    current = index;
  }

  let trigger;

  if (isDesktop) {
    // Trava a lista no centro e divide a rolagem em partes iguais por linha
    trigger = ScrollTrigger.create({
      trigger: list,
      start: 'center center',
      end: () => `+=${window.innerHeight * LINE_SCROLL * lines.length}`,
      pin: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        activate(Math.min(lines.length - 1, Math.floor(self.progress * lines.length)));
      },
      onEnter: () => activate(0),
      onLeaveBack: () => activate(-1),
    });
  } else {
    // Celular: acende a linha que estiver na marca de 60% da tela (calculado ao vivo)
    const pick = () => {
      const mark = window.innerHeight * 0.6;
      let index = -1;
      lines.forEach((line, i) => {
        if (line.getBoundingClientRect().top <= mark) index = i;
      });
      activate(index);
    };
    trigger = ScrollTrigger.create({
      trigger: list,
      start: 'top 60%',
      end: 'bottom 60%',
      onUpdate: pick,
      onEnter: pick,
      onEnterBack: pick,
      onLeaveBack: () => activate(-1), // voltou para cima da lista: apaga tudo
      // ao passar da lista para baixo, a última linha continua acesa
    });
  }

  return () => {
    trigger.kill();
    gsap.killTweensOf(wraps);
    gsap.set(wraps, { clearProps: 'height' });
    section.classList.remove('is-interactive');
    lines.forEach((line) => line.classList.remove('is-active'));
  };
}
