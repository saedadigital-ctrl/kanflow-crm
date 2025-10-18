import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, ArrowRight } from "lucide-react";
import type { Conversation } from "./ConversationKanban";

interface ConversationCardProps {
  conversation: Conversation;
  columnId: string;
}

export function ConversationCard({ conversation, columnId }: ConversationCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: conversation.id,
    data: {
      type: "conversation",
      conversation,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Gerar iniciais do nome
  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Formatar timestamp relativo
  const formatTimestamp = (timestamp: string) => {
    // Aqui você pode implementar lógica mais sofisticada
    return timestamp;
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow bg-white">
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Header com Avatar e Nome */}
            <div className="flex items-start gap-3">
              <Avatar className="h-12 w-12 shrink-0">
                {conversation.avatar ? (
                  <AvatarImage src={conversation.avatar} alt={conversation.name} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                    {conversation.type === "group" ? (
                      <Users className="h-5 w-5" />
                    ) : (
                      getInitials(conversation.name)
                    )}
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-sm truncate">{conversation.name}</h4>
                  {conversation.unreadCount > 0 && (
                    <Badge className="bg-blue-600 text-white h-5 min-w-[20px] flex items-center justify-center px-1.5 shrink-0">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-600 font-mono mt-0.5">
                  {conversation.phoneNumber}
                </p>
              </div>
            </div>

            {/* Última Mensagem */}
            <p className="text-sm text-gray-700 line-clamp-2 min-h-[40px]">
              {conversation.lastMessage}
            </p>

            {/* Footer com Timestamp */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-500">
                {formatTimestamp(conversation.timestamp)}
              </span>
              
              {columnId !== "resolved" && (
                <ArrowRight className="h-4 w-4 text-gray-400" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

