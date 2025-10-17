import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { APP_TITLE } from "@/const";
import { ArrowLeft, FileText } from "lucide-react";
import { Link } from "wouter";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <FileText className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-4xl font-bold">Termos de Uso</h1>
            <p className="text-muted-foreground">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
          </div>
        </div>

        <Card>
          <CardContent className="prose prose-slate max-w-none pt-6">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e usar o <strong>{APP_TITLE}</strong>, um produto do <strong>Studio AEDA Digital</strong>, 
                você concorda em cumprir e estar vinculado aos seguintes Termos de Uso. Se você não concordar com 
                qualquer parte destes termos, não deve usar nosso serviço.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">2. Descrição do Serviço</h2>
              <p>
                O {APP_TITLE} é uma plataforma de CRM (Customer Relationship Management) especializada em gestão de 
                contatos e comunicação via WhatsApp. O serviço inclui:
              </p>
              <ul>
                <li>Gestão de contatos e leads</li>
                <li>Pipeline Kanban visual para funil de vendas</li>
                <li>Integração com WhatsApp Business API</li>
                <li>Automações de mensagens</li>
                <li>Agentes de IA para atendimento</li>
                <li>Relatórios e métricas de desempenho</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">3. Cadastro e Conta</h2>
              <p>
                Para usar o {APP_TITLE}, você deve:
              </p>
              <ul>
                <li>Ter pelo menos 18 anos de idade</li>
                <li>Fornecer informações verdadeiras, precisas e completas</li>
                <li>Manter suas credenciais de acesso em sigilo</li>
                <li>Notificar-nos imediatamente sobre qualquer uso não autorizado da sua conta</li>
                <li>Ser responsável por todas as atividades realizadas em sua conta</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">4. Uso Aceitável</h2>
              <p>Você concorda em usar o serviço apenas para fins legítimos e de acordo com estes Termos. É proibido:</p>
              <ul>
                <li><strong>Spam:</strong> Enviar mensagens não solicitadas em massa</li>
                <li><strong>Conteúdo Ilegal:</strong> Transmitir conteúdo ilegal, ofensivo, difamatório ou fraudulento</li>
                <li><strong>Violação de Direitos:</strong> Infringir direitos autorais, marcas registradas ou outros direitos de propriedade intelectual</li>
                <li><strong>Engenharia Reversa:</strong> Tentar descompilar, fazer engenharia reversa ou descobrir o código-fonte</li>
                <li><strong>Interferência:</strong> Interferir ou interromper o funcionamento do serviço</li>
                <li><strong>Acesso Não Autorizado:</strong> Tentar acessar áreas restritas do sistema</li>
                <li><strong>Revenda:</strong> Revender ou redistribuir o serviço sem autorização</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">5. Responsabilidade pelo Conteúdo</h2>
              <p>
                Você é o único responsável por todo o conteúdo que envia, armazena ou compartilha através do {APP_TITLE}, incluindo:
              </p>
              <ul>
                <li>Mensagens enviadas aos seus contatos</li>
                <li>Dados de contatos armazenados</li>
                <li>Notas e anotações</li>
                <li>Configurações de automações</li>
              </ul>
              <p>
                Você declara e garante que possui todos os direitos necessários sobre o conteúdo e que o uso desse conteúdo 
                não viola leis aplicáveis, incluindo a LGPD.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">6. Conformidade com LGPD e WhatsApp</h2>
              <p>
                Ao usar o {APP_TITLE} para armazenar dados de contatos e enviar mensagens, você declara que:
              </p>
              <ul>
                <li>Possui <strong>consentimento válido</strong> dos titulares dos dados (seus clientes)</li>
                <li>Está em conformidade com a <strong>LGPD</strong> (Lei nº 13.709/2018)</li>
                <li>Respeita os <strong>Termos de Serviço do WhatsApp</strong></li>
                <li>Não enviará spam ou mensagens não solicitadas</li>
                <li>Respeitará a privacidade e os direitos dos seus contatos</li>
              </ul>
              <p>
                <strong>O Studio AEDA Digital não se responsabiliza pelo uso inadequado do serviço que viole a LGPD ou 
                os Termos do WhatsApp.</strong>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">7. Propriedade Intelectual</h2>
              <p>
                Todo o conteúdo, funcionalidades e recursos do {APP_TITLE}, incluindo mas não limitado a texto, gráficos, 
                logos, ícones, imagens, clipes de áudio, downloads digitais e compilações de dados, são de propriedade 
                exclusiva do <strong>Studio AEDA Digital</strong> e protegidos por leis de direitos autorais, marcas registradas 
                e outras leis de propriedade intelectual.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">8. Planos e Pagamentos</h2>
              <p>
                O {APP_TITLE} pode oferecer diferentes planos de assinatura. Ao assinar um plano:
              </p>
              <ul>
                <li>Você concorda em pagar as taxas aplicáveis</li>
                <li>Os pagamentos são processados por terceiros seguros</li>
                <li>As assinaturas são renovadas automaticamente, salvo cancelamento</li>
                <li>Você pode cancelar sua assinatura a qualquer momento</li>
                <li>Reembolsos seguem nossa política de reembolso (disponível mediante solicitação)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">9. Disponibilidade do Serviço</h2>
              <p>
                Embora nos esforcemos para manter o {APP_TITLE} disponível 24/7, não garantimos que o serviço será 
                ininterrupto ou livre de erros. Podemos:
              </p>
              <ul>
                <li>Realizar manutenções programadas (com aviso prévio)</li>
                <li>Suspender o serviço temporariamente por razões técnicas</li>
                <li>Modificar ou descontinuar funcionalidades</li>
              </ul>
              <p>
                <strong>Não nos responsabilizamos por perdas decorrentes de indisponibilidade do serviço.</strong>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">10. Limitação de Responsabilidade</h2>
              <p>
                Na máxima extensão permitida por lei, o Studio AEDA Digital não será responsável por:
              </p>
              <ul>
                <li>Danos indiretos, incidentais, especiais ou consequenciais</li>
                <li>Perda de lucros, receitas, dados ou uso</li>
                <li>Interrupção de negócios</li>
                <li>Uso inadequado do serviço por terceiros</li>
                <li>Violações da LGPD ou Termos do WhatsApp cometidas por você</li>
              </ul>
              <p>
                Nossa responsabilidade total não excederá o valor pago por você nos últimos 12 meses.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">11. Suspensão e Encerramento</h2>
              <p>
                Reservamo-nos o direito de suspender ou encerrar sua conta se:
              </p>
              <ul>
                <li>Você violar estes Termos de Uso</li>
                <li>Houver atividade fraudulenta ou ilegal</li>
                <li>Houver uso abusivo do serviço (spam, sobrecarga)</li>
                <li>Você não pagar as taxas devidas</li>
              </ul>
              <p>
                Em caso de encerramento, você terá <strong>30 dias</strong> para exportar seus dados antes da exclusão permanente.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">12. Modificações dos Termos</h2>
              <p>
                Podemos modificar estes Termos de Uso a qualquer momento. Notificaremos você sobre mudanças significativas 
                por email ou aviso no sistema. O uso continuado do serviço após as alterações constitui aceitação dos novos termos.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">13. Lei Aplicável e Jurisdição</h2>
              <p>
                Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. Qualquer disputa relacionada 
                a estes termos será resolvida nos tribunais competentes do Brasil.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">14. Contato</h2>
              <p>
                Para dúvidas sobre estes Termos de Uso, entre em contato:
              </p>
              <ul>
                <li><strong>Empresa:</strong> Studio AEDA Digital</li>
                <li><strong>Email:</strong> contato@aedadigital.com.br</li>
                <li><strong>Suporte:</strong> suporte@aedadigital.com.br</li>
                <li><strong>Website:</strong> <a href="https://aedadigital.com.br" target="_blank" rel="noopener noreferrer">aedadigital.com.br</a></li>
              </ul>
            </section>

            <section className="mb-8">
              <p className="text-sm text-muted-foreground">
                <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}<br />
                <strong>Versão:</strong> 1.0
              </p>
            </section>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/login">
            <Button size="lg">
              Voltar para Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

