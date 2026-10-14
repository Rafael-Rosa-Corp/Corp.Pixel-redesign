// =========================================================
// CONFIG — dados que você vai trocar
// =========================================================

// Número do WhatsApp com DDI + DDD, só números (ex.: 5535999998888)
export const WHATSAPP_NUMBER = '5535991409150';

// Monta o link do WhatsApp com uma mensagem opcional
export function whatsappLink(message = '') {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
