
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';

interface PatientCaseCardProps {
  id: string;
  title: string;
  status: 'pending' | 'in-review' | 'verified' | 'rejected' | 'expired';
  createdAt: string;
  targetAmount: number;
  currentAmount: number;
  verificationCount: number;
}

const PatientCaseCard: React.FC<PatientCaseCardProps> = ({
  id,
  title,
  status,
  createdAt,
  targetAmount,
  currentAmount,
  verificationCount
}) => {
  const percentFunded = Math.round((currentAmount / targetAmount) * 100);
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  
  return (
    <Card className="overflow-hidden hover:border-primary/50 transition-all">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="font-medium">{title}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span>Created {timeAgo}</span>
                <span>•</span>
                <span>ID: {id}</span>
              </div>
            </div>
            
            <StatusBadge status={status} />
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Funding Progress</span>
              <span className="font-medium">${currentAmount.toLocaleString()} of ${targetAmount.toLocaleString()}</span>
            </div>
            <Progress value={percentFunded} className="h-2" />
          </div>
          
          <div className="flex items-center mt-3 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5 mr-1" />
            <span>{verificationCount} verifier{verificationCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
        
        <div className="bg-muted/50 p-2 flex justify-between items-center">
          <div className="text-xs font-medium">
            {status === 'verified' ? 
              `${percentFunded}% funded` : 
              status === 'pending' ? 
                "Awaiting verification" : 
                status === 'in-review' ? 
                  "Under review" : 
                  status === 'rejected' ? 
                    "Verification declined" : 
                    "Case expired"}
          </div>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
            View Details
            <ChevronRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const StatusBadge = ({ status }: { status: PatientCaseCardProps['status'] }) => {
  const variants: Record<PatientCaseCardProps['status'], { label: string, variant: "default" | "secondary" | "destructive" | "outline" }> = {
    'pending': { label: 'Pending', variant: 'secondary' },
    'in-review': { label: 'In Review', variant: 'secondary' },
    'verified': { label: 'Verified', variant: 'default' },
    'rejected': { label: 'Rejected', variant: 'destructive' },
    'expired': { label: 'Expired', variant: 'outline' }
  };
  
  const { label, variant } = variants[status];
  
  return <Badge variant={variant}>{label}</Badge>;
};

export default PatientCaseCard;
