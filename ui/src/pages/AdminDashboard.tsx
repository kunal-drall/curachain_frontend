
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { BarChart3, Users, Shield, FileText, Settings, Bell, CheckCircle2 } from "lucide-react";
import Stats from '@/components/Stats';
import AdminUserManagement from '@/components/AdminUserManagement';
import AdminVerificationManagement from '@/components/AdminVerificationManagement';
import AdminSystemSettings from '@/components/AdminSystemSettings';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container py-10 max-w-7xl mx-auto">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Platform management and oversight for CuraChain administrators.
          </p>
        </div>
        
        <Stats />
        
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>User Management</span>
            </TabsTrigger>
            <TabsTrigger value="verifications" className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Verifications</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Reports</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="space-y-4">
            <AdminUserManagement />
          </TabsContent>
          
          <TabsContent value="verifications" className="space-y-4">
            <AdminVerificationManagement />
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Platform Analytics
                </CardTitle>
                <CardDescription>
                  System-wide statistics and reporting metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center border rounded-md bg-muted/20">
                  <p className="text-muted-foreground">Analytics dashboard will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <AdminSystemSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
