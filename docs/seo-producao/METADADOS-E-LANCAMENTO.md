# Metadados de lançamento — domínio bischof.com.br

Este arquivo é **um roteiro, não é código publicado**. O projeto em homologação deve manter meta robots noindex e header X-Robots-Tag noindex.

## URLs propostas
- Principal: https://bischof.com.br/
- Formulário: https://bischof.com.br/formulario-bischof.html
- Catálogo: https://bischof.com.br/catalogo-interativo.html
- Privacidade: https://bischof.com.br/privacidade.html
- Imagem social: https://bischof.com.br/img/og-image-bischof.webp
- Sitemap: https://bischof.com.br/sitemap.xml

## Antes de abrir a indexação
1. Verificar titularidade e acesso DNS, criar domínio no Cloudflare Pages e confirmar que HTTPS funciona.
2. Confirmar se o endereço canônico será sem `www` (proposto). Redirecionar `www` ao canônico.
3. Garantir que `bischof.pages.dev` continue fora das buscas após publicar o domínio novo. Atenção: as regras de `_headers` atuais são globais e afetam os dois hostnames; preferir política por hostname ou redirecionamento antes de retirar noindex.
4. Atualizar `og:url`, `og:image`, `og:image:secure_url`, `twitter:image`, `LocalBusiness.url`, canonical e os links internos. URLs absolutas devem usar bischof.com.br somente quando o domínio estiver público e validado.
5. Publicar sitemap e robots de produção **apenas na virada**. Atualizar a política de privacidade: ainda refere-se à "versão de teste".
6. Na propriedade do Google Search Console **Domínio: bischof.com.br**, verificar por registro TXT no DNS. Pode fazer agora (não indexa por si só).
7. Após o lançamento: confirmar com HTTP que o domínio oficial não recebe `noindex`, que 404 retorna status 404, que páginas estão em 200, que `www` redireciona, que o sitemap não inclui páginas inexistentes; então solicitar indexação.
8. Rever a migração do site anterior em GitHub Pages: caso não seja possível responder com HTTP 301/308 nesse host, usar estratégia de migração alternativa com limites claramente documentados, sem afirmar que existe redirecionamento permanente HTTP.
9. Testar prévia do compartilhamento (WhatsApp/LinkedIn), Core Web Vitals, imagens e dados estruturados, política LGPD e analytics antes do anúncio.

## Exemplos de metadados de produção (não incorporar até a virada)

```html
<link rel="canonical" href="https://bischof.com.br/">
<meta property="og:url" content="https://bischof.com.br/">
<meta property="og:image" content="https://bischof.com.br/img/og-image-bischof.webp">
<meta property="og:image:secure_url" content="https://bischof.com.br/img/og-image-bischof.webp">
<meta name="twitter:image" content="https://bischof.com.br/img/og-image-bischof.webp">
<meta name="robots" content="index,follow">
```

Use canonical individual nas páginas secundárias e não indexe a página 404. O schema JSON-LD da empresa deve apontar para `https://bischof.com.br/`. Não inventar dados comerciais.

## Estado atual
- Branch preparada: `site-bischof-v2`.
- `main` e domínio antigo permanecem intocados.
- Nenhuma integração Search Console, analytics ou DNS foi realizada por esta documentação.
- Nenhuma mudança deste diretório dispara o workflow, que observa apenas `site-v2/**`.
