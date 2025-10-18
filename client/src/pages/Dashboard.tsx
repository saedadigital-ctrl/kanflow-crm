import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SalesFunnel } from "@/components/SalesFunnel";
import { DistributionChart } from "@/components/DistributionChart";
import { ArrowUpRight } from "lucide-react";

export default function Dashboard() {
  // Dados mockados baseados na imagem de referência
  const metrics = [
    {
      title: "Total Contatos",
      value: "1,207",
      change: "+10.2%",
      positive: true,
    },
    {
      title: "Mensagens",
      value: "3,456",
      change: "+2.5%",
      positive: true,
    },
    {
      title: "Taxa Conversão",
      value: "32,5%",
      change: "+4.1%",
      positive: true,
    },
    {
      title: "Contatos Ativos",
      value: "803",
      change: "+0.8%",
      positive: true,
    },
  ];

  // Dados do funil de vendas
  const funnelData = [
    { name: "Novo Lead", value: 100, percentage: 21 },
    { name: "Contato Inicial", value: 80, percentage: 24 },
    { name: "Negociação", value: 60, percentage: 25 },
  ];

  // Dados da distribuição (gráfico de rosca)
  const distributionData = [
    { name: "Novo Lead", value: 21, color: "#1E40AF" },
    { name: "Contato Inicial", value: 24, color: "#06B6D4" },
    { name: "Negociação", value: 25, color: "#3B82F6" },
    { name: "Fechado", value: 30, color: "#10B981" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>

        {/* Cards de Métricas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {metric.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div className="text-3xl font-bold">{metric.value}</div>
                  <div
                    className={`flex items-center text-sm font-semibold ${
                      metric.positive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {metric.positive && <ArrowUpRight className="h-4 w-4 mr-1" />}
                    {metric.change}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Gráficos */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Funil de Vendas */}
          <SalesFunnel data={funnelData} />

          {/* Distribuição */}
          <DistributionChart data={distributionData} title="Distribuição" />
        </div>
      </div>
    </DashboardLayout>
  );
}

