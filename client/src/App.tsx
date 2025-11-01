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
import AdminDashboard from "./pages/admin/AdminDashboard";
import Organizations from "./pages/admin/Organizations";
import ClientDetails from "./pages/admin/ClientDetails";
import Billing from "./pages/admin/Billing";
import WhatsappIntegration from "./pages/WhatsappIntegration";
import WhatsAppSetup from "./pages/WhatsAppSetup";
import ConversationManager from "./pages/ConversationManager";
import MyLicense from "./pages/MyLicense";
import LandingPage from "./pages/LandingPage";
import DevLogin from "./pages/DevLogin";
import LandingPageShowcase from "./pages/LandingPageShowcase";
import NotificationPreferences from "./pages/NotificationPreferences";

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

// Admin Only Route Component
function AdminRoute({ component: Component, ...rest }: any) {
  const { isAuthenticated, loading, user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation("/login");
    }
    if (!loading && isAuthenticated && user?.role !== "admin") {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, loading, user, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
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
        <Route path="/" component={LandingPageShowcase} />
        <Route path="/home" component={LandingPage} />
        <Route path="/login" component={Login} />
        <Route path="/dev-login" component={DevLogin} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route path="/404" component={NotFound} />

        {/* Protected Routes */}
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
        <Route path="/whatsapp">
          <ProtectedRoute component={WhatsappIntegration} />
        </Route>
        <Route path="/whatsapp-setup">
          <ProtectedRoute component={WhatsAppSetup} />
        </Route>
        <Route path="/conversations">
          <ProtectedRoute component={ConversationManager} />
        </Route>
        <Route path="/my-license">
          <ProtectedRoute component={MyLicense} />
        </Route>
        <Route path="/notification-preferences">
          <ProtectedRoute component={NotificationPreferences} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin">
          <AdminRoute component={AdminDashboard} />
        </Route>
        <Route path="/admin/organizations">
          <AdminRoute component={Organizations} />
        </Route>
        <Route path="/admin/clients/:id">
          <AdminRoute component={ClientDetails} />
        </Route>
        <Route path="/admin/billing">
          <AdminRoute component={Billing} />
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

