// CONFIG

// DDI + DDD, só números
export const WHATSAPP_NUMBER = '5535991409150';

export function whatsappLink(message = '') {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
