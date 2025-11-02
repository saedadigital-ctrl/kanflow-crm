import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Users, MessageSquare, TrendingUp, Activity } from "lucide-react";

export default function Dashboard() {
  const { data: stats, isLoading } = trpc.dashboard.stats.useQuery();

  if (isLoading) {
    return <DashboardLayout><div className="flex items-center justify-center min-h-screen">Carregando...</div></DashboardLayout>;
  }

  const metrics = [
    {
      title: "Total de Contatos",
      value: stats?.totalContacts || 0,
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Estágios do Pipeline",
      value: stats?.totalStages || 0,
      icon: TrendingUp,
      color: "bg-green-100 text-green-600",
    },
  ];

  // Dados para gráfico de contatos por estágio
  const chartData = stats?.contactsByStage || [];

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Bem-vindo ao KanFlow - Seu CRM WhatsApp</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                  <div className={`p-2 rounded-lg ${metric.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts */}
        <Card>
          <CardHeader>
            <CardTitle>Contatos por Estágio</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stageName" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Nenhum dado disponível
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Contatos Novos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {chartData.find(s => s.stageName === "Leads")?.count || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">No estágio de Leads</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Em Contato</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {chartData.find(s => s.stageName === "Contacting")?.count || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">Sendo contatados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Negociando</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {chartData.find(s => s.stageName === "Negotiating")?.count || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">Em negociação</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

