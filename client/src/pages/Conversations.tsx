import { useState } from "react";
import { MessageSquare, Search, Archive, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";

interface ConversationsProps {
  organizationId: string;
}

export default function Conversations({ organizationId }: ConversationsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  // Fetch conversations
  const { data: conversationsData, isLoading } = trpc.whatsapp.conversations.list.useQuery({
    organizationId,
  });

  const conversations = conversationsData?.data || [];

  // Get selected conversation
  const selectedConversation = selectedConversationId
    ? conversations.find((c: any) => c.id === selectedConversationId)
    : null;

  // Mark as read mutation
  const markAsReadMutation = trpc.whatsapp.conversations.markAsRead.useMutation({
    onSuccess: () => {
      // Refetch conversations
    },
  });

  // Update status mutation
  const updateStatusMutation = trpc.whatsapp.conversations.updateStatus.useMutation({
    onSuccess: () => {
      // Refetch conversations
    },
  });

  const handleMarkAsRead = (conversationId: string) => {
    markAsReadMutation.mutate({
      id: conversationId,
      organizationId,
    });
  };

  const handleUpdateStatus = (conversationId: string, status: string) => {
    updateStatusMutation.mutate({
      id: conversationId,
      organizationId,
      status: status as any,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800";
      case "waiting":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredConversations = conversations.filter((conv: any) =>
    conv.lastSnippet?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-screen">
      {/* Conversations List */}
      <div className="md:col-span-1 border-r">
        <div className="p-4 space-y-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MessageSquare className="h-6 w-6" />
              Conversas
            </h1>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar conversas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          {/* Conversations List */}
          <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]">
            {isLoading ? (
              <div className="text-center text-muted-foreground py-8">
                Carregando conversas...
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                Nenhuma conversa encontrada
              </div>
            ) : (
              filteredConversations.map((conv: any) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversationId(conv.id)}
                  className={`p-3 rounded-lg cursor-pointer transition ${
                    selectedConversationId === conv.id
                      ? "bg-blue-100 border-l-4 border-blue-600"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {conv.lastSnippet || "Sem mensagens"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(conv.lastMessageAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <Badge className="ml-2 bg-red-600">
                        {conv.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Conversation Detail */}
      <div className="md:col-span-2 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="border-b p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    {selectedConversation.lastSnippet || "Conversa"}
                  </h2>
                  <div className="flex gap-2 mt-2">
                    <Badge className={getStatusColor(selectedConversation.status || "active")}>
                      {selectedConversation.status || "active"}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (selectedConversation.id) {
                        handleMarkAsRead(selectedConversation.id);
                      }
                    }}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Marcar como Lida
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                    if (selectedConversation.id) {
                      handleUpdateStatus(
                        selectedConversation.id,
                        selectedConversation.status === "archived"
                          ? "active"
                          : "archived"
                      );
                    }
                  }
                    }
                  >
                    <Archive className="h-4 w-4 mr-2" />
                    {selectedConversation.status === "archived"
                      ? "Restaurar"
                      : "Arquivar"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="text-xs text-muted-foreground bg-white px-3 py-1 rounded-full">
                    <Clock className="h-3 w-3 inline mr-1" />
                    Início da conversa
                  </div>
                </div>
                <p className="text-center text-muted-foreground">
                  Mensagens serão exibidas aqui
                </p>
              </div>
            </div>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input placeholder="Digite uma mensagem..." />
                <Button>Enviar</Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Selecione uma conversa para começar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

