import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, Bell, User } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

// Dados mockados baseados na imagem de referência
const metrics = [
  {
    title: "Monthly Recurring Revenue (MRR)",
    value: "R$ 8.450",
    change: "+12,5%",
    positive: true,
  },
  {
    title: "Total Customers",
    value: "R$ 101.400",
    change: "+2,5%",
    positive: true,
  },
  {
    title: "Churn Rate",
    value: "8.3%",
    change: "-2,1%",
    positive: false,
  },
];

// Dados do gráfico Revenue Trend
const revenueData = [
  { month: "Jan", value: 5300 },
  { month: "Feb", value: 5600 },
  { month: "Mar", value: 5900 },
  { month: "Apr", value: 6100 },
  { month: "May", value: 6300 },
  { month: "Jun", value: 6500 },
  { month: "Jul", value: 6700 },
  { month: "Aug", value: 6900 },
  { month: "Sep", value: 7100 },
  { month: "Oct", value: 7300 },
  { month: "Nov", value: 7700 },
  { month: "Dec", value: 8450 },
];

// Upcoming Renewals
const upcomingRenewals = [
  {
    clientName: "Acme Inc.",
    renewalDate: "Feb 15, 2025",
    amount: "R$ 299",
    status: "scheduled" as const,
  },
  {
    clientName: "Tech Startup",
    renewalDate: "Feb 18, 2025",
    amount: "R$ 99",
    status: "scheduled" as const,
  },
  {
    clientName: "Digital Agency",
    renewalDate: "Feb 20, 2025",
    amount: "R$ 999",
    status: "scheduled" as const,
  },
  {
    clientName: "Consulting Firm",
    renewalDate: "Feb 22, 2025",
    amount: "R$ 1.499",
    status: "scheduled" as const,
  },
];

// Failed Payments
const failedPayments = [
  {
    clientName: "Sales Team",
    amount: "R$ 299",
    status: "failed" as const,
    action: null,
  },
  {
    clientName: "Retail Store",
    amount: "R$ 99",
    status: "failed" as const,
    action: null,
  },
  {
    clientName: "Sales Team",
    amount: "",
    status: "retry" as const,
    action: "Contact",
  },
  {
    clientName: "Retail Store",
    amount: "R$ 99",
    status: "contact" as const,
    action: null,
  },
];

export default function Billing() {
  const statusColors = {
    scheduled: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    retry: "bg-blue-100 text-blue-800",
    contact: "bg-blue-100 text-blue-800",
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-blue-600 text-white -mx-6 -mt-6 px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Billing & Reports</h1>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-white hover:bg-blue-500">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-blue-500">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="space-y-6 pt-6">
          {/* Título da Seção */}
          <h2 className="text-3xl font-bold">Billing & Revenue</h2>

          {/* Cards de Métricas */}
          <div className="grid gap-4 md:grid-cols-3">
            {metrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">{metric.title}</p>
                    <div className="flex items-end justify-between">
                      <p className="text-3xl font-bold">{metric.value}</p>
                      <div
                        className={`flex items-center text-sm font-semibold ${
                          metric.positive ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {metric.positive ? (
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 mr-1" />
                        )}
                        {metric.change}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Gráfico Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      domain={[5000, 8500]}
                      ticks={[5000, 5000, 7000, 8000]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        padding: "8px",
                      }}
                    />
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1E40AF" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#1E40AF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#1E40AF"
                      strokeWidth={3}
                      fill="url(#colorRevenue)"
                      dot={{ fill: "#1E40AF", r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Tabelas */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Upcoming Renewals */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Renewals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">
                          Client Name
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">
                          Renewal Date
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">
                          Amount
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcomingRenewals.map((renewal, index) => (
                        <tr key={index} className="border-b last:border-0">
                          <td className="py-3 px-2 text-sm">{renewal.clientName}</td>
                          <td className="py-3 px-2 text-sm">{renewal.renewalDate}</td>
                          <td className="py-3 px-2 text-sm font-semibold">{renewal.amount}</td>
                          <td className="py-3 px-2">
                            <Badge className={statusColors[renewal.status]}>
                              {renewal.status.charAt(0).toUpperCase() + renewal.status.slice(1)}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Failed Payments */}
            <Card>
              <CardHeader>
                <CardTitle>Failed Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">
                          Client Name
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">
                          Renewal Date
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">
                          Status
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {failedPayments.map((payment, index) => (
                        <tr key={index} className="border-b last:border-0">
                          <td className="py-3 px-2 text-sm">{payment.clientName}</td>
                          <td className="py-3 px-2 text-sm">{payment.amount}</td>
                          <td className="py-3 px-2">
                            <Badge className={statusColors[payment.status]}>
                              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-3 px-2">
                            {payment.action && (
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                {payment.action}
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

