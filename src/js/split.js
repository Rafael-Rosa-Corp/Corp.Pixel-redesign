// =========================================================
// SPLIT — SplitText que continua legível para leitor de tela
// =========================================================
import { SplitText } from 'gsap/SplitText';

const HEADING = /^H[1-6]$/;

// Títulos (h1–h6) aceitam o rótulo do SplitText. span/p não aceitam:
// as letras ficam escondidas do leitor de tela e uma cópia invisível do texto fica ao lado.
export function splitText(target, vars) {
  const elements = Array.isArray(target) ? target : [target];
  if (elements.every((el) => HEADING.test(el.tagName))) return SplitText.create(target, vars);

  const copies = elements.map((el) => {
    const copy = document.createElement('span');
    copy.className = 'sr-only';
    copy.textContent = el.textContent.trim();
    el.after(copy);
    return copy;
  });

  const split = SplitText.create(target, { ...vars, aria: 'hidden' });
  const revert = split.revert.bind(split);
  split.revert = () => {
    copies.forEach((copy) => copy.remove());
    return revert();
  };
  return split;
}
