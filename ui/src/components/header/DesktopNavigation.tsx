
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { commonNavItems, generalNavGroups, roleSpecificNavItems, UserRole } from './NavigationConfig';

interface DesktopNavigationProps {
  userRole: UserRole;
}

const DesktopNavigation = ({ userRole }: DesktopNavigationProps) => {
  const location = useLocation();
  
  // Get navigation items based on role
  const getNavigationItems = () => {
    if (!userRole) return [...commonNavItems, ...generalNavGroups];
    return [...commonNavItems, ...roleSpecificNavItems[userRole]];
  };

  const navigationItems = getNavigationItems();

  return (
    <nav className="hidden md:flex md:space-x-6">
      {navigationItems.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={cn(
            "inline-flex items-center px-1 py-2 text-sm font-medium transition-colors hover:text-primary",
            location.pathname === item.href
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          <item.icon className="mr-2 h-4 w-4" />
          {item.name}
        </Link>
      ))}
    </nav>
  );
};

export default DesktopNavigation;
