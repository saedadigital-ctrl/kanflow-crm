import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, MessageCircle, Copy, Eye, EyeOff } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { useState as useStateHook } from "react";

export default function WhatsAppSetup() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [businessAccountId, setBusinessAccountId] = useState("");
  const [phoneNumberId, setPhoneNumberId] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: whatsappAccounts, refetch: refetchAccounts } = trpc.whatsapp.getAccounts.useQuery();
  const connectAccount = trpc.whatsapp.connectAccount.useMutation({
    onSuccess: () => {
      setPhoneNumber("");
      setDisplayName("");
      setAccessToken("");
      setBusinessAccountId("");
      setPhoneNumberId("");
      refetchAccounts();
    },
  });

  const handleConnect = async () => {
    if (!phoneNumber || !accessToken || !businessAccountId || !phoneNumberId) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setIsSubmitting(true);
    try {
      await connectAccount.mutateAsync({
        phoneNumber,
        displayName: displayName || "WhatsApp",
        accessToken,
        businessAccountId,
        phoneNumberId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <DashboardLayout>
      <div className="container max-w-4xl py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Conectar WhatsApp</h1>
            <p className="text-muted-foreground">
              Configure sua conta WhatsApp Business para começar a gerenciar conversas e criar grupos
            </p>
          </div>

          {/* Alert */}
          <Alert className="border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Você precisa de uma conta WhatsApp Business e acesso à Meta API para conectar. 
              <a href="https://developers.facebook.com/" target="_blank" rel="noopener noreferrer" className="ml-1 underline font-semibold">
                Acesse o Meta Developers
              </a>
            </AlertDescription>
          </Alert>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Form */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Adicionar Nova Conta</CardTitle>
                <CardDescription>Preencha os dados da sua conta WhatsApp Business</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Número de Telefone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Número de Telefone *</Label>
                  <Input
                    id="phone"
                    placeholder="+55 11 99999-9999"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground">
                    Formato: +55 com DDD (ex: +55 11 99999-9999)
                  </p>
                </div>

                {/* Nome de Exibição */}
                <div className="space-y-2">
                  <Label htmlFor="displayName">Nome de Exibição</Label>
                  <Input
                    id="displayName"
                    placeholder="ex: Suporte, Vendas, Atendimento"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Como seu número aparecerá para os clientes
                  </p>
                </div>

                {/* Token de Acesso */}
                <div className="space-y-2">
                  <Label htmlFor="token">Token de Acesso (API) *</Label>
                  <div className="relative">
                    <Input
                      id="token"
                      type={showToken ? "text" : "password"}
                      placeholder="EAABsZC..."
                      value={accessToken}
                      onChange={(e) => setAccessToken(e.target.value)}
                      className="font-mono pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowToken(!showToken)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Gerado no Meta Developers Console
                  </p>
                </div>

                {/* ID da Conta de Negócio */}
                <div className="space-y-2">
                  <Label htmlFor="businessId">ID da Conta de Negócio *</Label>
                  <Input
                    id="businessId"
                    placeholder="123456789"
                    value={businessAccountId}
                    onChange={(e) => setBusinessAccountId(e.target.value)}
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground">
                    Encontrado em Configurações da Conta de Negócio
                  </p>
                </div>

                {/* ID do Número de Telefone */}
                <div className="space-y-2">
                  <Label htmlFor="phoneId">ID do Número de Telefone *</Label>
                  <Input
                    id="phoneId"
                    placeholder="987654321"
                    value={phoneNumberId}
                    onChange={(e) => setPhoneNumberId(e.target.value)}
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground">
                    ID único do número no Meta Developers
                  </p>
                </div>

                {/* Botão de Conexão */}
                <Button
                  onClick={handleConnect}
                  disabled={isSubmitting || connectAccount.isPending}
                  className="w-full h-10"
                  size="lg"
                >
                  {isSubmitting || connectAccount.isPending ? "Conectando..." : "Conectar Conta"}
                </Button>

                {connectAccount.isError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Erro ao conectar: {connectAccount.error?.message}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Contas Conectadas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contas Conectadas</CardTitle>
                <CardDescription>
                  {whatsappAccounts?.length || 0} conta(s) ativa(s)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {whatsappAccounts && whatsappAccounts.length > 0 ? (
                  whatsappAccounts.map((account) => (
                    <div
                      key={account.id}
                      className="p-3 border rounded-lg space-y-2 bg-gradient-to-br from-green-50 to-emerald-50"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <MessageCircle className="h-4 w-4 text-green-600 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-sm truncate">
                              {account.displayName}
                            </p>
                            <p className="text-xs text-muted-foreground font-mono truncate">
                              {account.phoneNumber}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Ativo
                        </Badge>
                      </div>

                      {/* Estatísticas */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                        <div className="text-center p-2 bg-white rounded">
                          <p className="text-xs text-muted-foreground">Conversas</p>
                          <p className="text-lg font-bold text-primary">
                            {account.conversationCount || 0}
                          </p>
                        </div>
                        <div className="text-center p-2 bg-white rounded">
                          <p className="text-xs text-muted-foreground">Mensagens</p>
                          <p className="text-lg font-bold text-primary">
                            {account.messageCount || 0}
                          </p>
                        </div>
                      </div>

                      {/* Botões de Ação */}
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1 h-8">
                          Configurar
                        </Button>
                        <Button variant="ghost" size="sm" className="flex-1 h-8 text-red-600 hover:bg-red-50">
                          Desconectar
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhuma conta conectada</p>
                    <p className="text-xs">Conecte sua primeira conta acima</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Guia de Setup */}
          <Card>
            <CardHeader>
              <CardTitle>Como Obter suas Credenciais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-bold shrink-0">
                    1
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold">Acesse Meta Developers</p>
                    <p className="text-sm text-muted-foreground">
                      Vá para{" "}
                      <a
                        href="https://developers.facebook.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline"
                      >
                        developers.facebook.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-bold shrink-0">
                    2
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold">Crie uma Aplicação</p>
                    <p className="text-sm text-muted-foreground">
                      Crie uma nova app e selecione "WhatsApp Business"
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-bold shrink-0">
                    3
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold">Gere o Token de Acesso</p>
                    <p className="text-sm text-muted-foreground">
                      Em Configurações → Tokens, gere um token com permissão para WhatsApp
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-bold shrink-0">
                    4
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold">Obtenha os IDs</p>
                    <p className="text-sm text-muted-foreground">
                      Copie o ID da Conta de Negócio e ID do Número de Telefone
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-bold shrink-0">
                    5
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold">Cole aqui e Conecte</p>
                    <p className="text-sm text-muted-foreground">
                      Preencha o formulário acima e clique em "Conectar Conta"
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

