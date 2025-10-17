import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { Settings as SettingsIcon, Phone } from "lucide-react";

export default function Settings() {
  const { data: integrations } = trpc.whatsapp.list.useQuery();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie as integrações e configurações do sistema
          </p>
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Integração WhatsApp</h2>
              <p className="text-sm text-muted-foreground">
                Configure sua conexão com WhatsApp Business API
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Número do WhatsApp</Label>
              <Input
                id="phone"
                placeholder="+55 11 99999-9999"
                defaultValue={integrations?.[0]?.phoneNumber}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="business-id">Business Account ID</Label>
              <Input
                id="business-id"
                placeholder="ID da conta business"
                defaultValue={integrations?.[0]?.businessAccountId || ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="access-token">Access Token</Label>
              <Input
                id="access-token"
                type="password"
                placeholder="Token de acesso"
              />
            </div>
            <Button>Salvar Configurações</Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
