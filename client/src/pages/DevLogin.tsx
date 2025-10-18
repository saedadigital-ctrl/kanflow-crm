import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_LOGO, APP_TITLE } from "@/const";
import { useLocation } from "wouter";

export default function DevLogin() {
  const [, setLocation] = useLocation();
  const [role, setRole] = useState<"admin" | "user">("admin");

  const handleDevLogin = (selectedRole: "admin" | "user") => {
    // Simular login de desenvolvimento
    const mockUser = {
      id: selectedRole === "admin" ? "dev-admin-001" : "dev-user-001",
      name: selectedRole === "admin" ? "Admin Dev" : "User Dev",
      email: `${selectedRole}@dev.local`,
      role: selectedRole,
    };

    // Salvar no localStorage para simular sessão
    localStorage.setItem("dev_user", JSON.stringify(mockUser));
    
    // Redirecionar baseado no role
    if (selectedRole === "admin") {
      setLocation("/admin");
    } else {
      setLocation("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <Card className="w-full max-w-md border-2 border-orange-500">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            {APP_LOGO && (
              <img src={APP_LOGO} alt={APP_TITLE} className="h-12 w-12" />
            )}
            <CardTitle className="text-2xl">{APP_TITLE}</CardTitle>
          </div>
          <CardDescription className="text-orange-600 font-semibold">
            🔧 MODO DE DESENVOLVIMENTO
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-orange-100 border border-orange-300 rounded-lg p-4 text-sm text-orange-800">
            <p className="font-semibold mb-2">⚠️ Atenção:</p>
            <p>Este é um login de desenvolvimento. Não use em produção!</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Escolha o tipo de usuário:</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <Button
                  variant={role === "admin" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setRole("admin")}
                >
                  👨‍💼 Admin
                </Button>
                <Button
                  variant={role === "user" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setRole("user")}
                >
                  👤 Usuário
                </Button>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={() => handleDevLogin(role)}
            >
              Entrar como {role === "admin" ? "Admin" : "Usuário"}
            </Button>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>Credenciais mockadas:</p>
            <p className="font-mono text-xs mt-1">
              {role}@dev.local
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

