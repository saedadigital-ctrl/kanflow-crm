/**
 * Componentes de Exemplo para Notificações Personalizadas
 * 
 * Este arquivo demonstra como usar o sistema de notificações
 * em diferentes cenários do KanFlow CRM.
 */

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

/**
 * Exemplo 1: Notificação de Sucesso Simples
 */
export function SuccessNotificationExample() {
  const handleClick = () => {
    toast.success("Contato criado com sucesso!", {
      description: "João Silva foi adicionado ao seu funil de vendas",
      duration: 4000,
    });
  };

  return (
    <Button onClick={handleClick} variant="default">
      Mostrar Sucesso
    </Button>
  );
}

/**
 * Exemplo 2: Notificação de Erro com Descrição
 */
export function ErrorNotificationExample() {
  const handleClick = () => {
    toast.error("Erro ao enviar mensagem", {
      description: "Verifique sua conexão com a internet e tente novamente",
      duration: 5000,
    });
  };

  return (
    <Button onClick={handleClick} variant="destructive">
      Mostrar Erro
    </Button>
  );
}

/**
 * Exemplo 3: Notificação de Aviso
 */
export function WarningNotificationExample() {
  const handleClick = () => {
    toast.warning("Limite de contatos próximo", {
      description: "Você tem 95 de 100 contatos. Atualize seu plano para adicionar mais.",
      duration: 5000,
    });
  };

  return (
    <Button onClick={handleClick} variant="outline">
      Mostrar Aviso
    </Button>
  );
}

/**
 * Exemplo 4: Notificação Informativa
 */
export function InfoNotificationExample() {
  const handleClick = () => {
    toast.info("Novo recurso disponível", {
      description: "Você agora pode agendar mensagens automáticas para seus contatos",
      duration: 4000,
    });
  };

  return (
    <Button onClick={handleClick} variant="outline">
      Mostrar Info
    </Button>
  );
}

/**
 * Exemplo 5: Notificação com Ícone Customizado
 */
export function CustomIconNotificationExample() {
  const handleClick = () => {
    toast("Atenção necessária", {
      description: "Sua conta requer verificação de email",
      icon: <AlertCircle className="h-5 w-5 text-orange-500" />,
      duration: 5000,
    });
  };

  return (
    <Button onClick={handleClick} variant="outline">
      Mostrar com Ícone
    </Button>
  );
}

/**
 * Exemplo 6: Notificação com Ação (CTA)
 */
export function ActionNotificationExample() {
  const handleClick = () => {
    toast.info("Você tem uma nova mensagem", {
      description: "João Silva enviou uma mensagem para você",
      action: {
        label: "Responder",
        onClick: () => {
          toast.success("Abrindo conversa...");
          // Redirecionar para conversa
        },
      },
      duration: 6000,
    });
  };

  return (
    <Button onClick={handleClick} variant="outline">
      Mostrar com Ação
    </Button>
  );
}

/**
 * Exemplo 7: Notificação de Carregamento
 */
export function LoadingNotificationExample() {
  const handleClick = () => {
    const toastId = toast.loading("Sincronizando dados...", {
      description: "Aguarde enquanto sincronizamos seus contatos",
    });

    // Simular operação assíncrona
    setTimeout(() => {
      toast.success("Sincronização concluída!", {
        id: toastId,
        description: "150 contatos foram sincronizados",
        duration: 4000,
      });
    }, 3000);
  };

  return (
    <Button onClick={handleClick} variant="outline">
      Mostrar Carregamento
    </Button>
  );
}

/**
 * Exemplo 8: Notificação de Confirmação com Desfazer
 */
export function UndoNotificationExample() {
  const handleClick = () => {
    toast.success("Contato deletado", {
      description: "O contato foi removido do seu funil",
      action: {
        label: "Desfazer",
        onClick: () => {
          toast.success("Contato restaurado", {
            description: "O contato foi adicionado novamente",
            duration: 3000,
          });
        },
      },
      duration: 5000,
    });
  };

  return (
    <Button onClick={handleClick} variant="outline">
      Mostrar com Desfazer
    </Button>
  );
}

/**
 * Exemplo 9: Múltiplas Notificações em Sequência
 */
export function SequenceNotificationExample() {
  const handleClick = async () => {
    // Primeira notificação
    toast.loading("Iniciando importação...");

    // Simular progresso
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.info("Processando arquivo...", {
      description: "50% concluído",
    });

    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success("Importação concluída!", {
      description: "250 contatos foram importados com sucesso",
      duration: 4000,
    });
  };

  return (
    <Button onClick={handleClick} variant="outline">
      Mostrar Sequência
    </Button>
  );
}

/**
 * Exemplo 10: Notificação com Posição Customizada
 */
export function PositionNotificationExample() {
  const handleClick = () => {
    toast.success("Salvo com sucesso!", {
      description: "Suas alterações foram salvas",
      position: "bottom-right",
      duration: 3000,
    });
  };

  return (
    <Button onClick={handleClick} variant="outline">
      Mostrar em Posição
    </Button>
  );
}

/**
 * Componente de Demonstração: Galeria de Notificações
 */
export function NotificationGallery() {
  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold mb-6">Galeria de Notificações</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SuccessNotificationExample />
        <ErrorNotificationExample />
        <WarningNotificationExample />
        <InfoNotificationExample />
        <CustomIconNotificationExample />
        <ActionNotificationExample />
        <LoadingNotificationExample />
        <UndoNotificationExample />
        <SequenceNotificationExample />
        <PositionNotificationExample />
      </div>
    </div>
  );
}

/**
 * Hook Customizado para Notificações Comuns
 */
export function useNotifications() {
  return {
    success: (title: string, description?: string) => {
      toast.success(title, { description, duration: 4000 });
    },
    error: (title: string, description?: string) => {
      toast.error(title, { description, duration: 5000 });
    },
    warning: (title: string, description?: string) => {
      toast.warning(title, { description, duration: 5000 });
    },
    info: (title: string, description?: string) => {
      toast.info(title, { description, duration: 4000 });
    },
    loading: (title: string, description?: string) => {
      return toast.loading(title, { description });
    },
    update: (id: string | number, options: any) => {
      toast(options.message, { id, ...options });
    },
  };
}

/**
 * Exemplo de Uso do Hook Customizado
 */
export function UseNotificationsExample() {
  const notify = useNotifications();

  const handleCreateContact = async () => {
    try {
      const loadingId = notify.loading("Criando contato...");

      // Simular chamada à API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      notify.update(loadingId, {
        message: "Contato criado com sucesso!",
      });

      notify.success("Contato criado", "João Silva foi adicionado ao funil");
    } catch (error) {
      notify.error("Erro ao criar contato", "Tente novamente");
    }
  };

  return (
    <Button onClick={handleCreateContact} variant="default">
      Criar Contato
    </Button>
  );
}

