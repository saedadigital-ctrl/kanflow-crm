import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Phone, Mail, MessageCircle } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  action: "phone" | "email" | "whatsapp";
  actionLabel?: string;
  stageId: string;
}

// Dados mockados baseados na imagem de referência
const mockLeads: Lead[] = [
  {
    id: "1",
    name: "Maria Lima",
    email: "manc@maria.com",
    action: "phone",
    actionLabel: "arredumai",
    stageId: "novo_lead",
  },
  {
    id: "2",
    name: "Pedro Almeida",
    email: "pesta@mail.com",
    action: "email",
    stageId: "contato_inicial",
  },
  {
    id: "3",
    name: "Anna Seaza",
    email: "Alenavero yeurot",
    action: "whatsapp",
    actionLabel: "1 Há 29",
    stageId: "negociacao",
  },
  {
    id: "4",
    name: "Juan Anianesa",
    email: "Paula@riavaro.oye",
    phone: "1m unte",
    action: "phone",
    stageId: "fechado",
  },
];

// Dados do gráfico Funilínguias (linha)
const funnelLineData = [
  { name: "Novo Lead", value: 10 },
  { name: "Contato Inicial", value: 15 },
  { name: "Negociação", value: 11 },
  { name: "Fechada", value: 6 },
];

// Dados do gráfico Conversões (barras)
const conversionsData = [
  { month: "Jan", value: 3.5 },
  { month: "Fev", value: 4.2 },
  { month: "Mar", value: 3.8 },
  { month: "Ain", value: 4.5 },
  { month: "Mai", value: 5.0 },
  { month: "Jun", value: 4.0 },
  { month: "Jul", value: 4.8 },
  { month: "May", value: 4.3 },
];

const stages = [
  { id: "novo_lead", name: "Novo Lead", color: "bg-blue-600" },
  { id: "contato_inicial", name: "Contato Inicial", color: "bg-blue-600" },
  { id: "negociacao", name: "Negociação", color: "bg-blue-600" },
  { id: "fechado", name: "Fechado", color: "bg-cyan-500" },
];

export default function Pipeline() {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [draggedLead, setDraggedLead] = useState<string | null>(null);

  const handleDragStart = (leadId: string) => {
    setDraggedLead(leadId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (stageId: string) => {
    if (draggedLead) {
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === draggedLead ? { ...lead, stageId } : lead
        )
      );
      setDraggedLead(null);
    }
  };

  const getLeadsByStage = (stageId: string) => {
    return leads.filter((lead) => lead.stageId === stageId);
  };

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getActionIcon = (action: "phone" | "email" | "whatsapp") => {
    switch (action) {
      case "phone":
        return <Phone className="h-4 w-4" />;
      case "email":
        return <Mail className="h-4 w-4" />;
      case "whatsapp":
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Pipeline</h1>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stages.map((stage) => {
            const stageLeads = getLeadsByStage(stage.id);

            return (
              <div
                key={stage.id}
                className="flex flex-col gap-3"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(stage.id)}
              >
                {/* Column Header */}
                <div className={`${stage.color} text-white rounded-lg p-3 text-center`}>
                  <h3 className="font-semibold">{stage.name}</h3>
                </div>

                {/* Cards */}
                <div className="flex flex-col gap-3 min-h-[200px]">
                  {stageLeads.map((lead) => (
                    <Card
                      key={lead.id}
                      draggable
                      onDragStart={() => handleDragStart(lead.id)}
                      className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-sm">
                              {getInitials(lead.name)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm truncate">
                              {lead.name}
                            </h4>
                            <p className="text-xs text-gray-600 truncate">
                              {lead.email}
                            </p>

                            <div className="flex items-center gap-2 mt-2">
                              <Badge
                                variant="outline"
                                className="text-xs flex items-center gap-1"
                              >
                                {getActionIcon(lead.action)}
                                {lead.actionLabel || lead.action}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Gráficos */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Funilínguias (Linha) */}
          <Card>
            <CardHeader>
              <CardTitle>Funilínguias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={funnelLineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11 }}
                      angle={-15}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      domain={[0, 20]}
                      ticks={[6, 11, 15, 10]}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip />
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1E40AF" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#1E40AF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#1E40AF"
                      strokeWidth={2}
                      fill="url(#colorValue)"
                      dot={{ fill: "#1E40AF", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Conversões (Barras) */}
          <Card>
            <CardHeader>
              <CardTitle>Conversões</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={conversionsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} domain={[0, 6]} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#1E40AF" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

