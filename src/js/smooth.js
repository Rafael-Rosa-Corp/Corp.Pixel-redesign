// =========================================================
// SCROLL SUAVE — mesma configuração em todas as páginas
// Só no desktop com mouse; no celular, scroll nativo.
// =========================================================
import { ScrollSmoother } from 'gsap/ScrollSmoother';

// Ajuste do scroll no desktop (ScrollSmoother)
export const SCROLL = {
  smooth: 1.1, // segundos para "alcançar" a rolagem: maior = mais suave/arrastado
  speed: 0.8,  // velocidade geral da rolagem: 1 = normal, menor = menos sensível
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
