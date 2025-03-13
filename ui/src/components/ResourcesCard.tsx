
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, BookOpen, FileQuestion, MessageCircle } from "lucide-react";

const ResourcesCard = () => {
  const resources = [
    {
      icon: <FileQuestion className="h-4 w-4" />,
      title: 'How Verification Works',
      description: 'Learn about the medical verification process',
      href: '/help/verification'
    },
    {
      icon: <BookOpen className="h-4 w-4" />,
      title: 'Case Guidelines',
      description: 'Tips for creating a compelling case',
      href: '/help/guidelines'
    },
    {
      icon: <MessageCircle className="h-4 w-4" />,
      title: 'Contact Support',
      description: 'Get help with any questions',
      href: '/help/support'
    }
  ];
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4" />
          Help Resources
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {resources.map((resource, index) => (
            <div key={index} className="pb-3 last:pb-0">
              <Button 
                variant="link" 
                className="h-auto p-0 justify-start flex items-center gap-2 text-left"
                asChild
              >
                <a href={resource.href}>
                  <div className="text-primary">{resource.icon}</div>
                  <div>
                    <div className="font-medium text-sm text-foreground">{resource.title}</div>
                    <div className="text-xs text-muted-foreground">{resource.description}</div>
                  </div>
                </a>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourcesCard;
