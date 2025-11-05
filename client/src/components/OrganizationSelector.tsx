import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { trpc } from "@/lib/trpc";

interface Organization {
  id: string;
  name: string;
  slug: string;
}

interface OrganizationSelectorProps {
  currentOrg?: Organization;
  onOrgChange?: (org: Organization) => void;
}

export function OrganizationSelector({
  currentOrg,
  onOrgChange,
}: OrganizationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgSlug, setNewOrgSlug] = useState("");

  // Fetch organizations
  const { data: orgsData, isLoading } = trpc.org.list.useQuery();
  const organizations = orgsData?.data || [];

  // Create organization mutation
  const createOrgMutation = trpc.org.create.useMutation({
    onSuccess: (data: any) => {
      if (data.data) {
        onOrgChange?.(data.data);
      }
      setShowCreateDialog(false);
      setNewOrgName("");
      setNewOrgSlug("");
    },
  });

  const handleCreateOrg = () => {
    if (!newOrgName || !newOrgSlug) return;

    createOrgMutation.mutate({
      name: newOrgName,
      slug: newOrgSlug,
    });
  };

  const handleSelectOrg = (org: any) => {
    onOrgChange?.(org);
    setIsOpen(false);
  };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between"
            disabled={isLoading}
          >
            <span className="truncate">
              {currentOrg?.name || "Selecione uma organização"}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Suas Organizações</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {organizations.length === 0 ? (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              Nenhuma organização
            </div>
          ) : (
            organizations.map((org: any) => (
              <DropdownMenuItem
                key={org.id}
                onClick={() => handleSelectOrg(org)}
                className={currentOrg?.id === org.id ? "bg-accent" : ""}
              >
                {org.name}
              </DropdownMenuItem>
            ))
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Nova Organização</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Create Organization Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Nova Organização</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nome</label>
              <Input
                placeholder="Minha Empresa"
                value={newOrgName}
                onChange={(e) => setNewOrgName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Slug</label>
              <Input
                placeholder="minha-empresa"
                value={newOrgSlug}
                onChange={(e) => setNewOrgSlug(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateOrg}
                disabled={!newOrgName || !newOrgSlug || createOrgMutation.isPending}
              >
                {createOrgMutation.isPending ? "Criando..." : "Criar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

