// CASE
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SplitText } from 'gsap/SplitText';

import { initMenu } from './js/menu.js';
import { initAnchors } from './js/scroll.js';
import { initSmoother } from './js/smooth.js';
import { initPixelReveal } from './js/pixel-reveal.js';
import { initTitles } from './js/titles.js';
import { initSocialIcons } from './js/social-icons.js';
import { whatsappLink } from './js/config.js';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

// Evita recálculos quando a barra de endereço do celular aparece/some
ScrollTrigger.config({ ignoreMobileResize: true });

initMenu();
initAnchors();
initSocialIcons();
document.querySelectorAll('[data-whatsapp]').forEach((link) => {
  link.href = whatsappLink();
});

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

    const cleanups = [
      initPixelReveal(conditions),
      initTitles(conditions),
    ].filter(Boolean);

    return () => cleanups.forEach((cleanup) => cleanup());
  }
);

document.fonts.ready.then(() => ScrollTrigger.refresh());
