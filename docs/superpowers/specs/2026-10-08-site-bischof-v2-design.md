# Bischof Distribuidora — Site institucional V2 (especificação de design)

Data: 2026-10-08  
Repositório: `sabor-afk/bischof`  
Branch de trabalho: `site-bischof-v2`  
Produção preservada: `main`; backup: `backup-site-bischof-2026-10-08`

## 1. Objetivo
Modernizar o site institucional/comercial da Bischof Distribuidora com uma aparência premium, animações elegantes e experiência excelente no celular. Continuar sendo um **site estático e leve**, não um sistema com login ou banco de dados. O foco é gerar confiança, apresentar marcas e produtos reais e transformar visitas em contatos comerciais.

## 2. Referência aprovada
Direção aprovada em conversa: design premium/cinematográfico, hero de alto impacto, seções claras e escuras, profundidade, cartões, transições de rolagem e chamadas comerciais fortes. **Identidade oficial obrigatória:** logotipo fornecido pelo responsável em 08/10/2026 (letreiro BISCHOF DISTRIBUIDORA, fundo verde-azulado com borda arredondada). Não usar o logotipo com floco de neve das imagens conceituais. As prévias geradas eram ilustrativas; não usar marcas fictícias nem afirmar que veículos gerados são veículos reais da empresa.

## 3. Público e mensagem
Público: proprietários e compradores de padarias, lanchonetes, mercados, conveniências, restaurantes e revendedores. Mensagem principal: **“Seu negócio cresce. A gente abastece.”** Como texto de apoio: distribuição de salgados congelados com marcas selecionadas e logística refrigerada. Manter dados comerciais do site existente até confirmação: pedido mínimo R$ 200, atendimento em SC/PR/SP até Juquiá, desde 2013, atendimento via WhatsApp existente. Evitar promessas não verificadas de prazo de resposta, volume de frota ou prazos de entrega.

## 4. Arquitetura e restrições
- Entrega em HTML, CSS e JavaScript sem framework e sem backend; compatível com hospedagem GitHub Pages.
- Manter URLs e ativos existentes sempre que possível: `catalogo-interativo.html`, `pdf/catalogo-bischof.pdf`, `formulario-bischof.html`, `privacidade.html` e as oito marcas reais: Sabor do Alemão, Maizum, Delick's, Disk Salgadinhos, Serra da Canastra, DaNiza, Mein Haus, Italiana Gourmet.
- Identidade: verde-petróleo profundo, verde-azulado oficial e creme/off-white. Contraste AA para textos e controles. Fontes do Google com fallbacks.
- Redesign progressivo isolado na branch de V2. **Não atualizar `main`** até revisão e aprovação explícita.
- O `netlify.toml` existente não provê processamento de formulários no GitHub Pages. Substituir a dependência do Netlify Forms na V2 por uma estratégia estática funcional e transparente: formulário que compõe uma mensagem de WhatsApp com os dados preenchidos (sem enviar nada automaticamente), com aviso claro de que o usuário precisa confirmar o envio no WhatsApp; ou alternativa equivalente aprovada antes de implementar. Evitar coletar CPF/CNPJ na primeira interação se desnecessário.
- Inserir a logo oficial fornecida (ou uma derivação otimizada fiel) como ativo versionado na V2; garantir bom resultado em fundos escuros e claros.
- Não criar novas funcionalidades de e-commerce, pedidos, banco de dados ou rastreio neste redesign.

