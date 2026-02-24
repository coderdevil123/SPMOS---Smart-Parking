import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ParkingProvider, useParking } from "@/contexts/ParkingContext";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Components
import AuthModal from "@/components/AuthModal";
import NavigationHeader from "@/components/NavigationHeader";
import LandingPage from "@/components/LandingPage";
import SearchPage from "@/components/SearchPage";
import BookingModal from "@/components/BookingModal";
import ParkingSession from "@/components/ParkingSession";
import NavigationModal from "@/components/NavigationModal";
import SessionSummary from "@/components/SessionSummary";
import AdminDashboard from "@/components/admin/AdminDashboard";

function UserContent() {
  const { currentView } = useParking();

  const renderCurrentView = () => {
    switch (currentView) {
      case "landing":
        return <LandingPage />;
      case "search":
        return <SearchPage />;
      case "session":
        return <ParkingSession />;
      case "summary":
        return <SessionSummary />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <NavigationHeader />
      {renderCurrentView()}
      <BookingModal />
      <NavigationModal />
    </div>
  );
}

function AppContent() {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <AuthModal />;
  }

  // ✅ Admin users → Admin Dashboard (no ParkingProvider needed)
  if (isAdmin) {
    return <AdminDashboard />;
  }

  // ✅ Normal users → User views (wrapped in ParkingProvider)
  return (
    <ParkingProvider>
      <UserContent />
    </ParkingProvider>
  );
}

function App() {
  return (
    <TooltipProvider>
      <AuthProvider>
        <AppContent />
        <Toaster />
      </AuthProvider>
    </TooltipProvider>
  );
}

export default App;
