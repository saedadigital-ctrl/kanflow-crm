import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { 
  Building2, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  MoreVertical,
  Play,
  Pause,
  Ban
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Organizations() {
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    type: "suspend" | "activate" | "cancel" | null;
    reason: string;
  }>({
    open: false,
    type: null,
    reason: "",
  });

  const { data: organizations, isPending, refetch } = trpc.admin.organizations.list.useQuery({
    limit: 100,
    offset: 0,
  });

  const suspendMutation = trpc.admin.organizations.suspend.useMutation({
    onSuccess: () => {
      toast.success("Organização suspensa com sucesso!");
      refetch();
      closeActionDialog();
    },
    onError: (error) => {
      toast.error(`Erro ao suspender: ${error.message}`);
    },
  });

  const activateMutation = trpc.admin.organizations.activate.useMutation({
    onSuccess: () => {
      toast.success("Organização ativada com sucesso!");
      refetch();
      closeActionDialog();
    },
    onError: (error) => {
      toast.error(`Erro ao ativar: ${error.message}`);
    },
  });

  const cancelMutation = trpc.admin.organizations.cancel.useMutation({
    onSuccess: () => {
      toast.success("Organização cancelada com sucesso!");
      refetch();
      closeActionDialog();
    },
    onError: (error) => {
      toast.error(`Erro ao cancelar: ${error.message}`);
    },
  });

  const openActionDialog = (org: any, type: "suspend" | "activate" | "cancel") => {
    setSelectedOrg(org);
    setActionDialog({ open: true, type, reason: "" });
  };

  const closeActionDialog = () => {
    setActionDialog({ open: false, type: null, reason: "" });
    setSelectedOrg(null);
  };

  const handleAction = () => {
    if (!selectedOrg) return;

    if (actionDialog.type === "suspend") {
      if (!actionDialog.reason.trim()) {
        toast.error("Por favor, informe o motivo da suspensão");
        return;
      }
      suspendMutation.mutate({
        organizationId: selectedOrg.id,
        reason: actionDialog.reason,
      });
    } else if (actionDialog.type === "activate") {
      activateMutation.mutate({
        organizationId: selectedOrg.id,
      });
    } else if (actionDialog.type === "cancel") {
      if (!actionDialog.reason.trim()) {
        toast.error("Por favor, informe o motivo do cancelamento");
        return;
      }
      cancelMutation.mutate({
        organizationId: selectedOrg.id,
        reason: actionDialog.reason,
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Ativo
          </Badge>
        );
      case "suspended":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            <AlertCircle className="h-3 w-3 mr-1" />
            Suspenso
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelado
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const activeCount = organizations?.filter(o => o.status === "active").length || 0;
  const suspendedCount = organizations?.filter(o => o.status === "suspended").length || 0;
  const cancelledCount = organizations?.filter(o => o.status === "cancelled").length || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gerenciar Clientes</h1>
            <p className="text-muted-foreground mt-1">
              Visualize e gerencie todas as organizações cadastradas
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
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
              <div className="text-2xl font-bold text-green-600">{activeCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Suspensas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{suspendedCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Canceladas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{cancelledCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Organizations Table */}
        <Card>
          <CardHeader>
            <CardTitle>Organizações</CardTitle>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : organizations && organizations.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Usuários</TableHead>
                    <TableHead>Contatos</TableHead>
                    <TableHead>WhatsApp</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {organizations.map((org) => (
                    <TableRow key={org.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {org.name}
                        </div>
                      </TableCell>
                      <TableCell>{org.email || "-"}</TableCell>
                      <TableCell>{getStatusBadge(org.status)}</TableCell>
                      <TableCell>
                        {org.currentUsers} / {org.maxUsers}
                      </TableCell>
                      <TableCell>
                        {org.currentContacts || 0} / {org.maxContacts}
                      </TableCell>
                      <TableCell>
                        0 / {org.maxWhatsappNumbers}
                      </TableCell>
                      <TableCell>
                        {new Date(org.createdAt).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {org.status === "active" && (
                              <DropdownMenuItem
                                onClick={() => openActionDialog(org, "suspend")}
                                className="text-orange-600"
                              >
                                <Pause className="h-4 w-4 mr-2" />
                                Suspender
                              </DropdownMenuItem>
                            )}
                            {org.status === "suspended" && (
                              <DropdownMenuItem
                                onClick={() => openActionDialog(org, "activate")}
                                className="text-green-600"
                              >
                                <Play className="h-4 w-4 mr-2" />
                                Ativar
                              </DropdownMenuItem>
                            )}
                            {org.status !== "cancelled" && (
                              <DropdownMenuItem
                                onClick={() => openActionDialog(org, "cancel")}
                                className="text-red-600"
                              >
                                <Ban className="h-4 w-4 mr-2" />
                                Cancelar
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma organização encontrada
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Dialog */}
        <Dialog open={actionDialog.open} onOpenChange={closeActionDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {actionDialog.type === "suspend" && "Suspender Organização"}
                {actionDialog.type === "activate" && "Ativar Organização"}
                {actionDialog.type === "cancel" && "Cancelar Organização"}
              </DialogTitle>
              <DialogDescription>
                {actionDialog.type === "suspend" &&
                  "A organização será suspensa e perderá acesso ao sistema."}
                {actionDialog.type === "activate" &&
                  "A organização será reativada e poderá acessar o sistema novamente."}
                {actionDialog.type === "cancel" &&
                  "A organização será cancelada permanentemente. Esta ação não pode ser desfeita."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Organização</Label>
                <Input value={selectedOrg?.name || ""} disabled />
              </div>

              {(actionDialog.type === "suspend" || actionDialog.type === "cancel") && (
                <div className="space-y-2">
                  <Label>Motivo *</Label>
                  <Textarea
                    placeholder="Informe o motivo da ação..."
                    value={actionDialog.reason}
                    onChange={(e) =>
                      setActionDialog({ ...actionDialog, reason: e.target.value })
                    }
                    rows={3}
                  />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={closeActionDialog}>
                Cancelar
              </Button>
              <Button
                onClick={handleAction}
                disabled={
                  suspendMutation.isPending ||
                  activateMutation.isPending ||
                  cancelMutation.isPending
                }
                variant={actionDialog.type === "cancel" ? "destructive" : "default"}
              >
                {(suspendMutation.isPending ||
                  activateMutation.isPending ||
                  cancelMutation.isPending) && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                )}
                Confirmar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

