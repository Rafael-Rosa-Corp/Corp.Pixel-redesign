// 404
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

import { initMenu } from './js/menu.js';
import { initPuzzle } from './js/puzzle.js';
import { whatsappLink } from './js/config.js';

gsap.registerPlugin(SplitText);

initMenu();
document.querySelectorAll('[data-whatsapp]').forEach((link) => {
  link.href = whatsappLink();
});

initPuzzle({
  reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
});
