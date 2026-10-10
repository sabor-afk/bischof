# Bischof V2 — Plano de pré-lançamento e SEO

Atualizado em 10/10/2026. Preparação iniciada **sem mudar a branch `main` nem ativar a indexação**.

## Estado atual: homologação
- Endereço: https://bischof.pages.dev/
- Deploy: GitHub Actions apenas da branch `site-bischof-v2` e pasta `site-v2/`.
- `X-Robots-Tag: noindex,nofollow,noarchive` no Cloudflare e `meta robots noindex` no HTML.
- `robots.txt` permite rastreamento **para que os robôs consigam observar o `noindex`**; isto não é autorização para indexar.
- Compartilhamento Open Graph/Twitter aponta para imagem do repositório copiada ao deploy.
- Não configurar sitemap nem canonical de domínio não confirmado na prévia.

## Identidade e domínio — confirmar antes de alterar o site
- Confirmar grafia do domínio fornecido pelo responsável: `bichoff.com.br` (pode diferir do nome Bischof).
- Confirmar titularidade e acesso de DNS, `www` versus sem `www`, URLs oficiais e números de atendimento.
- Confirmar dados institucionais e informações no `LocalBusiness` (endereço, fundação, horários se públicos).
- Definir endereço canônico HTTPS no domínio oficial; testar SSL e redirecionar a outra variante.

## SEO técnico — preparar na branch, ativar só no lançamento
1. `<title>`, meta description, cabeçalhos H1/H2, texto alternativo das imagens e links internos.
2. Open Graph / Twitter Cards com imagem pública absoluta e captura de visualização em WhatsApp.
3. Dados estruturados (`Organization`/`LocalBusiness`), apenas dados reais e verificáveis.
4. Página 404 personalizada; evitar links quebrados e recursos externos ausentes.
5. Sitemap XML apenas de páginas públicas canônicas; `robots.txt` final com link do sitemap.
6. Ao lançar: trocar os `og:url`, `og:image`, JSON-LD `url` e canônicos, e só então remover TODOS os `noindex`.
7. Testar HTTP 200/301/404, cache, segurança, mobile, WCAG 2.2 AA e Core Web Vitals.
8. Garantir que `bischof.pages.dev` não dispute indexação com o domínio principal; mantê-lo `noindex` após lançamento, com estratégia de implantação separada se necessário.

## Search Console e Google
- Adicionar a propriedade do domínio oficial no Search Console por DNS TXT quando houver acesso; isso pode ser feito antes da publicação.
- Migrar a propriedade do GitHub Pages com mapa de URLs e redirecionamentos 301/308, quando autorizada alteração do site antigo.
- Depois do lançamento enviar o novo sitemap, verificar URL e monitorar cobertura, consultas e eventuais problemas.
- Não exigir indexação imediata: decisão e prazo são do Google.
- Revisar Perfil da Empresa no Google (endereço ou área de atendimento, categoria, telefone e site).

## Medição e LGPD
- Considerar Cloudflare Web Analytics gratuito e sem cookies como primeiro passo; exige ativação em painel.
- Se usar GA4, Google Ads, Meta Pixel ou rastreamento adicional, elaborar política/consentimento conforme a implementação e LGPD.
- Medir visitas, origem do tráfego e resultados comerciais de forma agregada; não incluir dados pessoais em URLs de métricas.
- Formulário atual: prepara mensagem para WhatsApp; não há backend de captura. Não anunciar CRM inexistente.

## Segurança e operação
- Verificar cabeçalhos, HTTPS, certificados, política de privacidade e fontes externas.
- Evitar CAPTCHA sem necessidade; aplicar proteção se for criado formulário com submissão a servidor.
- Testar em Edge/Chrome, Android, desktop e modo sem animação.
- Monitorar erros de deploy no GitHub Actions e ter procedimento de reversão.

## Gate para lançamento
A publicação oficial depende de: grafia e posse do domínio, DNS/SSL, aprovação comercial, SEO sem `noindex` no domínio oficial, analytics/privacy, Search Console, redirecionamentos do site antigo, QA, aprovação final.
**Nunca alterar `main` por este plano sem autorização explícita.**
