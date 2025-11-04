import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      toast.success("Bem-vindo de volta!", {
        description: `Você está autenticado como ${user?.name || "usuário"}`,
        duration: 3000,
      });
      setLocation("/dashboard");
    }
  }, [loading, isAuthenticated, setLocation, user]);

  const handleLogin = () => {
    const toastId = toast.loading("Redirecionando para login...");
    setTimeout(() => {
      window.location.href = getLoginUrl();
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full mx-auto p-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="flex flex-col items-center space-y-4">
            {APP_LOGO && (
              <img src={APP_LOGO} alt={APP_TITLE} className="h-16 w-16 rounded-xl" />
            )}
            <h1 className="text-3xl font-bold text-center">{APP_TITLE}</h1>
            <p className="text-muted-foreground text-center">
              Gerencie seus contatos do WhatsApp com um CRM inteligente estilo Kanban
            </p>
          </div>

          <div className="space-y-4">
            <Button
              size="lg"
              className="w-full"
              onClick={handleLogin}
            >
              Entrar na Plataforma
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-4">
              Você receberá uma notificação quando fizer login
            </p>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground text-center">
              Organize seus leads, automatize respostas e integre agentes de IA
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

