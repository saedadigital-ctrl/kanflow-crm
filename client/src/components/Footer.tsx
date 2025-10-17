import { Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-white mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          {/* Left - Copyright */}
          <div className="flex items-center gap-2">
            <span>© {currentYear} KanFlow. Todos os direitos reservados.</span>
          </div>

          {/* Center - Credits */}
          <div className="flex items-center gap-2">
            <span>Desenvolvido com</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" />
            <span>por</span>
            <a
              href="https://aedadigital.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:underline"
            >
              Studio AEDA Digital
            </a>
          </div>

          {/* Right - Links */}
          <div className="flex items-center gap-4">
            <a
              href="/privacy"
              className="hover:text-primary transition-colors"
            >
              Privacidade
            </a>
            <a
              href="/terms"
              className="hover:text-primary transition-colors"
            >
              Termos
            </a>
            <a
              href="mailto:contato@aedadigital.com.br"
              className="hover:text-primary transition-colors"
            >
              Suporte
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

