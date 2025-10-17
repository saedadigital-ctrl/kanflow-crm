import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contacts";
import Automations from "./pages/Automations";
import AIAgents from "./pages/AIAgents";
import Settings from "./pages/Settings";
import Messages from "./pages/Messages";
import Pipeline from "./pages/Pipeline";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/contacts"} component={Contacts} />
      <Route path={"/automations"} component={Automations} />
      <Route path={"/ai-agents"} component={AIAgents} />
      <Route path={"/settings"} component={Settings} />
      <Route path={"/messages"} component={Messages} />
      <Route path={"/pipeline"} component={Pipeline} />
      <Route path={"/404"} component={NotFound} />
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

