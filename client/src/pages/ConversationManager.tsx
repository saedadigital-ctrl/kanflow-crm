import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Search,
  Filter,
  Menu,
  Moon,
  Clock,
  CheckCircle2,
  Inbox,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { ConversationKanban, type Conversation } from "@/components/ConversationKanban";

// Dados mockados baseados na imagem de referência
const mockConversations: Conversation[] = [
  // New Conversations
  {
    id: "1",
    name: "John Smith",
    phoneNumber: "+1 (234) 507-9901",
    lastMessage: "Can we schedule a meeting?",
    timestamp: "2m",
    unreadCount: 1,
    status: "new",
    type: "individual",
  },
  {
    id: "2",
    name: "Emma Johnson",
    phoneNumber: "+1 (345) 676-9012",
    lastMessage: "Thank you!",
    timestamp: "1h",
    unreadCount: 1,
    status: "new",
    type: "individual",
  },
  {
    id: "3",
    name: "Michael Williams",
    phoneNumber: "+1 (456) 759-0126",
    lastMessage: "Is the item still available?",
    timestamp: "3h",
    unreadCount: 0,
    status: "new",
    type: "individual",
  },
  {
    id: "4",
    name: "3 group 3",
    phoneNumber: "+1 (837) 654-3210",
    lastMessage: "We'll be there.",
    timestamp: "Yesterday",
    unreadCount: 0,
    status: "new",
    type: "group",
  },

  // In Progress
  {
    id: "5",
    name: "Daniel Brown",
    phoneNumber: "+1 (334) 507-6601",
    lastMessage: "I'll check on that for you",
    timestamp: "10m",
    unreadCount: 1,
    status: "in_progress",
    type: "individual",
  },
  {
    id: "6",
    name: "Sarah Davis",
    phoneNumber: "+1 (875) 648-2109",
    lastMessage: "The order has been shipped",
    timestamp: "30m",
    unreadCount: 0,
    status: "in_progress",
    type: "individual",
  },
  {
    id: "7",
    name: "David Wilson",
    phoneNumber: "+1 (587) 690-1234",
    lastMessage: "Do you need any assistance?",
    timestamp: "1h",
    unreadCount: 0,
    status: "in_progress",
    type: "individual",
  },
  {
    id: "8",
    name: "2 group",
    phoneNumber: "+1 (921) 654-9370",
    lastMessage: "Welcome to the group!",
    timestamp: "",
    unreadCount: 0,
    status: "in_progress",
    type: "group",
  },

  // Waiting Response
  {
    id: "9",
    name: "James Anderson",
    phoneNumber: "+1 (345) 678-8012",
    lastMessage: "Please send me the details",
    timestamp: "2h",
    unreadCount: 0,
    status: "waiting",
    type: "individual",
  },
  {
    id: "10",
    name: "Jessica Martinez",
    phoneNumber: "+1 (768) 432-1098",
    lastMessage: "Let me know when you free",
    timestamp: "3h",
    unreadCount: 0,
    status: "waiting",
    type: "individual",
  },
  {
    id: "11",
    name: "Christopher Lee",
    phoneNumber: "+1 (715) 546-7890",
    lastMessage: "Are you available for a call",
    timestamp: "8h",
    unreadCount: 0,
    status: "waiting",
    type: "individual",
  },
  {
    id: "12",
    name: "Let's follow up next week",
    phoneNumber: "",
    lastMessage: "Let's follow up next week",
    timestamp: "6h",
    unreadCount: 1,
    status: "waiting",
    type: "individual",
  },

  // Resolved
  {
    id: "13",
    name: "Olivia Taylor",
    phoneNumber: "+1 (875) 601-2349",
    lastMessage: "It was great working with...",
    timestamp: "11 ray",
    unreadCount: 0,
    status: "resolved",
    type: "individual",
  },
  {
    id: "14",
    name: "Matthew Harris",
    phoneNumber: "+1 (4327 (08-8755",
    lastMessage: "Ill review the document.",
    timestamp: "Monday",
    unreadCount: 0,
    status: "resolved",
    type: "individual",
  },
  {
    id: "15",
    name: "Amanda Clark",
    phoneNumber: "+1 (869) 123-4867",
    lastMessage: "See you at the meeting",
    timestamp: "Monday",
    unreadCount: 0,
    status: "resolved",
    type: "individual",
  },
  {
    id: "16",
    name: "Brian Moore",
    phoneNumber: "+1 (610- 967-6643",
    lastMessage: "The issue has been resolved",
    timestamp: "",
    unreadCount: 0,
    status: "resolved",
    type: "individual",
  },
];

