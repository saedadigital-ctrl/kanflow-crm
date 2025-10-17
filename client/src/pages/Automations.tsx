import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Plus, Zap, Play, Pause } from "lucide-react";

export default function Automations() {
  const { data: automations, isLoading } = trpc.automations.list.useQuery();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Automações</h1>
            <p className="text-muted-foreground">
              Configure regras automáticas para seu CRM
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Automação
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid gap-4">
            {automations?.map((automation) => (
              <Card key={automation.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{automation.name}</h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        {automation.description || "Sem descrição"}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Badge variant="outline">
                          Gatilho: {automation.trigger}
                        </Badge>
                        <Badge variant="outline">
                          Ação: {automation.action}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={automation.isActive ? "default" : "secondary"}>
                      {automation.isActive ? "Ativa" : "Inativa"}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      {automation.isActive ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && automations?.length === 0 && (
          <div className="text-center py-12">
            <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Nenhuma automação configurada ainda
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
