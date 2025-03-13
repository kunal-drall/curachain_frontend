import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import OnboardingGuide from "./components/OnboardingGuide";
import Header from "./components/Header";
import PatientDashboard from "./pages/PatientDashboard";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

const App = () => {
  // In a real app, this would come from auth state
  const [userRole, setUserRole] = useState<'patient' | 'donor' | 'verifier' | 'admin' | null>(null);
  
  // For demo purposes
  const toggleRole = () => {
    const roles: ('patient' | 'donor' | 'verifier' | 'admin' | null)[] = [null, 'patient', 'donor', 'verifier', 'admin'];
    const currentIndex = roles.findIndex(r => r === userRole);
    setUserRole(roles[(currentIndex + 1) % roles.length]);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="relative min-h-screen flex flex-col">
            <Header />
            
            {/* OnboardingGuide (shows conditionally based on userRole) */}
            <div className="fixed bottom-4 right-4 z-50">
              <OnboardingGuide userRole={userRole} />
            </div>
            
            {/* Demo controls - would be removed in production */}
            <div className="fixed bottom-4 left-4 z-50">
              <button 
                onClick={toggleRole}
                className="bg-primary/90 hover:bg-primary text-white text-xs px-3 py-1.5 rounded-full shadow-md"
              >
                Demo: Change Role
              </button>
            </div>
            
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/patient-dashboard" element={<PatientDashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
