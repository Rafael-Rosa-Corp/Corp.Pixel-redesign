// SPLIT
import { SplitText } from 'gsap/SplitText';

const HEADING = /^H[1-6]$/;

// span/p não aceitam aria-label: letras escondidas do leitor de tela + cópia invisível do texto
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
  const resplit = split.split.bind(split);
  let resplitting = false;
  // autoSplit refaz as linhas chamando revert(): aí as cópias continuam
  split.split = (config) => {
    resplitting = true;
    try {
      return resplit(config);
    } finally {
      resplitting = false;
    }
  };
  split.revert = () => {
    if (!resplitting) copies.forEach((copy) => copy.remove());
    return revert();
  };
  return split;
}
