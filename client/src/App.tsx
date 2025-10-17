import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Redirect, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useAuth } from "./_core/hooks/useAuth";
import { trpc } from "./lib/trpc";
import { useState, useEffect } from "react";
import ConsentModal from "./components/ConsentModal";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contacts";
import Automations from "./pages/Automations";
import AIAgents from "./pages/AIAgents";
import Settings from "./pages/Settings";
import Messages from "./pages/Messages";
import Pipeline from "./pages/Pipeline";

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <Component {...rest} />;
}

function Router() {
  const { isAuthenticated, loading } = useAuth();
  const [showConsentModal, setShowConsentModal] = useState(false);

  // Check if user has accepted consents
  const { data: consentCheck, refetch: refetchConsents } = trpc.security.checkConsents.useQuery(
    undefined,
    {
      enabled: isAuthenticated && !loading,
      retry: false,
    }
  );

  useEffect(() => {
    if (isAuthenticated && !loading && consentCheck && !consentCheck.hasAccepted) {
      setShowConsentModal(true);
    }
  }, [isAuthenticated, loading, consentCheck]);

  const handleConsentAccepted = () => {
    setShowConsentModal(false);
    refetchConsents();
  };

  return (
    <>
      {/* Consent Modal */}
      {isAuthenticated && showConsentModal && (
        <ConsentModal open={showConsentModal} onAccept={handleConsentAccepted} />
      )}

      <Switch>
        {/* Public Routes */}
        <Route path="/login" component={Login} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route path="/404" component={NotFound} />

        {/* Protected Routes */}
        <Route path="/">
          {isAuthenticated ? <Redirect to="/dashboard" /> : <Redirect to="/login" />}
        </Route>
        <Route path="/dashboard">
          <ProtectedRoute component={Dashboard} />
        </Route>
        <Route path="/contacts">
          <ProtectedRoute component={Contacts} />
        </Route>
        <Route path="/automations">
          <ProtectedRoute component={Automations} />
        </Route>
        <Route path="/ai-agents">
          <ProtectedRoute component={AIAgents} />
        </Route>
        <Route path="/settings">
          <ProtectedRoute component={Settings} />
        </Route>
        <Route path="/messages">
          <ProtectedRoute component={Messages} />
        </Route>
        <Route path="/pipeline">
          <ProtectedRoute component={Pipeline} />
        </Route>

        {/* Fallback */}
        <Route component={NotFound} />
      </Switch>
    </>
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

