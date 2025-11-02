import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, MessageCircle, TrendingUp, Users, Zap, BarChart3, Bot, Shield, ArrowRight, Star, Facebook, Instagram, Youtube } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { SEO } from "@/components/SEO";

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");

  const handleGetStarted = () => {
    setLocation("/login");
  };

  return (
    <>
      <SEO />
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header/Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                KanFlow
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition">
                Recursos
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition">
                Preços
              </a>
              <a href="#faq" className="text-gray-600 hover:text-blue-600 transition">
                FAQ
              </a>
              <Button onClick={handleGetStarted} className="bg-blue-600 hover:bg-blue-700">
                Começar Grátis
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
              🚀 Transforme WhatsApp em Vendas
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              CRM Profissional para WhatsApp com{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Automação e IA
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Gerencie todas as suas conversas do WhatsApp Business em um Kanban visual. Automatize respostas com IA, organize leads no pipeline de vendas e aumente sua taxa de conversão. Sistema completo de CRM para equipes de vendas e atendimento.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6"
              >
                Começar Grátis por 14 Dias
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <a href="/dev-login">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                  <span>Ver Demonstração</span>
                </Button>
              </a>
            </div>
            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-600">Sem cartão de crédito</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-600">Cancele quando quiser</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Mockup */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-8 shadow-2xl">
              <div className="bg-white rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Conversas Organizadas</h3>
                    <p className="text-sm text-gray-600">Kanban visual e intuitivo</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-blue-600">1.2k</div>
                    <div className="text-xs text-gray-600">Contatos</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-600">85%</div>
                    <div className="text-xs text-gray-600">Conversão</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-orange-600">3.4k</div>
                    <div className="text-xs text-gray-600">Mensagens</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Floating badges */}
            <div className="absolute -top-4 -right-4 bg-white rounded-full p-4 shadow-lg">
              <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white rounded-full p-4 shadow-lg">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold">1.000+</div>
              <div className="text-blue-200">Empresas Ativas</div>
            </div>
            <div>
              <div className="text-4xl font-bold">50k+</div>
              <div className="text-blue-200">Conversas/Dia</div>
            </div>
            <div>
              <div className="text-4xl font-bold">95%</div>
              <div className="text-blue-200">Satisfação</div>
            </div>
            <div>
              <div className="text-4xl font-bold">3x</div>
              <div className="text-blue-200">Mais Vendas</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-700 mb-4">Recursos Poderosos</Badge>
            <h2 className="text-4xl font-bold mb-4">Funcionalidades Completas de CRM para WhatsApp Business</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ferramentas profissionais que transformam seu WhatsApp em uma máquina de vendas
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: MessageCircle,
              title: "Kanban de Conversas WhatsApp",
              description: "Organize todas as conversas do WhatsApp Business em um board visual estilo Kanban. Arraste e solte leads entre etapas do funil de vendas.",
              color: "blue",
            },
            {
              icon: Bot,
              title: "Chatbot com IA para WhatsApp",
              description: "Respostas automáticas inteligentes com IA que qualificam leads, respondem dúvidas e agendam reuniões 24 horas por dia, 7 dias por semana.",
              color: "purple",
            },
            {
              icon: TrendingUp,
              title: "Funil de Vendas Completo",
              description: "Acompanhe cada lead desde o primeiro contato no WhatsApp até o fechamento da venda. Visualize taxas de conversão em cada etapa.",
              color: "green",
            },
            {
              icon: BarChart3,
              title: "Relatórios e Analytics Avançados",
              description: "Dashboards com métricas em tempo real: taxa de conversão, tempo de resposta, volume de mensagens e performance da equipe de vendas.",
              color: "orange",
            },
            {
              icon: Users,
              title: "Gestão de Equipe Multi-Usuário",
              description: "Toda sua equipe de vendas e atendimento trabalhando no mesmo sistema, com permissões personalizadas e distribuição automática de leads.",
              color: "cyan",
            },
            {
              icon: Shield,
              title: "100% Seguro (LGPD)",
              description: "Seus dados protegidos com criptografia e compliance total.",
              color: "red",
            },
          ].map((feature, index) => (
            <Card key={index} className="border-2 hover:border-blue-600 transition-all hover:shadow-lg">
              <CardHeader>
                <div className={`w-12 h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className={`h-6 w-6 text-${feature.color}-600`} />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-700 mb-4">Preços Transparentes</Badge>
            <h2 className="text-4xl font-bold mb-4">Planos para todos os tamanhos</h2>
            <p className="text-xl text-gray-600">Comece grátis. Escale quando precisar.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Plano Básico */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Básico</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R$ 99</span>
                  <span className="text-gray-600">/mês</span>
                </div>
                <CardDescription>Perfeito para começar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" variant="outline">
                  Começar Grátis
                </Button>
                <ul className="space-y-3">
                  {["3 usuários", "1.000 contatos", "1 número WhatsApp", "Kanban básico", "Suporte por email"].map(
                    (item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-600" />
                        <span>{item}</span>
                      </li>
                    )
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* Plano Pro */}
            <Card className="border-4 border-blue-600 shadow-xl relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-blue-600 text-white px-4 py-1">Mais Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R$ 299</span>
                  <span className="text-gray-600">/mês</span>
                </div>
                <CardDescription>Para equipes em crescimento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Começar Grátis</Button>
                <ul className="space-y-3">
                  {[
                    "10 usuários",
                    "5.000 contatos",
                    "3 números WhatsApp",
                    "Agentes de IA",
                    "Automações ilimitadas",
                    "Dashboards avançados",
                    "Suporte prioritário",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Plano Enterprise */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">R$ 999</span>
                  <span className="text-gray-600">/mês</span>
                </div>
                <CardDescription>Solução completa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" variant="outline">
                  Falar com Vendas
                </Button>
                <ul className="space-y-3">
                  {[
                    "Usuários ilimitados",
                    "Contatos ilimitados",
                    "10 números WhatsApp",
                    "IA personalizada",
                    "API dedicada",
                    "Onboarding premium",
                    "Suporte 24/7",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Pronto para transformar seu WhatsApp?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Junte-se a milhares de empresas que já aumentaram suas vendas com KanFlow
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Seu melhor email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white text-gray-900"
            />
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Começar Agora
            </Button>
          </div>
          <p className="text-sm text-blue-100 mt-4">14 dias grátis • Sem cartão de crédito</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">KanFlow</span>
              </div>
              <p className="text-sm">CRM Profissional para WhatsApp</p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#features" className="hover:text-white transition">
                    Recursos
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white transition">
                    Preços
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Integrações
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Sobre
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contato
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/privacy" className="hover:text-white transition">
                    Privacidade
                  </a>
                </li>
                <li>
                  <a href="/terms" className="hover:text-white transition">
                    Termos de Uso
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Redes Sociais</h3>
              <div className="flex gap-4">
                <a
                  href="https://www.facebook.com/profile.php?id=61578330103145"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition"
                  aria-label="Facebook"
                >
                  <Facebook className="h-6 w-6" />
                </a>
                <a
                  href="https://www.instagram.com/studioaedadigital/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition"
                  aria-label="Instagram"
                >
                  <Instagram className="h-6 w-6" />
                </a>
                <a
                  href="https://www.youtube.com/@studioaeda.digital"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition"
                  aria-label="YouTube"
                >
                  <Youtube className="h-6 w-6" />
                </a>
                <a
                  href="https://www.tiktok.com/@studio.aeda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition"
                  aria-label="TikTok"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>© 2025 KanFlow. Desenvolvido por <a href="https://www.instagram.com/studioaedadigital/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition">Studio AEDA Digital</a>. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}

