// =========================================================
// PARALLAX — o conteúdo de Trabalhos e Contato sobe mais devagar
// que o resto da página (só desktop, junto com o ScrollSmoother).
// Uso no HTML: data-parallax="120" → o elemento "atrasa" até 120px
// enquanto a seção atravessa a tela. Número maior = mais lento.
// =========================================================
import { gsap } from 'gsap';

export function initParallax({ isDesktop, finePointer, reduceMotion }) {
  if (!isDesktop || !finePointer || reduceMotion) return;

  document.querySelectorAll('[data-parallax]').forEach((el) => {
    const section = el.closest('section') || el.parentElement;
    gsap.fromTo(el,
      { y: 0 },
      {
        y: () => parseFloat(el.dataset.parallax) || 0,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      }
    );
  });
}
