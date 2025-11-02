import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Plus, Search, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Contacts() {
  const utils = trpc.useUtils();
  const { data: contacts, isLoading } = trpc.contacts.list.useQuery();
  const [searchTerm, setSearchTerm] = useState("");

  const createContactMutation = trpc.contacts.create.useMutation({
    onSuccess: () => {
      utils.contacts.list.invalidate();
      toast.success("Contato criado com sucesso!");
    },
  });

  const filteredContacts = contacts?.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phoneNumber.includes(searchTerm)
  ) || [];

  const handleCreateContact = () => {
    createContactMutation.mutate({
      name: "Novo Contato",
      phoneNumber: "+5511999999999",
    });
  };

  if (isLoading) {
    return <DashboardLayout><div className="flex items-center justify-center min-h-screen">Carregando...</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contatos</h1>
            <p className="text-gray-600 mt-2">Gerencie seus contatos de WhatsApp</p>
          </div>
          <Button onClick={handleCreateContact} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Contato
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nome ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Contacts Grid */}
        {filteredContacts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContacts.map((contact) => (
              <Card key={contact.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-semibold text-blue-600">
                        {contact.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{contact.name}</h3>
                      <div className="space-y-1 mt-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-3 w-3" />
                          <span className="truncate">{contact.phoneNumber}</span>
                        </div>
                        {contact.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{contact.email}</span>
                          </div>
                        )}
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-3">
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {searchTerm ? "Nenhum contato encontrado" : "Nenhum contato cadastrado ainda"}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

