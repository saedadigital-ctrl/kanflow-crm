import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, FileText, Mail } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface ConsentModalProps {
  open: boolean;
  onAccept: () => void;
}

export default function ConsentModal({ open, onAccept }: ConsentModalProps) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedMarketing, setAcceptedMarketing] = useState(false);

  const acceptConsentsMutation = trpc.security.acceptConsents.useMutation({
    onSuccess: () => {
      toast.success("Consentimentos registrados com sucesso!");
      onAccept();
    },
    onError: (error) => {
      toast.error("Erro ao registrar consentimentos: " + error.message);
    },
  });

  const handleAccept = () => {
    if (!acceptedTerms || !acceptedPrivacy) {
      toast.error("Você deve aceitar os Termos de Uso e a Política de Privacidade para continuar.");
      return;
    }

    acceptConsentsMutation.mutate({
      terms: acceptedTerms,
      privacy: acceptedPrivacy,
      marketing: acceptedMarketing,
    });
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Shield className="h-6 w-6 text-primary" />
            Bem-vindo ao KanFlow
          </DialogTitle>
          <DialogDescription className="text-base">
            Antes de continuar, precisamos do seu consentimento para coletar e processar seus dados conforme a LGPD.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* What we collect */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Dados que Coletamos
            </h3>
            <ul className="text-sm text-blue-800 space-y-1 ml-6 list-disc">
              <li>Nome, email e método de login</li>
              <li>Dados de contatos (nome, telefone, email)</li>
              <li>Histórico de mensagens do WhatsApp</li>
              <li>Logs de acesso e uso do sistema</li>
            </ul>
          </div>

          {/* Why we collect */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">Finalidade</h3>
            <p className="text-sm text-green-800">
              Utilizamos seus dados exclusivamente para fornecer o serviço de CRM, incluindo gestão de contatos, 
              envio de mensagens, automações e relatórios. Seus dados <strong>não são vendidos</strong> para terceiros.
            </p>
          </div>

          {/* Your rights */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-900 mb-2">Seus Direitos (LGPD Art. 18)</h3>
            <p className="text-sm text-purple-800">
              Você tem direito a <strong>acessar, corrigir, exportar e deletar</strong> seus dados a qualquer momento. 
              Acesse <code className="bg-purple-100 px-1 rounded">/settings/privacy</code> para gerenciar seus dados.
            </p>
          </div>

          {/* Consents */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-lg">Consentimentos Necessários</h3>

            {/* Terms */}
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                className="mt-1"
              />
              <label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                Li e aceito os{" "}
                <Link href="/terms" target="_blank" className="text-primary hover:underline font-medium">
                  Termos de Uso
                </Link>{" "}
                <span className="text-red-500">*</span>
              </label>
            </div>

            {/* Privacy */}
            <div className="flex items-start space-x-3">
              <Checkbox
                id="privacy"
                checked={acceptedPrivacy}
                onCheckedChange={(checked) => setAcceptedPrivacy(checked as boolean)}
                className="mt-1"
              />
              <label htmlFor="privacy" className="text-sm leading-relaxed cursor-pointer">
                Li e aceito a{" "}
                <Link href="/privacy" target="_blank" className="text-primary hover:underline font-medium">
                  Política de Privacidade
                </Link>{" "}
                <span className="text-red-500">*</span>
              </label>
            </div>

            {/* Marketing (optional) */}
            <div className="flex items-start space-x-3">
              <Checkbox
                id="marketing"
                checked={acceptedMarketing}
                onCheckedChange={(checked) => setAcceptedMarketing(checked as boolean)}
                className="mt-1"
              />
              <label htmlFor="marketing" className="text-sm leading-relaxed cursor-pointer">
                <Mail className="h-4 w-4 inline mr-1" />
                Aceito receber emails com novidades, dicas e ofertas (opcional)
              </label>
            </div>

            <p className="text-xs text-muted-foreground">
              <span className="text-red-500">*</span> Campos obrigatórios
            </p>
          </div>

          {/* Contact */}
          <div className="text-xs text-muted-foreground border-t pt-4">
            <p>
              <strong>Controlador:</strong> Studio AEDA Digital<br />
              <strong>DPO:</strong> Adriano Castro - dpo@aedadigital.com.br<br />
              <strong>Dúvidas:</strong> contato@aedadigital.com.br
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleAccept}
            disabled={!acceptedTerms || !acceptedPrivacy || acceptConsentsMutation.isPending}
            size="lg"
            className="w-full"
          >
            {acceptConsentsMutation.isPending ? "Registrando..." : "Aceitar e Continuar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

