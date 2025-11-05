# 🎨 KanFlow CRM - Design System Figma

## Paleta de Cores Profissional

### Cores Primárias

| Nome | Hex | RGB | Uso |
|------|-----|-----|-----|
| **Azul Profundo** | #1E40AF | rgb(30, 64, 175) | Botões, Headers, Links |
| **Ciano Vibrante** | #06B6D4 | rgb(6, 182, 212) | Destaques, Secundário |
| **Verde Sucesso** | #10B981 | rgb(16, 185, 129) | Status Positivo, Confirmação |
| **Cinza Profissional** | #664748B | rgb(102, 71, 139) | Backgrounds, Borders |

### Cores Secundárias

| Nome | Hex | Uso |
|------|-----|-----|
| Branco | #FFFFFF | Backgrounds, Texto em cores escuras |
| Cinza Claro | #F3F4F6 | Backgrounds alternativos |
| Cinza Médio | #9CA3AF | Texto secundário, Borders |
| Preto | #000000 | Texto principal |

### Cores de Status

| Status | Cor | Hex |
|--------|-----|-----|
| Sucesso | Verde | #10B981 |
| Erro | Vermelho | #EF4444 |
| Aviso | Amarelo | #F59E0B |
| Info | Azul | #3B82F6 |

---

## Tipografia

### Fontes

- **Primária**: Inter (Google Fonts)
- **Monoespacial**: JetBrains Mono (código)

### Escalas de Tamanho

| Nível | Tamanho | Peso | Uso |
|-------|---------|------|-----|
| H1 | 32px | 700 (Bold) | Títulos de página |
| H2 | 28px | 600 (Semibold) | Subtítulos |
| H3 | 24px | 600 (Semibold) | Seções |
| H4 | 20px | 600 (Semibold) | Subseções |
| Body | 16px | 400 (Regular) | Texto principal |
| Small | 14px | 400 (Regular) | Texto secundário |
| Tiny | 12px | 400 (Regular) | Labels, Badges |

### Line Heights

- H1-H4: 1.2
- Body: 1.5
- Small: 1.4

---

## Espaçamento

### Sistema de Grid (8px base)

| Tamanho | Valor | Uso |
|---------|-------|-----|
| xs | 4px | Micro espaçamento |
| sm | 8px | Espaçamento compacto |
| md | 16px | Espaçamento padrão |
| lg | 24px | Espaçamento generoso |
| xl | 32px | Seções |
| 2xl | 48px | Grandes seções |

---

## Componentes

### Botões

#### Primário
- Fundo: #1E40AF
- Texto: Branco
- Padding: 12px 24px
- Border Radius: 8px
- Font Weight: 600

#### Secundário
- Fundo: #06B6D4
- Texto: Branco
- Padding: 12px 24px
- Border Radius: 8px
- Font Weight: 600

#### Outline
- Fundo: Transparente
- Borda: 2px #1E40AF
- Texto: #1E40AF
- Padding: 10px 22px
- Border Radius: 8px

#### Desabilitado
- Opacidade: 50%
- Cursor: not-allowed

### Cards

- Background: Branco
- Border: 1px #E5E7EB
- Border Radius: 12px
- Padding: 24px
- Shadow: 0 1px 3px rgba(0,0,0,0.1)

### Inputs

- Background: #F9FAFB
- Border: 1px #D1D5DB
- Border Radius: 8px
- Padding: 12px 16px
- Font Size: 16px

### Badges

- Padding: 4px 12px
- Border Radius: 12px
- Font Size: 12px
- Font Weight: 600

#### Variações
- Success: Verde background, texto branco
- Error: Vermelho background, texto branco
- Warning: Amarelo background, texto preto
- Info: Azul background, texto branco

### Modals

- Overlay: rgba(0,0,0,0.5)
- Background: Branco
- Border Radius: 16px
- Padding: 32px
- Max Width: 600px

### Tabelas

- Header Background: #F3F4F6
- Row Padding: 16px
- Border: 1px #E5E7EB
- Alternating rows: Branco / #F9FAFB

---

## Sombras

| Nível | Valor |
|-------|-------|
| sm | 0 1px 2px 0 rgba(0,0,0,0.05) |
| md | 0 4px 6px -1px rgba(0,0,0,0.1) |
| lg | 0 10px 15px -3px rgba(0,0,0,0.1) |
| xl | 0 20px 25px -5px rgba(0,0,0,0.1) |

---

## Ícones

- **Biblioteca**: Lucide React
- **Tamanho Padrão**: 24px
- **Cores**: Herdam do texto (inherit)

### Tamanhos Comuns

- xs: 16px
- sm: 20px
- md: 24px
- lg: 32px
- xl: 48px

---

## Estados

### Hover
- Opacidade: -10%
- Transform: scale(1.02)

### Focus
- Outline: 2px solid #1E40AF
- Outline Offset: 2px

### Active
- Opacidade: -20%

### Disabled
- Opacidade: 50%
- Cursor: not-allowed

---

## Breakpoints (Responsive)

| Breakpoint | Tamanho | Uso |
|-----------|---------|-----|
| Mobile | < 640px | Smartphones |
| Tablet | 640px - 1024px | Tablets |
| Desktop | > 1024px | Computadores |

---

## Temas

### Light (Padrão)
- Background: Branco
- Foreground: Preto
- Primário: #1E40AF

### Dark
- Background: #1F2937
- Foreground: Branco
- Primário: #3B82F6

---

## Guia de Uso

### Hierarquia de Cores

1. **Primária (#1E40AF)**: Ações principais, CTAs
2. **Secundária (#06B6D4)**: Destaques, informações
3. **Sucesso (#10B981)**: Confirmações, status positivo
4. **Neutra (#664748B)**: Backgrounds, borders

### Acessibilidade

- Contraste mínimo: 4.5:1 para texto
- Não use apenas cor para comunicar informações
- Sempre inclua labels em inputs
- Suporte a keyboard navigation

### Consistência

- Use a mesma paleta em todo o app
- Mantenha espaçamento consistente
- Use os mesmos componentes reutilizáveis
- Siga a tipografia definida

---

## Exportar para Figma

### Passos:

1. Criar novo projeto no Figma
2. Criar páginas para:
   - Colors (paleta)
   - Typography (fontes)
   - Components (botões, cards, inputs)
   - Patterns (layouts)
   - Documentation (guia)

3. Criar componentes reutilizáveis:
   - Button (4 variações)
   - Card
   - Input
   - Badge
   - Modal
   - Table Row

4. Criar estilos de cor
5. Criar estilos de tipografia
6. Documentar padrões

---

## Próximos Passos

- [ ] Criar projeto Figma
- [ ] Importar paleta de cores
- [ ] Criar componentes base
- [ ] Documentar padrões
- [ ] Compartilhar com time
- [ ] Sincronizar com código

---

**Design System Pronto para Figma! 🎨**

