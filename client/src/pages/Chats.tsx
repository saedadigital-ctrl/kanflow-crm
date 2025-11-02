import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Plus, Search, Settings, Sparkles } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar: string;
  channel?: string;
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    name: "João Silva",
    lastMessage: "Olá, tudo bem?",
    timestamp: "10:30",
    unread: 2,
    avatar: "JS",
    channel: "whatsapp",
  },
  {
    id: "2",
    name: "Maria Santos",
    lastMessage: "Obrigado pela atenção",
    timestamp: "09:15",
    unread: 0,
    avatar: "MS",
    channel: "email",
  },
];

export default function Chats() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [showAISuggestion, setShowAISuggestion] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  const suggestResponseMutation = trpc.ai.suggestResponse.useMutation({
    onSuccess: (data) => {
      setAiSuggestion(data.suggestedResponse);
      setShowAISuggestion(true);
    },
  });

  const filteredConversations = mockConversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedConversation = mockConversations.find(c => c.id === selectedChat);

  const handleAISuggest = () => {
    if (selectedConversation) {
      suggestResponseMutation.mutate({
        messageContent: "Nova mensagem recebida",
        contactName: selectedConversation.name,
      });
    }
  };

  const handleUseAISuggestion = () => {
    if (aiSuggestion) {
      setMessageInput(aiSuggestion);
      setShowAISuggestion(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="h-full flex gap-0">
        {/* Sidebar - Conversations List */}
        <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">INBOX</h2>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Settings className="h-4 w-4" />
              </Button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {/* Conversations Abertas */}
            <div>
              <div className="px-4 py-3 bg-green-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">Conversas abertas</h3>
                  <span className="text-xs text-gray-600">Total: {filteredConversations.length}</span>
                </div>
              </div>

              <div className="space-y-1 p-2">
                {filteredConversations.length > 0 ? (
                  filteredConversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedChat(conv.id)}
                      className={`w-full p-3 rounded-lg text-left transition-colors ${
                        selectedChat === conv.id
                          ? "bg-blue-50 border border-blue-200"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold text-blue-600">{conv.avatar}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-gray-900 truncate">{conv.name}</p>
                          <p className="text-xs text-gray-600 truncate">{conv.lastMessage}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <span className="text-xs text-gray-500">{conv.timestamp}</span>
                          {conv.unread > 0 && (
                            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-semibold">
                              {conv.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    <p className="text-sm">Nenhuma conversa encontrada</p>
                  </div>
                )}
              </div>
            </div>

            {/* Add Channels */}
            <div className="p-4 border-t border-gray-200">
              <Button variant="outline" className="w-full gap-2 text-sm h-10">
                <Plus className="h-4 w-4" />
                Adicionar canais
              </Button>
              <p className="text-xs text-gray-600 mt-2 text-center">
                Capture leads do WhatsApp & mais!
              </p>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 bg-gray-50 flex flex-col items-center justify-center">
          {selectedChat ? (
            <div className="w-full h-full flex flex-col">
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {selectedConversation?.name}
                  </h2>
                  <p className="text-xs text-gray-600">Online</p>
                </div>
                <Button variant="ghost" size="sm">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-lg max-w-xs">
                    <p className="text-sm text-gray-900">Olá! Como posso ajudar?</p>
                    <p className="text-xs text-gray-500 mt-1">10:30</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white p-3 rounded-lg max-w-xs">
                    <p className="text-sm">Ótimo! Gostaria de mais informações</p>
                    <p className="text-xs text-blue-100 mt-1">10:32</p>
                  </div>
                </div>
              </div>

              {/* AI Suggestion */}
              {showAISuggestion && aiSuggestion && (
                <div className="bg-blue-50 border-t border-blue-200 p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold text-blue-900 flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        Sugestão de Resposta (IA)
                      </p>
                      <p className="text-sm text-blue-800 mt-1">{aiSuggestion}</p>
                    </div>
                    <button
                      onClick={() => setShowAISuggestion(false)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={handleUseAISuggestion}
                    >
                      Usar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowAISuggestion(false)}
                    >
                      Descartar
                    </Button>
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Digite sua mensagem..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAISuggest}
                    disabled={suggestResponseMutation.isPending}
                    className="gap-1"
                  >
                    <Sparkles className="h-4 w-4" />
                    IA
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Enviar
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto">
                <MessageCircle className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <p className="text-gray-900 font-semibold">Nenhuma conversa selecionada</p>
                <p className="text-gray-600 text-sm">Selecione uma conversa para começar</p>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Conectar mais canais
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

