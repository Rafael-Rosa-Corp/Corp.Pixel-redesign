// MAIN
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SplitText } from 'gsap/SplitText';

import { initMenu } from './js/menu.js';
import { initAnchors, scrollToHash } from './js/scroll.js';
import { initSmoother } from './js/smooth.js';
import { initBriefing } from './js/briefing.js';
import { initHero } from './js/hero.js';
import { initManifesto } from './js/manifesto.js';
import { initPixelReveal } from './js/pixel-reveal.js';
import { initProcess } from './js/process.js';
import { initAbout } from './js/about.js';
import { initCtaPixels } from './js/cta-pixels.js';
import { initLab } from './js/lab.js';
import { initTitles } from './js/titles.js';
import { initSocialIcons } from './js/social-icons.js';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

// Evita recálculos quando a barra de endereço do celular aparece/some
ScrollTrigger.config({ ignoreMobileResize: true });

initMenu();
initAnchors();
initBriefing();
initSocialIcons();

const mm = gsap.matchMedia();

mm.add(
  {
    isDesktop: '(min-width: 768px)',
    isMobile: '(max-width: 767px)',
    finePointer: '(pointer: fine)',
    reduceMotion: '(prefers-reduced-motion: reduce)',
  },
  (context) => {
    const conditions = context.conditions;

    initSmoother(conditions);

    // A ordem importa: seções de cima primeiro (por causa dos pins)
    const cleanups = [
      initHero(conditions),
      initManifesto(conditions),
      initPixelReveal(conditions),
      initProcess(conditions),
      initAbout(conditions),
      initCtaPixels(conditions),
      initLab(conditions),
      initTitles(conditions), // por último: depende das travas (pins) acima
    ].filter(Boolean);

    return () => cleanups.forEach((cleanup) => cleanup());
  }
);

// Âncora vinda de outra página (ex.: /#contato): vai até ela só depois de medir tudo
document.fonts.ready.then(() => {
  ScrollTrigger.refresh();
  if (window.location.hash) requestAnimationFrame(() => scrollToHash(window.location.hash, { instant: true }));
});
