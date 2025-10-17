import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Link } from "wouter";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";

export default function Dashboard() {
  const { data: contacts } = trpc.contacts.list.useQuery();
  const { data: stages } = trpc.pipeline.list.useQuery();
  
  // Calcular métricas
  const totalContacts = contacts?.length || 0;
  const totalMessages = 156; // Mock data
  const activeContacts = contacts?.filter(c => c.stageId !== null)?.length || 0;
  const conversionRate = totalContacts > 0 ? ((activeContacts / totalContacts) * 100).toFixed(1) : 0;

  // Dados para gráfico de funil (formato funil real)
  const funnelData = stages?.map((stage, index) => {
    const count = contacts?.filter(c => c.stageId === stage.id)?.length || 0;
    return {
      name: stage.name,
      value: count,
      fill: stage.color || "#3b82f6",
      // Simular formato de funil com largura decrescente
      width: 100 - (index * 15)
    };
  }) || [];

  // Dados para gráfico de linha (mensagens por dia - últimos 7 dias)
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push({
        date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        messages: Math.floor(Math.random() * 50) + 10,
      });
    }
    return days;
  };
  const messagesOverTime = getLast7Days();

  // Dados para gráfico de pizza (distribuição por etapa)
  const pieData = stages?.map(stage => ({
    name: stage.name,
    value: contacts?.filter(c => c.stageId === stage.id)?.length || 0,
    fill: stage.color || "#3b82f6"
  })).filter(item => item.value > 0) || [];

  // Dados para gráfico de barras horizontais (taxa de conversão por etapa)
  const conversionByStageData = stages?.map((stage, index) => {
    const stageContacts = contacts?.filter(c => c.stageId === stage.id)?.length || 0;
    const nextStage = stages[index + 1];
    const nextStageContacts = nextStage 
      ? contacts?.filter(c => c.stageId === nextStage.id)?.length || 0 
      : 0;
    
    const rate = stageContacts > 0 && nextStageContacts > 0
      ? ((nextStageContacts / stageContacts) * 100).toFixed(0)
      : 0;
    
    return {
      name: stage.name.length > 15 ? stage.name.substring(0, 15) + '...' : stage.name,
      taxa: Number(rate),
      fill: stage.color || "#3b82f6"
    };
  }).filter(item => item.taxa > 0) || [];

  const COLORS = ['#1E40AF', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral do seu CRM e métricas de desempenho
          </p>
        </div>

        {/* Cards de Métricas */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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

        {/* Primeira linha de gráficos - Funil e Mensagens */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Gráfico de Funil - Barras Verticais */}
          <Card>
            <CardHeader>
              <CardTitle>Funil de Vendas</CardTitle>
              <CardDescription>Distribuição de contatos por etapa do pipeline</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={funnelData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '8px'
                      }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {funnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Gráfico de Linha - Mensagens ao Longo do Tempo */}
          <Card>
            <CardHeader>
              <CardTitle>Mensagens nos Últimos 7 Dias</CardTitle>
              <CardDescription>Volume de mensagens diárias</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={messagesOverTime} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="messages" 
                      stroke="#06B6D4" 
                      strokeWidth={3}
                      dot={{ fill: '#06B6D4', r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Segunda linha de gráficos - Pizza e Barras Horizontais */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Gráfico de Pizza - Distribuição por Etapa */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Etapa</CardTitle>
              <CardDescription>Proporção de contatos em cada etapa</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[350px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '8px'
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Gráfico de Barras Horizontais - Taxa de Conversão */}
          <Card>
            <CardHeader>
              <CardTitle>Taxa de Conversão por Etapa</CardTitle>
              <CardDescription>Percentual de leads que avançam para próxima etapa</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={conversionByStageData} 
                    layout="horizontal"
                    margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      type="number" 
                      tick={{ fontSize: 12 }}
                      label={{ value: 'Taxa (%)', position: 'insideBottom', offset: -10 }}
                    />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      width={90}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '8px'
                      }}
                      formatter={(value) => [`${value}%`, 'Taxa de Conversão']}
                    />
                    <Bar dataKey="taxa" radius={[0, 8, 8, 0]}>
                      {conversionByStageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Acesse rapidamente as principais funcionalidades</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Link href="/contacts">
              <Button variant="outline" size="lg">
                <Users className="h-4 w-4 mr-2" />
                Ver Contatos
              </Button>
            </Link>
            <Link href="/messages">
              <Button variant="outline" size="lg">
                <MessageSquare className="h-4 w-4 mr-2" />
                Mensagens
              </Button>
            </Link>
            <Link href="/pipeline">
              <Button variant="outline" size="lg">
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

