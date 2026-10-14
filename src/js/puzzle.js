// =========================================================
// QUEBRA-CABEÇA DA 404 — o polvo vem embaralhado em peças.
//
// Trocar duas peças: tocar/clicar numa e depois na outra,
// ou arrastar uma até a outra. Teclado: Tab + Enter/Espaço.
// Quando o polvo fica montado, aparece "Isso, sim, foi por acaso."
// =========================================================
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { LOGO, getLogoPixels } from './logo.js';

// Quantas peças. O polvo tem 60×48 pixels, então use divisores:
// colunas 2, 3, 4, 5 ou 6 · linhas 2, 3, 4 ou 6.
// Se mudar, ajuste também .puzzle (colunas) e .puzzle__slot (proporção) no notfound.css.
const PUZZLE = { cols: 3, rows: 2 };

const BACKGROUND = '#1C1A22'; // fundo das peças (mesmo --c-surface)
const DRAG_THRESHOLD = 6;     // px que o dedo/mouse precisa andar para virar "arrastar"

export function initPuzzle({ reduceMotion }) {
  const page = document.querySelector('.notfound');
  const board = page.querySelector('[data-puzzle]');
  const end = page.querySelector('[data-puzzle-end]');
  const phrase = page.querySelector('[data-puzzle-phrase]');
  const movesLabel = page.querySelector('[data-puzzle-moves]');
  const homeLink = page.querySelector('[data-puzzle-home]');
  const total = PUZZLE.cols * PUZZLE.rows;
  const pieceW = LOGO.cols / PUZZLE.cols;
  const pieceH = LOGO.rows / PUZZLE.rows;

  // --- Desenha o polvo inteiro uma vez e recorta as peças ---
  const full = document.createElement('canvas');
  full.width = LOGO.cols;
  full.height = LOGO.rows;
  const fullCtx = full.getContext('2d', { willReadFrequently: true });
  fullCtx.fillStyle = BACKGROUND;
  fullCtx.fillRect(0, 0, LOGO.cols, LOGO.rows);
  getLogoPixels().forEach(({ x, y, color }) => {
    fullCtx.fillStyle = color;
    fullCtx.fillRect(x, y, 1, 1);
  });

  // Cada peça vira um canvas pequeno (o CSS amplia sem borrar)
  // "look" = conteúdo da peça: peças iguais (ex.: duas vazias) contam como certas
  const pieces = Array.from({ length: total }, (_, id) => {
    const sx = (id % PUZZLE.cols) * pieceW;
    const sy = Math.floor(id / PUZZLE.cols) * pieceH;
    const canvas = document.createElement('canvas');
    canvas.className = 'puzzle__piece';
    canvas.dataset.piece = String(id); // posição certa da peça (0 = canto superior esquerdo)
    canvas.width = pieceW;
    canvas.height = pieceH;
    canvas.getContext('2d').drawImage(full, sx, sy, pieceW, pieceH, 0, 0, pieceW, pieceH);
    const look = Array.from(fullCtx.getImageData(sx, sy, pieceW, pieceH).data).join(',');
    return { id, canvas, look };
  });

  // --- Casas do tabuleiro (botões fixos; as peças trocam de casa) ---
  const slots = Array.from({ length: total }, (_, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'puzzle__slot';
    button.dataset.index = String(index);
    board.append(button);
    return button;
  });

  // Embaralha até ficar bem fora do lugar (pelo menos metade das peças)
  const order = pieces.map((piece) => piece.id);
  const misplaced = () => order.filter((id, slot) => pieces[id].look !== pieces[slot].look).length;
  do {
    for (let i = order.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
  } while (misplaced() < Math.ceil(total / 2));

  order.forEach((id, slot) => slots[slot].append(pieces[id].canvas));
  page.classList.add('is-playing');

  let moves = 0;
  let selected = null;
  let solved = false;

  function label() {
    slots.forEach((slot, i) => {
      slot.setAttribute('aria-label', `Peça na casa ${i + 1} de ${total}`);
      slot.setAttribute('aria-pressed', String(slot === selected));
    });
  }

  function select(slot) {
    if (selected) selected.classList.remove('is-selected');
    selected = slot;
    if (slot) slot.classList.add('is-selected');
    label();
  }

  // Troca as peças de duas casas, com um deslize entre elas
  function swap(a, b) {
    const pieceA = a.firstElementChild;
    const pieceB = b.firstElementChild;
    const boxA = pieceA.getBoundingClientRect();
    const boxB = pieceB.getBoundingClientRect();
    a.append(pieceB);
    b.append(pieceA);
    [order[a.dataset.index], order[b.dataset.index]] = [order[b.dataset.index], order[a.dataset.index]];
    moves += 1;

    if (!reduceMotion) {
      gsap.fromTo(pieceA, { x: boxA.left - boxB.left, y: boxA.top - boxB.top }, { x: 0, y: 0, duration: 0.35, ease: 'power3.out' });
      gsap.fromTo(pieceB, { x: boxB.left - boxA.left, y: boxB.top - boxA.top }, { x: 0, y: 0, duration: 0.35, ease: 'power3.out' });
    }
    if (misplaced() === 0) finish();
  }

  // --- Montou! ---
  function finish() {
    solved = true;
    select(null);
    page.classList.remove('is-playing');
    page.classList.add('is-solved');
    board.setAttribute('aria-label', 'Polvo da Corporação Pixel montado');
    slots.forEach((slot) => { slot.disabled = true; });
    movesLabel.textContent = `Montado em ${moves} ${moves === 1 ? 'troca' : 'trocas'}.`;
    end.hidden = false;

    if (reduceMotion) {
      homeLink.focus({ preventScroll: true });
      return;
    }

    const split = SplitText.create(phrase, { type: 'words,chars' });
    gsap.timeline({ onComplete: () => homeLink.focus({ preventScroll: true }) })
      .fromTo(board, { scale: 1 }, { scale: 1.04, duration: 0.25, ease: 'power2.out', yoyo: true, repeat: 1 })
      .fromTo(split.chars,
        { opacity: 0.06, yPercent: 30 },
        { opacity: 1, yPercent: 0, duration: 0.6, ease: 'power2.out', stagger: { each: 0.03, from: 'random' } },
        0.2)
      .from([movesLabel, homeLink], { autoAlpha: 0, y: 12, duration: 0.5, stagger: 0.1, ease: 'power2.out' }, '-=0.3');
  }

  // --- Toque / clique: escolhe uma peça, depois a outra ---
  function tap(slot) {
    if (solved) return;
    if (!selected) select(slot);
    else if (selected === slot) select(null);
    else {
      const first = selected;
      select(null);
      swap(first, slot);
    }
  }

  // --- Arrastar (mouse e dedo) ---
  let drag = null;

  board.addEventListener('pointerdown', (event) => {
    const slot = event.target.closest('.puzzle__slot');
    if (!slot || solved || event.button > 0) return;
    drag = { slot, piece: slot.firstElementChild, startX: event.clientX, startY: event.clientY, moving: false };
    slot.setPointerCapture(event.pointerId);
  });

  board.addEventListener('pointermove', (event) => {
    if (!drag) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (!drag.moving && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
    if (!drag.moving) {
      drag.moving = true;
      select(null);
      drag.slot.classList.add('is-dragging');
    }
    gsap.set(drag.piece, { x: dx, y: dy });
  });

  function endDrag(event) {
    if (!drag) return;
    const { slot, piece, moving } = drag;
    drag = null;
    if (!moving) return; // foi só um toque: o "click" cuida

    // casa embaixo do dedo/mouse (a peça arrastada não conta: .is-dragging
    // tira os cliques dela no CSS)
    const target = document.elementFromPoint(event.clientX, event.clientY)?.closest('.puzzle__slot');
    slot.classList.remove('is-dragging');

    if (target && target !== slot) {
      // começa a troca de onde a peça foi solta
      const dropped = piece.getBoundingClientRect();
      gsap.set(piece, { x: 0, y: 0 });
      swap(slot, target);
      if (!reduceMotion) {
        const now = piece.getBoundingClientRect();
        gsap.fromTo(piece, { x: dropped.left - now.left, y: dropped.top - now.top }, { x: 0, y: 0, duration: 0.3, ease: 'power3.out', overwrite: true });
      }
    } else {
      gsap.to(piece, { x: 0, y: 0, duration: reduceMotion ? 0 : 0.3, ease: 'power3.out' });
    }
    slot.dataset.dragged = 'true'; // evita o "click" que vem logo depois
  }

  board.addEventListener('pointerup', endDrag);
  board.addEventListener('pointercancel', endDrag);

  board.addEventListener('click', (event) => {
    const slot = event.target.closest('.puzzle__slot');
    if (!slot) return;
    if (slot.dataset.dragged) {
      delete slot.dataset.dragged;
      return;
    }
    tap(slot);
  });

  label();

  // Entrada: peças acendem fora de ordem (mesmo espírito dos títulos)
  if (!reduceMotion) {
    gsap.from(pieces.map((piece) => piece.canvas), {
      opacity: 0.06,
      yPercent: 20,
      duration: 0.6,
      ease: 'power2.out',
      stagger: { each: 0.06, from: 'random' },
      delay: 0.2,
    });
  }
}
