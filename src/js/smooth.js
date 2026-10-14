// SCROLL SUAVE
import { ScrollSmoother } from 'gsap/ScrollSmoother';

export const SCROLL = {
  smooth: 1.1,
  speed: 0.8,
};

export function initSmoother({ isDesktop, finePointer, reduceMotion }) {
  if (!isDesktop || !finePointer || reduceMotion) return;
  ScrollSmoother.create({
    wrapper: '#smooth-wrapper',
    content: '#smooth-content',
    smooth: SCROLL.smooth,
    speed: SCROLL.speed,
    effects: false,
  });
}
