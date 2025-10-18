import { useState } from "react";
import { useRoute } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";

// Dados mockados baseados na imagem de referência
const mockClient = {
  id: "1",
  name: "Acme Inc.",
  email: "acme@company.com",
  status: "active" as const,
  signupDate: "Jan 15, 2025",
  nextBilling: "Feb 15, 2025",
  plan: "Pro",
  monthlyRevenue: 299,
  annualValue: 3588,
  lastPayment: "Feb 1, 2025",
  paymentStatus: "paid" as const,
  limits: {
    users: { current: 5, max: 10 },
    contacts: { current: 1250, max: 5000 },
    whatsappNumbers: { current: 2, max: 3 },
  },
};

export default function ClientDetails() {
  const [match, params] = useRoute("/admin/clients/:id");
  const [activeTab, setActiveTab] = useState("overview");

  const statusColors = {
    active: "bg-green-100 text-green-800",
    suspended: "bg-orange-100 text-orange-800",
    cancelled: "bg-red-100 text-red-800",
    trialing: "bg-blue-100 text-blue-800",
  };

  const paymentStatusColors = {
    paid: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Client Details - {mockClient.name}</h1>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Coluna Esquerda */}
              <div className="space-y-6">
                {/* Client Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Client Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Organization Name</p>
                        <p className="font-semibold">{mockClient.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Contact Email</p>
                        <p className="font-semibold">{mockClient.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <Badge className={statusColors[mockClient.status]}>
                          {mockClient.status.charAt(0).toUpperCase() + mockClient.status.slice(1)}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Signup Date</p>
                        <p className="font-semibold">{mockClient.signupDate}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-600">Next Billing</p>
                        <p className="font-semibold">{mockClient.nextBilling}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      Edit Client
                    </Button>
                    <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white">
                      Upgrade Plan
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Suspend Account
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      View Activity
                    </Button>
                    <Button variant="destructive" className="w-full justify-start">
                      Delete Client
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Coluna Direita */}
              <div className="space-y-6">
                {/* Resource Limits */}
                <Card>
                  <CardHeader>
                    <CardTitle>Resource Limits</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Users */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold">Users</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">
                            {mockClient.limits.users.current} / {mockClient.limits.users.max}
                          </span>
                          <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Progress
                        value={(mockClient.limits.users.current / mockClient.limits.users.max) * 100}
                        className="h-2"
                      />
                    </div>

                    {/* Contacts */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold">Contacts</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">
                            {mockClient.limits.contacts.current.toLocaleString()} /{" "}
                            {mockClient.limits.contacts.max.toLocaleString()}
                          </span>
                          <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Progress
                        value={(mockClient.limits.contacts.current / mockClient.limits.contacts.max) * 100}
                        className="h-2 [&>div]:bg-cyan-500"
                      />
                    </div>

                    {/* WhatsApp Numbers */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold">WhatsApp Numbers</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">
                            {mockClient.limits.whatsappNumbers.current} /{" "}
                            {mockClient.limits.whatsappNumbers.max}
                          </span>
                          <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Progress
                        value={
                          (mockClient.limits.whatsappNumbers.current /
                            mockClient.limits.whatsappNumbers.max) *
                          100
                        }
                        className="h-2 [&>div]:bg-orange-500"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Billing Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Billing Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Monthly Revenue</p>
                        <p className="text-2xl font-bold">R$ {mockClient.monthlyRevenue}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Annual Value</p>
                        <p className="text-2xl font-bold">
                          R$ {mockClient.annualValue.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Last Payment</p>
                        <p className="font-semibold">{mockClient.lastPayment}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Payment Status</p>
                        <Badge className={paymentStatusColors[mockClient.paymentStatus]}>
                          {mockClient.paymentStatus.charAt(0).toUpperCase() +
                            mockClient.paymentStatus.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <Button variant="link" className="p-0 h-auto text-blue-600">
                        Billing Summary
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">Users list will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">Billing details will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">Activity log will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

