import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { trpc } from "@/lib/trpc";
import { Building2, MoreVertical, Plus, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function Organizations() {
  const utils = trpc.useUtils();
  const { data: organizations, isLoading } = trpc.admin.organizations.list.useQuery();

  const suspendMutation = trpc.admin.organizations.suspend.useMutation({
    onSuccess: () => {
      toast.success("Organização suspensa com sucesso");
      utils.admin.organizations.list.invalidate();
    },
    onError: (error) => {
      toast.error("Erro ao suspender: " + error.message);
    },
  });

  const activateMutation = trpc.admin.organizations.activate.useMutation({
    onSuccess: () => {
      toast.success("Organização ativada com sucesso");
      utils.admin.organizations.list.invalidate();
    },
    onError: (error) => {
      toast.error("Erro ao ativar: " + error.message);
    },
  });

  const cancelMutation = trpc.admin.organizations.cancel.useMutation({
    onSuccess: () => {
      toast.success("Organização cancelada com sucesso");
      utils.admin.organizations.list.invalidate();
    },
    onError: (error) => {
      toast.error("Erro ao cancelar: " + error.message);
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Ativa
          </Badge>
        );
      case "suspended":
        return (
          <Badge variant="default" className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            <AlertCircle className="h-3 w-3 mr-1" />
            Suspensa
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="default" className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelada
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Organizações</h1>
            <p className="text-muted-foreground">
              Gerencie os clientes que usam o KanFlow
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Organização
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{organizations?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ativas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {organizations?.filter(o => o.status === "active").length || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Suspensas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {organizations?.filter(o => o.status === "suspended").length || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Canceladas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {organizations?.filter(o => o.status === "cancelled").length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Organizations Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Lista de Organizações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Usuários</TableHead>
                  <TableHead className="text-center">Contatos</TableHead>
                  <TableHead className="text-center">WhatsApp</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organizations && organizations.length > 0 ? (
                  organizations.map((org) => (
                    <TableRow key={org.id}>
                      <TableCell className="font-medium">{org.name}</TableCell>
                      <TableCell>{org.email || "-"}</TableCell>
                      <TableCell>{getStatusBadge(org.status)}</TableCell>
                      <TableCell className="text-center">
                        {org.currentUsers} / {org.maxUsers}
                      </TableCell>
                      <TableCell className="text-center">
                        0 / {org.maxContacts}
                      </TableCell>
                      <TableCell className="text-center">
                        0 / {org.maxWhatsappNumbers}
                      </TableCell>
                      <TableCell>
                        {org.createdAt ? new Date(org.createdAt).toLocaleDateString('pt-BR') : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem>Ver Pagamentos</DropdownMenuItem>
                            {org.status === "active" && (
                              <DropdownMenuItem
                                className="text-orange-600"
                                onClick={() => suspendMutation.mutate({ id: org.id })}
                              >
                                Suspender
                              </DropdownMenuItem>
                            )}
                            {org.status === "suspended" && (
                              <DropdownMenuItem
                                className="text-green-600"
                                onClick={() => activateMutation.mutate({ id: org.id })}
                              >
                                Ativar
                              </DropdownMenuItem>
                            )}
                            {org.status !== "cancelled" && (
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => cancelMutation.mutate({ id: org.id })}
                              >
                                Cancelar
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      Nenhuma organização cadastrada ainda
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

