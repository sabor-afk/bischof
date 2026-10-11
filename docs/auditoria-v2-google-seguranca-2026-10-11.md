# Bischof V2 — Auditoria inicial Google, segurança e pré-lançamento

**Data:** 11/10/2026  
**Escopo:** inspeção estática do repositório `sabor-afk/bischof`, branch `site-bischof-v2`, e verificação do último GitHub Actions.  
**Política de alteração:** não alterar aparência, funcionalidades, publicação ou `main` nesta etapa.

## 1. Evidências confirmadas

- Última execução conhecida do workflow V2 concluída com sucesso em 10/10/2026: https://github.com/sabor-afk/bischof/actions/runs/38092639733. Workflow publica `site-v2/` no projeto Pages `bischof`, usando `--branch=main` como padrão.
- A V2 está na branch `site-bischof-v2`; o conteúdo dos arquivos `site-v2/**` **não é alterado** por esta auditoria.
- As páginas `index.html`, `formulario-bischof.html`, `privacidade.html` e `404.html` contêm `meta robots noindex`.
- O arquivo `site-v2/_headers` tem `X-Robots-Tag: noindex, nofollow, noarchive` global. O `robots.txt` permite rastreamento, necessário para o robô reconhecer o `noindex`.
- A página inicial define `title`, descrição, H1, atributos de imagem e Open Graph; algumas URLs absolutas, `og:url` e `LocalBusiness.url`, ainda apontam para `https://bischof.pages.dev/`.
- Ainda não existem tags `rel=canonical` nas quatro páginas analisadas.
- As páginas principais não possuem URLs de recurso HTTP explícitas; os links que abrem nova aba têm `rel=noopener`.
- O projeto define `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options` e `Permissions-Policy` em `_headers`.
- `Content-Security-Policy` e `Strict-Transport-Security` **não estão declarados no arquivo `_headers`**. Isso não prova que estejam ausentes das respostas ao vivo: podem ser configurados pela Cloudflare.
- Nos três módulos JS inspecionados (`site-v2.mjs`, `motion-v2.mjs`, `coverage-v2.mjs`) não foram detectados usos literais de `eval`, `innerHTML`, `fetch`, `localStorage` ou `sessionStorage` por busca estática de tokens. **Não é uma análise de segurança exaustiva.**
- A página de privacidade ainda descreve uma versão de teste; o fluxo público é um formulário que prepara a mensagem para WhatsApp sem banco de dados próprio.
- O diretório `docs/seo-producao/` já contém modelos **não publicados** de sitemap, robots e metadados para `bischof.com.br`.

## 2. Não foi possível verificar externamente nesta execução

- DNS e titularidade/controle de `bischof.com.br`.
- Se `bischof.com.br` está vinculado ao projeto Cloudflare Pages e aceita HTTPS com certificado válido.
- Respostas HTTP reais (incluindo redirecionamento 301, status de 404 e headers, como HSTS/CSP).
- Dados privados da conta Google Search Console e indexação real.
- PageSpeed Insights / Core Web Vitals em condições reais de rede e dispositivo.

**Importante:** não registrar esses itens como aprovados sem medição/consulta ao painel responsável.

## 3. Etapas seguras para lançamento — sem mudar design

### Etapa A — Domínio e HTTPS
1. Confirmar acesso ao domínio `bischof.com.br` e DNS. O nome de domínio foi confirmado em conversa anterior, mas a posse técnica precisa ser validada.
2. No painel Cloudflare: **Workers & Pages → bischof → Custom domains**: associar `bischof.com.br`, confirmar certificado.
3. Validar `https://bischof.com.br/`, `http://bischof.com.br/` e `https://www.bischof.com.br/`; definir canônico preferido (proposto sem `www`) e redirecionamentos permanentes.
4. Verificar respostas reais do servidor, inclusive os cabeçalhos e o status 404.

### Etapa B — Google e SEO
1. Criar/verificar **propriedade de domínio** `bischof.com.br` em https://search.google.com/search-console por registro TXT no DNS (não torna o site indexável sozinho).
2. Substituir as URLs absolutas de `pages.dev` nos metadados por `bischof.com.br` **na virada**, inserir canonical em cada página pública e revisar schema `LocalBusiness` com dados reais.
3. Revisar e publicar `docs/seo-producao/sitemap.xml` e `robots.txt` de produção.
4. **Antes de remover `noindex`:** definir redirecionamento de `bischof.pages.dev` para o domínio oficial ou outro controle por hostname; o `_headers` atual não distingue hostnames. Não permitir que uma prévia V3 seja indexada por engano.
5. Remover o `noindex` **somente no lançamento**, validar URL com inspeção do Search Console e solicitar indexação sem prometer prazo.
6. Conferir a necessidade de migração/links do site antigo hospedado no GitHub Pages.