export default function ConversationManager() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "waiting" | "resolved" | "archived">("all");

  // Calcular estatísticas
  const stats = {
    active: conversations.filter((c) => c.status === "new" || c.status === "in_progress").length,
    activeTotal: conversations.filter((c) => c.status === "new" || c.status === "in_progress").length,
    awaiting: conversations.filter((c) => c.status === "waiting").length,
    awaitingTotal: conversations.filter((c) => c.status === "waiting").length,
    resolved: conversations.filter((c) => c.status === "resolved").length,
    resolvedTotal: conversations.filter((c) => c.status === "resolved").length,
    unread: conversations.reduce((sum, c) => sum + c.unreadCount, 0),
  };

  // Filtrar conversas
  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.phoneNumber.includes(searchTerm);

    let matchesFilter = true;
    if (activeFilter === "active") {
      matchesFilter = conv.status === "new" || conv.status === "in_progress";
    } else if (activeFilter === "waiting") {
      matchesFilter = conv.status === "waiting";
    } else if (activeFilter === "resolved") {
      matchesFilter = conv.status === "resolved";
    }

    return matchesSearch && matchesFilter;
  });

  // Handler para mudança de status via drag-and-drop
  const handleStatusChange = (conversationId: string, newStatus: Conversation["status"]) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId ? { ...conv, status: newStatus } : conv
      )
    );
  };

  return (
    <DashboardLayout>
      {/* Header Azul */}
      <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-6 w-6" />
            <span className="text-xl font-bold">KanFlow CRM</span>
          </div>
          <span className="text-lg">Kanblow Con:</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-blue-100 border-0 text-gray-900 placeholder:text-gray-500"
            />
          </div>
          <Button variant="outline" className="bg-blue-500 border-blue-400 text-white hover:bg-blue-400">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-blue-500">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="container max-w-[1600px] mx-auto py-8 px-6">
        <div className="space-y-6">
          {/* Título */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Whatsapp Conversation Manager</h1>

            {/* Filtros de Tabs */}
            <div className="flex items-center gap-2">
              <Button
                variant={activeFilter === "all" ? "default" : "outline"}
                onClick={() => setActiveFilter("all")}
                className={activeFilter === "all" ? "bg-blue-600" : ""}
              >
                All
              </Button>
              <Button
                variant={activeFilter === "active" ? "default" : "outline"}
                onClick={() => setActiveFilter("active")}
                className={activeFilter === "active" ? "bg-blue-600" : ""}
              >
                Active
              </Button>
              <Button
                variant={activeFilter === "waiting" ? "default" : "outline"}
                onClick={() => setActiveFilter("waiting")}
                className={activeFilter === "waiting" ? "bg-blue-600" : ""}
              >
                Waiting
              </Button>
              <Button
                variant={activeFilter === "resolved" ? "default" : "outline"}
                onClick={() => setActiveFilter("resolved")}
                className={activeFilter === "resolved" ? "bg-blue-600" : ""}
              >
                Resolved
              </Button>
              <Button
                variant={activeFilter === "archived" ? "default" : "outline"}
                onClick={() => setActiveFilter("archived")}
                className={activeFilter === "archived" ? "bg-blue-600" : ""}
              >
                Archived
              </Button>
              <Button variant="ghost" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-blue-600">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Moon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Active Conversations</p>
                      <p className="text-xs text-gray-500">{stats.activeTotal}</p>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">{stats.active}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-100 rounded-full">
                      <Clock className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Awaiting Response</p>
                      <p className="text-xs text-gray-500">{stats.awaitingTotal}</p>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-orange-600">{stats.awaiting}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-600">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-100 rounded-full">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Resolved</p>
                      <p className="text-xs text-gray-500">{stats.resolvedTotal}</p>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-cyan-600">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-cyan-100 rounded-full">
                      <Inbox className="h-6 w-6 text-cyan-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Unread</p>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-cyan-600">{stats.unread}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Kanban Board */}
          <ConversationKanban
            conversations={filteredConversations}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

