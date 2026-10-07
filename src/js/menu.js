// =========================================================
// MENU — abrir/fechar, foco, trava do scroll
// =========================================================
import { gsap } from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { drawLogo, LOGO } from './logo.js';
import { scrollToHash } from './scroll.js';

// Cores do polvo sobre o fundo vermelho do menu
const MENU_PALETTE = { ...LOGO.palette, R: '#121212', P: '#5E0A1C', W: '#FBEFF1' };

export function initMenu() {
  const menu = document.querySelector('.menu');
  const toggle = document.querySelector('.site-header__toggle');
  const closeBtn = menu.querySelector('.menu__close');
  const animated = menu.querySelectorAll('.menu__link, .menu__marker');
  let isOpen = false;

  drawLogo(menu.querySelector('[data-logo="menu"]'), MENU_PALETTE);

  function lockScroll(lock) {
    const smoother = ScrollSmoother.get();
    if (smoother) smoother.paused(lock);
    document.body.classList.toggle('is-locked', lock);
  }

  function open() {
    isOpen = true;
    menu.inert = false;
    menu.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    lockScroll(true);
    closeBtn.focus({ preventScroll: true });

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.fromTo(animated,
        { yPercent: 110 },
        { yPercent: 0, duration: 0.9, ease: 'power4.out', stagger: 0.07, delay: 0.2 }
      );
    }
  }

  function close({ returnFocus = true } = {}) {
    if (!isOpen) return;
    isOpen = false;
    menu.classList.remove('is-open');
    menu.inert = true;
    toggle.setAttribute('aria-expanded', 'false');
    lockScroll(false);
    if (returnFocus) toggle.focus({ preventScroll: true });
  }

  toggle.addEventListener('click', open);
  closeBtn.addEventListener('click', () => close());

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });

  // Links do menu: fecha e depois rola até a seção
  menu.querySelectorAll('[data-menu-link]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      close({ returnFocus: false });
      const hash = link.getAttribute('href');
      requestAnimationFrame(() => scrollToHash(hash));
    });
  });
}
