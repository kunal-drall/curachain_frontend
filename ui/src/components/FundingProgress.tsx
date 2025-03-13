
import React from 'react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface FundingProgressProps {
  current: number;
  target: number;
  className?: string;
  showAmounts?: boolean;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  currency?: string;
}

const FundingProgress: React.FC<FundingProgressProps> = ({
  current,
  target,
  className,
  showAmounts = true,
  showPercentage = true,
  size = 'md',
  currency = 'USD'
}) => {
  const percentage = Math.min(Math.round((current / target) * 100), 100);
  
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  };
  
  const labelSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const getProgressColor = () => {
    if (percentage < 30) return 'bg-red-500';
    if (percentage < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className={cn('space-y-2', className)}>
      {showAmounts && (
        <div className="flex justify-between text-muted-foreground">
          <div className={cn('font-medium', labelSizeClasses[size])}>
            {formatCurrency(current)}
          </div>
          <div className={cn('font-medium', labelSizeClasses[size])}>
            {formatCurrency(target)}
          </div>
        </div>
      )}
      
      <div className="relative">
        <Progress 
          value={percentage} 
          className={cn('w-full', sizeClasses[size], percentage < 30 ? 'bg-red-500/20' : percentage < 70 ? 'bg-yellow-500/20' : 'bg-green-500/20')}
          // Since indicatorClassName is not supported, we need to use a different approach
          // We'll style the indicator directly with a custom className
          style={{ 
            '--progress-color': percentage < 30 ? 'rgb(239 68 68)' : percentage < 70 ? 'rgb(234 179 8)' : 'rgb(34 197 94)',
          } as React.CSSProperties}
        />
        
        {showPercentage && (
          <div 
            className={cn(
              'absolute right-0 -top-5 font-semibold',
              labelSizeClasses[size]
            )}
          >
            {percentage}%
          </div>
        )}
      </div>
    </div>
  );
};

export default FundingProgress;
