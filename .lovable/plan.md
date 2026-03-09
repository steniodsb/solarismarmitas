

# Plano de Reestruturação Completa do Site Solaris

## Resumo

Reestruturar o site com base nas instruções detalhadas: simplificar a HomePage, adicionar categoria "Promocionais", melhorar o fluxo de compra dos sucos (sem seleção de tamanho), adicionar página "Área de Atendimento", e corrigir a UX do carrinho.

---

## 1. HomePage - Simplificar Hero e Estrutura

**Hero**: Trocar o carrossel de fotos por um fundo vermelho sólido (gradient-hero) com o texto. Manter simples e limpo.

**Galerias por categoria**: Manter os carrosséis horizontais de fotos por categoria (Fitness, Low Carb, Caseira, Vegetariana, Sucos, **Promocionais**). Cada galeria com botão "Peça Agora" que leva para a página de montagem.

**"Conheça nossa empresa"**: Manter como está, mas **sem link/botão clicável** — apenas informativo com a foto da Carina e texto.

**"Como funciona"**: Manter os 4 passos.

Arquivo: `src/pages/HomePage.tsx`

---

## 2. Nova Categoria: Promocionais

Criar uma página dedicada `/montar/promocionais` com fluxo simplificado:
- Exibir descrição: "Montamos combos sortidos com combinações bem variadas..."
- Usuário escolhe apenas **tamanho** e **quantidade** (10, 20 ou 30 unidades)
- Preços fixos:
  - 10un 400ml = R$ 159,90
  - 10un 500ml = R$ 189,90
  - 10un 850ml = R$ 259,90
  - 20un = R$ 10,00 de desconto
  - 30un = R$ 20,00 de desconto
- Galeria de fotos de amostra abaixo das opções
- Campo para observações/alergias/preferências

Arquivo: `src/pages/PromotionalPage.tsx` (novo)
Rota: `/montar/promocionais`

---

## 3. Sucos - Pular Seleção de Tamanho

Na `FlavorSelectionPage`, quando a categoria for "sucos":
- Não mostrar seleção de tamanho (todos são 300ml)
- Ao clicar no sabor, mostrar direto o controle de quantidade + botão "Adicionar"
- Atualizar descrição do header: "Sucos naturais em embalagens de 300ml para congelamento"

Arquivo: `src/pages/FlavorSelectionPage.tsx`

---

## 4. Descrições das Categorias

Atualizar as descrições exibidas na OrderCategoriesPage e nos carrosséis:
- **Fitness**: "Alimentação com foco mais saudável, para quem está começando dietas e cuidando da saúde."
- **Tradicional** (caseira): "Comida mais caseira pra quem busca praticidade pro dia a dia."
- **Low Carb**: "Focada em dietas mais extremas para perda de peso."
- **Vegetariana**: "Refeições preparadas sem carnes, com foco mais saudável pro dia a dia."

Essas descrições vêm do Supabase, então será necessário um UPDATE no banco.

---

## 5. Navegação - Área de Atendimento

Adicionar link "Área de Atendimento" no header (nav). Criar página `/area-atendimento` listando as cidades:
- Porto Alegre, Gravataí, Cachoeirinha, Canoas, Sapucaia, Esteio, São Leopoldo, Novo Hamburgo, Nova Santa Rita, Alvorada, Viamão, Guaíba, Eldorado, Estância Velha
- Nota: "Demais localizações podemos entregar com agendamento."

Arquivos: `src/pages/AreaAtendimentoPage.tsx` (novo), `src/components/Header.tsx`, `src/App.tsx`

---

## 6. Correção UX do Carrinho

Problemas relatados: notificação bloqueia botão, após adicionar ao carrinho o usuário é levado para o checkout em vez de continuar comprando.

Correções:
- A notificação de "adicionado ao carrinho" não deve sobrepor a barra do carrinho flutuante
- Após adicionar item, o usuário permanece na página de seleção (já funciona assim, mas verificar)
- O botão flutuante do carrinho abre o sidebar, não o checkout direto

Arquivo: `src/components/frozen/CartNotification.tsx`

---

## 7. Atualização de Preços no Banco

Executar SQL para atualizar os preços na tabela `frozen_sizes`:
- 400ml → R$ 16,90
- 500ml → R$ 19,90
- 850ml → R$ 26,90

Será necessário uma query UPDATE no Supabase.

---

## Ordem de Implementação

1. Atualizar preços no banco (SQL)
2. Atualizar descrições das categorias no banco (SQL)
3. Refatorar HomePage (hero vermelho simples, remover links da seção Carina)
4. Criar página Promocionais
5. Ajustar FlavorSelectionPage para sucos (sem tamanho)
6. Criar página Área de Atendimento + atualizar navegação
7. Corrigir UX do carrinho/notificação
8. Adicionar rota para Promocionais no App.tsx

