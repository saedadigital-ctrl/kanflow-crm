import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { trpc } from "@/lib/trpc";
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Calendar,
  Users,
  MessageSquare,
  Phone,
  TrendingUp
} from "lucide-react";

export default function MyLicense() {
  // TODO: Get organizationId from user context
  const organizationId = "org_demo";
  
  const { data: licenseData, isLoading: licenseLoading } = trpc.client.getLicense.useQuery({
    organizationId,
  });

  const { data: orgInfo, isLoading: orgLoading } = trpc.client.getOrganizationInfo.useQuery({
    organizationId,
  });

  const isLoading = licenseLoading || orgLoading;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusBadge = () => {
    if (!licenseData) return null;

    switch (licenseData.status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Ativa
          </Badge>
        );
      case "suspended":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            <AlertCircle className="h-3 w-3 mr-1" />
            Suspensa
          </Badge>
        );
      case "expired":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="h-3 w-3 mr-1" />
            Expirada
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelada
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            <AlertCircle className="h-3 w-3 mr-1" />
            Sem Licença
          </Badge>
        );
    }
  };

  const getStatusAlert = () => {
    if (!licenseData) return null;

    if (licenseData.status === "suspended") {
      return (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Licença Suspensa:</strong> {licenseData.message}
            {licenseData.reason && <div className="mt-1">Motivo: {licenseData.reason}</div>}
          </AlertDescription>
        </Alert>
      );
    }

    if (licenseData.status === "expired") {
      return (
        <Alert className="border-red-200 bg-red-50">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Licença Expirada:</strong> Sua licença expirou. Entre em contato com o suporte para renovar.
          </AlertDescription>
        </Alert>
      );
    }

    if (licenseData.status === "cancelled") {
      return (
        <Alert className="border-red-200 bg-red-50">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Licença Cancelada:</strong> Sua conta foi cancelada. Entre em contato com o suporte.
          </AlertDescription>
        </Alert>
      );
    }

    if (licenseData.status === "active" && licenseData.license && licenseData.license.daysRemaining <= 7) {
      return (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Atenção:</strong> Sua licença expira em {licenseData.license.daysRemaining} dias. 
            Entre em contato para renovar.
          </AlertDescription>
        </Alert>
      );
    }

    return null;
  };

  const usagePercentage = (current: number, max: number) => {
    return Math.round((current / max) * 100);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Minha Licença</h1>
            <p className="text-muted-foreground mt-1">
              Visualize o status da sua licença e uso de recursos
            </p>
          </div>
          {getStatusBadge()}
        </div>

        {/* Status Alert */}
        {getStatusAlert()}

        {/* License Info */}
        {licenseData?.status === "active" && licenseData.license && (
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informações da Licença</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Chave da Licença</span>
                  <span className="font-mono text-sm">{licenseData.license.licenseKey}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Data de Início</span>
                  <span className="text-sm">
                    {new Date(licenseData.license.startDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Data de Expiração</span>
                  <span className="text-sm">
                    {new Date(licenseData.license.expiryDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Dias Restantes</span>
                  <span className="text-sm font-semibold text-primary">
                    {licenseData.license.daysRemaining} dias
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Organização</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Nome</span>
                  <span className="text-sm font-medium">{orgInfo?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="text-sm">{orgInfo?.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  {getStatusBadge()}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Membro desde</span>
                  <span className="text-sm">
                    {orgInfo?.createdAt && new Date(orgInfo.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Resource Usage */}
        {orgInfo && (
          <Card>
            <CardHeader>
              <CardTitle>Uso de Recursos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                {/* Users */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Usuários</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {orgInfo.currentUsers} / {orgInfo.maxUsers}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${usagePercentage(orgInfo.currentUsers, orgInfo.maxUsers)}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {usagePercentage(orgInfo.currentUsers, orgInfo.maxUsers)}% utilizado
                  </p>
                </div>

                {/* Contacts */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Contatos</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      0 / {orgInfo.maxContacts}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${usagePercentage(0, orgInfo.maxContacts)}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {usagePercentage(0, orgInfo.maxContacts)}% utilizado
                  </p>
                </div>

                {/* WhatsApp Numbers */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">Números WhatsApp</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      0 / {orgInfo.maxWhatsappNumbers}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${usagePercentage(0, orgInfo.maxWhatsappNumbers)}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {usagePercentage(0, orgInfo.maxWhatsappNumbers)}% utilizado
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Support */}
        <Card>
          <CardHeader>
            <CardTitle>Precisa de Ajuda?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Entre em contato com nosso suporte para renovar sua licença, fazer upgrade do plano ou tirar dúvidas.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Email:</span>
                <a href="mailto:suporte@aedadigital.com.br" className="text-primary hover:underline">
                  suporte@aedadigital.com.br
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">WhatsApp:</span>
                <a href="https://wa.me/5511999999999" className="text-primary hover:underline">
                  +55 (11) 99999-9999
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

