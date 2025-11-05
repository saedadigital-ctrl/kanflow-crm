# 🎨 KanFlow CRM - Brand Guide

## Identidade Visual Profissional

---

## Logo Variations

### 1. **Logo Principal** (Quadrado)
- **Arquivo**: `logo-kanflow-crm-modern.png`
- **Uso**: Favicon, app icon, social media
- **Tamanho mínimo**: 64px
- **Espaçamento**: 16px ao redor

### 2. **Logo Horizontal** (Landscape)
- **Arquivo**: `logo-kanflow-crm-horizontal.png`
- **Uso**: Headers, navegação, branding
- **Tamanho mínimo**: 120px de altura
- **Espaçamento**: 24px ao redor

### 3. **Logo Completo** (Full)
- **Arquivo**: `logo-kanflow-crm-full.png`
- **Uso**: Landing pages, hero sections, apresentações
- **Tamanho mínimo**: 200px de altura
- **Espaçamento**: 32px ao redor

### 4. **Ícone** (Icon Only)
- **Arquivo**: `logo-kanflow-crm-icon.png`
- **Uso**: Favicon, app icon, botões
- **Tamanho**: 32px, 64px, 128px, 256px

---

## Paleta de Cores

### Cores Primárias

| Cor | Hex | RGB | Uso |
|-----|-----|-----|-----|
| **Azul Profundo** | #1E40AF | rgb(30, 64, 175) | Primária, Headers, Botões |
| **Cyan Vibrante** | #06B6D4 | rgb(6, 182, 212) | Destaques, Secundária |
| **Verde Sucesso** | #10B981 | rgb(16, 185, 129) | Status, Confirmação |

### Cores Neutras

| Cor | Hex | RGB | Uso |
|-----|-----|-----|-----|
| Branco | #FFFFFF | rgb(255, 255, 255) | Backgrounds, Texto claro |
| Cinza Claro | #F3F4F6 | rgb(243, 244, 246) | Backgrounds alternativos |
| Cinza Médio | #9CA3AF | rgb(156, 163, 175) | Texto secundário |
| Preto | #000000 | rgb(0, 0, 0) | Texto principal |

### Cores de Status

| Status | Cor | Hex | Uso |
|--------|-----|-----|-----|
| ✅ Sucesso | Verde | #10B981 | Confirmações, Positivo |
| ❌ Erro | Vermelho | #EF4444 | Erros, Negativo |
| ⚠️ Aviso | Amarelo | #F59E0B | Avisos, Atenção |
| ℹ️ Info | Azul | #3B82F6 | Informações, Neutro |

---

## Tipografia

### Fontes Recomendadas

- **Primária**: Inter (Google Fonts)
- **Secundária**: Poppins (Google Fonts)
- **Monoespacial**: JetBrains Mono (código)

### Escala de Tamanhos

| Nível | Tamanho | Peso | Uso |
|-------|---------|------|-----|
| **H1** | 32px | 700 Bold | Títulos principais |
| **H2** | 28px | 600 Semibold | Subtítulos |
| **H3** | 24px | 600 Semibold | Seções |
| **H4** | 20px | 600 Semibold | Subseções |
| **Body** | 16px | 400 Regular | Texto principal |
| **Small** | 14px | 400 Regular | Texto secundário |
| **Tiny** | 12px | 400 Regular | Labels |

### Line Heights

- Títulos (H1-H4): 1.2
- Corpo: 1.5
- Pequeno: 1.4

---

## Componentes

### Botões

#### Primário
```
Background: #1E40AF
Texto: Branco
Padding: 12px 24px
Border Radius: 8px
Font Weight: 600
Hover: Opacidade -10%
```

#### Secundário
```
Background: #06B6D4
Texto: Branco
Padding: 12px 24px
Border Radius: 8px
Font Weight: 600
```

#### Outline
```
Background: Transparente
Borda: 2px #1E40AF
Texto: #1E40AF
Padding: 10px 22px
Border Radius: 8px
```

### Cards

```
Background: Branco
Border: 1px #E5E7EB
Border Radius: 12px
Padding: 24px
Shadow: 0 1px 3px rgba(0,0,0,0.1)
```

### Inputs

