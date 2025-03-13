
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { FilePlus, Bell, User, FileText, AlertCircle } from "lucide-react";
import PatientCaseCard from "@/components/PatientCaseCard";
import NotificationCard from "@/components/NotificationCard";
import QuickActionsCard from "@/components/QuickActionsCard";
import ResourcesCard from "@/components/ResourcesCard";

const PatientDashboard = () => {
  // In a real app, these would come from API/context
  const patientName = "Sarah Johnson";
  const activeCases = 2;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patient Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {patientName}</p>
        </div>
        <Button className="mt-4 md:mt-0" size="sm">
          <FilePlus className="mr-2 h-4 w-4" />
          Submit New Case
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main content area - 2/3 width on desktop */}
        <div className="md:col-span-2 space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatsCard 
              title="Active Cases" 
              value={activeCases.toString()}
              description="Cases awaiting verification or funding"
              icon={<FileText className="h-5 w-5 text-blue-500" />}
            />
            <StatsCard 
              title="Total Funding" 
              value="$12,580"
              description="Amount received across all cases"
              icon={<FileText className="h-5 w-5 text-green-500" />}
            />
            <StatsCard 
              title="Verification Rate" 
              value="100%"
              description="Percentage of cases verified"
              icon={<FileText className="h-5 w-5 text-yellow-500" />}
            />
          </div>

          {/* Recent Cases */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>My Cases</CardTitle>
                <Button variant="ghost" size="sm" className="text-sm">View All</Button>
              </div>
              <CardDescription>Your active and recent funding cases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <PatientCaseCard 
                  id="case-001"
                  title="Specialized Cardiac Treatment" 
                  status="verified"
                  createdAt="2023-11-15T10:30:00"
                  targetAmount={25000}
                  currentAmount={18750}
                  verificationCount={3}
                />
                <PatientCaseCard 
                  id="case-002"
                  title="Physical Therapy Sessions" 
                  status="pending"
                  createdAt="2023-12-05T14:45:00"
                  targetAmount={8000}
                  currentAmount={0}
                  verificationCount={1}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - 1/3 width on desktop */}
        <div className="space-y-6">
          {/* Notifications */}
          <NotificationCard />
          
          {/* Quick Actions */}
          <QuickActionsCard />
          
          {/* Help Resources */}
          <ResourcesCard />
        </div>
      </div>
    </div>
  );
};

// Stats card component for the dashboard
const StatsCard = ({ 
  title, 
  value, 
  description, 
  icon 
}: { 
  title: string; 
  value: string; 
  description: string; 
  icon: React.ReactNode;
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-background rounded-full border">{icon}</div>
          <div className="font-medium text-sm text-muted-foreground">{title}</div>
        </div>
        <div className="mt-3 space-y-1">
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientDashboard;
