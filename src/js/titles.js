// TÍTULOS
import { gsap } from 'gsap';
import { splitText } from './split.js';

const TITLE = {
  ghost: 0.06,
  rise: 30,
  each: 0.028,
  start: 'top 80%',
  end: 'top 30%',
  scrub: 0.6,
};

const LOAD = {
  delay: 0.3,
  duration: 0.9,
  each: 0.1,
};

export function initTitles({ reduceMotion }) {
  if (reduceMotion) return;

  const titles = gsap.utils.toArray('[data-title-reveal]');

  const splits = titles.map((title) =>
    splitText(title, {
      type: 'words,chars',
      onSplit: (self) => {
        // set antes do to: com fromTo + stagger aleatório só a 1ª letra começava apagada
        gsap.set(self.chars, { opacity: TITLE.ghost, yPercent: TITLE.rise });

        if (title.dataset.titleReveal === 'load') {
          return gsap.to(self.chars, {
            opacity: 1,
            yPercent: 0,
            ease: 'power2.out',
            delay: LOAD.delay,
            duration: LOAD.duration,
            stagger: { each: LOAD.each, from: 'random' },
          });
        }

        return gsap.to(self.chars, {
          opacity: 1,
          yPercent: 0,
          ease: 'power1.out',
          stagger: { each: TITLE.each, from: 'random' },
          scrollTrigger: {
            trigger: title,
            start: title.dataset.titleStart || TITLE.start,
            end: title.dataset.titleEnd || TITLE.end,
            scrub: TITLE.scrub,
          },
        });
      },
    })
  );

  return () => splits.forEach((split) => split.revert());
}
