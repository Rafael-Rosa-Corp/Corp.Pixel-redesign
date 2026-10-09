// =========================================================
// BRIEFING — as respostas escrevem a mensagem do WhatsApp
// =========================================================
import { whatsappLink } from './config.js';

const BLANK = '____';
const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

export function initBriefing() {
  const form = document.querySelector('[data-briefing]');
  const output = form.querySelector('[data-briefing-message]');
  const cta = form.querySelector('[data-briefing-cta]');
  const other = form.querySelector('[data-briefing-other]');
  const otherInput = other.querySelector('input');

  // Links genéricos de WhatsApp (menu etc.)
  document.querySelectorAll('[data-whatsapp]').forEach((link) => {
    link.href = whatsappLink();
  });

  // Lê as respostas. Em "Outro", a frase vem do que a pessoa escreveu.
  function answers() {
    const data = new FormData(form);
    const tipo = data.get('tipo');
    const outro = (data.get('outro') || '').trim().replace(/[.!]+$/, '');
    return {
      tipo: tipo === 'outro' ? (outro ? `trabalho com ${outro}` : null) : tipo,
      identidade: data.get('identidade'),
      prazo: data.get('prazo'),
      isOther: tipo === 'outro',
    };
  }

  let wasComplete = false;

  function update() {
    const { tipo, identidade, prazo, isOther } = answers();
    other.hidden = !isOther;

    const message = `Oi, Corporação Pixel! ${capitalize(tipo || BLANK)}, ${identidade || BLANK} e ${prazo || BLANK}.`;
    const complete = Boolean(tipo && identidade && prazo);

    output.textContent = message;
    cta.href = whatsappLink(complete ? message : '');
    cta.setAttribute('aria-disabled', String(!complete));

    // Avisa quando o formulário acabou de ficar completo (o botão "acende")
    if (complete && !wasComplete) form.dispatchEvent(new CustomEvent('briefing:complete'));
    wasComplete = complete;
  }

  // Ao escolher "Outro", o cursor já vai para o campo
  form.querySelectorAll('input[name="tipo"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      if (radio.value === 'outro' && radio.checked) {
        update();
        otherInput.focus();
      }
    });
  });

  // Se faltar resposta, leva a pessoa até a pergunta em aberto
  cta.addEventListener('click', (event) => {
    const { tipo, identidade, prazo, isOther } = answers();
    if (tipo && identidade && prazo) return;
    event.preventDefault();
    if (!tipo && isOther) otherInput.focus();
    else if (!tipo) form.querySelector('input[name="tipo"]').focus();
    else if (!identidade) form.querySelector('input[name="identidade"]').focus();
    else form.querySelector('input[name="prazo"]').focus();
  });

  form.addEventListener('change', update);
  form.addEventListener('input', update);
  form.addEventListener('submit', (event) => event.preventDefault());
  update();
}
