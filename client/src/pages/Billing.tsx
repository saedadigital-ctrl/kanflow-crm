import { useState } from "react";
import { CreditCard, Check, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { trpc } from "@/lib/trpc";

interface BillingProps {
  organizationId: string;
}

export default function Billing({ organizationId }: BillingProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Fetch plans
  const { data: plansData, isLoading: isLoadingPlans } = trpc.billing.plans.list.useQuery();
  const plans = plansData?.data || [];

  // Fetch current subscription
  const { data: subscriptionData } = trpc.billing.subscription.get.useQuery({
    organizationId,
  });
  const currentSubscription = subscriptionData?.data;

  // Fetch invoices
  const { data: invoicesData } = trpc.billing.invoices.list.useQuery({
    organizationId,
  });
  const invoices = invoicesData?.data || [];

  // Fetch payment methods
  const { data: paymentMethodsData } = trpc.billing.paymentMethods.list.useQuery({
    organizationId,
  });
  const paymentMethods = paymentMethodsData?.data || [];

  // Update plan mutation
  const updatePlanMutation = trpc.billing.subscription.updatePlan.useMutation({
    onSuccess: () => {
      alert("Plano atualizado com sucesso!");
      setSelectedPlan(null);
    },
  });

  const handleUpgradePlan = (planId: string) => {
    updatePlanMutation.mutate({
      organizationId,
      plan: planId as any,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <CreditCard className="h-8 w-8" />
          Planos e Faturamento
        </h1>
        <p className="text-muted-foreground mt-2">
          Gerencie sua assinatura e métodos de pagamento
        </p>
      </div>

      {/* Current Plan */}
      {currentSubscription && (
        <Card>
          <CardHeader>
            <CardTitle>Plano Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold capitalize">
                  {currentSubscription.plan}
                </p>
                <p className="text-sm text-muted-foreground">
                  Status: {currentSubscription.status}
                </p>
              </div>
              <Badge className="capitalize">
                {currentSubscription.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plans Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Escolha seu Plano</h2>
        {isLoadingPlans ? (
          <div className="text-center py-8">Carregando planos...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan: any) => (
              <Card
                key={plan.id}
                className={`relative ${
                  currentSubscription?.plan === plan.id
                    ? "border-blue-600 border-2"
                    : ""
                }`}
              >
                {currentSubscription?.plan === plan.id && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-blue-600">Ativo</Badge>
                  </div>
                )}

                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>
                    <span className="text-2xl font-bold">
                      ${plan.price}
                    </span>
                    <span className="text-muted-foreground">
                      /{plan.billingPeriod}
                    </span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Features */}
                  <div className="space-y-2">
                    {plan.features.map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-600 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Button */}
                  <Button
                    className="w-full"
                    variant={
                      currentSubscription?.plan === plan.id
                        ? "outline"
                        : "default"
                    }
                    disabled={
                      currentSubscription?.plan === plan.id ||
                      updatePlanMutation.isPending
                    }
                    onClick={() => handleUpgradePlan(plan.id)}
                  >
                    {updatePlanMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Atualizando...
                      </>
                    ) : currentSubscription?.plan === plan.id ? (
                      "Plano Atual"
                    ) : (
                      "Escolher Plano"
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Invoices */}
      <Card>
        <CardHeader>
          <CardTitle>Faturas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <p className="text-muted-foreground">Nenhuma fatura ainda</p>
          ) : (
            <div className="space-y-2">
              {invoices.map((invoice: any) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-3 border rounded"
                >
                  <div>
                    <p className="font-medium">
                      {invoice.currency} {(invoice.amount / 100).toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(invoice.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <Badge className="capitalize">
                    {invoice.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Métodos de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          {paymentMethods.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Nenhum método de pagamento configurado. Adicione um cartão de crédito.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-2">
              {paymentMethods.map((method: any) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-3 border rounded"
                >
                  <div>
                    <p className="font-medium capitalize">
                      {method.brand} •••• {method.last4}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Válido até {method.expiryMonth}/{method.expiryYear}
                    </p>
                  </div>
                  {method.isDefault && (
                    <Badge>Padrão</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informações de Faturamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Próxima Cobrança</label>
            <p className="text-muted-foreground">
              {currentSubscription?.currentPeriodEnd
                ? new Date(currentSubscription.currentPeriodEnd).toLocaleDateString("pt-BR")
                : "Não configurado"}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium">Email de Faturamento</label>
            <p className="text-muted-foreground">
              Será enviado para o email da sua conta
            </p>
          </div>

          <Button variant="outline" className="w-full">
            Baixar Última Fatura
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

