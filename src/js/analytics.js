// CONTADOR (Umami)

// ID do site no painel do Umami (cloud.umami.is); vazio = contador desligado
const UMAMI_ID = '27abb239-2947-4e9d-adbd-24cbbcddf5df';

// Só conta o site publicado (testes no PC não entram nos números)
export function initAnalytics() {
  if (!UMAMI_ID || window.location.hostname !== 'pixelcorp.tech') return;
  const script = document.createElement('script');
  script.defer = true;
  script.src = 'https://cloud.umami.is/script.js';
  script.dataset.websiteId = UMAMI_ID;
  document.head.append(script);
}

export function track(name, data) {
  window.umami?.track(name, data);
}
