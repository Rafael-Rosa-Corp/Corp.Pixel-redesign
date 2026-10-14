// SCROLL
import { ScrollSmoother } from 'gsap/ScrollSmoother';

const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function scrollToHash(hash, { instant = false } = {}) {
  const target = hash && hash !== '#' ? document.querySelector(hash) : null;
  if (!target) return;

  const smoother = ScrollSmoother.get();
  if (smoother) {
    smoother.scrollTo(target, !instant, 'top top');
  } else {
    target.scrollIntoView({ behavior: instant || prefersReduced() ? 'auto' : 'smooth' });
  }
}

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
