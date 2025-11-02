import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Phone, Mail, MessageCircle, Plus, Filter, MoreVertical, Eye, EyeOff, Settings2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Pipeline() {
  const utils = trpc.useUtils();
  const { data: stages, isLoading: stagesLoading } = trpc.pipeline.list.useQuery();
  const { data: contacts, isLoading: contactsLoading } = trpc.contacts.list.useQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState("active");

  const updateContactMutation = trpc.contacts.update.useMutation({
    onSuccess: () => {
      utils.contacts.list.invalidate();
      toast.success("Contato movido com sucesso!");
    },
  });

  const isLoading = stagesLoading || contactsLoading;

  if (isLoading) {
    return <DashboardLayout><div className="flex items-center justify-center min-h-screen">Carregando...</div></DashboardLayout>;
  }

  const getContactsByStage = (stageId: string) => {
    return (contacts || []).filter(c => c.stageId === stageId);
  };

  const handleDragStart = (e: React.DragEvent, contactId: string) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("contactId", contactId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    const contactId = e.dataTransfer.getData("contactId");
    if (contactId) {
      updateContactMutation.mutate({
        id: contactId,
        stageId,
      });
    }
  };

  const filteredStages = stages?.filter(stage => {
    if (!searchTerm) return true;
    const stageContacts = getContactsByStage(stage.id);
    return stageContacts.some(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }) || [];

  const totalLeads = contacts?.length || 0;
  const totalValue = 0; // Placeholder - será implementado com dados reais

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 h-full flex flex-col">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" className="gap-2">
                  <span className="font-semibold">LEADS</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </Button>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 4H5a2 2 0 00-2 2v14a2 2 0 002 2h4m0-18v18m0-18l10 0a2 2 0 012 2v14a2 2 0 01-2 2h-10" />
                  </svg>
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Leads ativos
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-semibold">{totalLeads}</span> leads · <span className="font-semibold">R${totalValue.toLocaleString('pt-BR')}</span>
              </div>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-3 top-3 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <Input
                placeholder="Busca e filtro"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtro
            </Button>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 5v14m7-7H5" />
              </svg>
              AUTOMATIZE
            </Button>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              NOVO LEAD
            </Button>
          </div>
        </div>

        {/* Pipeline Columns */}
        <div className="overflow-x-auto flex-1 pb-4">
          <div className="flex gap-4 min-w-max h-full">
            {filteredStages.map((stage) => {
              const stageContacts = getContactsByStage(stage.id);
              const stageValue = 0; // Placeholder - será implementado com dados reais

              return (
                <div
                  key={stage.id}
                  className="flex-shrink-0 w-96 bg-white rounded-lg border border-gray-200 flex flex-col"
                >
                  {/* Stage Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: stage.color || "#3b82f6" }}
                        />
                        <h2 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                          {stage.name}
                        </h2>
                      </div>
                      <div className="text-xs text-gray-600">
                        {stageContacts.length} leads · R${stageValue.toLocaleString('pt-BR')}
                      </div>
                    </div>
                  </div>

                  {/* Contacts Container */}
                  <div
                    className="flex-1 p-4 space-y-3 overflow-y-auto"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, stage.id)}
                  >
                    {stageContacts.length > 0 ? (
                      stageContacts.map((contact) => (
                        <Card
                          key={contact.id}
                          className="cursor-move hover:shadow-md transition-all border-l-4 hover:border-opacity-100"
                          style={{ borderLeftColor: stage.color || "#3b82f6" }}
                          draggable
                          onDragStart={(e) => handleDragStart(e, contact.id)}
                        >
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-start justify-between">
                                <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1">
                                  {contact.name}
                                </h3>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-2">
                                  <MoreVertical className="h-3 w-3" />
                                </Button>
                              </div>

                              {/* Valor será exibido aqui quando implementado */}

                              <div className="space-y-1.5">
                                {contact.email && (
                                  <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <Mail className="h-3 w-3 flex-shrink-0" />
                                    <span className="truncate">{contact.email}</span>
                                  </div>
                                )}

                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                  <Phone className="h-3 w-3 flex-shrink-0" />
                                  <span className="truncate">{contact.phoneNumber}</span>
                                </div>
                              </div>

                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full mt-2 text-xs h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <MessageCircle className="h-3 w-3 mr-1" />
                                Enviar mensagem
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center w-full">
                          <p className="text-xs font-medium text-gray-500 mb-2">Adição rápida</p>
                          <Button variant="ghost" size="sm" className="text-xs text-gray-500">
                            <Plus className="h-3 w-3 mr-1" />
                            Adicionar
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

