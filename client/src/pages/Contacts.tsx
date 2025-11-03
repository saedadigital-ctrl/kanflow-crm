import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Plus, Search, Mail, Phone, MoreVertical, MessageSquare, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

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
      <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 via-white to-slate-50 min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Contatos
            </h1>
            <p className="text-sm text-slate-500 mt-1">Gerencie seus leads e clientes</p>
          </div>
          <Button onClick={handleCreateContact} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Novo Contato
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por nome, email ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-slate-300 focus:border-blue-500"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600">{filteredContacts.length}</div>
              <p className="text-sm text-blue-700 mt-1">Contatos Encontrados</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600">{contacts?.length || 0}</div>
              <p className="text-sm text-green-700 mt-1">Total de Contatos</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-cyan-600">0</div>
              <p className="text-sm text-cyan-700 mt-1">Conversas Ativas</p>
            </CardContent>
          </Card>
        </div>

        {/* Contacts Table */}
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-900">Lista de Contatos</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredContacts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Nome</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Telefone</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContacts.map((contact) => (
                      <tr key={contact.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-medium text-slate-900">{contact.name}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-slate-600 text-sm">
                            <Mail className="h-4 w-4 text-cyan-600" />
                            {contact.email || "-"}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-slate-600 text-sm">
                            <Phone className="h-4 w-4 text-blue-600" />
                            {contact.phoneNumber}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-50">
                              <MessageSquare className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100">
                              <Edit2 className="h-4 w-4 text-slate-600" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-50">
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                {searchTerm ? "Nenhum contato encontrado" : "Nenhum contato cadastrado ainda"}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

