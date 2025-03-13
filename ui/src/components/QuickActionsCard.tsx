
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilePlus, FileText, UserCog, MessageSquarePlus } from "lucide-react";

const QuickActionsCard = () => {
  const actions = [
    { 
      icon: <FilePlus className="h-4 w-4" />,
      label: 'Submit New Case',
      description: 'Create a new funding request',
      href: '/submit-case'
    },
    { 
      icon: <FileText className="h-4 w-4" />,
      label: 'View All Cases',
      description: 'Manage your existing cases',
      href: '/my-cases'
    },
    { 
      icon: <UserCog className="h-4 w-4" />,
      label: 'Update Profile',
      description: 'Manage your account details',
      href: '/profile'
    },
    { 
      icon: <MessageSquarePlus className="h-4 w-4" />,
      label: 'Post Update',
      description: 'Share progress on your treatment',
      href: '/post-update'
    },
  ];
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2">
          {actions.map((action, index) => (
            <Button 
              key={index}
              variant="ghost" 
              className="justify-start h-auto py-3 px-4 w-full"
              asChild
            >
              <a href={action.href}>
                <div className="flex items-center space-x-3 w-full text-left">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    {action.icon}
                  </div>
                  <div>
                    <div className="font-medium">{action.label}</div>
                    <div className="text-xs text-muted-foreground">{action.description}</div>
                  </div>
                </div>
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
