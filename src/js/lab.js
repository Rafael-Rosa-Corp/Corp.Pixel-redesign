// =========================================================
// LAB — vídeos dos estudos
//
// No HTML: <video class="lab__video" data-video="/videos/lab/nome" ...>
// Arquivos esperados em public/videos/lab/:
//   nome-1280.mp4 / nome-1280.webm  → desktop
//   nome-720.mp4  / nome-720.webm   → celular
//   nome-poster.webp                → imagem enquanto carrega
//
// - Carregam só quando chegam perto da tela (não pesam no início)
// - Tocam sozinhos, sem som e em loop, e pausam quando saem da tela
// - Movimento reduzido: não tocam sozinhos; aparecem os controles
// =========================================================

export function initLab({ isMobile, reduceMotion }) {
  const videos = [...document.querySelectorAll('.lab__video')];
  if (!videos.length) return;

  const size = isMobile ? '720' : '1280';

  // Coloca as fontes do vídeo (MP4 primeiro; WebM de reserva)
  const load = (video) => {
    const base = `${video.dataset.video}-${size}`;
    if (video.dataset.loaded === base) return;
    video.replaceChildren(
      Object.assign(document.createElement('source'), { src: `${base}.mp4`, type: 'video/mp4' }),
      Object.assign(document.createElement('source'), { src: `${base}.webm`, type: 'video/webm' })
    );
    video.dataset.loaded = base;
    video.load();
  };

  if (reduceMotion) {
    videos.forEach((video) => {
      video.controls = true;
      load(video);
    });
    return () => videos.forEach((video) => { video.controls = false; });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target: video, isIntersecting }) => {
      if (isIntersecting) {
        load(video);
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { rootMargin: '200px 0px' });

  videos.forEach((video) => {
    video.muted = true;
    observer.observe(video);
  });

  return () => {
    observer.disconnect();
    videos.forEach((video) => video.pause());
  };
}
