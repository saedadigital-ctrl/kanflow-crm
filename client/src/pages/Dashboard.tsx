import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, MessageSquare, TrendingUp, Activity, ArrowUpRight, ArrowDownRight, Phone } from "lucide-react";

export default function Dashboard() {
  const { data: stats, isLoading } = trpc.dashboard.stats.useQuery();

  if (isLoading) {
    return <DashboardLayout><div className="flex items-center justify-center min-h-screen">Carregando...</div></DashboardLayout>;
  }

  const chartData = stats?.contactsByStage || [];
  const COLORS = ["#1E40AF", "#06B6D4", "#10B981", "#F59E0B"];

  const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
    <Card className="bg-gradient-to-br from-white to-slate-50 border-slate-200 hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
        <div className="p-2 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
          <Icon className="h-4 w-4 text-blue-600" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <div className="flex items-center gap-1 mt-2">
          {trend === "up" ? (
            <ArrowUpRight className="h-4 w-4 text-green-600" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-red-600" />
          )}
          <span className={trend === "up" ? "text-green-600 text-sm font-medium" : "text-red-600 text-sm font-medium"}>
            {change}
          </span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 via-white to-slate-50 min-h-screen">
        {/* Header */}
        <div className="border-b border-slate-200 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-sm text-slate-500 mt-1">Bem-vindo ao KanFlow - Seu CRM WhatsApp</p>
            </div>
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
              Ativo
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total de Contatos"
            value={stats?.totalContacts || "0"}
            change="+10.2%"
            icon={Users}
            trend="up"
          />
          <StatCard
            title="Estágios do Pipeline"
            value={stats?.totalStages || "0"}
            change="+2.5%"
            icon={TrendingUp}
            trend="up"
          />
          <StatCard
            title="Taxa de Resposta"
            value="92.5%"
            change="-1.2%"
            icon={MessageSquare}
            trend="down"
          />
          <StatCard
            title="Números WhatsApp"
            value="5"
            change="+1"
            icon={Phone}
            trend="up"
          />
        </div>

        {/* Charts */}
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-900">Contatos por Estágio</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis stroke="#94a3b8" dataKey="stageName" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
                  <Bar dataKey="count" fill="#1E40AF" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-slate-500 py-8">
                Nenhum dado disponível
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-900">Contatos Novos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {chartData.find(s => s.stageName === "Leads")?.count || 0}
              </div>
              <p className="text-xs text-blue-700 mt-1">No estágio de Leads</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-cyan-900">Em Contato</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-600">
                {chartData.find(s => s.stageName === "Contacting")?.count || 0}
              </div>
              <p className="text-xs text-cyan-700 mt-1">Sendo contatados</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-900">Negociando</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {chartData.find(s => s.stageName === "Negotiating")?.count || 0}
              </div>
              <p className="text-xs text-green-700 mt-1">Em negociação</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

