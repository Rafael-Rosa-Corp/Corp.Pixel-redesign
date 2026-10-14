// LAB
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitText } from './split.js';

const ZONE = { start: 'top 70%', end: 'bottom 30%' };

const REVEAL = { duration: 0.9, stagger: 0.08 };

export function initLab({ isMobile, reduceMotion }) {
  const section = document.querySelector('.lab');
  const list = section.querySelector('.lab__list');
  const items = [...section.querySelectorAll('.lab__item')].map((el) => ({
    el,
    video: el.querySelector('.lab__video'),
    info: el.querySelector('.lab__info'),
  }));
  if (!items.length) return;

  const size = isMobile ? '720' : '1280';

  const load = (video) => {
    const base = `${video.dataset.video}-${size}`;
    if (video.dataset.loaded === base) return;
    video.replaceChildren(
      Object.assign(document.createElement('source'), { src: `${base}.mp4`, type: 'video/mp4' }),
      Object.assign(document.createElement('source'), { src: `${base}.webm`, type: 'video/webm' })
    );
    video.dataset.loaded = base;
    video.preload = 'auto';
    video.load();
  };

  if (reduceMotion) {
    items.forEach(({ video }) => {
      video.controls = true;
      load(video);
    });
    return () => items.forEach(({ video }) => { video.controls = false; });
  }

  section.classList.add('is-interactive');

  const loader = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      load(target);
      loader.unobserve(target);
    });
  }, { rootMargin: '100% 0px' });

  items.forEach((item) => {
    item.video.muted = true;
    // a capa só some quando o vídeo de fato começou (sem piscar preto)
    item.onPlaying = () => item.el.classList.add('is-playing');
    item.video.addEventListener('playing', item.onPlaying);
    loader.observe(item.video);
  });

  function start(item) {
    const { el, video } = item;
    el.classList.add('is-active');
    load(video);
    if (el.classList.contains('is-blocked')) return;
    try {
      video.currentTime = 0;
    } catch {
    }
    video.play().catch((error) => {
      // "AbortError" = pausado antes de começar (rolagem rápida): normal
      if (error.name !== 'NotAllowedError') return;
      el.classList.add('is-blocked');
      video.controls = true;
    });
  }

  function stop(item) {
    item.el.classList.remove('is-active', 'is-playing');
    item.video.pause();
  }

  // --- Texto (só desktop): começa escondido e entra linha a linha ---
  const revealTriggers = [];
  if (!isMobile) {
    items.forEach((item) => {
      // o nome do estudo usa o efeito dos títulos (titles.js)
      const lines = [...item.info.children].filter((el) => !el.hasAttribute('data-title-reveal'));
      item.split = splitText(lines, {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        onSplit: (self) => {
          if (!item.revealed) gsap.set(self.lines, { yPercent: 100 });
        },
      });
      revealTriggers.push(ScrollTrigger.create({
        trigger: item.el,
        start: 'top 70%',
        once: true,
        onEnter: () => reveal(item),
      }));
    });
  }

  function reveal(item) {
    if (!item.split || item.revealed) return;
    item.revealed = true;
    gsap.to(item.split.lines, {
      yPercent: 0,
      duration: REVEAL.duration,
      stagger: REVEAL.stagger,
      ease: 'power3.out',
    });
  }

  // --- Qual estudo está ativo ---
  let current = null;
  function activate(item) {
    if (item === current) return;
    if (current) stop(current);
    current = item;
    list.classList.toggle('has-focus', Boolean(item));
    if (item) {
      start(item);
      reveal(item);
    }
  }

  const pick = () => {
    const middle = window.innerHeight / 2;
    let nearest = null;
    let nearestDistance = Infinity;
    items.forEach((item) => {
      const box = item.el.getBoundingClientRect();
      const distance = Math.abs(box.top + box.height / 2 - middle);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = item;
      }
    });
    activate(nearest);
  };

  const trigger = ScrollTrigger.create({
    trigger: list,
    start: ZONE.start,
    end: ZONE.end,
    onUpdate: pick,
    onEnter: pick,
    onEnterBack: pick,
    onLeave: () => {
      items.forEach(reveal);
      activate(null);
    },
    onLeaveBack: () => activate(null),
  });

  return () => {
    trigger.kill();
    revealTriggers.forEach((t) => t.kill());
    loader.disconnect();
    activate(null);
    items.forEach((item) => {
      item.video.removeEventListener('playing', item.onPlaying);
      item.video.controls = false;
      item.el.classList.remove('is-blocked');
      if (item.split) {
        gsap.killTweensOf(item.split.lines);
        item.split.revert();
      }
    });
    section.classList.remove('is-interactive');
  };
}
