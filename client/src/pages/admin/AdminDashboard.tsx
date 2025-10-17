import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { 
  Building2, 
  Users, 
  DollarSign, 
  AlertCircle,
  TrendingUp,
  TrendingDown
} from "lucide-react";

export default function AdminDashboard() {
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

  const metrics = [
    {
      title: "Total de Organizações",
      value: stats?.totalOrganizations || 0,
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Organizações Ativas",
      value: stats?.activeOrganizations || 0,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
      trend: "+8%",
      trendUp: true,
    },
    {
      title: "Total de Usuários",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      trend: "+15%",
      trendUp: true,
    },
    {
      title: "Receita Total",
      value: `R$ ${((stats?.totalRevenue || 0) / 100).toFixed(2)}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      trend: "+23%",
      trendUp: true,
    },
    {
      title: "Suspensas",
      value: stats?.suspendedOrganizations || 0,
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      trend: "-5%",
      trendUp: false,
    },
    {
      title: "Canceladas",
      value: stats?.cancelledOrganizations || 0,
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-100",
      trend: "+2%",
      trendUp: false,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          <p className="text-muted-foreground">
            Gerencie clientes, planos e pagamentos do KanFlow
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <div className={`h-10 w-10 rounded-lg ${metric.bgColor} flex items-center justify-center`}>
                  <metric.icon className={`h-5 w-5 ${metric.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{metric.value}</div>
                <div className="flex items-center gap-1 mt-2">
                  {metric.trendUp ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm ${metric.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.trend}
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">vs mês anterior</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/admin/organizations"
                className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
              >
                <Building2 className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold">Gerenciar Clientes</h3>
                <p className="text-sm text-muted-foreground">
                  Ver, criar e editar organizações
                </p>
              </a>
              <a
                href="/admin/plans"
                className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
              >
                <DollarSign className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold">Planos e Preços</h3>
                <p className="text-sm text-muted-foreground">
                  Configurar planos de assinatura
                </p>
              </a>
              <a
                href="/admin/payments"
                className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
              >
                <TrendingUp className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold">Pagamentos</h3>
                <p className="text-sm text-muted-foreground">
                  Acompanhar faturas e cobranças
                </p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

