# Corporação Pixel — site (v0.1)

Primeira versão da home. Vite + HTML/CSS/JS puro + GSAP (ScrollTrigger, ScrollSmoother, SplitText).

## Rodar no seu PC

```bash
npm install      # só na primeira vez
npm run dev      # abre em http://localhost:5173 com recarregamento automático
npm run build    # gera a versão final na pasta dist/ (é o que o Vercel publica)
```

No Vercel: importe o repositório. Ele reconhece o Vite sozinho (build `npm run build`, saída `dist`).

## Estrutura

```
index.html              → home: todo o conteúdo (textos, seções, links)
trabalhos/raiz/         → página do case Raíz (index.html)
vite.config.js          → lista das páginas (cada case novo entra aqui)
public/images/          → imagens (logo, cases; telas do Raíz em images/raiz/)
src/main.js             → home: liga tudo e separa desktop / celular / movimento reduzido
src/case.js             → páginas de case: menu, scroll suave, títulos e pixelado
src/js/                 → um arquivo por parte do site
  config.js             → NÚMERO DO WHATSAPP
  menu.js               → menu em tela cheia
  hero.js               → pixels que montam o polvo
  manifesto.js          → linhas gigantes que se abrem
  pixel-reveal.js       → imagens dos cases que ganham nitidez
  process.js            → processo com "câmera" horizontal
  about.js              → linhas do Sobre que acendem
  briefing.js           → mensagem do WhatsApp montada pelas respostas
  lab.js                → vídeos do Lab (só o estudo ativo toca)
  titles.js             → títulos com letras que acendem fora de ordem
  smooth.js             → configuração do scroll suave (vale para todas as páginas)
  logo.js / scroll.js   → utilidades
src/data/logo.json      → o polvo em pixels (usado pelo hero e pelo menu)
src/css/                → um arquivo por seção
  tokens.css            → CORES, FONTES E ESPAÇAMENTOS (comece por aqui)
  main.css              → entrada da home
  case-page.css / case.css → entrada e estilos das páginas de case
```

## Regras do código

- Zero CSS inline: tudo em classes (padrão `bloco__elemento`, ex.: `.process-card__title`).
  A única exceção é o GSAP, que escreve `transform`/`opacity` no elemento enquanto anima.
- Mobile-first, medidas fluidas (`clamp()`, `rem`, `vw`, `svh`).
- Cada seção funciona sem JavaScript e com "movimento reduzido" ativado no sistema:
  o CSS mostra o estado final e o JS só adiciona a animação por cima.

## Comportamento por tela

| Seção     | Desktop                                  | Celular                                  |
|-----------|------------------------------------------|------------------------------------------|
| Scroll    | Suave (ScrollSmoother)                   | Nativo                                   |
| Hero      | Pixels espalhados pela tela toda         | Espalhamento menor, montagem mais curta  |
| Manifesto | Linhas se abrem com pin                  | Igual, mais curto                        |
| Trabalhos | Nitidez ao entrar na tela + no hover     | Nitidez ao entrar na tela                |
| Processo  | Câmera horizontal + fundo em profundidade| Horizontal, sem a camada de fundo        |
| Sobre     | Linha ativa acende e mostra o comentário | Igual                                    |
| Lab       | Zigue-zague, texto entra ao chegar       | Estudo ativo em foco, outros apagados    |
|           | Nome do estudo com o efeito dos títulos  | Igual                                    |
| Títulos   | Letras acendem fora de ordem com a rolagem | Igual                                  |

Movimento reduzido: tudo estático, processo vira rolagem lateral com o dedo/trackpad.

## Ajustes rápidos

- **Cores/fontes:** `src/css/tokens.css`
- **WhatsApp:** `src/js/config.js` → `WHATSAPP_NUMBER`
- **Instagram:** procure `Instagram` no `index.html`
- **Velocidade do hero:** `SETTINGS` no topo de `src/js/hero.js`
- **Duração do manifesto:** `end: '+=140%'` em `src/js/manifesto.js`
- **Profundidade do processo:** `BG_SPEED` em `src/js/process.js`
- **Passos do pixelado:** `STEPS` em `src/js/pixel-reveal.js`
- **Scroll suave:** `SCROLL` em `src/js/smooth.js`
- **Cores do case:** variáveis `--case-*` no topo de `src/css/case.css`
- **Efeito dos títulos:** `TITLE` no topo de `src/js/titles.js`; para usar em outro
  título, coloque `data-title-reveal` nele no `index.html`

## Pendências (textos entre colchetes no index.html)

- [ ] Imagem do Raíz → coloque em `public/images/` e troque o `src` do `<img>` em "TRABALHOS"
      (hoje é `work-raiz.svg`, provisório). Escreva também o `alt`.
- [ ] Case da arquiteta: fora por enquanto (aguardando resposta sobre o site novo).
      Ao voltar a ter 2 cases, tire a classe `works__grid--single` do grid.
- [ ] Linha 03 do Sobre (nova frase + comentário) e revisão final dos textos do Sobre
- [ ] Número do WhatsApp e Instagram
- [x] Vídeos do Lab (Hanami, Pringles, Novo Mundo). Padrão de cada vídeo em `public/videos/lab/`:
      `nome-1280.mp4`, `nome-1280.webm` (desktop), `nome-720.mp4`, `nome-720.webm` (celular)
      e `nome-poster.webp`; proporção 1280×592; no HTML basta `data-video="/videos/lab/nome"`
      e a mesma capa no `<img class="lab__poster">`. Só o estudo ativo toca (`src/js/lab.js`).
- [ ] Revisar as descrições curtas dos estudos do Lab (`.lab__desc` no index.html)
- [x] Case do Raíz em página própria (`/trabalhos/raiz/`)
- [ ] Vídeo do Raíz para o celular do topo do case
- [ ] Confirmar o motivo da decisão "Abre pelo link, sem loja de aplicativos" no case
- [ ] Header branco some sobre áreas claras (palcos creme, card do Raíz, vídeo da Hanami)
- [ ] Logo em resolução original (o mapa atual foi convertido de um PNG de 200px)
