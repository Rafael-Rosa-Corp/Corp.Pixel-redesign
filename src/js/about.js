// SOBRE
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const LINE_SCROLL = 0.45;

export function initAbout({ isDesktop, reduceMotion }) {
  if (reduceMotion) return;

  const section = document.querySelector('.about');
  const list = section.querySelector('.about__lines');
  const lines = [...section.querySelectorAll('.about__line')];
  const wraps = lines.map((line) => line.querySelector('.about__comment-wrap'));
  section.classList.add('is-interactive');

  // GSAP mede o height "auto" na hora (o grid 0fr/1fr cortava o texto no Safari)
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
      onLeaveBack: () => activate(-1),
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
