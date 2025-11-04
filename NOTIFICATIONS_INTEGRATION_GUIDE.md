# Guia de Integração de Notificações - KanFlow CRM

## Resumo Executivo

O sistema de notificações personalizadas foi implementado com sucesso no KanFlow CRM. Este guia fornece instruções para integrar notificações em diferentes partes da aplicação.

## O Que Foi Implementado

### 1. Documentação Completa
- **NOTIFICATIONS_SYSTEM.md** - Documentação técnica completa com 5 tipos de notificações, 10 exemplos de código, boas práticas e troubleshooting

### 2. Componentes Reutilizáveis
- **NotificationExamples.tsx** - 10 componentes de exemplo prontos para usar, incluindo:
  - Notificações de sucesso, erro, aviso e informação
  - Notificações com ícones customizados
  - Notificações com ações (CTA)
  - Notificações de carregamento
  - Notificações com desfazer
  - Hook customizado `useNotifications()`

### 3. Integração em Páginas
- **Home.tsx** - Integrada com notificações de login e boas-vindas

## Como Usar

### Importar o Sonner

```typescript
import { toast } from "sonner";
```

### Tipos de Notificações

#### Sucesso
```typescript
toast.success("Título", {
  description: "Descrição opcional",
  duration: 4000,
});
```

#### Erro
```typescript
toast.error("Título", {
  description: "Descrição opcional",
  duration: 5000,
});
```

#### Aviso
```typescript
toast.warning("Título", {
  description: "Descrição opcional",
  duration: 5000,
});
```

#### Informação
```typescript
toast.info("Título", {
  description: "Descrição opcional",
  duration: 4000,
});
```

#### Carregamento
```typescript
const toastId = toast.loading("Processando...");
// Depois atualizar:
toast.success("Concluído!", { id: toastId });
```

## Integração em Diferentes Cenários

### 1. Formulários

```typescript
const handleSubmit = async (data) => {
  try {
    await api.createContact(data);
    toast.success("Contato criado com sucesso!");
  } catch (error) {
    toast.error("Erro ao criar contato", {
      description: error.message,
    });
  }
};
```

### 2. Mutações tRPC

```typescript
const createMutation = trpc.contacts.create.useMutation({
  onSuccess: () => {
    toast.success("Contato criado!");
    trpc.useUtils().contacts.list.invalidate();
  },
  onError: (error) => {
    toast.error("Erro ao criar contato", {
      description: error.message,
    });
  },
});
```

### 3. Operações Assíncronas

```typescript
const handleSync = async () => {
  const toastId = toast.loading("Sincronizando...");
  try {
    await api.sync();
    toast.success("Sincronização concluída!", { id: toastId });
  } catch (error) {
    toast.error("Erro na sincronização", { id: toastId });
  }
};
```

### 4. Ações Destrutivas

```typescript
const handleDelete = async () => {
  await api.delete(id);
  toast.success("Deletado", {
    action: {
      label: "Desfazer",
      onClick: () => {
        api.restore(id);
        toast.success("Restaurado");
      },
    },
  });
};
```

## Usar o Hook Customizado

### Importar

```typescript
import { useNotifications } from "@/components/NotificationExamples";
```

### Usar

```typescript
const notify = useNotifications();

// Sucesso
notify.success("Título", "Descrição");

// Erro
notify.error("Título", "Descrição");

// Aviso
notify.warning("Título", "Descrição");

// Informação
notify.info("Título", "Descrição");

// Carregamento
const id = notify.loading("Processando...");
notify.update(id, { message: "Concluído!" });
```

## Boas Práticas

### 1. Mensagens Claras
✅ Bom: "Contato criado"
❌ Ruim: "O novo contato foi criado com sucesso no sistema"

### 2. Duração Apropriada
✅ Sucesso: 2-3 segundos
✅ Erro: 4-5 segundos
✅ Aviso: 5 segundos

### 3. Contexto Suficiente
✅ Bom: "Contato criado" + "João Silva foi adicionado"
❌ Ruim: "✓"

### 4. Evitar Spam
✅ Bom: Usar ID para atualizar o mesmo toast
❌ Ruim: Mostrar 100 toasts iguais

### 5. Acessibilidade
✅ Bom: Descrição clara para leitores de tela
❌ Ruim: Apenas ícones ou emojis

## Próximos Passos

### Integrar em Mais Páginas

1. **Dashboard** - Notificações ao carregar dados, sincronizar, etc.
2. **Contatos** - Notificações ao criar, editar, deletar contatos
3. **Mensagens** - Notificações ao enviar, receber mensagens
4. **Configurações** - Notificações ao salvar configurações
5. **Admin** - Notificações de operações administrativas

### Exemplos de Integração

#### Dashboard
```typescript
useEffect(() => {
  const loadData = async () => {
    const toastId = toast.loading("Carregando dashboard...");
    try {
      const data = await api.getDashboard();
      toast.success("Dashboard carregado!", { id: toastId });
      setData(data);
    } catch (error) {
      toast.error("Erro ao carregar dashboard", { id: toastId });
    }
  };
  loadData();
}, []);
```

#### Contatos
```typescript
const handleCreateContact = async (data) => {
  const toastId = toast.loading("Criando contato...");
  try {
    const contact = await api.createContact(data);
    toast.success("Contato criado!", {
      id: toastId,
      description: `${contact.name} foi adicionado`,
    });
  } catch (error) {
    toast.error("Erro ao criar contato", { id: toastId });
  }
};
```

#### Mensagens
```typescript
const handleSendMessage = async (message) => {
  const toastId = toast.loading("Enviando mensagem...");
  try {
    await api.sendMessage(message);
    toast.success("Mensagem enviada!", { id: toastId });
  } catch (error) {
    toast.error("Erro ao enviar mensagem", { id: toastId });
  }
};
```

## Customização de Estilo

### Cores Personalizadas

Edite `client/src/index.css`:

```css
[data-sonner-toast][data-type="success"] {
  --background: oklch(0.9 0.1 142);
  --foreground: oklch(0.3 0.1 142);
}

[data-sonner-toast][data-type="error"] {
  --background: oklch(0.9 0.1 25);
  --foreground: oklch(0.3 0.1 25);
}
```

### Posição Padrão

Customize em `App.tsx`:

```typescript
<Toaster position="bottom-right" />
```

## Troubleshooting

### Notificações não aparecem
- Verifique se `<Toaster />` está em `App.tsx`
- Verifique console para erros

### Estilo incorreto
- Verifique se Tailwind CSS está configurado
- Limpe cache do navegador

### Múltiplas notificações iguais
- Use ID para atualizar o mesmo toast
- Implemente debouncing se necessário

## Recursos

- **Documentação Sonner:** https://sonner.emilkowal.ski/
- **Exemplos Completos:** `NotificationExamples.tsx`
- **Documentação Técnica:** `NOTIFICATIONS_SYSTEM.md`

## Conclusão

O sistema de notificações está pronto para uso em toda a aplicação. Siga os exemplos fornecidos e as boas práticas para criar uma experiência de usuário superior.

Para dúvidas ou sugestões, consulte a documentação técnica ou os exemplos de código.

