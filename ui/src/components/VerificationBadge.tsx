
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  ShieldCheck, 
  AlertCircle,
  Activity
} from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export type VerificationStatus = 'verified' | 'pending' | 'in-review' | 'rejected' | 'expired';

export interface VerificationBadgeProps {
  status: VerificationStatus;
  className?: string;
  showLabel?: boolean;
  showTimeline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  'verified': {
    icon: ShieldCheck,
    label: 'Verified',
    tooltip: 'This case has been verified by medical professionals',
    className: 'bg-green-100 text-green-800 border-green-200',
    iconClassName: 'text-green-600',
    step: 4
  },
  'pending': {
    icon: Clock,
    label: 'Pending Verification',
    tooltip: 'This case is awaiting verification',
    className: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    iconClassName: 'text-yellow-500',
    step: 1
  },
  'in-review': {
    icon: ShieldAlert,
    label: 'In Review',
    tooltip: 'This case is currently being reviewed by medical professionals',
    className: 'bg-blue-50 text-blue-800 border-blue-200',
    iconClassName: 'text-blue-500',
    step: 2
  },
  'rejected': {
    icon: AlertCircle,
    label: 'Not Verified',
    tooltip: 'This case could not be verified',
    className: 'bg-red-50 text-red-800 border-red-200',
    iconClassName: 'text-red-500',
    step: 3
  },
  'expired': {
    icon: AlertCircle,
    label: 'Verification Expired',
    tooltip: 'The verification for this case has expired',
    className: 'bg-gray-100 text-gray-800 border-gray-200',
    iconClassName: 'text-gray-500',
    step: 0
  }
};

const VerificationBadge: React.FC<VerificationBadgeProps> = ({ 
  status, 
  className, 
  showLabel = true,
  showTimeline = false,
  size = 'md'
}) => {
  const config = statusConfig[status];
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'text-xs py-0.5 px-1.5',
    md: 'text-sm py-1 px-2',
    lg: 'text-base py-1.5 px-3'
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div 
              className={cn(
                'inline-flex items-center border rounded-full transition-all', 
                sizeClasses[size],
                config.className,
                className
              )}
            >
              <Icon size={iconSizes[size]} className={cn('mr-1', config.iconClassName)} />
              {showLabel && <span className="font-medium">{config.label}</span>}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{config.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {showTimeline && (
        <div className="pt-2 w-full">
          <div className="relative flex items-center">
            {Object.entries(statusConfig)
              .sort((a, b) => a[1].step - b[1].step)
              .filter(([key]) => key !== 'expired') 
              .map(([key, value], index, array) => {
                const isActive = config.step >= value.step;
                const isLast = index === array.length - 1;
                
                return (
                  <React.Fragment key={key}>
                    <div className={cn(
                      "flex flex-col items-center",
                      index > 0 && "ml-2"
                    )}>
                      <div className={cn(
                        "rounded-full w-6 h-6 flex items-center justify-center z-10 border-2",
                        isActive ? "bg-primary border-primary" : "bg-white border-gray-300"
                      )}>
                        {isActive && <Activity size={12} className="text-white" />}
                      </div>
                      <span className={cn(
                        "text-xs mt-1",
                        isActive ? "text-primary font-medium" : "text-gray-500"
                      )}>
                        {value.label.split(' ')[0]}
                      </span>
                    </div>
                    
                    {!isLast && (
                      <div className={cn(
                        "flex-1 h-0.5 mx-1",
                        isActive && statusConfig[status].step > value.step ? "bg-primary" : "bg-gray-300"
                      )} />
                    )}
                  </React.Fragment>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationBadge;
