import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Instagram, Music, Facebook, Mail, Zap, Plus, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: "connected" | "disconnected";
  category: "messaging" | "social" | "automation";
}

const integrations: Integration[] = [
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    description: "Conecte sua conta WhatsApp Business para gerenciar conversas",
    icon: <MessageCircle className="h-8 w-8" />,
    status: "connected",
    category: "messaging",
  },
  {
    id: "instagram",
    name: "Instagram",
    description: "Capture leads e gerencie DMs do Instagram",
    icon: <Instagram className="h-8 w-8" />,
    status: "disconnected",
    category: "social",
  },
  {
    id: "tiktok",
    name: "TikTok",
    description: "Integre com TikTok para capturar leads",
    icon: <Music className="h-8 w-8" />,
    status: "disconnected",
    category: "social",
  },
  {
    id: "facebook",
    name: "Facebook",
    description: "Conecte com Facebook para gerenciar mensagens",
    icon: <Facebook className="h-8 w-8" />,
    status: "disconnected",
    category: "social",
  },
  {
    id: "email",
    name: "Email",
    description: "Integre com seu email para automações",
    icon: <Mail className="h-8 w-8" />,
    status: "disconnected",
    category: "messaging",
  },
  {
    id: "automation",
    name: "Automações",
    description: "Configure fluxos automáticos de vendas",
    icon: <Zap className="h-8 w-8" />,
    status: "disconnected",
    category: "automation",
  },
];

export default function Settings() {
  const [connectedIntegrations, setConnectedIntegrations] = useState<string[]>(["whatsapp"]);

  const handleConnect = (integrationId: string) => {
    setConnectedIntegrations([...connectedIntegrations, integrationId]);
    toast.success("Integração conectada com sucesso!");
  };

  const handleDisconnect = (integrationId: string) => {
    setConnectedIntegrations(connectedIntegrations.filter(id => id !== integrationId));
    toast.success("Integração desconectada!");
  };

  const categories = [
    { id: "messaging", label: "Mensageria" },
    { id: "social", label: "Redes Sociais" },
    { id: "automation", label: "Automações" },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600 mt-2">Gerencie suas integrações e preferências</p>
        </div>

        {/* Integrations by Category */}
        {categories.map((category) => {
          const categoryIntegrations = integrations.filter(i => i.category === category.id);
          return (
            <div key={category.id} className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">{category.label}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryIntegrations.map((integration) => {
                  const isConnected = connectedIntegrations.includes(integration.id);
                  return (
                    <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-gray-100 text-gray-700">
                              {integration.icon}
                            </div>
                            <div>
                              <CardTitle className="text-base">{integration.name}</CardTitle>
                              <CardDescription className="text-xs mt-1">
                                {integration.description}
                              </CardDescription>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          {isConnected ? (
                            <Badge className="bg-green-100 text-green-800 flex gap-1">
                              <Check className="h-3 w-3" />
                              Conectado
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-gray-600">
                              Desconectado
                            </Badge>
                          )}
                          <Button
                            variant={isConnected ? "outline" : "default"}
                            size="sm"
                            onClick={() =>
                              isConnected
                                ? handleDisconnect(integration.id)
                                : handleConnect(integration.id)
                            }
                          >
                            {isConnected ? "Desconectar" : "Conectar"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Configurações Gerais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Nome da Empresa
              </label>
              <input
                type="text"
                placeholder="Sua empresa"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Email de Contato
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Fuso Horário
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>America/Sao_Paulo (UTC-3)</option>
                <option>America/Manaus (UTC-4)</option>
                <option>America/Anchorage (UTC-9)</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button className="bg-blue-600 hover:bg-blue-700">Salvar Alterações</Button>
              <Button variant="outline">Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

