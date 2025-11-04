import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Redirect, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useAuth } from "./_core/hooks/useAuth";
import { useState, useEffect, Suspense, lazy } from "react";

// Public pages (loaded immediately)
import Home from "./pages/Home";
import Login from "./pages/Login";
import DevLogin from "./pages/DevLogin";
import LandingPageShowcase from "./pages/LandingPageShowcase";

// Protected pages (lazy loaded)
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Contacts = lazy(() => import("./pages/Contacts"));
const Pipeline = lazy(() => import("./pages/Pipeline"));
const Chats = lazy(() => import("./pages/Chats"));
const Settings = lazy(() => import("./pages/Settings"));
const ConversationManager = lazy(() => import("./pages/ConversationManager"));
const WhatsAppIntegration = lazy(() => import("./pages/WhatsAppIntegration"));
const AIAgents = lazy(() => import("./pages/AIAgents"));
const Automations = lazy(() => import("./pages/Automations"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));

// Loading component
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando...</p>
      </div>
    </div>
  );
}

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
    return <PageLoader />;
  }

  return isAuthenticated ? (
    <Suspense fallback={<PageLoader />}>
      <Component {...rest} />
    </Suspense>
  ) : null;
}

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={LandingPageShowcase} />
      <Route path="/login" component={Login} />
      <Route path="/dev-login" component={DevLogin} />

      {/* Protected Routes with lazy loading */}
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

