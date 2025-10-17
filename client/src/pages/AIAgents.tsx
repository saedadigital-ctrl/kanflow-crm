import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Plus, Bot, Power } from "lucide-react";

export default function AIAgents() {
  const { data: agents, isLoading } = trpc.aiAgents.list.useQuery();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Agentes de IA</h1>
            <p className="text-muted-foreground">
              Configure assistentes inteligentes para atendimento
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Agente
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid gap-4">
            {agents?.map((agent) => (
              <Card key={agent.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Bot className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{agent.name}</h3>
                      <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                        {agent.systemPrompt}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Badge variant="outline">
                          Temperatura: {agent.temperature}%
                        </Badge>
                        {agent.autoReply && (
                          <Badge variant="default">Resposta Automática</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={agent.isActive ? "default" : "secondary"}>
                      {agent.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Power className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && agents?.length === 0 && (
          <div className="text-center py-12">
            <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Nenhum agente de IA configurado ainda
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
