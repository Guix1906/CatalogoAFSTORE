
Objetivo: lançar o AF STORE mobile-first com foco total em conversão para WhatsApp, em 2 fases.

**Fase 1 — MVP funcional (estrutura + conversão)**
1. **Base visual da marca**
   - Aplicar identidade premium escura da AF STORE (cores, tipografia, espaçamento, bordas douradas).
   - Definir estilo consistente para botões, cards, badges e estados ativos.

2. **Dados e modelo inicial**
   - Criar estrutura local de dados com tipagem de produto.
   - Popular com 10 produtos fitness realistas (feminino e masculino), já preparados para migrar para backend depois.
   - Deixar imagens como URLs substituíveis no futuro (sem travar o layout).

3. **Layout mobile-first global**
   - Header fixo com logo central e busca.
   - Bottom nav fixa com: Início, Categorias, Novidades, WhatsApp.
   - Page wrapper para compensar header/nav fixos e manter leitura confortável.

4. **Páginas principais e navegação**
   - **Home (/):** hero rotativo, categorias em scroll, mais vendidos, novidades, promoções, banner WhatsApp.
   - **Categorias (/categorias):** página com atalhos visuais para todas as categorias.
   - **Categoria (/categoria/:slug):** filtros horizontais, ordenação e grid 2 colunas com carregamento progressivo.
   - **Produto (/produto/:id):** galeria swipe, preço com desconto, seleção de tamanho/cor, descrição/medidas expansíveis, recomendados.
   - **Busca (/busca):** busca em tempo real com estado vazio inteligente.
   - **Novidades (/novidades):** listagem filtrada por itens novos.

5. **Conversão WhatsApp (núcleo do app)**
   - Implementar CTA de WhatsApp em pontos estratégicos (cards, banners e página de produto).
   - Gerar mensagem pré-formatada com produto, tamanho e cor selecionados.
   - Usar número oficial da loja em todos os fluxos.

**Fase 2 — Refino de experiência (conversão + percepção premium)**
1. **Animações moderadas (Framer Motion)**
   - Entrada suave de cards com stagger.
   - Transição leve entre rotas.
   - Hero com transição lateral.
   - Bottom nav com feedback de item ativo.
   - Botão WhatsApp com pulse sutil periódico.

2. **Polimento de UX mobile**
   - Melhorar feedback visual de filtros, ordenação, chips e seleção de variações.
   - Ajustar hierarquia de conteúdo para leitura rápida e decisão de compra.
   - Revisar espaçamentos para toque e acessibilidade.

3. **Ajustes finais de conversão**
   - Garantir que todo clique importante reduza fricção até o WhatsApp.
   - Revisar textos de CTA e microcopy para aumentar intenção de contato.

4. **Validação final**
   - Teste end-to-end dos fluxos: Home → Categoria → Produto → WhatsApp.
   - Testes de responsividade e consistência visual em diferentes larguras mobile.
