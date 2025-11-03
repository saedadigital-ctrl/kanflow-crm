import { useState } from "react";
import { AlertCircle, CheckCircle2, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { trpc } from "@/lib/trpc";

interface WhatsAppSetupProps {
  organizationId: string;
}

export default function WhatsAppSetup({ organizationId }: WhatsAppSetupProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [businessAccountId, setBusinessAccountId] = useState("");
  const [phoneNumberId, setPhoneNumberId] = useState("");

  // Fetch current config
  const { data: configData, isLoading: isLoadingConfig } = trpc.whatsapp.config.get.useQuery({
    organizationId,
  });

  // Save config mutation
  const saveConfigMutation = trpc.whatsapp.config.save.useMutation({
    onSuccess: () => {
      alert("Configuração salva com sucesso!");
    },
  });

  // Test connection mutation
  const testConnectionMutation = trpc.whatsapp.config.test.useMutation({
    onSuccess: (data) => {
      alert(data.message);
    },
  });

  const handleSaveConfig = () => {
    if (!phoneNumber) {
      alert("Número de telefone é obrigatório");
      return;
    }

    saveConfigMutation.mutate({
      organizationId,
      phoneNumber,
      displayName,
      accessToken,
      businessAccountId,
      phoneNumberId,
    });
  };

  const handleTestConnection = () => {
    testConnectionMutation.mutate({ organizationId });
  };

  const isConnected = configData?.data?.connected || false;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <MessageCircle className="h-8 w-8" />
          Configuração WhatsApp
        </h1>
        <p className="text-muted-foreground mt-2">
          Configure sua integração com WhatsApp Business API
        </p>
      </div>

      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isConnected ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Conectado
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                Não Conectado
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isConnected ? (
            <p className="text-green-600">
              Sua conta WhatsApp está conectada e pronta para usar.
            </p>
          ) : (
            <p className="text-yellow-600">
              Configure seus dados do WhatsApp Business para começar a receber mensagens.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Configuration Form */}
      <Card>
        <CardHeader>
          <CardTitle>Dados de Configuração</CardTitle>
          <CardDescription>
            Preencha os dados da sua conta WhatsApp Business
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Phone Number */}
          <div>
            <label className="text-sm font-medium">Número de Telefone</label>
            <Input
              placeholder="+55 11 99999-9999"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isLoadingConfig || saveConfigMutation.isPending}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Número de telefone verificado no WhatsApp Business
            </p>
          </div>

          {/* Display Name */}
          <div>
            <label className="text-sm font-medium">Nome de Exibição</label>
            <Input
              placeholder="Minha Empresa"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={isLoadingConfig || saveConfigMutation.isPending}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Nome que aparecerá nas conversas
            </p>
          </div>

          {/* Access Token */}
          <div>
            <label className="text-sm font-medium">Access Token</label>
            <Input
              type="password"
              placeholder="Seu access token do WhatsApp"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              disabled={isLoadingConfig || saveConfigMutation.isPending}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Token de autenticação da API WhatsApp Business
            </p>
          </div>

          {/* Business Account ID */}
          <div>
            <label className="text-sm font-medium">ID da Conta Comercial</label>
            <Input
              placeholder="Seu Business Account ID"
              value={businessAccountId}
              onChange={(e) => setBusinessAccountId(e.target.value)}
              disabled={isLoadingConfig || saveConfigMutation.isPending}
            />
            <p className="text-xs text-muted-foreground mt-1">
              ID único da sua conta comercial
            </p>
          </div>

          {/* Phone Number ID */}
          <div>
            <label className="text-sm font-medium">ID do Número de Telefone</label>
            <Input
              placeholder="Seu Phone Number ID"
              value={phoneNumberId}
              onChange={(e) => setPhoneNumberId(e.target.value)}
              disabled={isLoadingConfig || saveConfigMutation.isPending}
            />
            <p className="text-xs text-muted-foreground mt-1">
              ID do número de telefone na API WhatsApp
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSaveConfig}
              disabled={
                !phoneNumber ||
                isLoadingConfig ||
                saveConfigMutation.isPending
              }
            >
              {saveConfigMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Configuração"
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleTestConnection}
              disabled={
                !phoneNumber ||
                isLoadingConfig ||
                testConnectionMutation.isPending
              }
            >
              {testConnectionMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testando...
                </>
              ) : (
                "Testar Conexão"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Como Configurar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ol className="space-y-3 list-decimal list-inside">
            <li className="text-sm">
              Acesse{" "}
              <a
                href="https://developers.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Facebook Developers
              </a>
            </li>
            <li className="text-sm">
              Crie um aplicativo e configure WhatsApp Business API
            </li>
            <li className="text-sm">
              Obtenha seu Access Token, Business Account ID e Phone Number ID
            </li>
            <li className="text-sm">
              Preencha os campos acima com suas credenciais
            </li>
            <li className="text-sm">
              Clique em "Testar Conexão" para verificar se está funcionando
            </li>
            <li className="text-sm">
              Configure o webhook para receber mensagens
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* Webhook Info */}
      <Card>
        <CardHeader>
          <CardTitle>Webhook</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-medium mb-2">URL do Webhook:</p>
              <code className="bg-muted p-2 rounded text-xs block">
                {window.location.origin}/api/webhooks/whatsapp
              </code>
              <p className="text-xs text-muted-foreground mt-2">
                Configure esta URL no painel do WhatsApp Business para receber eventos
              </p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}

