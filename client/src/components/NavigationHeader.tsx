import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function NavigationHeader() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary" data-testid="text-logo">SPMOS</h1>
            <span className="text-sm text-muted-foreground hidden sm:block">
              Smart Parking Optimization
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium" data-testid="text-username">
              {user?.username}
            </span>
            <Button
              variant="ghost"
              size="sm"
              data-testid="button-logout"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
