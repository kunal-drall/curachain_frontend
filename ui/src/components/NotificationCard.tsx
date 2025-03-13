
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Check, CheckCircle2, HeartHandshake, AlertCircle } from "lucide-react";

interface Notification {
  id: string;
  type: 'verification' | 'donation' | 'update' | 'alert';
  message: string;
  time: string;
  read: boolean;
}

const NotificationCard = () => {
  // In a real app, this would come from API/context
  const notifications: Notification[] = [
    {
      id: 'notif-1',
      type: 'verification',
      message: 'Your case "Specialized Cardiac Treatment" has been verified by Dr. Emily Chen',
      time: '2 hours ago',
      read: false
    },
    {
      id: 'notif-2',
      type: 'donation',
      message: 'You received a donation of $500 for your "Specialized Cardiac Treatment" case',
      time: '1 day ago',
      read: false
    },
    {
      id: 'notif-3',
      type: 'update',
      message: 'Please provide an update on your treatment progress',
      time: '3 days ago',
      read: true
    }
  ];
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-primary text-primary-foreground">
                {unreadCount}
              </span>
            )}
          </CardTitle>
          <Button variant="ghost" size="sm" className="h-8 text-xs">
            Mark all read
          </Button>
        </div>
      </CardHeader>
      <CardContent className="max-h-[320px] overflow-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No notifications yet
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`flex items-start p-2 rounded-md text-sm ${
                  notification.read ? 'opacity-70' : 'bg-muted'
                }`}
              >
                <div className="mr-3 mt-0.5">
                  {notification.type === 'verification' && (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  )}
                  {notification.type === 'donation' && (
                    <HeartHandshake className="h-5 w-5 text-green-500" />
                  )}
                  {notification.type === 'update' && (
                    <Bell className="h-5 w-5 text-blue-500" />
                  )}
                  {notification.type === 'alert' && (
                    <AlertCircle className="h-5 w-5 text-destructive" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="leading-tight">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                </div>
                {!notification.read && (
                  <Button variant="ghost" size="icon" className="h-6 w-6 ml-2 shrink-0 text-muted-foreground">
                    <Check className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
