import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, Link2, MessageCircle, Plus, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";

export default function WhatsappIntegration() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: "",
    displayName: "",
    accessToken: "",
    businessAccountId: "",
    phoneNumberId: "",
  });

  // Simulando dados de exemplo
  const mockAccounts = [
    {
      id: "1",
      phoneNumber: "+5511999999999",
      displayName: "Suporte",
      status: "connected",
      createdAt: new Date("2025-10-15"),
      isDefault: true,
    },
    {
      id: "2",
      phoneNumber: "+5511988888888",
      displayName: "Vendas",
      status: "disconnected",
      createdAt: new Date("2025-10-10"),
      isDefault: false,
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar chamada tRPC para criar conta
    console.log("Conectando conta:", formData);
    setShowForm(false);
    setFormData({
      phoneNumber: "",
      displayName: "",
      accessToken: "",
      businessAccountId: "",
      phoneNumberId: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Integração WhatsApp</h1>
          <p className="text-muted-foreground mt-2">
            Conecte suas contas WhatsApp Business para começar a gerenciar conversas
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          Conectar Conta
        </Button>
      </div>

      {/* Info Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Você precisa de uma conta WhatsApp Business e acesso à Meta API para conectar. 
          <a href="#" className="underline ml-1">Saiba como configurar</a>
        </AlertDescription>
      </Alert>

      {/* Form */}
      {showForm && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg">Conectar Nova Conta WhatsApp</CardTitle>
            <CardDescription>
              Preencha os dados da sua conta WhatsApp Business
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phoneNumber">Número de Telefone</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="+55 11 99999-9999"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Formato: +55 com DDD e número
                  </p>
                </div>

                <div>
                  <Label htmlFor="displayName">Nome de Exibição</Label>
                  <Input
                    id="displayName"
                    name="displayName"
                    placeholder="Ex: Suporte, Vendas"
                    value={formData.displayName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="accessToken">Token de Acesso</Label>
                  <Input
                    id="accessToken"
                    name="accessToken"
                    type="password"
                    placeholder="Seu token de acesso da Meta API"
                    value={formData.accessToken}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Obtém no Meta App Dashboard → Configurações
                  </p>
                </div>

                <div>
                  <Label htmlFor="businessAccountId">ID da Conta de Negócio</Label>
                  <Input
                    id="businessAccountId"
                    name="businessAccountId"
                    placeholder="Seu ID de conta de negócio"
                    value={formData.businessAccountId}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phoneNumberId">ID do Número de Telefone</Label>
                  <Input
                    id="phoneNumberId"
                    name="phoneNumberId"
                    placeholder="ID do número registrado"
                    value={formData.phoneNumberId}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  <Link2 className="w-4 h-4 mr-2" />
                  Conectar Conta
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Accounts List */}
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Contas Conectadas</h2>
          <Badge variant="outline">{mockAccounts.length} conta(s)</Badge>
        </div>

        {mockAccounts.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <p className="text-muted-foreground">Nenhuma conta conectada ainda</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Clique em "Conectar Conta" para adicionar sua primeira conta WhatsApp
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {mockAccounts.map(account => (
              <Card key={account.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <MessageCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <h3 className="font-semibold">{account.displayName}</h3>
                          <p className="text-sm text-muted-foreground">{account.phoneNumber}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-3">
                        {account.status === "connected" ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Conectada
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            Desconectada
                          </Badge>
                        )}

                        {account.isDefault && (
                          <Badge variant="outline">Padrão</Badge>
                        )}

                        <span className="text-xs text-muted-foreground ml-auto">
                          Conectada em {account.createdAt.toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        Configurar
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Conversas Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">+5 desde ontem</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Mensagens Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground mt-1">Enviadas e recebidas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Tempo Médio de Resposta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4m 32s</div>
            <p className="text-xs text-muted-foreground mt-1">Última hora</p>
          </CardContent>
        </Card>
      </div>

      {/* Documentation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Como Conectar sua Conta WhatsApp</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-100 text-blue-600 font-semibold">
                  1
                </div>
              </div>
              <div>
                <h4 className="font-semibold">Crie uma Conta de Negócio no WhatsApp</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Acesse <a href="https://www.whatsapp.com/business" className="underline">WhatsApp Business</a> e crie sua conta de negócio
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-100 text-blue-600 font-semibold">
                  2
                </div>
              </div>
              <div>
                <h4 className="font-semibold">Configure a Meta API</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Vá para <a href="https://developers.facebook.com" className="underline">Meta Developers</a> e crie um app
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-100 text-blue-600 font-semibold">
                  3
                </div>
              </div>
              <div>
                <h4 className="font-semibold">Obtenha suas Credenciais</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Copie o Token de Acesso, ID da Conta e ID do Número de Telefone
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-100 text-blue-600 font-semibold">
                  4
                </div>
              </div>
              <div>
                <h4 className="font-semibold">Conecte no KanFlow</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Cole as credenciais no formulário acima e clique em "Conectar Conta"
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

