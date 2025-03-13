
import React from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, Settings } from 'lucide-react';
import { UserRole, getRoleLabel } from './NavigationConfig';

interface UserActionsProps {
  userRole: UserRole;
  toggleRole: () => void;
}

const UserActions = ({ userRole, toggleRole }: UserActionsProps) => {
  return (
    <div className="hidden sm:flex items-center space-x-4">
      {userRole && (
        <div 
          onClick={toggleRole}
          className="flex items-center cursor-pointer bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium"
        >
          <span className="mr-1">{getRoleLabel(userRole)}</span>
          <Settings size={12} />
        </div>
      )}
      {!userRole && (
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-white"
          onClick={toggleRole}
        >
          Sign In
        </Button>
      )}
      <Button 
        size="sm"
        className="group relative overflow-hidden button-glow"
      >
        <Wallet className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
    </div>
  );
};

export default UserActions;
