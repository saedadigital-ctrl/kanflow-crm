import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { 
  MessageCircle, 
  TrendingUp, 
  Zap, 
  Bot, 
  BarChart3, 
  Users, 
  Lock, 
  Smartphone,
  CheckCircle,
  ArrowRight,
  Star,
  Lightbulb,
  Workflow,
  Database
} from "lucide-react";

const features = [
  {
    icon: MessageCircle,
    title: "WhatsApp Integrado",
    description: "Gerencie todas as conversas do WhatsApp em um único lugar com sincronização em tempo real",
    color: "bg-green-100",
    textColor: "text-green-700"
  },
  {
    icon: TrendingUp,
    title: "Pipeline Kanban Visual",
    description: "Organize seus leads em etapas personalizáveis com drag-and-drop intuitivo",
    color: "bg-blue-100",
    textColor: "text-blue-700"
  },
  {
    icon: Zap,
    title: "Automações Inteligentes",
    description: "Crie workflows automáticos para economizar tempo e aumentar produtividade",
    color: "bg-yellow-100",
    textColor: "text-yellow-700"
  },
  {
    icon: Bot,
    title: "Agentes de IA",
    description: "IA que qualifica leads, sugere respostas e analisa conversas automaticamente",
    color: "bg-purple-100",
    textColor: "text-purple-700"
  },
  {
    icon: BarChart3,
    title: "Analytics Avançado",
    description: "Dashboards com métricas em tempo real, gráficos e relatórios customizáveis",
    color: "bg-indigo-100",
    textColor: "text-indigo-700"
  },
  {
    icon: Users,
    title: "Gestão de Equipe",
    description: "Gerencie usuários, roles, permissões e atribua contatos com facilidade",
    color: "bg-pink-100",
    textColor: "text-pink-700"
  },
  {
    icon: Lock,
    title: "100% Seguro",
    description: "LGPD compliant, criptografia end-to-end, backup automático e auditoria completa",
    color: "bg-red-100",
    textColor: "text-red-700"
  },
  {
    icon: Smartphone,
    title: "App Mobile",
    description: "Acesse seu CRM em qualquer lugar com app iOS e Android nativo",
    color: "bg-cyan-100",
    textColor: "text-cyan-700"
  }
];

const stats = [
  { label: "Funcionalidades", value: "300+" },
  { label: "Módulos", value: "15" },
  { label: "Testes", value: "68+" },
  { label: "Uptime", value: "99.9%" }
];

const plans = [
  {
    name: "Free",
    price: "R$ 0",
    description: "Perfeito para começar",
    features: ["Até 100 contatos", "1 usuário", "Funcionalidades básicas", "Suporte por email"],
    highlighted: false
  },
  {
    name: "Pro",
    price: "R$ 99",
    period: "/mês",
    description: "Para equipes em crescimento",
    features: ["Até 10.000 contatos", "5 usuários", "Todas as funcionalidades", "Suporte prioritário", "Automações avançadas"],
    highlighted: true
  },
  {
    name: "Enterprise",
    price: "R$ 499+",
    period: "/mês",
    description: "Solução completa",
    features: ["Contatos ilimitados", "Usuários ilimitados", "Todas as funcionalidades", "Suporte 24/7", "Customizações", "SLA garantido"],
    highlighted: false
  }
];

