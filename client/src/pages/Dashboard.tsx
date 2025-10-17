import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from "lucide-react";
import { Link } from "wouter";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const { data: contacts } = trpc.contacts.list.useQuery();
  const { data: stages } = trpc.pipeline.list.useQuery();
  // Calcular métricas
  const totalContacts = contacts?.length || 0;
  const totalMessages = 156; // Mock data - será implementado quando tivermos endpoint de listagem
  const activeContacts = contacts?.filter(c => c.stageId !== null)?.length || 0;
  const conversionRate = totalContacts > 0 ? ((activeContacts / totalContacts) * 100).toFixed(1) : 0;

  // Dados para gráfico de funil (contatos por etapa)
  const funnelData = stages?.map(stage => ({
    name: stage.name,
    value: contacts?.filter(c => c.stageId === stage.id)?.length || 0,
    fill: stage.color || "#3b82f6"
  })) || [];

  // Dados para gráfico de linha (mensagens por dia - últimos 7 dias)
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push({
        date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        messages: Math.floor(Math.random() * 50) + 10, // Mock data
      });
    }
    return days;
  };
  const messagesOverTime = getLast7Days();

  // Dados para gráfico de pizza (status dos contatos)
  const statusData = [
    { name: "Ativos", value: activeContacts, fill: "#10B981" },
    { name: "Inativos", value: totalContacts - activeContacts, fill: "#64748B" },
  ];

  // Dados para gráfico de barras (conversões por etapa)
  const conversionData = stages?.map(stage => ({
    name: stage.name.length > 10 ? stage.name.substring(0, 10) + '...' : stage.name,
    conversoes: Math.floor(Math.random() * 30) + 5, // Mock data
  })) || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral do seu CRM e métricas de desempenho
          </p>
        </div>

        {/* Cards de Métricas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Contatos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalContacts}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                +12% desde o mês passado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mensagens</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMessages}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                +8% desde o mês passado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{conversionRate}%</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                -2% desde o mês passado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contatos Ativos</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeContacts}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                +5% desde o mês passado
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Gráfico de Funil */}
          <Card>
            <CardHeader>
              <CardTitle>Funil de Vendas</CardTitle>
              <CardDescription>Distribuição de contatos por etapa</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  value: {
                    label: "Contatos",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={funnelData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      fontSize={12}
                      tickFormatter={(value) => value.length > 10 ? value.substring(0, 10) + '...' : value}
                    />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {funnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Mensagens ao Longo do Tempo */}
          <Card>
            <CardHeader>
              <CardTitle>Mensagens nos Últimos 7 Dias</CardTitle>
              <CardDescription>Volume de mensagens diárias</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  messages: {
                    label: "Mensagens",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={messagesOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={12} />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="messages" 
                      stroke="#06B6D4" 
                      strokeWidth={2}
                      dot={{ fill: '#06B6D4', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Pizza - Status dos Contatos */}
          <Card>
            <CardHeader>
              <CardTitle>Status dos Contatos</CardTitle>
              <CardDescription>Distribuição entre ativos e inativos</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  value: {
                    label: "Contatos",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Conversões por Etapa */}
          <Card>
            <CardHeader>
              <CardTitle>Conversões por Etapa</CardTitle>
              <CardDescription>Número de conversões em cada etapa do funil</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  conversoes: {
                    label: "Conversões",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={conversionData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="conversoes" fill="#1E40AF" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Acesse rapidamente as principais funcionalidades</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Link href="/contacts">
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Ver Contatos
              </Button>
            </Link>
            <Link href="/messages">
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Mensagens
              </Button>
            </Link>
            <Link href="/pipeline">
              <Button variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                Pipeline
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

