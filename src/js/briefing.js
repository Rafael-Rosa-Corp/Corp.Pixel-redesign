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
  const fields = ['tipo', 'identidade', 'prazo'];

  // Links genéricos de WhatsApp (menu etc.)
  document.querySelectorAll('[data-whatsapp]').forEach((link) => {
    link.href = whatsappLink();
  });

  function answers() {
    const data = new FormData(form);
    return fields.map((name) => data.get(name));
  }

  function update() {
    const [tipo, identidade, prazo] = answers();
    const message = `Oi, Corporação Pixel! ${capitalize(tipo || BLANK)}, ${identidade || BLANK} e queria o site ${prazo || BLANK}.`;
    const complete = Boolean(tipo && identidade && prazo);

    output.textContent = message;
    cta.href = whatsappLink(complete ? message : '');
    cta.setAttribute('aria-disabled', String(!complete));
  }

  // Se faltar resposta, leva a pessoa até a pergunta em aberto
  cta.addEventListener('click', (event) => {
    const missing = fields.find((name, i) => !answers()[i]);
    if (!missing) return;
    event.preventDefault();
    form.querySelector(`input[name="${missing}"]`).focus();
  });

  form.addEventListener('change', update);
  form.addEventListener('submit', (event) => event.preventDefault());
  update();
}
