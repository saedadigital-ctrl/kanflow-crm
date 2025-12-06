import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Bot,
  Zap,
  Shield,
  FileText,
  MessageCircle,
} from "lucide-react";
import { APP_LOGO, APP_TITLE } from "@/const";

interface NavItem {
  icon: ReactNode;
  label: string;
  path: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { icon: <BarChart3 className="h-5 w-5" />, label: "Dashboard", path: "/dashboard" },
  { icon: <MessageSquare className="h-5 w-5" />, label: "Leads", path: "/pipeline" },
  { icon: <MessageCircle className="h-5 w-5" />, label: "Conversas", path: "/conversations" },
  { icon: <MessageSquare className="h-5 w-5" />, label: "Chats", path: "/chats" },
  { icon: <Users className="h-5 w-5" />, label: "Contatos", path: "/contacts" },
  { icon: <MessageSquare className="h-5 w-5" />, label: "WhatsApp", path: "/whatsapp" },
  { icon: <Bot className="h-5 w-5" />, label: "Agentes IA", path: "/ai-agents" },
  { icon: <Zap className="h-5 w-5" />, label: "Automações", path: "/automations" },
  { icon: <FileText className="h-5 w-5" />, label: "Blog", path: "/blog" },
  { icon: <Shield className="h-5 w-5" />, label: "Admin", path: "/admin" },
  { icon: <Settings className="h-5 w-5" />, label: "Configurações", path: "/settings" },
];

export function DashboardLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gray-900 text-white transition-all duration-300 flex flex-col overflow-y-auto border-r border-gray-800`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-gray-900">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              {APP_LOGO && <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-8 rounded" />}
              <span className="font-bold text-sm truncate">{APP_TITLE}</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-gray-800 rounded transition-colors"
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.path;

            return (
              <Link
                key={item.label}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                {item.icon}
                {sidebarOpen && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
                {item.badge && sidebarOpen && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-3 border-t border-gray-800 space-y-2">
          {sidebarOpen && (
            <div className="px-3 py-2 text-xs text-gray-400">
              <p className="font-semibold text-white">{user?.name || "Usuário"}</p>
              <p className="text-gray-500">{user?.email || "user@example.com"}</p>
            </div>
          )}
          <Button
            onClick={handleLogout}
            variant="outline"
            className={`w-full gap-2 ${sidebarOpen ? "" : "p-2"}`}
          >
            <LogOut className="h-4 w-4" />
            {sidebarOpen && "Sair"}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;

