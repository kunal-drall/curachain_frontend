
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from './header/Logo';
import DesktopNavigation from './header/DesktopNavigation';
import MobileNavigation from './header/MobileNavigation';
import UserActions from './header/UserActions';
import { UserRole } from './header/NavigationConfig';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // This would normally come from auth state, for demo we'll just simulate it
  const [userRole, setUserRole] = useState<UserRole>(null);
  
  // For demo purposes, let's add a way to switch roles
  const toggleRole = () => {
    const roles: UserRole[] = [null, 'patient', 'donor', 'verifier', 'admin'];
    const currentIndex = roles.findIndex(r => r === userRole);
    setUserRole(roles[(currentIndex + 1) % roles.length]);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Desktop navigation */}
        <DesktopNavigation userRole={userRole} />

        {/* User actions (role indicator + connect wallet button) */}
        <UserActions userRole={userRole} toggleRole={toggleRole} />

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="sr-only">Open main menu</span>
          {mobileMenuOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile navigation */}
      <MobileNavigation 
        userRole={userRole}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        toggleRole={toggleRole}
      />
    </header>
  );
};

export default Header;
