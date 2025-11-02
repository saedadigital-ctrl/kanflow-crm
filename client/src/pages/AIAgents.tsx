import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Plus, Edit2, Trash2, Eye } from "lucide-react";

interface AIAgent {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  model: string;
  responseRate: number;
  createdAt: string;
}

const mockAgents: AIAgent[] = [
  {
    id: "1",
    name: "Atendimento ao Cliente",
    description: "Responde dúvidas comuns sobre produtos e serviços",
    status: "active",
    model: "GPT-4",
    responseRate: 94,
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    name: "Qualificação de Leads",
    description: "Qualifica novos leads automaticamente",
    status: "active",
    model: "GPT-4",
    responseRate: 87,
    createdAt: "2024-01-12",
  },
  {
    id: "3",
    name: "Suporte Técnico",
    description: "Ajuda com problemas técnicos e bugs",
    status: "inactive",
    model: "GPT-3.5",
    responseRate: 0,
    createdAt: "2024-01-15",
  },
];

export default function AIAgents() {
  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col h-full bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Bot className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900">Agentes de IA</h1>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Novo Agente
            </Button>
          </div>
          <p className="text-gray-600">Crie e gerencie agentes de IA para automatizar respostas</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Info Card */}
            <Card className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
              <h3 className="font-semibold text-gray-900 mb-2">O que são Agentes de IA?</h3>
              <p className="text-gray-700">
                Agentes de IA são assistentes inteligentes que podem responder mensagens automaticamente,
                qualificar leads, e executar ações baseadas em regras que você define. Eles aprendem com
                o tempo e melhoram suas respostas.
              </p>
            </Card>

            {/* Agents List */}
            <div className="space-y-4">
              {mockAgents.map((agent) => (
                <Card key={agent.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
                        <Badge variant={agent.status === "active" ? "default" : "secondary"}>
                          {agent.status === "active" ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{agent.description}</p>
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Modelo:</span> {agent.model}
                        </div>
                        <div>
                          <span className="font-medium">Taxa de Resposta:</span> {agent.responseRate}%
                        </div>
                        <div>
                          <span className="font-medium">Criado em:</span>{" "}
                          {new Date(agent.createdAt).toLocaleDateString("pt-BR")}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
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

                  {/* Progress Bar */}
                  {agent.status === "active" && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Confiança</span>
                        <span className="text-sm text-gray-600">{agent.responseRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${agent.responseRate}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {/* Features */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recursos Disponíveis</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-900">Treinamento Customizado</p>
                    <p className="text-sm text-gray-600">Treine o agente com seus dados</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-900">Integração com Canais</p>
                    <p className="text-sm text-gray-600">Funciona em todos os canais</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-900">Análise de Sentimento</p>
                    <p className="text-sm text-gray-600">Entende o tom das mensagens</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-900">Escalação Inteligente</p>
                    <p className="text-sm text-gray-600">Encaminha para humano quando necessário</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

