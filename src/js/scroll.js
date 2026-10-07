// =========================================================
// SCROLL — rolagem até âncoras (funciona com e sem ScrollSmoother)
// =========================================================
import { ScrollSmoother } from 'gsap/ScrollSmoother';

const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function scrollToHash(hash) {
  const target = hash && hash !== '#' ? document.querySelector(hash) : null;
  if (!target) return;

  const smoother = ScrollSmoother.get();
  if (smoother) {
    smoother.scrollTo(target, true, 'top top');
  } else {
    target.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth' });
  }
}

// Links internos comuns (os do menu são tratados no menu.js)
export function initAnchors() {
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || link.matches('[data-menu-link], .skip-link')) return;
    const hash = link.getAttribute('href');
    if (hash.length < 2) return;
    event.preventDefault();
    scrollToHash(hash);
  });
}