export default function LandingPageShowcase() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={APP_LOGO} alt={APP_TITLE} className="h-12 w-12 rounded-lg shadow-md" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">{APP_TITLE}</span>
              <span className="text-xs text-blue-600 font-semibold">Fluxo Inteligente de Vendas</span>
            </div>
          </div>
          <Button onClick={() => window.location.href = getLoginUrl()}>
            Entrar
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-6">
          <div className="flex justify-center mb-6">
            <img src={APP_LOGO} alt={APP_TITLE} className="h-24 w-24 rounded-xl shadow-lg" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900">
            Ganhe tempo em cada etapa do seu funil
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Integre seus canais de comunicação, automatize processos e acelere seu crescimento. Organize leads, qualifique com IA e feche mais negócios.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => window.location.href = getLoginUrl()}>
              Ativar meu funil <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Link href="/dev-login">
              <Button size="lg" variant="outline" asChild>
                <span>Ver Demo</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Hero Images Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <img src="/hero-crm-dashboard.png" alt="CRM Dashboard" className="rounded-lg shadow-2xl w-full" />
          </div>
          <div>
            <img src="/automation-workflow.png" alt="Automation Workflow" className="rounded-lg shadow-2xl w-full" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold">{stat.value}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Funcionalidades que Vendem</h2>
          <p className="text-xl text-gray-600">Tudo que você precisa para organizar seu funil e aumentar conversões</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className={`h-6 w-6 ${feature.textColor}`} />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Modules Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">15 Módulos Integrados</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Workflow className="h-5 w-5 text-blue-600" />
                  Gestão de Contatos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-gray-600">✓ CRUD completo</p>
                <p className="text-sm text-gray-600">✓ Campos customizáveis</p>
                <p className="text-sm text-gray-600">✓ Importação/Exportação</p>
                <p className="text-sm text-gray-600">✓ Histórico de interações</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Pipeline e Vendas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-gray-600">✓ Kanban visual</p>
                <p className="text-sm text-gray-600">✓ Stages customizáveis</p>
                <p className="text-sm text-gray-600">✓ Gráficos de funil</p>
                <p className="text-sm text-gray-600">✓ Previsão de receita</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  Automações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-gray-600">✓ Workflows visuais</p>
                <p className="text-sm text-gray-600">✓ 30+ triggers</p>
                <p className="text-sm text-gray-600">✓ Agendamento</p>
                <p className="text-sm text-gray-600">✓ Condições avançadas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-purple-600" />
                  IA Inteligente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-gray-600">✓ Qualificação de leads</p>
                <p className="text-sm text-gray-600">✓ Sugestão de respostas</p>
                <p className="text-sm text-gray-600">✓ Análise de sentimento</p>
                <p className="text-sm text-gray-600">✓ Previsões</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-indigo-600" />
                  Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-gray-600">✓ Dashboards em tempo real</p>
                <p className="text-sm text-gray-600">✓ 20+ gráficos</p>
                <p className="text-sm text-gray-600">✓ Relatórios customizáveis</p>
                <p className="text-sm text-gray-600">✓ Exportação de dados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                  WhatsApp
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-gray-600">✓ Sincronização em tempo real</p>
                <p className="text-sm text-gray-600">✓ Gerenciamento de grupos</p>
                <p className="text-sm text-gray-600">✓ Múltiplos formatos</p>
                <p className="text-sm text-gray-600">✓ Offline queue</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Planos Simples e Transparentes</h2>
          <p className="text-xl text-gray-600">Escolha o plano que melhor se adequa ao seu negócio</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <Card key={i} className={plan.highlighted ? "border-2 border-blue-600 shadow-xl" : ""}>
              <CardHeader>
                {plan.highlighted && (
                  <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold w-fit mb-4">
                    Mais Popular
                  </div>
                )}
                <CardTitle>{plan.name}</CardTitle>
                <div className="text-3xl font-bold mt-2">
                  {plan.price}
                  {plan.period && <span className="text-lg text-gray-600">{plan.period}</span>}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {plan.features.map((feature, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full" 
                  variant={plan.highlighted ? "default" : "outline"}
                  onClick={() => window.location.href = getLoginUrl()}
                >
                  Começar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Team Collaboration Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Trabalhe em Equipe com Eficiência</h2>
            <p className="text-lg text-gray-600 mb-6">
              Colabore com sua equipe em tempo real, compartilhe informacoes de contatos e acompanhe o progresso de cada negocio. O KanFlow foi projetado para equipes que querem crescer juntas.
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Permissoes granulares por usuario</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Historico de atividades e auditoria</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Notificacoes em tempo real</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Integracao com ferramentas populares</span>
              </li>
            </ul>
          </div>
          <div>
            <img src="/team-collaboration.png" alt="Team Collaboration" className="rounded-lg shadow-2xl w-full" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Pronto para Transformar Suas Vendas?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Comece agora com o plano Free e escale conforme crescer
          </p>
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-blue-50"
            onClick={() => window.location.href = getLoginUrl()}
          >
            Criar Conta Grátis
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <img src={APP_LOGO} alt={APP_TITLE} className="h-10 w-10 rounded-lg" />
            <span className="text-white font-bold text-lg">{APP_TITLE}</span>
          </div>
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Funcionalidades</a></li>
                <li><a href="#" className="hover:text-white">Preços</a></li>
                <li><a href="#" className="hover:text-white">Segurança</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Sobre</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contato</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Termos</a></li>
                <li><a href="#" className="hover:text-white">Privacidade</a></li>
                <li><a href="#" className="hover:text-white">LGPD</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Documentação</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">Contato</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <div className="text-center text-sm mb-4">
              <p>&copy; 2025 {APP_TITLE}. Todos os direitos reservados.</p>
            </div>
            <div className="text-center text-xs text-gray-500">
              <p>Construído pelo <a href="https://aedadigital.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Studio AEDA Digital</a></p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

