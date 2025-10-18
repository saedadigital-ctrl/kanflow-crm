import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { 
  Building2, 
  Users, 
  DollarSign, 
  AlertCircle,
  TrendingUp,
  XCircle,
  ArrowRight
} from "lucide-react";
import { useLocation } from "wouter";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { data: stats, isLoading } = trpc.admin.stats.useQuery();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(cents / 100);
  };

  const metrics = [
    {
      title: "Total de Organizações",
      value: stats?.totalOrganizations || 0,
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description: "Clientes cadastrados",
    },
    {
      title: "Organizações Ativas",
      value: stats?.activeOrganizations || 0,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
      description: "Com licença ativa",
    },
    {
      title: "Total de Usuários",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      description: "Usuários ativos",
    },
    {
      title: "Receita Total",
      value: formatCurrency(stats?.totalRevenue || 0),
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      description: "Pagamentos recebidos",
    },
    {
      title: "Organizações Suspensas",
      value: stats?.suspendedOrganizations || 0,
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      description: "Aguardando pagamento",
    },
    {
      title: "Organizações Canceladas",
      value: stats?.cancelledOrganizations || 0,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
      description: "Contas encerradas",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Painel Administrativo</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie clientes, licenças e faturamento do KanFlow
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {metric.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                    <Icon className={`h-4 w-4 ${metric.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {metric.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-start gap-2"
                onClick={() => setLocation("/admin/organizations")}
              >
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold">Gerenciar Clientes</span>
                </div>
                <span className="text-sm text-muted-foreground text-left">
                  Ver, criar e editar organizações
                </span>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </Button>

              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-start gap-2"
                onClick={() => setLocation("/admin/plans")}
              >
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span className="font-semibold">Planos e Preços</span>
                </div>
                <span className="text-sm text-muted-foreground text-left">
                  Configurar planos de assinatura
                </span>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </Button>

              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-start gap-2"
                onClick={() => setLocation("/admin/payments")}
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <span className="font-semibold">Pagamentos</span>
                </div>
                <span className="text-sm text-muted-foreground text-left">
                  Acompanhar faturas e cobranças
                </span>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total de Contatos Gerenciados</span>
                <span className="font-semibold">{stats?.totalContacts?.toLocaleString('pt-BR') || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Taxa de Ativação</span>
                <span className="font-semibold">
                  {stats?.totalOrganizations
                    ? Math.round((stats.activeOrganizations / stats.totalOrganizations) * 100)
                    : 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Receita Média por Cliente</span>
                <span className="font-semibold">
                  {stats?.activeOrganizations
                    ? formatCurrency(Math.round((stats.totalRevenue || 0) / stats.activeOrganizations))
                    : formatCurrency(0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

