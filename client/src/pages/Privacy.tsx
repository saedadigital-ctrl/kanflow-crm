import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_TITLE } from "@/const";
import { ArrowLeft, Shield } from "lucide-react";
import { Link } from "wouter";

export default function Privacy() {
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
          <Shield className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-4xl font-bold">Política de Privacidade</h1>
            <p className="text-muted-foreground">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
          </div>
        </div>

        <Card>
          <CardContent className="prose prose-slate max-w-none pt-6">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">1. Identificação do Controlador</h2>
              <p>
                O <strong>{APP_TITLE}</strong> é um sistema de CRM (Customer Relationship Management) para gestão de contatos e mensagens via WhatsApp. 
                Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos seus dados pessoais, em conformidade com a 
                Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
              </p>
              <p>
                <strong>Controlador:</strong> Studio AEDA Digital<br />
                <strong>CNPJ:</strong> [A definir]<br />
                <strong>Endereço:</strong> [A definir]<br />
                <strong>Email:</strong> contato@aedadigital.com.br<br />
                <strong>DPO (Encarregado):</strong> Adriano Castro - dpo@aedadigital.com.br
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">2. Dados Pessoais Coletados</h2>
              <p>Coletamos os seguintes dados pessoais:</p>
              <ul>
                <li><strong>Dados de Cadastro:</strong> Nome completo, email, método de login</li>
                <li><strong>Dados de Contatos:</strong> Nome, número de telefone (WhatsApp), email, avatar, notas</li>
                <li><strong>Dados de Comunicação:</strong> Histórico de mensagens, data e hora de envio/recebimento</li>
                <li><strong>Dados de Navegação:</strong> Endereço IP, navegador, dispositivo, logs de acesso</li>
                <li><strong>Dados de Uso:</strong> Interações com o sistema, páginas visitadas, ações realizadas</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">3. Finalidade da Coleta</h2>
              <p>Utilizamos seus dados pessoais para as seguintes finalidades:</p>
              <ul>
                <li><strong>Gestão de CRM:</strong> Organizar e gerenciar seus contatos e leads</li>
                <li><strong>Comunicação:</strong> Enviar e receber mensagens via WhatsApp</li>
                <li><strong>Automações:</strong> Executar fluxos automatizados de atendimento</li>
                <li><strong>Análises:</strong> Gerar relatórios e métricas de desempenho</li>
                <li><strong>Segurança:</strong> Proteger sua conta e prevenir fraudes</li>
                <li><strong>Melhoria do Serviço:</strong> Aprimorar funcionalidades e experiência</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">4. Base Legal (LGPD Art. 7º)</h2>
              <p>O tratamento dos seus dados é baseado em:</p>
              <ul>
                <li><strong>Consentimento (Art. 7º, I):</strong> Você autoriza expressamente a coleta e uso dos dados ao aceitar esta política</li>
                <li><strong>Execução de Contrato (Art. 7º, V):</strong> Necessário para fornecer o serviço de CRM contratado</li>
                <li><strong>Legítimo Interesse (Art. 7º, IX):</strong> Melhoria do serviço e prevenção de fraudes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">5. Compartilhamento de Dados</h2>
              <p>Seus dados podem ser compartilhados com:</p>
              <ul>
                <li><strong>WhatsApp Business API:</strong> Para envio e recebimento de mensagens</li>
                <li><strong>Provedores de Hospedagem:</strong> Para armazenamento seguro dos dados</li>
                <li><strong>Serviços de IA:</strong> Para funcionalidades de automação e agentes inteligentes</li>
                <li><strong>Autoridades:</strong> Quando exigido por lei ou ordem judicial</li>
              </ul>
              <p><strong>Não vendemos seus dados para terceiros.</strong></p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">6. Tempo de Retenção</h2>
              <p>Mantemos seus dados pelo tempo necessário para:</p>
              <ul>
                <li><strong>Dados de Conta:</strong> Enquanto sua conta estiver ativa</li>
                <li><strong>Dados de Contatos:</strong> Até que você os delete ou solicite exclusão</li>
                <li><strong>Logs de Auditoria:</strong> 6 meses (conforme LGPD)</li>
                <li><strong>Backups:</strong> 30 dias</li>
              </ul>
              <p>Após esse período, os dados são anonimizados ou excluídos permanentemente.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">7. Medidas de Segurança</h2>
              <p>Implementamos as seguintes medidas de segurança:</p>
              <ul>
                <li><strong>Criptografia HTTPS:</strong> Todas as comunicações são criptografadas</li>
                <li><strong>Autenticação Segura:</strong> Tokens JWT com expiração</li>
                <li><strong>Controle de Acesso:</strong> Permissões baseadas em roles</li>
                <li><strong>Logs de Auditoria:</strong> Registro de todos os acessos</li>
                <li><strong>Backup Automático:</strong> Cópias de segurança diárias</li>
                <li><strong>Monitoramento:</strong> Detecção de atividades suspeitas</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">8. Seus Direitos (LGPD Art. 18)</h2>
              <p>Você tem os seguintes direitos sobre seus dados pessoais:</p>
              <ul>
                <li><strong>Confirmação e Acesso:</strong> Saber se temos seus dados e acessá-los</li>
                <li><strong>Correção:</strong> Corrigir dados incompletos, inexatos ou desatualizados</li>
                <li><strong>Anonimização ou Bloqueio:</strong> Solicitar anonimização ou bloqueio de dados desnecessários</li>
                <li><strong>Eliminação:</strong> Deletar dados tratados com seu consentimento</li>
                <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado (CSV, JSON)</li>
                <li><strong>Informação sobre Compartilhamento:</strong> Saber com quem compartilhamos seus dados</li>
                <li><strong>Revogação do Consentimento:</strong> Retirar sua autorização a qualquer momento</li>
                <li><strong>Oposição:</strong> Opor-se ao tratamento realizado sem consentimento</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">9. Como Exercer Seus Direitos</h2>
              <p>Para exercer qualquer dos direitos acima, você pode:</p>
              <ul>
                <li><strong>Portal do Titular:</strong> Acesse <code>/settings/privacy</code> no sistema</li>
                <li><strong>Email:</strong> Entre em contato com nosso DPO em [email do DPO]</li>
                <li><strong>Prazo de Resposta:</strong> Responderemos em até 15 dias úteis</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">10. Cookies</h2>
              <p>
                Utilizamos cookies essenciais para o funcionamento do sistema (autenticação, sessão). 
                Você pode gerenciar cookies nas configurações do seu navegador, mas isso pode afetar o funcionamento do sistema.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">11. Alterações nesta Política</h2>
              <p>
                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre mudanças significativas 
                por email ou aviso no sistema. A data da última atualização está no topo desta página.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">12. Contato</h2>
              <p>Para dúvidas sobre esta Política de Privacidade ou sobre o tratamento dos seus dados, entre em contato:</p>
              <ul>
                <li><strong>Email:</strong> contato@aedadigital.com.br</li>
                <li><strong>DPO:</strong> dpo@aedadigital.com.br</li>
                <li><strong>Website:</strong> <a href="https://aedadigital.com.br" target="_blank" rel="noopener noreferrer">aedadigital.com.br</a></li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">13. Autoridade Nacional de Proteção de Dados (ANPD)</h2>
              <p>
                Caso não fique satisfeito com nossas respostas, você pode entrar em contato com a ANPD:
              </p>
              <ul>
                <li><strong>Site:</strong> <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer">www.gov.br/anpd</a></li>
                <li><strong>Email:</strong> atendimento@anpd.gov.br</li>
              </ul>
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

