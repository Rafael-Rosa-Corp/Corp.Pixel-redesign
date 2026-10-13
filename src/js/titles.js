// =========================================================
// TÍTULOS — as letras aparecem fora de ordem, acompanhando a rolagem
// (efeito trazido do estudo Novo Mundo)
//
// Cada letra começa quase apagada e um pouco abaixo; conforme a página
// rola, elas sobem e acendem em ordem aleatória. Voltando a rolagem,
// o efeito volta junto.
//
// Para usar em outro título: coloque data-title-reveal no HTML.
// Para mudar quando um título específico começa/termina, use também
// data-title-start="top 90%" e/ou data-title-end="top 50%" nele.
// Título do topo da página (já visível ao abrir): data-title-reveal="load"
// acende sozinho, sem depender da rolagem.
// =========================================================
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

const TITLE = {
  ghost: 0.06,      // quanto a letra aparece antes de acender (0 = invisível)
  rise: 30,         // quanto a letra sobe (% da altura da própria letra)
  each: 0.028,      // intervalo entre as letras (menor = acendem mais juntas)
  start: 'top 80%', // começa quando o topo do título chega a 80% da tela
  end: 'top 30%',   // termina quando chega a 30%
  scrub: 0.6,       // atraso para acompanhar a rolagem (segundos)
};

// Versão "load" (topo da página)
const LOAD = {
  delay: 0.3,    // espera antes de começar (segundos)
  duration: 0.9, // tempo de cada letra
  each: 0.1,     // intervalo entre as letras
};

export function initTitles({ reduceMotion }) {
  if (reduceMotion) return; // títulos ficam normais

  const titles = gsap.utils.toArray('[data-title-reveal]');

  const splits = titles.map((title) =>
    SplitText.create(title, {
      type: 'words,chars', // "words" evita quebrar uma palavra no meio
      onSplit: (self) => {
        // estado inicial primeiro (garante que TODAS as letras comecem apagadas)
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
