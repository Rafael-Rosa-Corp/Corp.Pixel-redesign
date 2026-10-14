# Corporação Pixel — site

Vite + HTML/CSS/JS puro + GSAP (ScrollTrigger, ScrollSmoother, SplitText).

## Rodar no PC

```bash
npm install      # só na primeira vez (ou quando mudar dependência)
npx vite --host  # abre em http://localhost:5173 (e no celular pela rede)
npm run build    # gera a versão final em dist/
```

## Estrutura

```
index.html            → home
trabalhos/raiz/       → case Raíz
404.html              → página não encontrada (quebra-cabeça)
vite.config.js        → lista das páginas
public/               → imagens, vídeos, ícones, robots, sitemap, .htaccess
src/main.js           → home
src/case.js           → páginas de case
src/notfound.js       → 404
src/js/               → um arquivo por parte do site
src/css/              → um arquivo por seção (tokens.css = cores, fontes, espaçamentos)
```

## Regras do código

- Sem CSS inline: tudo em classes (`bloco__elemento`). Exceção: o GSAP enquanto anima.
- Mobile-first, medidas fluidas (`clamp()`, `rem`, `vw`, `svh`).
- Tudo funciona sem JavaScript e com "movimento reduzido": o CSS mostra o estado final.

## Publicação

Todo `git push` na `main` publica sozinho na Hostinger
(`.github/workflows/deploy.yml`: build + FTP para `public_html`).

- Segredos no GitHub: `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`
- Variável `DEPLOY_ENABLED` = `true` liga; `false` pausa
- Publicar na mão: aba Actions → "Publicar na Hostinger" → Run workflow