## 5. Estrutura da home V2
1. **Navegação:** cabeçalho fixo translúcido com logotipo original, links Início, Produtos/Catálogo, Marcas, Sobre, Entregas, Contato e botão WhatsApp. No celular, menu acessível que fecha com clique, Escape e ao navegar.
2. **Hero:** manchete “Seu negócio cresce. A gente abastece.” em duas linhas, subtítulo objetivo, CTAs de catálogo e WhatsApp, números reais (desde 2013, pedido mínimo R$ 200, três estados) e composição gráfica premium com imagens autênticas quando disponíveis. Não deixar o texto escondido pela arte. Priorizar carregamento do conteúdo inicial.
3. **Proposta de valor:** frota refrigerada, marcas selecionadas, atendimento regional e cadeia do frio; cartões com ícones consistentes, não uma fileira de emojis.
4. **Marcas:** usar exclusivamente os logos já presentes no repositório; card Sabor do Alemão em destaque, grid responsivo para as demais; conferir nomes e acessibilidade.
5. **Catálogo:** apresentar categorias sem inventar produtos nem fotos, acesso ao catálogo interativo atual e PDF existente.
6. **Quem somos:** parágrafo mais curto, operação de Joinville e tradição desde 2013; design editorial.
7. **Cobertura:** SC/PR/SP com bandeiras existentes e limite Juquiá/SP; botão para perguntar sobre cidade via WhatsApp.
8. **Contato:** CTA final, horários/WhatsApp existentes, formulário estático que abre mensagem revisável no WhatsApp; expectativa realista sobre o envio.
9. **Rodapé:** contato, navegação, marcas e política de privacidade coerente com o novo formulário.

## 6. Interações e animações
- Entrada de elementos em rolagem com `IntersectionObserver`, CSS `transform` / `opacity`; efeitos suaves e pontuais.
- Realce por hover/focus em cartões e botões; transição no cabeçalho após rolagem; scroll suave respeitando preferências do usuário.
- `prefers-reduced-motion: reduce` desabilita movimentos não essenciais. Sem bibliotecas de animação pesadas, sem autoplay em segundo plano.
- Modais só se necessário e com controles semânticos, foco e tecla Escape.
- Nenhuma animação deve bloquear conteúdo caso JavaScript esteja desabilitado.

## 7. Desempenho, SEO, acessibilidade
- Mobile-first, testar 360, 390, 768, 1024 e 1440 px; evitar overflow horizontal.
- Dimensões de imagem declaradas, lazy-load abaixo da dobra, otimizar logo oficial. Catálogo PDF de ~16 MB permanece opt-in (download por ação explícita).
- Corrigir links quebrados: referência local `sabor-do-alemao/index.html` ausente; endereço externo de Sabor do Alemão precisa `https://`; URL `/formulario` do Netlify aponta para arquivo inexistente.
- Corrigir `sitemap.xml` onde `/bischoff/` diverge do URL `/bischof/`, sem pressupor que GitHub Pages seja domínio final.
- Meta description, Open Graph, title, canonical/sitemap consistentes; somente um H1 principal na home.
- Navegação por teclado, estados de foco, labels, hierarquia de títulos, texto alternativo e feedback de formulário.
- Segurança: links externos com `rel="noopener noreferrer"`; sem prometer envio/armazenamento de dados além do efetivamente implementado.

## 8. Testes e critérios de aceite
- Validar arquivos e todos os caminhos locais para não produzir 404.
- Testar menu mobile, CTAs, catálogo HTML/PDF, links externos, WhatsApp com mensagem preenchida, FAQ, política de privacidade e comportamento sem JS.
- Checar console JS sem erros, visual no desktop e mobile, contraste e `prefers-reduced-motion`.
- Garantir que `main` e branch de backup ainda apontem para seus commits anteriores.
- Entregar a V2 em sua branch separada; disponibilizar prévia verificável (p.ex., artefato local ou ambiente de preview independente). Uma branch do GitHub por si só **não** publica automaticamente URL separada do GitHub Pages.
- Reavaliar resultados com o usuário antes de eventual merge para `main`.

## 9. Fora de escopo
Recriar o catálogo interativo de 12,9 MB; atualizar catálogo comercial/preços; conectar pedidos ao Bischof Vendas; cadastrar produtos via banco; adicionar analytics/tracking ou modificar infraestrutura de produção.

## 10. Sequência sugerida
A. Revisar e aprovar esta especificação.  
B. Elaborar um plano de implementação com arquivos, passos, testes e método de execução; obter aprovação.  
C. Implementar a V2 na branch, testar e apresentar prévia; iterar com feedback.  
D. Publicar em produção somente mediante solicitação específica.
