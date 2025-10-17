import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Lock, Shield, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

export default function Login() {
  const handleLogin = () => {
    window.location.href = getLoginUrl();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="space-y-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            {APP_LOGO && (
              <img src={APP_LOGO} alt={APP_TITLE} className="h-12 w-12" />
            )}
            <h1 className="text-4xl font-bold text-primary">{APP_TITLE}</h1>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900">
            CRM Profissional para WhatsApp
          </h2>
          
          <p className="text-lg text-gray-600">
            Gerencie seus contatos, automatize conversas e aumente suas vendas com o poder da IA.
          </p>

          {/* Features */}
          <div className="space-y-4 pt-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900">Pipeline Kanban Visual</h3>
                <p className="text-sm text-gray-600">Organize seus leads em etapas personalizáveis</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900">Automações Inteligentes</h3>
                <p className="text-sm text-gray-600">Responda automaticamente e economize tempo</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900">Agentes de IA</h3>
                <p className="text-sm text-gray-600">IA que qualifica leads e sugere respostas</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shield className="h-6 w-6 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900">100% Seguro e Conforme LGPD</h3>
                <p className="text-sm text-gray-600">Seus dados protegidos com criptografia</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Card */}
        <Card className="shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Bem-vindo de volta</CardTitle>
            <CardDescription>
              Faça login para acessar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleLogin}
              className="w-full h-12 text-lg"
              size="lg"
            >
              <Lock className="h-5 w-5 mr-2" />
              Entrar com Manus Auth
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Seguro e Protegido
                </span>
              </div>
            </div>

            {/* Security Badges */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="h-4 w-4 text-green-500" />
                <span>LGPD</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Lock className="h-4 w-4 text-green-500" />
                <span>Criptografado</span>
              </div>
            </div>

            {/* Footer Links */}
            <div className="text-center text-sm text-muted-foreground pt-4 space-y-2">
              <p>
                Ao continuar, você concorda com nossos{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Termos de Uso
                </Link>{" "}
                e{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Política de Privacidade
                </Link>
              </p>
              <p className="text-xs text-muted-foreground pt-2">
                Desenvolvido por{" "}
                <a
                  href="https://aedadigital.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  Studio AEDA Digital
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

