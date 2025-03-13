
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, CheckCircle, Clock, Search, Filter } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

// Mock user data
const mockUsers = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "patient",
    status: "active",
    registeredDate: new Date(2023, 5, 12),
    cases: 2
  },
  {
    id: 2,
    name: "Dr. Sarah Miller",
    email: "sarah@example.com",
    role: "verifier",
    status: "active",
    registeredDate: new Date(2023, 4, 18),
    verifications: 28
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "michael@example.com",
    role: "donor",
    status: "active",
    registeredDate: new Date(2023, 6, 5),
    donations: 12
  },
  {
    id: 4,
    name: "Dr. Robert Wilson",
    email: "robert@example.com",
    role: "verifier",
    status: "pending",
    registeredDate: new Date(2023, 7, 10),
    verifications: 0
  },
  {
    id: 5,
    name: "Emma Davis",
    email: "emma@example.com",
    role: "patient",
    status: "inactive",
    registeredDate: new Date(2023, 3, 15),
    cases: 1
  }
];

const RoleBadge = ({ role }: { role: string }) => {
  const styles = {
    patient: "bg-blue-100 text-blue-800",
    verifier: "bg-purple-100 text-purple-800",
    donor: "bg-green-100 text-green-800",
    admin: "bg-red-100 text-red-800"
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[role as keyof typeof styles]}`}>
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const variants: Record<string, any> = {
    active: { variant: "default" },
    pending: { variant: "outline" },
    inactive: { variant: "secondary" }
  };
  
  return (
    <Badge variant={variants[status]?.variant || "default"}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const AdminUserManagement = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Users className="h-6 w-6" />
              User Management
            </CardTitle>
            <CardDescription>
              View and manage all users across the platform
            </CardDescription>
          </div>
          <Button className="flex items-center gap-1">
            <UserPlus className="h-4 w-4" />
            Add User
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search users..." className="w-full pl-8" />
              </div>
              <Button variant="outline" className="flex items-center gap-1 w-full sm:w-auto">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </TableCell>
                      <TableCell>
                        <RoleBadge role={user.role} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={user.status} />
                      </TableCell>
                      <TableCell>
                        {format(user.registeredDate, 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        {user.role === 'patient' && `${user.cases} cases`}
                        {user.role === 'verifier' && `${user.verifications} verifications`}
                        {user.role === 'donor' && `${user.donations} donations`}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Verification Requests
            </CardTitle>
            <CardDescription>
              Medical professionals awaiting approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockUsers
                .filter(user => user.role === 'verifier' && user.status === 'pending')
                .map(user => (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Review</Button>
                      <Button size="sm">Approve</Button>
                    </div>
                  </div>
              ))}
              {mockUsers.filter(user => user.role === 'verifier' && user.status === 'pending').length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  No pending verification requests
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest user actions across the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-2 border-primary/20 pl-4 py-1">
                <div className="text-sm font-medium">New verifier registered</div>
                <div className="text-xs text-muted-foreground">Dr. Robert Wilson • 2 hours ago</div>
              </div>
              <div className="border-l-2 border-primary/20 pl-4 py-1">
                <div className="text-sm font-medium">Case verified by Dr. Sarah Miller</div>
                <div className="text-xs text-muted-foreground">Case #1083 • 5 hours ago</div>
              </div>
              <div className="border-l-2 border-primary/20 pl-4 py-1">
                <div className="text-sm font-medium">Emma Davis updated profile</div>
                <div className="text-xs text-muted-foreground">Patient • 1 day ago</div>
              </div>
              <div className="border-l-2 border-primary/20 pl-4 py-1">
                <div className="text-sm font-medium">Michael Chen made a donation</div>
                <div className="text-xs text-muted-foreground">2.5 SOL to Case #1056 • 1 day ago</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminUserManagement;
