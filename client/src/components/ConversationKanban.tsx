import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ConversationCard } from "./ConversationCard";
import { Card } from "@/components/ui/card";
import { ArrowRight, Check } from "lucide-react";

export interface Conversation {
  id: string;
  name: string;
  phoneNumber: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  status: "new" | "in_progress" | "waiting" | "resolved";
  type: "individual" | "group";
  avatar?: string;
}

interface ConversationKanbanProps {
  conversations: Conversation[];
  onStatusChange: (conversationId: string, newStatus: Conversation["status"]) => void;
}

const columns = [
  {
    id: "new" as const,
    title: "Novas Conversas",
    color: "bg-blue-600",
    icon: ArrowRight,
  },
  {
    id: "in_progress" as const,
    title: "Em Andamento",
    color: "bg-yellow-500",
    icon: ArrowRight,
  },
  {
    id: "waiting" as const,
    title: "Aguardando Resposta",
    color: "bg-orange-500",
    icon: ArrowRight,
  },
  {
    id: "resolved" as const,
    title: "Resolvidas",
    color: "bg-green-600",
    icon: Check,
  },
];

export function ConversationKanban({ conversations, onStatusChange }: ConversationKanbanProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeConversation = conversations.find((c) => c.id === active.id);
      const overColumn = columns.find((col) => col.id === over.id);

      if (activeConversation && overColumn) {
        onStatusChange(activeConversation.id, overColumn.id);
      }
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const activeConversation = conversations.find((c) => c.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((column) => {
          const columnConversations = conversations.filter((c) => c.status === column.id);
          const Icon = column.icon;

          return (
            <div key={column.id} className="flex flex-col gap-3">
              {/* Column Header */}
              <div className={`${column.color} text-white rounded-lg p-4 flex items-center justify-between`}>
                <h3 className="font-semibold text-lg">{column.title}</h3>
                <Icon className="h-5 w-5" />
              </div>

              {/* Droppable Area */}
              <SortableContext
                id={column.id}
                items={columnConversations.map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-3 min-h-[500px] p-2 rounded-lg bg-gray-50">
                  {columnConversations.map((conversation) => (
                    <ConversationCard
                      key={conversation.id}
                      conversation={conversation}
                      columnId={column.id}
                    />
                  ))}
                  
                  {columnConversations.length === 0 && (
                    <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                      Nenhuma conversa
                    </div>
                  )}
                </div>
              </SortableContext>
            </div>
          );
        })}
      </div>

      <DragOverlay>
        {activeConversation ? (
          <div className="opacity-80">
            <ConversationCard conversation={activeConversation} columnId={activeConversation.status} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

