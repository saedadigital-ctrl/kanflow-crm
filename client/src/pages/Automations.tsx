import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Plus, Edit2, Trash2, Eye, ToggleRight } from "lucide-react";

interface Automation {
  id: string;
  name: string;
  trigger: string;
  action: string;
  status: "active" | "inactive";
  executions: number;
  lastRun: string;
}

const mockAutomations: Automation[] = [
  {
    id: "1",
    name: "Boas-vindas para Novos Contatos",
    trigger: "Novo contato adicionado",
    action: "Enviar mensagem de boas-vindas",
    status: "active",
    executions: 245,
    lastRun: "2024-01-20 14:30",
  },
  {
    id: "2",
    name: "Lembrete de Acompanhamento",
    trigger: "Conversa sem resposta há 24h",
    action: "Enviar lembrete automático",
    status: "active",
    executions: 89,
    lastRun: "2024-01-20 10:15",
  },
  {
    id: "3",
    name: "Classificação de Leads",
    trigger: "Mensagem recebida",
    action: "Classificar automaticamente",
    status: "active",
    executions: 512,
    lastRun: "2024-01-20 15:45",
  },
  {
    id: "4",
    name: "Feedback Automático",
    trigger: "Conversa resolvida",
    action: "Solicitar feedback",
    status: "inactive",
    executions: 0,
    lastRun: "-",
  },
];

export default function Automations() {
  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col h-full bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900">Automações</h1>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Nova Automação
            </Button>
          </div>
          <p className="text-gray-600">Crie regras para automatizar tarefas repetitivas</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Info Card */}
            <Card className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
              <h3 className="font-semibold text-gray-900 mb-2">Como funcionam as Automações?</h3>
              <p className="text-gray-700">
                Automações são regras que executam ações automaticamente quando um evento ocorre.
                Por exemplo: quando um novo contato é adicionado, envie uma mensagem de boas-vindas.
                Economize tempo e melhore a eficiência do seu time.
              </p>
            </Card>

            {/* Automations List */}
            <div className="space-y-4">
              {mockAutomations.map((automation) => (
                <Card key={automation.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{automation.name}</h3>
                        <Badge variant={automation.status === "active" ? "default" : "secondary"}>
                          {automation.status === "active" ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-600 w-20">Gatilho:</span>
                          <span className="text-sm text-gray-900">{automation.trigger}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-600 w-20">Ação:</span>
                          <span className="text-sm text-gray-900">{automation.action}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Execuções:</span> {automation.executions}
                        </div>
                        <div>
                          <span className="font-medium">Última execução:</span> {automation.lastRun}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <ToggleRight className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Templates */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Modelos Prontos</h3>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-900 mb-2">Boas-vindas Automáticas</h4>
                  <p className="text-sm text-gray-600">Envie uma mensagem quando novo contato se junta</p>
                </Card>
                <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-900 mb-2">Lembretes de Acompanhamento</h4>
                  <p className="text-sm text-gray-600">Notifique quando conversa ficar sem resposta</p>
                </Card>
                <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-900 mb-2">Qualificação de Leads</h4>
                  <p className="text-sm text-gray-600">Classifique automaticamente novos leads</p>
                </Card>
                <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-900 mb-2">Pesquisa de Satisfação</h4>
                  <p className="text-sm text-gray-600">Solicite feedback após resolução</p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

