# Sistema de Notificações Personalizadas - KanFlow CRM

## Visão Geral

O sistema de notificações do KanFlow CRM fornece feedback visual em tempo real aos usuários através de mensagens personalizadas, alertas e confirmações. O sistema é construído com **Sonner** (biblioteca de toast notifications) integrada ao React, oferecendo uma experiência moderna e não-intrusiva.

## Tipos de Notificações

### 1. Sucesso (Success)

Notificações de sucesso indicam que uma ação foi concluída com êxito. Aparecem em verde com ícone de verificação.

**Casos de Uso:**
- Usuário criou um novo contato
- Mensagem enviada com sucesso
- Configurações salvas
- Operação concluída

**Exemplo:**
```typescript
import { toast } from "sonner";

toast.success("Contato criado com sucesso!", {
  description: "O novo contato foi adicionado ao seu funil",
  duration: 4000,
});
```

### 2. Erro (Error)

Notificações de erro alertam sobre problemas que impediram a conclusão de uma ação. Aparecem em vermelho com ícone de alerta.

**Casos de Uso:**
- Falha ao enviar mensagem
- Erro de validação de formulário
- Falha na conexão com API
- Operação não autorizada

**Exemplo:**
```typescript
toast.error("Erro ao enviar mensagem", {
  description: "Verifique sua conexão e tente novamente",
  duration: 4000,
});
```

### 3. Aviso (Warning)

Notificações de aviso informam sobre situações que requerem atenção, mas não impedem a operação. Aparecem em amarelo/laranja.

**Casos de Uso:**
- Limite de contatos próximo
- Créditos baixos
- Ação que não pode ser desfeita
- Dados incompletos

**Exemplo:**
```typescript
toast.warning("Você está próximo do limite de contatos", {
  description: "Atualize seu plano para adicionar mais contatos",
  duration: 5000,
});
```

### 4. Informação (Info)

Notificações informativas fornecem contexto ou instruções adicionais. Aparecem em azul.

**Casos de Uso:**
- Dica de uso
- Informação sobre mudança de status
- Confirmação de ação pendente
- Notícia importante

**Exemplo:**
```typescript
toast.info("Novo recurso disponível", {
  description: "Você agora pode agendar mensagens automáticas",
  duration: 4000,
});
```

### 5. Carregamento (Loading)

Notificações de carregamento indicam que uma operação está em andamento. Mostram um spinner.

**Casos de Uso:**
- Sincronizando dados
- Processando arquivo
- Conectando com API externa
- Salvando alterações

**Exemplo:**
```typescript
const toastId = toast.loading("Sincronizando contatos...");

// Depois de concluir:
toast.success("Sincronização concluída!", { id: toastId });
```

## Configuração Técnica

### Instalação

O Sonner já está instalado no projeto. Verifique em `package.json`:

```json
{
  "dependencies": {
    "sonner": "^1.x.x"
  }
}
```

### Importação

```typescript
import { toast } from "sonner";
```

### Configuração Global

O Toaster está configurado em `client/src/App.tsx`:

```typescript
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
```

## Opções de Personalização

### Duração

Controla quanto tempo a notificação permanece visível (em milissegundos):

```typescript
toast.success("Salvo!", { duration: 2000 }); // 2 segundos
toast.error("Erro!", { duration: 5000 }); // 5 segundos
toast.info("Info", { duration: Infinity }); // Permanente até fechar
```

### Descrição

Adiciona um subtítulo à notificação:

```typescript
toast.success("Contato criado", {
  description: "João Silva foi adicionado ao funil de vendas",
});
```

### Ícone Customizado

Substitui o ícone padrão:

```typescript
import { AlertCircle } from "lucide-react";

toast.warning("Atenção", {
  icon: <AlertCircle className="h-5 w-5" />,
});
```

### Ação (CTA)

Adiciona um botão de ação à notificação:

```typescript
toast.info("Nova mensagem recebida", {
  description: "Clique para responder",
  action: {
    label: "Responder",
    onClick: () => {
      // Ação aqui
    },
  },
});
```

### Posição

Define onde a notificação aparece na tela:

```typescript
toast.success("Salvo!", {
  position: "top-right", // top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
});
```

## Casos de Uso Comuns

### Formulário com Validação

```typescript
const handleSubmit = async (data) => {
  try {
    const result = await api.createContact(data);
    toast.success("Contato criado com sucesso!");
    // Redirecionar ou atualizar lista
  } catch (error) {
    toast.error("Erro ao criar contato", {
      description: error.message,
    });
  }
};
```

### Operação Assíncrona

```typescript
const handleSync = async () => {
  const toastId = toast.loading("Sincronizando dados...");
  
  try {
    await api.syncData();
    toast.success("Sincronização concluída!", { id: toastId });
  } catch (error) {
    toast.error("Erro na sincronização", { id: toastId });
  }
};
```

### Confirmação de Ação Destrutiva

```typescript
const handleDelete = () => {
  toast.error("Contato deletado", {
    description: "Esta ação não pode ser desfeita",
    action: {
      label: "Desfazer",
      onClick: () => {
        // Restaurar
        toast.success("Contato restaurado");
      },
    },
  });
};
```

### Notificação com Múltiplas Linhas

```typescript
toast.info("Atualização de plano", {
  description: "Seu plano foi atualizado para Premium. Você agora tem acesso a todos os recursos.",
  duration: 6000,
});
```

## Boas Práticas

### 1. Mensagens Claras e Concisas

Mantenha as mensagens curtas e diretas. Use a descrição para contexto adicional.

**✅ Bom:**
```typescript
toast.success("Contato criado");
```

