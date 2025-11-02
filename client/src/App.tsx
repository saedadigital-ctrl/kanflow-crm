import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Redirect, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useAuth } from "./_core/hooks/useAuth";
import { useState, useEffect } from "react";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contacts";
import Pipeline from "./pages/Pipeline";
import Chats from "./pages/Chats";
import Settings from "./pages/Settings";
import DevLogin from "./pages/DevLogin";
import LandingPageShowcase from "./pages/LandingPageShowcase";
import ConversationManager from "./pages/ConversationManager";
import WhatsAppIntegration from "./pages/WhatsAppIntegration";
import AIAgents from "./pages/AIAgents";
import Automations from "./pages/Automations";
import AdminPanel from "./pages/AdminPanel";

// Protected Route Component
function ProtectedRoute({ component: Component, ...rest }: any) {
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, loading, setLocation]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return isAuthenticated ? <Component {...rest} /> : null;
}

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={LandingPageShowcase} />
      <Route path="/login" component={Login} />
      <Route path="/dev-login" component={DevLogin} />

      {/* Protected Routes */}
      <Route path="/dashboard" component={(props: any) => <ProtectedRoute component={Dashboard} {...props} />} />
      <Route path="/contacts" component={(props: any) => <ProtectedRoute component={Contacts} {...props} />} />
      <Route path="/pipeline" component={(props: any) => <ProtectedRoute component={Pipeline} {...props} />} />
      <Route path="/chats" component={(props: any) => <ProtectedRoute component={Chats} {...props} />} />
      <Route path="/conversations" component={(props: any) => <ProtectedRoute component={ConversationManager} {...props} />} />
      <Route path="/whatsapp" component={(props: any) => <ProtectedRoute component={WhatsAppIntegration} {...props} />} />
      <Route path="/ai-agents" component={(props: any) => <ProtectedRoute component={AIAgents} {...props} />} />
      <Route path="/automations" component={(props: any) => <ProtectedRoute component={Automations} {...props} />} />
      <Route path="/admin" component={(props: any) => <ProtectedRoute component={AdminPanel} {...props} />} />
      <Route path="/settings" component={(props: any) => <ProtectedRoute component={Settings} {...props} />} />

      {/* 404 */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

