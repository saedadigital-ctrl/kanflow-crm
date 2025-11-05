import { useAuth } from "@/_core/hooks/useAuth";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, LogOut, Settings, User } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img
            src="/logo-kanflow-crm-icon.png"
            alt="KanFlow CRM"
            className="h-8 w-8"
          />
          <span className="hidden sm:inline font-bold text-lg text-primary">
            KanFlow CRM
          </span>
        </Link>

        {/* Desktop Navigation */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
            <Link href="/contacts">
              <Button variant="ghost" size="sm">
                Contatos
              </Button>
            </Link>
            <Link href="/pipeline">
              <Button variant="ghost" size="sm">
                Pipeline
              </Button>
            </Link>
            <Link href="/conversations">
              <Button variant="ghost" size="sm">
                Conversas
              </Button>
            </Link>
            <Link href="/billing">
              <Button variant="ghost" size="sm">
                Billing
              </Button>
            </Link>
          </nav>
        )}

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
                      {user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.name || "Usuário"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                      <Settings className="h-4 w-4" />
                      <span>Configurações</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                      <User className="h-4 w-4" />
                      <span>Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => logout()}
                    className="text-destructive focus:text-destructive flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </>
          ) : (
            <Button asChild size="sm">
              <a href={getLoginUrl()}>Entrar</a>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isAuthenticated && mobileMenuOpen && (
        <nav className="md:hidden border-t border-border bg-background">
          <div className="container py-4 space-y-2">
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full justify-start">
                Dashboard
              </Button>
            </Link>
            <Link href="/contacts">
              <Button variant="ghost" className="w-full justify-start">
                Contatos
              </Button>
            </Link>
            <Link href="/pipeline">
              <Button variant="ghost" className="w-full justify-start">
                Pipeline
              </Button>
            </Link>
            <Link href="/conversations">
              <Button variant="ghost" className="w-full justify-start">
                Conversas
              </Button>
            </Link>
            <Link href="/billing">
              <Button variant="ghost" className="w-full justify-start">
                Billing
              </Button>
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