```
Background: #F9FAFB
Border: 1px #D1D5DB
Border Radius: 8px
Padding: 12px 16px
Font Size: 16px
Focus: Border #1E40AF, Shadow azul
```

### Badges

```
Padding: 4px 12px
Border Radius: 12px
Font Size: 12px
Font Weight: 600

Variações:
- Success: Verde background, texto branco
- Error: Vermelho background, texto branco
- Warning: Amarelo background, texto preto
- Info: Azul background, texto branco
```

---

## Sombras

| Nível | Valor |
|-------|-------|
| **sm** | 0 1px 2px 0 rgba(0,0,0,0.05) |
| **md** | 0 4px 6px -1px rgba(0,0,0,0.1) |
| **lg** | 0 10px 15px -3px rgba(0,0,0,0.1) |
| **xl** | 0 20px 25px -5px rgba(0,0,0,0.1) |

---

## Espaçamento

### Sistema de Grid (8px base)

| Tamanho | Valor | Uso |
|---------|-------|-----|
| **xs** | 4px | Micro espaçamento |
| **sm** | 8px | Compacto |
| **md** | 16px | Padrão |
| **lg** | 24px | Generoso |
| **xl** | 32px | Seções |
| **2xl** | 48px | Grandes seções |

---

## Breakpoints (Responsive)

| Breakpoint | Tamanho | Dispositivo |
|-----------|---------|-----------|
| **Mobile** | < 640px | Smartphones |
| **Tablet** | 640px - 1024px | Tablets |
| **Desktop** | > 1024px | Computadores |

---

## Ícones

- **Biblioteca**: Lucide React
- **Tamanho padrão**: 24px
- **Cores**: Herdam do texto

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

## Temas

### Light (Padrão)
```
Background: Branco
Foreground: Preto
Primário: #1E40AF
Secundário: #06B6D4
```

### Dark
```
Background: #1F2937
Foreground: Branco
Primário: #3B82F6
Secundário: #06B6D4
```

---

## Uso de Logo

### ✅ Correto

- Logo em fundo branco ou claro
- Logo em fundo azul escuro
- Logo com espaçamento adequado
- Logo em tamanho legível
- Logo sem distorção

### ❌ Incorreto

- Logo em fundo colorido similar
- Logo muito pequeno (< 64px)
- Logo distorcido ou rotacionado
- Logo com cores alteradas
- Logo sem espaçamento

---

## Guia de Acessibilidade

- Contraste mínimo: 4.5:1 para texto
- Não use apenas cor para comunicar informações
- Sempre inclua labels em inputs
- Suporte a keyboard navigation
- Teste com leitores de tela

---

## Arquivos de Branding

| Arquivo | Tipo | Uso |
|---------|------|-----|
| `logo-kanflow-crm-modern.png` | PNG | Quadrado, favicon |
| `logo-kanflow-crm-horizontal.png` | PNG | Landscape, headers |
| `logo-kanflow-crm-full.png` | PNG | Full branding |
| `logo-kanflow-crm-icon.png` | PNG | Ícone puro |
| `BRAND_GUIDE.md` | Markdown | Este guia |

---

## Integração no Projeto

### HTML
```html
<!-- Favicon -->
<link rel="icon" href="/logo-kanflow-crm-icon.png" type="image/png">

<!-- Logo no Header -->
<img src="/logo-kanflow-crm-horizontal.png" alt="KanFlow CRM" height="40">
```

### CSS
```css
.logo {
  background-image: url('/logo-kanflow-crm-modern.png');
  background-size: contain;
  background-repeat: no-repeat;
  width: 64px;
  height: 64px;
}
```

### React
```jsx
import logo from '@/assets/logo-kanflow-crm-horizontal.png';

export default function Header() {
  return <img src={logo} alt="KanFlow CRM" height={40} />;
}
```

---

## Próximos Passos

- [ ] Exportar logos em SVG
- [ ] Criar variações em escala de cinza
- [ ] Criar variações negativas (invertidas)
- [ ] Gerar favicons para diferentes resoluções
- [ ] Criar guia de animações
- [ ] Documentar padrões de micro-interações

---

**Brand Guide Completo! 🎨**

Para dúvidas sobre uso da marca, consulte este guia ou entre em contato com o time de design.

