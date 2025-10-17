import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { Plus, MoreVertical } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function Pipeline() {
  const utils = trpc.useUtils();
  const { data: stages, isLoading: stagesLoading } = trpc.pipeline.list.useQuery();
  const { data: contacts, isLoading: contactsLoading } = trpc.contacts.list.useQuery();
  
  const createStageMutation = trpc.pipeline.create.useMutation({
    onSuccess: () => {
      utils.pipeline.list.invalidate();
      toast.success("Etapa criada com sucesso!");
      setNewStageDialog(false);
      setNewStageName("");
    },
  });

  const updateContactMutation = trpc.contacts.update.useMutation({
    onSuccess: () => {
      utils.contacts.list.invalidate();
      toast.success("Contato movido!");
    },
  });

  const [newStageDialog, setNewStageDialog] = useState(false);
  const [newStageName, setNewStageName] = useState("");
  const [draggedContact, setDraggedContact] = useState<string | null>(null);

  // Initialize default stages if none exist
  useEffect(() => {
    if (!stagesLoading && (!stages || stages.length === 0)) {
      const defaultStages = [
        { name: "Novo Lead", order: 0, color: "#3b82f6" },
        { name: "Contato Inicial", order: 1, color: "#8b5cf6" },
        { name: "Negociação", order: 2, color: "#f59e0b" },
        { name: "Fechado", order: 3, color: "#10b981" },
      ];
      
      defaultStages.forEach((stage) => {
        createStageMutation.mutate(stage);
      });
    }
  }, [stages, stagesLoading]);

  const handleCreateStage = () => {
    if (!newStageName.trim()) {
      toast.error("Digite um nome para a etapa");
      return;
    }

    createStageMutation.mutate({
      name: newStageName,
      order: (stages?.length || 0),
      color: "#3b82f6",
    });
  };

  const handleDragStart = (contactId: string) => {
    setDraggedContact(contactId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (stageId: string) => {
    if (draggedContact) {
      updateContactMutation.mutate({
        id: draggedContact,
        stageId: stageId,
      });
      setDraggedContact(null);
    }
  };

  const getContactsByStage = (stageId: string) => {
    return contacts?.filter((c) => c.stageId === stageId) || [];
  };

  if (stagesLoading || contactsLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Pipeline de Vendas</h1>
            <p className="text-muted-foreground">
              Gerencie seus contatos através do funil de vendas
            </p>
          </div>
          <Dialog open={newStageDialog} onOpenChange={setNewStageDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Etapa
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Etapa</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="stage-name">Nome da Etapa</Label>
                  <Input
                    id="stage-name"
                    placeholder="Ex: Qualificação"
                    value={newStageName}
                    onChange={(e) => setNewStageName(e.target.value)}
                  />
                </div>
                <Button onClick={handleCreateStage} className="w-full">
                  Criar Etapa
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Kanban Board */}
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages?.map((stage) => (
            <div
              key={stage.id}
              className="flex-shrink-0 w-80"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(stage.id)}
            >
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: stage.color || "#3b82f6" }}
                    />
                    <h3 className="font-semibold">{stage.name}</h3>
                    <span className="text-sm text-muted-foreground">
                      ({getContactsByStage(stage.id).length})
                    </span>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2 min-h-[200px]">
                  {getContactsByStage(stage.id).map((contact) => (
                    <Card
                      key={contact.id}
                      className="p-3 cursor-move hover:shadow-md transition-shadow"
                      draggable
                      onDragStart={() => handleDragStart(contact.id)}
                    >
                      <div className="font-medium">{contact.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {contact.phoneNumber}
                      </div>
                      {contact.tags && (
                        <div className="flex gap-1 mt-2">
                          {contact.tags.split(",").map((tag, i) => (
                            <span
                              key={i}
                              className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

