import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Plus, Copy, Check, AlertCircle } from "lucide-react";
import { useState } from "react";

interface WhatsAppAccount {
  id: string;
  phoneNumber: string;
  businessName: string;
  status: "connected" | "disconnected" | "pending";
  connectedAt: string;
}

const mockAccounts: WhatsAppAccount[] = [
  {
    id: "1",
    phoneNumber: "+55 11 98765-4321",
    businessName: "Empresa ABC",
    status: "connected",
    connectedAt: "2024-01-15",
  },
  {
    id: "2",
    phoneNumber: "+55 21 99876-5432",
    businessName: "Loja XYZ",
    status: "pending",
    connectedAt: "2024-01-20",
  },
];

export default function WhatsAppIntegration() {
  const [copied, setCopied] = useState(false);
  const [accounts, setAccounts] = useState<WhatsAppAccount[]>(mockAccounts);

  const handleCopy = () => {
    navigator.clipboard.writeText("https://kanflow.app/whatsapp/webhook");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusConfig = {
    connected: { label: "Conectado", color: "bg-green-100 text-green-800", badge: "success" },
    disconnected: { label: "Desconectado", color: "bg-red-100 text-red-800", badge: "destructive" },
    pending: { label: "Pendente", color: "bg-yellow-100 text-yellow-800", badge: "secondary" },
  };

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col h-full bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900">Integração WhatsApp</h1>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Conta
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Setup Instructions */}
            <Card className="p-6 border border-blue-200 bg-blue-50">
              <div className="flex gap-4">
                <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Como conectar WhatsApp Business</h3>
                  <ol className="space-y-2 text-sm text-gray-700">
                    <li>1. Acesse <a href="#" className="text-primary hover:underline">Meta Business Manager</a></li>
                    <li>2. Selecione sua conta WhatsApp Business</li>
                    <li>3. Copie o Webhook URL abaixo e configure em Meta</li>
                    <li>4. Confirme a conexão e pronto!</li>
                  </ol>
                </div>
              </div>
            </Card>

            {/* Webhook URL */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">URL do Webhook</h3>
              <div className="flex gap-2">
                <Input
                  value="https://kanflow.app/whatsapp/webhook"
                  readOnly
                  className="bg-gray-100"
                />
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  className="flex-shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Connected Accounts */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contas Conectadas</h2>
              <div className="space-y-3">
                {accounts.map((account) => (
                  <Card key={account.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{account.businessName}</h3>
                          <Badge variant={statusConfig[account.status].badge as any}>
                            {statusConfig[account.status].label}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{account.phoneNumber}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Conectado em {new Date(account.connectedAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Configurar
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          Desconectar
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Features */}
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
              <h3 className="font-semibold text-gray-900 mb-4">Recursos Disponíveis</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-900">Receber mensagens</p>
                    <p className="text-sm text-gray-600">Todas as mensagens sincronizadas em tempo real</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-900">Enviar mensagens</p>
                    <p className="text-sm text-gray-600">Responda diretamente do KanFlow</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-900">Automações</p>
                    <p className="text-sm text-gray-600">Configure respostas automáticas</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-900">Agentes de IA</p>
                    <p className="text-sm text-gray-600">Respostas inteligentes com IA</p>
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