### Etapa C — Segurança e qualidade
1. Conferir o HTTPS completo e se não há conteúdo misto.
2. Testar política CSP inicialmente em modo Report-Only e ajustar fontes, módulos, SVGs, links e scripts antes de enforcement. Não ativar CSP restritiva às cegas.
3. Avaliar HSTS quando HTTPS e redirects estiverem estáveis; confirmar configuração real da Cloudflare antes de duplicar.
4. Verificar imagens, formulário WhatsApp, catálogo, responsividade, acessibilidade e PageSpeed.
5. Atualizar texto de privacidade que menciona versão de testes; revisar política se analytics adicionais forem ativados.

## 4. Critérios de saída
- Domínio oficial ativo com HTTPS certificado e redirecionamentos corretos.
- Sem `noindex` no domínio oficial e com subdomínios de prévia protegidos de indexação.
- URLs canônicas, OG, JSON-LD, sitemap e política de privacidade consistentes.
- Search Console verificado e URL pública inspecionada.
- Sem regressões de layout/JS, formulário, catálogo ou cobertura regional.

**Estado desta auditoria:** diagnóstico estático concluído; validações externas pendentes. Nenhuma implantação ou alteração de `site-v2/**` realizada.

## 5. Complemento: auditoria de desempenho e superfície de ataque (11/10/2026)

### Inspeção estática por arquivo (sem medição em ambiente real)
- Página inicial: **17 tags `img`**, das quais **15** têm `loading="lazy"`. Duas imagens essenciais (logo principal e caminhão) carregam normalmente; isso é apropriado para os elementos da primeira dobra.
- Arquivos CSS públicos principais: `site-v2.css` 59.722 B, `motion-v2.css` 14.799 B, `formulario-v2.css` 9.367 B (o formulário usa a folha própria; a home usa as duas primeiras). CSS da home: **74.521 B** antes de compressão.
- Módulos JavaScript: `site-v2.mjs` 13.434 B, `motion-v2.mjs` 7.558 B, `coverage-v2.mjs` 13.153 B, `state-shapes-v2.mjs` 3.397 B (soma: **37.542 B**, antes de compressão).
- O modal do mapa constrói os pontos somente sob demanda. Interações 3D limitadas a dispositivos com ponteiro compatível; animações possuem tratamento de movimento reduzido.
- O PDF `pdf/catalogo-bischof.pdf` contém **16.219.980 B (~16,2 MB)**, mas é solicitado pelo visitante ao clicar para baixá-lo, não na abertura da home. Avaliar compressão apenas se a experiência do usuário justificar.
- Seis logos de parceiros na home não especificam atributos HTML `width`/`height` (imagens com dimensões fixadas pelo layout CSS). Vale conferir deslocamento de layout real antes de qualquer mudança.
- Fontes externas do Google Fonts adicionam solicitações a terceiros; site usa `preconnect` com `fonts.googleapis.com` e `fonts.gstatic.com`. Recomenda-se medir impacto pelo PageSpeed antes de substituir fontes.
- O arquivo `site-v2/_headers` configura cache de HTML curto, CSS/JS por 300 s, e imagens por 86400 s. É uma base conservadora, que evita problemas de atualização.
- Foram examinados módulos JS com busca textual para `eval`, `innerHTML`, `document.write`, `localStorage`, `sessionStorage`, `fetch`. Não apareceram chamadas diretas a esses tokens, mas o resultado **não equivale a teste de vulnerabilidades ou execução de JS**.
- As páginas inspecionadas não apresentam URLs explícitas `http://` nos `src`/`href` do HTML, e links `target=_blank` têm `rel=noopener`.

### Limites e prioridades
1. **Medição pendente:** ambiente de inspeção não conseguiu estabelecer conexões HTTPS externas a `bischof.pages.dev` nem `bischof.com.br`. Não há pontuação válida de Lighthouse/PageSpeed, nem confirmação de status HTTP, certificado ou cabeçalhos realmente enviados ao cliente.
2. **Não ativar CSP estrita de imediato:** testar primeiro política em modo Report-Only, pois fontes do Google, conteúdo embutido JSON-LD e módulos JavaScript exigem uma política compatível.
3. **Não ativar HSTS às cegas:** confirmar redirecionamentos, certificado e eventuais configurações de Cloudflare que já adicionem HSTS.
4. **Mais próximo do lançamento:** configurar domínio e confirmar TLS; realizar medição externa de PageSpeed em mobile/desktop, validar formulário, acessibilidade, links e mapa; só então aplicar correções pontuais e revalidar.
5. **Google continua em homologação:** conservar `noindex` até o domínio canônico estar definido e verificado.

**Nenhum arquivo `site-v2/**` foi alterado; atualização documental apenas.**