**❌ Ruim:**
```typescript
toast.success("O novo contato foi criado com sucesso no sistema");
```

### 2. Contexto Apropriado

Use o tipo correto de notificação para cada situação:

**✅ Bom:**
```typescript
if (success) toast.success("Salvo!");
if (error) toast.error("Erro ao salvar");
if (warning) toast.warning("Limite próximo");
```

**❌ Ruim:**
```typescript
toast.info("Salvo!"); // Deveria ser success
```

### 3. Duração Apropriada

Notificações importantes devem ficar visíveis por mais tempo:

**✅ Bom:**
```typescript
toast.success("Salvo!", { duration: 2000 }); // Rápido
toast.error("Erro crítico", { duration: 5000 }); // Mais tempo
```

### 4. Evite Spam

Não mostre múltiplas notificações idênticas. Agrupe ou limite:

**✅ Bom:**
```typescript
const toastId = toast.loading("Processando...");
// Depois atualizar o mesmo toast
toast.success("Concluído!", { id: toastId });
```

**❌ Ruim:**
```typescript
for (let i = 0; i < 100; i++) {
  toast.success("Item " + i); // Spam!
}
```

### 5. Acessibilidade

Sempre forneça contexto suficiente para usuários com leitores de tela:

**✅ Bom:**
```typescript
toast.success("Contato criado", {
  description: "João Silva foi adicionado",
});
```

**❌ Ruim:**
```typescript
toast.success("✓"); // Muito vago
```

## Integração com tRPC

### Sucesso em Mutações

```typescript
const createContact = trpc.contacts.create.useMutation({
  onSuccess: (data) => {
    toast.success("Contato criado!");
    // Invalidar cache
    trpc.useUtils().contacts.list.invalidate();
  },
  onError: (error) => {
    toast.error("Erro ao criar contato", {
      description: error.message,
    });
  },
});
```

### Carregamento em Queries

```typescript
const { data, isLoading, error } = trpc.contacts.list.useQuery();

if (isLoading) {
  toast.loading("Carregando contatos...");
}

if (error) {
  toast.error("Erro ao carregar contatos");
}
```

## Customização de Estilo

O Sonner usa Tailwind CSS. Customize em `client/src/index.css`:

```css
/* Customizar cores das notificações */
[data-sonner-toast] {
  --background: oklch(0.985 0 0);
  --foreground: oklch(0.145 0 0);
}

[data-sonner-toast][data-type="success"] {
  --background: oklch(0.9 0.1 142);
  --foreground: oklch(0.3 0.1 142);
}

[data-sonner-toast][data-type="error"] {
  --background: oklch(0.9 0.1 25);
  --foreground: oklch(0.3 0.1 25);
}
```

## Exemplos Completos

### Exemplo 1: Criar Contato com Notificação

```typescript
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export function CreateContactForm() {
  const createMutation = trpc.contacts.create.useMutation({
    onSuccess: () => {
      toast.success("Contato criado com sucesso!");
      // Limpar formulário
    },
    onError: (error) => {
      toast.error("Erro ao criar contato", {
        description: error.message,
      });
    },
  });

  const handleSubmit = (data) => {
    createMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Formulário */}
      <button type="submit" disabled={createMutation.isPending}>
        {createMutation.isPending ? "Criando..." : "Criar"}
      </button>
    </form>
  );
}
```

### Exemplo 2: Sincronizar Dados com Progresso

```typescript
import { toast } from "sonner";

export function SyncButton() {
  const handleSync = async () => {
    const toastId = toast.loading("Sincronizando dados...");
    
    try {
      const response = await fetch("/api/sync");
      const data = await response.json();
      
      toast.success(`${data.count} itens sincronizados!`, {
        id: toastId,
        description: `Última sincronização: ${new Date().toLocaleTimeString()}`,
      });
    } catch (error) {
      toast.error("Erro na sincronização", {
        id: toastId,
        description: error.message,
      });
    }
  };

  return <button onClick={handleSync}>Sincronizar</button>;
}
```

### Exemplo 3: Notificação com Ação

```typescript
import { toast } from "sonner";

export function DeleteContactButton({ contactId, onDelete }) {
  const handleDelete = async () => {
    try {
      await fetch(`/api/contacts/${contactId}`, { method: "DELETE" });
      
      toast.success("Contato deletado", {
        description: "Esta ação não pode ser desfeita",
        action: {
          label: "Desfazer",
          onClick: async () => {
            await fetch(`/api/contacts/${contactId}/restore`, { method: "POST" });
            toast.success("Contato restaurado");
            onDelete();
          },
        },
      });
    } catch (error) {
      toast.error("Erro ao deletar contato");
    }
  };

  return <button onClick={handleDelete}>Deletar</button>;
}
```

## Troubleshooting

### Notificações não aparecem

**Solução:** Verifique se `<Toaster />` está em `App.tsx`:

```typescript
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <>
      <Toaster />
      <Router />
    </>
  );
}
```

### Notificações com estilo incorreto

**Solução:** Verifique se Tailwind CSS está configurado em `index.css`.

### Múltiplas notificações iguais

**Solução:** Use ID para atualizar o mesmo toast:

```typescript
const id = toast.loading("Processando...");
toast.success("Concluído!", { id });
```

## Conclusão

O sistema de notificações do KanFlow CRM oferece uma forma elegante e não-intrusiva de fornecer feedback aos usuários. Seguindo as boas práticas e exemplos fornecidos, você pode criar uma experiência de usuário superior e intuitiva.

Para mais informações sobre Sonner, visite: [https://sonner.emilkowal.ski/](https://sonner.emilkowal.ski/)

