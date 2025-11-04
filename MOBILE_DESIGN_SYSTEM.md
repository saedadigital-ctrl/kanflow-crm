# 🎨 Design System Mobile - KanFlow CRM

## 🎯 Objetivo

Definir um design system consistente, acessível e otimizado para dispositivos móveis que garanta uma experiência de usuário excelente no KanFlow CRM Mobile.

---

## 🎨 Paleta de Cores

### **Cores Primárias**

```
Primária: #2563EB (Azul)
  - Light: #DBEAFE
  - Dark: #1E40AF

Secundária: #10B981 (Verde)
  - Light: #D1FAE5
  - Dark: #059669

Destaque: #F59E0B (Âmbar)
  - Light: #FEF3C7
  - Dark: #D97706
```

### **Cores de Status**

```
Sucesso: #10B981 (Verde)
Erro: #EF4444 (Vermelho)
Aviso: #F59E0B (Âmbar)
Informação: #3B82F6 (Azul)
```

### **Cores Neutras**

```
Fundo: #FFFFFF
Superfície: #F9FAFB
Borda: #E5E7EB
Texto Primário: #111827
Texto Secundário: #6B7280
Texto Desabilitado: #9CA3AF
```

---

## 📐 Tipografia

### **Fontes**

```
Família: Inter (Google Fonts)
Pesos: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
```

### **Escalas de Tipo**

| Nome | Tamanho | Peso | Altura de Linha | Uso |
|------|---------|------|-----------------|-----|
| **Display** | 32px | 700 | 40px | Títulos principais |
| **Heading 1** | 28px | 700 | 36px | Títulos de seção |
| **Heading 2** | 24px | 600 | 32px | Subtítulos |
| **Heading 3** | 20px | 600 | 28px | Títulos de card |
| **Body Large** | 18px | 400 | 28px | Texto principal |
| **Body** | 16px | 400 | 24px | Texto padrão |
| **Body Small** | 14px | 400 | 20px | Texto secundário |
| **Label** | 12px | 500 | 16px | Labels e badges |
| **Caption** | 11px | 400 | 16px | Texto muito pequeno |

---

## 🎛️ Espaçamento

### **Escala de Espaçamento**

```
xs: 4px
sm: 8px
md: 12px
lg: 16px
xl: 24px
2xl: 32px
3xl: 48px
4xl: 64px
```

### **Aplicações Típicas**

```
Padding de Card: 16px (lg)
Margin entre Cards: 12px (md)
Padding de Button: 12px (vertical) x 16px (horizontal)
Padding de Input: 12px (vertical) x 12px (horizontal)
Espaço entre Elementos: 8-16px (sm-lg)
```

---

## 🔘 Componentes Base

### **1. Button (Botão)**

#### **Variantes**

```
Primary (Preenchido)
├─ Background: #2563EB
├─ Text: Branco
├─ Padding: 12px vertical, 16px horizontal
└─ Border Radius: 8px

Secondary (Contorno)
├─ Background: Transparente
├─ Border: 2px #2563EB
├─ Text: #2563EB
└─ Border Radius: 8px

Tertiary (Texto)
├─ Background: Transparente
├─ Text: #2563EB
├─ Sem border
└─ Sem padding horizontal
```

#### **Estados**

```
Normal: Opacidade 100%
Hover: Opacidade 90% (mobile: não aplicável)
Pressed: Opacidade 80%
Disabled: Opacidade 50%, Cursor not-allowed
Loading: Spinner + Disabled
```

#### **Tamanhos**

```
Large: 48px altura, 16px padding horizontal
Medium: 40px altura, 14px padding horizontal
Small: 32px altura, 12px padding horizontal
```

---

### **2. Card (Cartão)**

```
Background: #FFFFFF
Border Radius: 12px
Padding: 16px
Shadow: 0 1px 3px rgba(0,0,0,0.1)
Margin Bottom: 12px
```

#### **Variantes**

```
Elevated
├─ Shadow: 0 4px 6px rgba(0,0,0,0.1)
└─ Elevação visual

Outlined
├─ Border: 1px #E5E7EB
└─ Sem shadow

Filled
├─ Background: #F9FAFB
└─ Sem border
```

