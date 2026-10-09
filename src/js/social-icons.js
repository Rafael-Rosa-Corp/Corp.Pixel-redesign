// =========================================================
// ÍCONES SOCIAIS — logos oficiais (pacote simple-icons, licença CC0)
// Uso no HTML: <a ... aria-label="Instagram" data-icon="instagram"></a>
// =========================================================
import { siInstagram, siGithub } from 'simple-icons';

const ICONS = {
  instagram: siInstagram,
  github: siGithub,
};

export function initSocialIcons() {
  document.querySelectorAll('[data-icon]').forEach((link) => {
    const icon = ICONS[link.dataset.icon];
    if (!icon) return;
    link.insertAdjacentHTML(
      'beforeend',
      `<svg class="site-footer__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${icon.path}"/></svg>`
    );
  });
}
