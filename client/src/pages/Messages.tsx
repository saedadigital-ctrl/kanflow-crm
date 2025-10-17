import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default function Messages() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mensagens</h1>
          <p className="text-muted-foreground">
            Visualize e responda mensagens dos seus contatos
          </p>
        </div>

        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Funcionalidade de mensagens em desenvolvimento
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
