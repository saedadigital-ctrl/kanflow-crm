import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { Settings as SettingsIcon, Phone, Info, Heart, ExternalLink } from "lucide-react";
import { APP_TITLE } from "@/const";

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

        {/* Sobre */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Info className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Sobre o {APP_TITLE}</h2>
              <p className="text-sm text-muted-foreground">
                Informações sobre o sistema
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Version */}
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium">Versão</p>
                <p className="text-sm text-muted-foreground">Versão atual do sistema</p>
              </div>
              <span className="text-sm font-mono bg-muted px-3 py-1 rounded">1.0.0</span>
            </div>

            {/* Developer */}
            <div className="py-3 border-b">
              <p className="font-medium mb-2">Desenvolvido por</p>
              <div className="flex items-center gap-2 text-sm">
                <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                <a
                  href="https://aedadigital.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-semibold flex items-center gap-1"
                >
                  Studio AEDA Digital
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Soluções digitais inovadoras para impulsionar seu negócio
              </p>
            </div>

            {/* Contact */}
            <div className="py-3">
              <p className="font-medium mb-3">Contato e Suporte</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <a href="mailto:contato@aedadigital.com.br" className="text-primary hover:underline">
                    contato@aedadigital.com.br
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Suporte:</span>
                  <a href="mailto:suporte@aedadigital.com.br" className="text-primary hover:underline">
                    suporte@aedadigital.com.br
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Website:</span>
                  <a
                    href="https://aedadigital.com.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    aedadigital.com.br
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="pt-4 border-t text-center">
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} Studio AEDA Digital. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
