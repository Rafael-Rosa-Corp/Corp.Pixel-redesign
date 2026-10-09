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
index.html              → todo o conteúdo (textos, seções, links)
public/images/          → imagens (logo, cases)
src/main.js             → liga tudo e separa desktop / celular / movimento reduzido
src/js/                 → um arquivo por parte do site
  config.js             → NÚMERO DO WHATSAPP
  menu.js               → menu em tela cheia
  hero.js               → pixels que montam o polvo
  manifesto.js          → linhas gigantes que se abrem
  pixel-reveal.js       → imagens dos cases que ganham nitidez
  process.js            → processo com "câmera" horizontal
  about.js              → linhas do Sobre que acendem
  briefing.js           → mensagem do WhatsApp montada pelas respostas
  logo.js / scroll.js   → utilidades
src/data/logo.json      → o polvo em pixels (usado pelo hero e pelo menu)
src/css/                → um arquivo por seção
  tokens.css            → CORES, FONTES E ESPAÇAMENTOS (comece por aqui)
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

Movimento reduzido: tudo estático, processo vira rolagem lateral com o dedo/trackpad.

## Ajustes rápidos

- **Cores/fontes:** `src/css/tokens.css`
- **WhatsApp:** `src/js/config.js` → `WHATSAPP_NUMBER`
- **Instagram:** procure `Instagram` no `index.html`
- **Velocidade do hero:** `SETTINGS` no topo de `src/js/hero.js`
- **Duração do manifesto:** `end: '+=140%'` em `src/js/manifesto.js`
- **Profundidade do processo:** `BG_SPEED` em `src/js/process.js`
- **Passos do pixelado:** `STEPS` em `src/js/pixel-reveal.js`

## Pendências (textos entre colchetes no index.html)

- [ ] Imagens dos cases → coloque em `public/images/` e troque o `src` dos `<img>` em "TRABALHOS"
      (hoje são `work-arquiteta.svg` e `work-raiz.svg`, provisórios). Escreva também o `alt`.
- [ ] Imagens do processo → trocar cada `.process-card__media` por um `<img>`
- [ ] Nome da arquiteta
- [ ] Comentário da linha 01 do Sobre + revisar os textos do Sobre (são rascunho)
- [ ] Número do WhatsApp e Instagram
- [ ] Vídeos do Lab
- [ ] Logo em resolução original (o mapa atual foi convertido de um PNG de 200px)
