import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export default function NotificationPreferences() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  // Queries
  const { data: preferences, isLoading } = trpc.notifications.getPreferences.useQuery();
  const updateMutation = trpc.notifications.updatePreferences.useMutation();

  // Form state
  const [formData, setFormData] = useState({
    enableSound: preferences?.enableSound ?? true,
    muteFrom: preferences?.muteFrom ?? '',
    muteTo: preferences?.muteTo ?? '',
    whatsappMessage: preferences?.whatsappMessage ?? true,
    kanbanMove: preferences?.kanbanMove ?? true,
    contactUpdate: preferences?.contactUpdate ?? false,
  });

  // Atualizar form quando preferences carregar
  React.useEffect(() => {
    if (preferences) {
      setFormData({
        enableSound: preferences.enableSound ?? true,
        muteFrom: preferences.muteFrom ?? '',
        muteTo: preferences.muteTo ?? '',
        whatsappMessage: preferences.whatsappMessage ?? true,
        kanbanMove: preferences.kanbanMove ?? true,
        contactUpdate: preferences.contactUpdate ?? false,
      });
    }
  }, [preferences]);

  const handleToggle = (field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev],
    }));
  };

  const handleTimeChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateMutation.mutateAsync({
        enableSound: formData.enableSound,
        muteFrom: formData.muteFrom || null,
        muteTo: formData.muteTo || null,
        whatsappMessage: formData.whatsappMessage,
        kanbanMove: formData.kanbanMove,
        contactUpdate: formData.contactUpdate,
      });
      toast.success('Preferências salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar preferências');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <div className="container max-w-2xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Preferências de Notificações</h1>
        <p className="text-gray-600 mt-2">Personalize como você recebe notificações</p>
      </div>

      <div className="space-y-6">
        {/* Notificações Gerais */}
        <Card>
          <CardHeader>
            <CardTitle>Notificações Gerais</CardTitle>
            <CardDescription>Controle os tipos de notificações que deseja receber</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Som */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Som de Notificação</Label>
                <p className="text-sm text-gray-600 mt-1">Reproduzir som ao receber notificações</p>
              </div>
              <Switch
                checked={formData.enableSound}
                onCheckedChange={() => handleToggle('enableSound')}
              />
            </div>

            {/* Mensagens WhatsApp */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Mensagens WhatsApp</Label>
                <p className="text-sm text-gray-600 mt-1">Notificações de novas mensagens</p>
              </div>
              <Switch
                checked={formData.whatsappMessage}
                onCheckedChange={() => handleToggle('whatsappMessage')}
              />
            </div>

            {/* Movimentação Kanban */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Movimentação de Cards</Label>
                <p className="text-sm text-gray-600 mt-1">Notificações ao mover cards no Kanban</p>
              </div>
              <Switch
                checked={formData.kanbanMove}
                onCheckedChange={() => handleToggle('kanbanMove')}
              />
            </div>

            {/* Atualização de Contatos */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Atualizações de Contatos</Label>
                <p className="text-sm text-gray-600 mt-1">Notificações de contatos criados ou atualizados</p>
              </div>
              <Switch
                checked={formData.contactUpdate}
                onCheckedChange={() => handleToggle('contactUpdate')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Horário de Silêncio */}
        <Card>
          <CardHeader>
            <CardTitle>Horário de Silêncio</CardTitle>
            <CardDescription>Defina um período para não receber notificações</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="muteFrom">De</Label>
                <Input
                  id="muteFrom"
                  type="time"
                  value={formData.muteFrom}
                  onChange={(e) => handleTimeChange('muteFrom', e.target.value)}
                  placeholder="HH:MM"
                />
              </div>
              <div>
                <Label htmlFor="muteTo">Até</Label>
                <Input
                  id="muteTo"
                  type="time"
                  value={formData.muteTo}
                  onChange={(e) => handleTimeChange('muteTo', e.target.value)}
                  placeholder="HH:MM"
                />
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Deixe em branco para desabilitar o horário de silêncio
            </p>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex gap-4">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1"
          >
            {isSaving ? 'Salvando...' : 'Salvar Preferências'}
          </Button>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}

