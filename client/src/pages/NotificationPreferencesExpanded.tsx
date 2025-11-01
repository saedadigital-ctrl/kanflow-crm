import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { Bell, Mail, Smartphone, Volume2, Clock, MessageSquare, Kanban, Users, TrendingUp } from 'lucide-react';

export default function NotificationPreferencesExpanded() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  // Queries
  const { data: preferences, isLoading } = trpc.notifications.getPreferences.useQuery();
  const updateMutation = trpc.notifications.updatePreferences.useMutation();

  // Form state
  const [formData, setFormData] = useState({
    // Geral
    enableSound: true,
    muteFrom: '',
    muteTo: '',
    
    // Tipos de notificação
    whatsappMessage: true,
    kanbanMove: true,
    contactUpdate: false,
    dealCreated: true,
    dealUpdated: true,
    automationTriggered: false,
    
    // Canais
    enableWebSocket: true,
    enableEmail: false,
    enablePush: false,
    
    // Frequência
    digestMode: false,
    digestFrequency: 'daily', // daily, weekly, never
    
    // Horários
    quietHoursEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
  });

  // Atualizar form quando preferences carregar
  useEffect(() => {
    if (preferences) {
      setFormData((prev) => ({
        ...prev,
        enableSound: preferences.enableSound ?? true,
        muteFrom: preferences.muteFrom ?? '',
        muteTo: preferences.muteTo ?? '',
        whatsappMessage: preferences.whatsappMessage ?? true,
        kanbanMove: preferences.kanbanMove ?? true,
        contactUpdate: preferences.contactUpdate ?? false,
      }));
    }
  }, [preferences]);

  const handleToggle = (field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev],
    }));
  };

  const handleChange = (field: string, value: any) => {
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

  const handleTestNotification = () => {
    toast.success('🔔 Notificação de teste enviada!', {
      description: 'Se você habilitou som, deve ter ouvido um som.',
    });
  };

  if (isLoading) {
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-slate-900">Preferências de Notificações</h1>
          </div>
          <p className="text-slate-600">Personalize completamente como você recebe notificações</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-4">
            <TabsTrigger value="general" className="text-xs sm:text-sm">Geral</TabsTrigger>
            <TabsTrigger value="types" className="text-xs sm:text-sm">Tipos</TabsTrigger>
            <TabsTrigger value="channels" className="text-xs sm:text-sm">Canais</TabsTrigger>
            <TabsTrigger value="schedule" className="text-xs sm:text-sm">Horários</TabsTrigger>
          </TabsList>

          {/* TAB 1: GERAL */}
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  Som de Notificação
                </CardTitle>
                <CardDescription>Reproduzir som ao receber notificações</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Label className="text-base">Habilitar som</Label>
                  <Switch
                    checked={formData.enableSound}
                    onCheckedChange={() => handleToggle('enableSound')}
                  />
                </div>
                {formData.enableSound && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTestNotification}
                    className="mt-4"
                  >
                    🔊 Testar Som
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Preferências Gerais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Modo Resumido</Label>
                    <p className="text-sm text-slate-600 mt-1">Receber notificações em lotes</p>
                  </div>
                  <Switch
                    checked={formData.digestMode}
                    onCheckedChange={() => handleToggle('digestMode')}
                  />
                </div>

                {formData.digestMode && (
                  <div>
                    <Label htmlFor="digestFrequency" className="text-sm">Frequência</Label>
                    <select
                      id="digestFrequency"
                      value={formData.digestFrequency}
                      onChange={(e) => handleChange('digestFrequency', e.target.value)}
                      className="mt-2 w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                    >
                      <option value="daily">Diariamente</option>
                      <option value="weekly">Semanalmente</option>
                      <option value="never">Nunca</option>
                    </select>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: TIPOS DE NOTIFICAÇÃO */}
          <TabsContent value="types" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tipos de Notificações</CardTitle>
                <CardDescription>Escolha quais tipos de notificações deseja receber</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* WhatsApp */}
                <div className="flex items-start justify-between pb-4 border-b">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <Label className="text-base font-medium">Mensagens WhatsApp</Label>
                      <p className="text-sm text-slate-600 mt-1">Notificações de novas mensagens recebidas</p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.whatsappMessage}
                    onCheckedChange={() => handleToggle('whatsappMessage')}
                  />
                </div>

                {/* Kanban */}
                <div className="flex items-start justify-between pb-4 border-b">
                  <div className="flex items-start gap-3">
                    <Kanban className="h-5 w-5 text-purple-600 mt-1" />
                    <div>
                      <Label className="text-base font-medium">Movimentação de Cards</Label>
                      <p className="text-sm text-slate-600 mt-1">Notificações ao mover cards entre colunas</p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.kanbanMove}
                    onCheckedChange={() => handleToggle('kanbanMove')}
                  />
                </div>

                {/* Contatos */}
                <div className="flex items-start justify-between pb-4 border-b">
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <Label className="text-base font-medium">Atualizações de Contatos</Label>
                      <p className="text-sm text-slate-600 mt-1">Notificações de contatos criados ou atualizados</p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.contactUpdate}
                    onCheckedChange={() => handleToggle('contactUpdate')}
                  />
                </div>

                {/* Deals */}
                <div className="flex items-start justify-between pb-4 border-b">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-emerald-600 mt-1" />
                    <div>
                      <Label className="text-base font-medium">Novos Negócios</Label>
                      <p className="text-sm text-slate-600 mt-1">Notificações quando novos negócios são criados</p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.dealCreated}
                    onCheckedChange={() => handleToggle('dealCreated')}
                  />
                </div>

                {/* Deals Updated */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-orange-600 mt-1" />
                    <div>
                      <Label className="text-base font-medium">Atualizações de Negócios</Label>
                      <p className="text-sm text-slate-600 mt-1">Notificações quando negócios são atualizados</p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.dealUpdated}
                    onCheckedChange={() => handleToggle('dealUpdated')}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: CANAIS DE ENTREGA */}
          <TabsContent value="channels" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Canais de Entrega</CardTitle>
                <CardDescription>Escolha como deseja receber notificações</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* WebSocket */}
                <div className="flex items-start justify-between pb-4 border-b">
                  <div className="flex items-start gap-3">
                    <Bell className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <Label className="text-base font-medium">Notificações em Tempo Real</Label>
                      <p className="text-sm text-slate-600 mt-1">Receber notificações instantaneamente na interface</p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.enableWebSocket}
                    onCheckedChange={() => handleToggle('enableWebSocket')}
                  />
                </div>

                {/* Email */}
                <div className="flex items-start justify-between pb-4 border-b">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-red-600 mt-1" />
                    <div>
                      <Label className="text-base font-medium">Notificações por Email</Label>
                      <p className="text-sm text-slate-600 mt-1">Receber resumos por email</p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.enableEmail}
                    onCheckedChange={() => handleToggle('enableEmail')}
                    disabled
                  />
                </div>

                {/* Push */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Smartphone className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <Label className="text-base font-medium">Notificações Push Mobile</Label>
                      <p className="text-sm text-slate-600 mt-1">Receber notificações no seu celular</p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.enablePush}
                    onCheckedChange={() => handleToggle('enablePush')}
                    disabled
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 4: HORÁRIOS */}
          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Horário de Silêncio
                </CardTitle>
                <CardDescription>Defina um período para não receber notificações</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base">Ativar horário de silêncio</Label>
                  <Switch
                    checked={formData.quietHoursEnabled}
                    onCheckedChange={() => handleToggle('quietHoursEnabled')}
                  />
                </div>

                {formData.quietHoursEnabled && (
                  <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-slate-50 rounded-lg">
                    <div>
                      <Label htmlFor="quietHoursStart" className="text-sm">De</Label>
                      <Input
                        id="quietHoursStart"
                        type="time"
                        value={formData.quietHoursStart}
                        onChange={(e) => handleChange('quietHoursStart', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="quietHoursEnd" className="text-sm">Até</Label>
                      <Input
                        id="quietHoursEnd"
                        type="time"
                        value={formData.quietHoursEnd}
                        onChange={(e) => handleChange('quietHoursEnd', e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-900">
                    💡 <strong>Dica:</strong> Durante o horário de silêncio, as notificações serão salvas e você receberá um resumo quando o período terminar.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Botões de Ação */}
        <div className="flex gap-4 mt-8">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="lg"
            className="flex-1"
          >
            {isSaving ? 'Salvando...' : '✓ Salvar Preferências'}
          </Button>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            size="lg"
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>

        {/* Info Box */}
        <div className="mt-8 p-4 bg-slate-100 rounded-lg border border-slate-300">
          <p className="text-sm text-slate-700">
            <strong>ℹ️ Informação:</strong> Suas preferências são sincronizadas em tempo real em todos os seus dispositivos. As mudanças entram em vigor imediatamente.
          </p>
        </div>
      </div>
    </div>
  );
}

