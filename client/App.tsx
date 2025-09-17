import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProfileProvider } from "./contexts/ProfileContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import Activities from "./pages/Activities";
import Contact from "./pages/Contact";
import GitIntegration from "./pages/GitIntegration";
import AdminSettings from "./pages/AdminSettings";
import SMSManagement from "./pages/SMSManagement";
import Login from "./pages/Login";
import ProjectDetail from "./pages/ProjectDetail";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import SMSToast from "./components/SMSToast";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ProfileProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <SMSToast />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/project/:id" element={<ProjectDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/admin-login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/skills"
                element={
                  <ProtectedRoute>
                    <Skills />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects"
                element={
                  <ProtectedRoute>
                    <Projects />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/activities"
                element={
                  <ProtectedRoute>
                    <Activities />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/git-integration"
                element={
                  <ProtectedRoute>
                    <GitIntegration />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-settings"
                element={
                  <ProtectedRoute>
                    <AdminSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sms-management"
                element={
                  <ProtectedRoute>
                    <SMSManagement />
                  </ProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ProfileProvider>
    </AuthProvider>
  </QueryClientProvider>
);

// Ensure single root creation for React 18 with proper error handling
const initApp = () => {
  const rootElement = document.getElementById("root");

  if (!rootElement) {
    console.error("Root element not found");
    return;
  }

  // Check if root already exists to prevent double mounting
  if (!rootElement.hasAttribute("data-react-root")) {
    try {
      rootElement.setAttribute("data-react-root", "true");
      const root = createRoot(rootElement);
      root.render(<App />);
    } catch (error) {
      console.error("Failed to create React root:", error);
    }
  }
};

// Initialize app
initApp();