---

### **3. Input (Campo de Texto)**

```
Height: 48px
Padding: 12px
Border Radius: 8px
Border: 1px #E5E7EB
Font Size: 16px
```

#### **Estados**

```
Normal: Border #E5E7EB
Focused: Border #2563EB, Shadow azul
Filled: Background #F9FAFB
Error: Border #EF4444
Disabled: Background #F3F4F6, Text #9CA3AF
```

---

### **4. Badge (Distintivo)**

```
Padding: 4px 8px
Border Radius: 12px
Font Size: 12px
Font Weight: 500
```

#### **Variantes**

```
Primary: Background #DBEAFE, Text #1E40AF
Success: Background #D1FAE5, Text #059669
Error: Background #FEE2E2, Text #DC2626
Warning: Background #FEF3C7, Text #D97706
```

---

### **5. Avatar (Imagem de Perfil)**

```
Tamanhos:
├─ Extra Small: 24px
├─ Small: 32px
├─ Medium: 48px
├─ Large: 64px
└─ Extra Large: 96px

Border Radius: 50% (circular)
Border: 2px (opcional)
Fallback: Iniciais ou ícone
```

---

### **6. List (Lista)**

```
Item Height: 56px (com ícone), 48px (sem ícone)
Padding: 12px 16px
Border Bottom: 1px #E5E7EB
```

#### **Estrutura**

```
┌─────────────────────────────────┐
│ [Avatar] Título        [Ícone]  │
│          Subtítulo              │
└─────────────────────────────────┘
```

---

### **7. Modal (Diálogo)**

```
Width: 90% da tela (máx 400px)
Border Radius: 12px
Padding: 24px
Backdrop: rgba(0,0,0,0.5)
Animation: Fade in + Scale
```

#### **Estrutura**

```
┌─────────────────────────────┐
│ Título              [X]     │
├─────────────────────────────┤
│ Conteúdo                    │
│                             │
├─────────────────────────────┤
│ [Cancelar]  [Confirmar]     │
└─────────────────────────────┘
```

---

### **8. BottomSheet (Menu Deslizável)**

```
Height: 40-80% da tela
Border Radius: 12px (topo)
Padding: 16px
Backdrop: rgba(0,0,0,0.3)
Animation: Slide up
```

---

### **9. Tab (Abas)**

```
Height: 48px
Padding: 12px 16px
Border Bottom: 2px (ativa) ou 0px (inativa)
Font Size: 14px
Font Weight: 500
```

#### **Estados**

```
Ativa: Text #2563EB, Border #2563EB
Inativa: Text #6B7280, Border transparent
```

---

### **10. Chip (Etiqueta)**

```
Height: 32px
Padding: 4px 12px
Border Radius: 16px
Font Size: 14px
Background: #E5E7EB
```

#### **Variantes**

```
Filled: Background colorido
Outlined: Border colorido, fundo transparente
Actionable: Com ícone de fechar
Selectable: Com checkbox
```

---

## 📐 Layout Padrão

### **Estrutura de Tela**

```
┌─────────────────────────────┐
│ [<] Título          [⋯]     │  Header (56px)
├─────────────────────────────┤
│                             │
│  Conteúdo Principal         │
│  (Scrollável)               │
│                             │
│                             │
├─────────────────────────────┤
│ [🏠] [👥] [📊] [💬] [⚙️]    │  Bottom Tab (56px)
└─────────────────────────────┘
```

### **Safe Area**

```
iOS: Respeita notch e home indicator
Android: Respeita status bar
Padding: 16px lateral, 12px vertical
```

---

## 🎬 Animações

### **Transições**

```
Duração Padrão: 300ms
Easing: ease-out (cubic-bezier(0.4, 0, 0.2, 1))

Tipos:
├─ Fade: Opacidade 0 → 1
├─ Slide: Posição -100% → 0%
├─ Scale: Escala 0.8 → 1
└─ Rotate: Rotação 0° → 360°
```

### **Feedback Háptico**

```
Light: Toque leve (confirmação)
Medium: Toque médio (ação importante)
Heavy: Toque forte (alerta/erro)
```

