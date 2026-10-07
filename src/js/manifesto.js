// =========================================================
// MANIFESTO — as linhas começam coladas e se afastam,
// revelando "O site, depois." no meio
// =========================================================
import { gsap } from 'gsap';

export function initManifesto({ isMobile, reduceMotion }) {
  if (reduceMotion) return; // fica no estado aberto (CSS)

  const stage = document.querySelector('.manifesto__stage');
  const top = stage.querySelector('.manifesto__line--top');
  const bottom = stage.querySelector('.manifesto__line--bottom');
  const body = stage.querySelector('.manifesto__body');

  // Distância que cada linha anda até encostar na outra
  const offset = () => {
    const gap = parseFloat(getComputedStyle(stage).rowGap) || 0;
    return body.offsetHeight / 2 + gap;
  };

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: stage,
      start: 'top top',
      end: isMobile ? '+=90%' : '+=140%',
      pin: true,
      scrub: isMobile ? 0.6 : true,
      invalidateOnRefresh: true,
    },
  });

  tl.fromTo(top, { y: () => offset(), scale: 1.06 }, { y: 0, scale: 1, ease: 'power2.inOut' }, 0)
    .fromTo(bottom, { y: () => -offset(), scale: 1.06 }, { y: 0, scale: 1, ease: 'power2.inOut' }, 0)
    .fromTo(body,
      { clipPath: 'inset(50% 0% 50% 0%)', autoAlpha: 0 },
      { clipPath: 'inset(0% 0% 0% 0%)', autoAlpha: 1, ease: 'power2.inOut' },
      0.12
    );
}
