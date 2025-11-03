import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Lock, Shield, CheckCircle2, Mail, User, Eye, EyeOff } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");

  const handleLogin = () => {
    if (loginEmail && loginPassword) {
      // TODO: Implementar autenticação com email/senha
      console.log("Login com:", { email: loginEmail, password: loginPassword });
    }
  };

  const handleSignup = () => {
    if (signupName && signupEmail && signupPassword && signupConfirmPassword) {
      if (signupPassword !== signupConfirmPassword) {
        alert("As senhas não correspondem!");
        return;
      }
      // TODO: Implementar registro de novo usuário
      console.log("Signup com:", { name: signupName, email: signupEmail, password: signupPassword });
    }
  };

  const handleResetPassword = () => {
    if (resetEmail) {
      // TODO: Implementar envio de email para reset de senha
      console.log("Reset password para:", resetEmail);
    }
  };

  const handleMausLogin = () => {
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

        {/* Right Side - Login Card with Tabs */}
        <Card className="shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Bem-vindo</CardTitle>
            <CardDescription>
              Faça login ou crie uma conta para acessar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Criar Conta</TabsTrigger>
                <TabsTrigger value="reset">Recuperar</TabsTrigger>
              </TabsList>

              {/* Tab 1: Login */}
              <TabsContent value="login" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button 
                  onClick={handleLogin}
                  className="w-full h-12 text-lg"
                  size="lg"
                >
                  <Lock className="h-5 w-5 mr-2" />
                  Entrar
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Ou continue com
                    </span>
                  </div>
                </div>

                <Button 
                  onClick={handleMausLogin}
                  variant="outline"
                  className="w-full h-12"
                  size="lg"
                >
                  <Lock className="h-5 w-5 mr-2" />
                  Manus Auth
                </Button>
              </TabsContent>

              {/* Tab 2: Sign Up */}
              <TabsContent value="signup" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Nome Completo</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Seu Nome"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirm">Confirmar Senha</Label>
                  <div className="relative">
                    <Input
                      id="signup-confirm"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button 
                  onClick={handleSignup}
                  className="w-full h-12 text-lg"
                  size="lg"
                >
                  <User className="h-5 w-5 mr-2" />
                  Criar Conta
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Ao criar uma conta, você concorda com nossos{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Termos de Uso
                  </Link>
                </p>
              </TabsContent>

              {/* Tab 3: Reset Password */}
              <TabsContent value="reset" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Digite seu email para receber um link de recuperação de senha.
                </p>

                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
                  />
                </div>

                <Button 
                  onClick={handleResetPassword}
                  className="w-full h-12 text-lg"
                  size="lg"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Enviar Link
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Você receberá um email com instruções para redefinir sua senha.
                </p>
              </TabsContent>
            </Tabs>

            {/* Security Badges */}
            <div className="grid grid-cols-2 gap-3 pt-6 mt-6 border-t">
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

