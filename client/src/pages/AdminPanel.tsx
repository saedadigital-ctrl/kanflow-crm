import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Users, CreditCard, Settings, Edit2, Trash2, Eye } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  plan: "starter" | "pro" | "enterprise";
  users: number;
  joinedAt: string;
}

const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "Empresa ABC",
    email: "contato@empresaabc.com",
    status: "active",
    plan: "pro",
    users: 5,
    joinedAt: "2024-01-10",
  },
  {
    id: "2",
    name: "Loja XYZ",
    email: "admin@lojaxyz.com",
    status: "active",
    plan: "starter",
    users: 2,
    joinedAt: "2024-01-15",
  },
  {
    id: "3",
    name: "Consultoria 123",
    email: "info@consultoria123.com",
    status: "inactive",
    plan: "enterprise",
    users: 10,
    joinedAt: "2023-12-20",
  },
];

const planConfig = {
  starter: { label: "Starter", color: "bg-blue-100 text-blue-800" },
  pro: { label: "Pro", color: "bg-purple-100 text-purple-800" },
  enterprise: { label: "Enterprise", color: "bg-amber-100 text-amber-800" },
};

export default function AdminPanel() {
  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col h-full bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <Users className="w-4 h-4 mr-2" />
              Novo Cliente
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Clientes Ativos</p>
                    <p className="text-3xl font-bold text-gray-900">2</p>
                  </div>
                  <Users className="w-8 h-8 text-primary opacity-20" />
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Usuários Totais</p>
                    <p className="text-3xl font-bold text-gray-900">17</p>
                  </div>
                  <Users className="w-8 h-8 text-secondary opacity-20" />
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Receita Mensal</p>
                    <p className="text-3xl font-bold text-gray-900">R$ 2.500</p>
                  </div>
                  <CreditCard className="w-8 h-8 text-accent opacity-20" />
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Conversas/Mês</p>
                    <p className="text-3xl font-bold text-gray-900">1.245</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-amber-500 opacity-20" />
                </div>
              </Card>
            </div>

            {/* Customers */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Clientes</h2>
              <div className="space-y-3">
                {mockCustomers.map((customer) => (
                  <Card key={customer.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                          <Badge variant={customer.status === "active" ? "default" : "secondary"}>
                            {customer.status === "active" ? "Ativo" : "Inativo"}
                          </Badge>
                          <Badge className={planConfig[customer.plan].color}>
                            {planConfig[customer.plan].label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <span>{customer.email}</span>
                          <span>{customer.users} usuários</span>
                          <span>Desde {new Date(customer.joinedAt).toLocaleDateString("pt-BR")}</span>
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
                  </Card>
                ))}
              </div>
            </div>

            {/* System Settings */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configurações do Sistema
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Manutenção do Sistema</p>
                    <p className="text-sm text-gray-600">Ativar modo de manutenção</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configurar
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Backups Automáticos</p>
                    <p className="text-sm text-gray-600">Próximo backup em 2h</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configurar
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Logs do Sistema</p>
                    <p className="text-sm text-gray-600">Visualizar atividades recentes</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Visualizar
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

