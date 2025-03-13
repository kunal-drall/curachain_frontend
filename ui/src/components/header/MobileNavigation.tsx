
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Wallet, Settings } from 'lucide-react';
import { commonNavItems, generalNavGroups, roleSpecificNavItems, UserRole, getRoleLabel } from './NavigationConfig';

interface MobileNavigationProps {
  userRole: UserRole;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  toggleRole: () => void;
}

const MobileNavigation = ({ 
  userRole, 
  mobileMenuOpen, 
  setMobileMenuOpen,
  toggleRole
}: MobileNavigationProps) => {
  const location = useLocation();
  
  // Get navigation items based on role
  const getNavigationItems = () => {
    if (!userRole) return [...commonNavItems, ...generalNavGroups];
    return [...commonNavItems, ...roleSpecificNavItems[userRole]];
  };

  const navigationItems = getNavigationItems();

  if (!mobileMenuOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 z-40 bg-background animate-fade-in">
      <div className="flex flex-col p-4 pt-20">
        {/* Role selector for mobile */}
        {userRole ? (
          <div 
            onClick={toggleRole}
            className="flex items-center justify-between cursor-pointer bg-primary/10 text-primary px-4 py-2 mb-4 rounded-md"
          >
            <span className="font-medium">{getRoleLabel(userRole)}</span>
            <Settings size={16} />
          </div>
        ) : (
          <Button 
            variant="outline" 
            size="lg" 
            className="justify-start mb-4"
            onClick={toggleRole}
          >
            Sign In / Select Role
          </Button>
        )}

        {navigationItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "flex items-center px-4 py-3 text-base font-medium rounded-md transition-colors",
              location.pathname === item.href
                ? "bg-primary/10 text-primary"
                : "text-foreground hover:bg-accent"
            )}
            onClick={() => setMobileMenuOpen(false)}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </Link>
        ))}
        <div className="mt-6 px-4 flex flex-col space-y-3">
          {!userRole && (
            <Button variant="outline" size="lg" className="justify-start">
              Sign In
            </Button>
          )}
          <Button size="lg" className="justify-start">
            <Wallet className="mr-3 h-5 w-5" />
            Connect Wallet
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileNavigation;