---

## ♿ Acessibilidade

### **Requisitos WCAG 2.1 AA**

1. **Contraste** - Mínimo 4.5:1 para texto
2. **Tamanho de Toque** - Mínimo 44x44px
3. **Leitura de Tela** - Labels e hints claros
4. **Navegação por Teclado** - Todos os elementos acessíveis
5. **Cores** - Não usar cor como único indicador
6. **Movimento** - Respeitar preferência de movimento reduzido

### **Implementação**

```typescript
// Exemplo de acessibilidade
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Enviar mensagem"
  accessibilityHint="Toque duplo para enviar"
  accessibilityRole="button"
  onPress={handleSend}
>
  <Text>Enviar</Text>
</TouchableOpacity>
```

---

## 🌙 Modo Escuro

### **Cores para Modo Escuro**

```
Fundo: #0F172A
Superfície: #1E293B
Borda: #334155
Texto Primário: #F1F5F9
Texto Secundário: #CBD5E1
```

### **Implementação**

```typescript
const colors = useColorScheme() === 'dark' 
  ? darkColors 
  : lightColors;
```

---

## 📱 Responsividade

### **Breakpoints**

```
Mobile: 0-480px (padrão)
Tablet: 480-768px
Large: 768px+
```

### **Ajustes por Tamanho**

```
Mobile:
├─ Font Size: 16px base
├─ Padding: 16px
└─ Button Height: 48px

Tablet:
├─ Font Size: 18px base
├─ Padding: 24px
└─ Button Height: 56px
```

---

## 🎯 Componentes Específicos do KanFlow

### **ContactCard**

```
┌─────────────────────────────┐
│ [Avatar] João Silva         │
│          Vendedor           │
│ 📞 (11) 99999-9999          │
│ 💬 3 mensagens              │
│ 📅 Último contato: 2h atrás │
└─────────────────────────────┘
```

### **ChatBubble**

```
Mensagem Recebida:
┌──────────────────┐
│ Olá, como vai?   │
└──────────────────┘
12:30

Mensagem Enviada:
                 ┌──────────────────┐
                 │ Tudo bem, e você?│
                 └──────────────────┘
                 12:31 ✓✓
```

### **PipelineStage**

```
┌─────────────────────────────┐
│ 🔴 Qualificação             │
├─────────────────────────────┤
│ [Contact 1]                 │
│ [Contact 2]                 │
│ [Contact 3]                 │
│ +5 mais                     │
└─────────────────────────────┘
```

### **MetricCard**

```
┌─────────────────────────────┐
│ Conversas Hoje              │
│ 24                          │
│ ↑ 8% vs ontem               │
└─────────────────────────────┘
```

---

## 📊 Guia de Implementação

### **Passo 1: Setup**

```bash
npm install react-native-paper
npm install @react-navigation/native
npm install react-native-screens
```

### **Passo 2: Criar Theme**

```typescript
// theme.ts
import { MD3LightTheme } from 'react-native-paper';

export const theme = {
  ...MD3LightTheme,
  colors: {
    primary: '#2563EB',
    secondary: '#10B981',
    error: '#EF4444',
    // ... mais cores
  },
};
```

### **Passo 3: Usar Componentes**

```typescript
import { Button, Card, Text } from 'react-native-paper';

export function MyComponent() {
  return (
    <Card>
      <Card.Content>
        <Text variant="headlineSmall">Título</Text>
      </Card.Content>
      <Card.Actions>
        <Button>Ação</Button>
      </Card.Actions>
    </Card>
  );
}
```

---

## ✅ Checklist de Implementação

- [ ] Paleta de cores definida
- [ ] Tipografia configurada
- [ ] Componentes base criados
- [ ] Tema React Native Paper customizado
- [ ] Acessibilidade implementada
- [ ] Modo escuro funcional
- [ ] Responsividade testada
- [ ] Animações suaves
- [ ] Feedback háptico configurado
- [ ] Documentação completa

---

**Versão:** 1.0.0
**Data:** 2025-01-04
**Status:** ✅ Design System Definido
**Assinado:** Manus AI

