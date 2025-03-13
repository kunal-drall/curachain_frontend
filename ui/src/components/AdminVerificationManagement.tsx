
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, Search, Filter, Clock, FileCheck, FileX } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

// Mock verification data
const mockVerifications = [
  {
    id: 1083,
    patientName: "John Smith",
    condition: "Heart Surgery",
    assignedVerifiers: 3,
    approvals: 2,
    rejections: 0,
    status: "in_review",
    dateSubmitted: new Date(2023, 7, 15),
    amountRequested: 12.5
  },
  {
    id: 1082,
    patientName: "Maria Garcia",
    condition: "Cancer Treatment",
    assignedVerifiers: 3,
    approvals: 3,
    rejections: 0,
    status: "approved",
    dateSubmitted: new Date(2023, 7, 14),
    amountRequested: 20.0
  },
  {
    id: 1081,
    patientName: "David Chen",
    condition: "Kidney Transplant",
    assignedVerifiers: 3,
    approvals: 1,
    rejections: 2,
    status: "rejected",
    dateSubmitted: new Date(2023, 7, 12),
    amountRequested: 15.5
  },
  {
    id: 1080,
    patientName: "Priya Patel",
    condition: "Physical Therapy",
    assignedVerifiers: 3,
    approvals: 3,
    rejections: 0,
    status: "approved",
    dateSubmitted: new Date(2023, 7, 10),
    amountRequested: 5.2
  },
  {
    id: 1079,
    patientName: "Sarah Johnson",
    condition: "Chronic Pain Management",
    assignedVerifiers: 3,
    approvals: 0,
    rejections: 3,
    status: "rejected",
    dateSubmitted: new Date(2023, 7, 8),
    amountRequested: 8.7
  }
];

const StatusBadge = ({ status }: { status: string }) => {
  const variants: Record<string, any> = {
    approved: { variant: "default", icon: <CheckCircle2 className="h-3 w-3 mr-1" /> },
    rejected: { variant: "destructive", icon: <AlertTriangle className="h-3 w-3 mr-1" /> },
    in_review: { variant: "outline", icon: <Clock className="h-3 w-3 mr-1" /> }
  };
  
  const labels: Record<string, string> = {
    approved: "Approved",
    rejected: "Rejected",
    in_review: "In Review"
  };
  
  return (
    <Badge variant={variants[status]?.variant || "default"} className="flex items-center">
      {variants[status]?.icon}
      {labels[status] || status}
    </Badge>
  );
};

const AdminVerificationManagement = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-2xl flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6" />
              Verification Management
            </CardTitle>
            <CardDescription>
              Oversee medical case verifications across the platform
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search cases..." className="w-full pl-8" />
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
                    <TableHead>Case ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Verifications</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockVerifications.map((verification) => (
                    <TableRow key={verification.id}>
                      <TableCell>#{verification.id}</TableCell>
                      <TableCell className="font-medium">{verification.patientName}</TableCell>
                      <TableCell>{verification.condition}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="text-green-600">{verification.approvals}</span>
                          <span>/</span>
                          <span className="text-red-600">{verification.rejections}</span>
                          <span>/</span>
                          <span>{verification.assignedVerifiers}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={verification.status} />
                      </TableCell>
                      <TableCell>
                        {format(verification.dateSubmitted, 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        {verification.amountRequested} SOL
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">View</Button>
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
              <FileCheck className="h-5 w-5" />
              Recently Approved
            </CardTitle>
            <CardDescription>
              Cases that have passed verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockVerifications
                .filter(verification => verification.status === 'approved')
                .slice(0, 3)
                .map(verification => (
                  <div key={verification.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Case #{verification.id}</div>
                      <div className="text-sm">{verification.patientName} • {verification.condition}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(verification.dateSubmitted, 'MMM d, yyyy')} • {verification.amountRequested} SOL
                      </div>
                    </div>
                    <StatusBadge status="approved" />
                  </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileX className="h-5 w-5" />
              Recently Rejected
            </CardTitle>
            <CardDescription>
              Cases that failed verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockVerifications
                .filter(verification => verification.status === 'rejected')
                .slice(0, 3)
                .map(verification => (
                  <div key={verification.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Case #{verification.id}</div>
                      <div className="text-sm">{verification.patientName} • {verification.condition}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(verification.dateSubmitted, 'MMM d, yyyy')} • {verification.amountRequested} SOL
                      </div>
                    </div>
                    <StatusBadge status="rejected" />
                  </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminVerificationManagement;
