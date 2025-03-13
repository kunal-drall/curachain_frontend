
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Heart, Share2, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import VerificationBadge from '@/components/VerificationBadge';
import FundingProgress from '@/components/FundingProgress';

interface CaseCardProps {
  id: string;
  title: string;
  patientName: string;
  location: string;
  condition: string;
  description: string;
  imageUrl: string;
  currentFunding: number;
  targetFunding: number;
  createdAt: string;
  verificationStatus: 'verified' | 'pending' | 'in-review' | 'rejected' | 'expired';
  className?: string;
  featured?: boolean;
}

const CaseCard: React.FC<CaseCardProps> = ({
  id,
  title,
  patientName,
  location,
  condition,
  description,
  imageUrl,
  currentFunding,
  targetFunding,
  createdAt,
  verificationStatus,
  className,
  featured = false
}) => {
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  return (
    <Card 
      className={cn(
        'overflow-hidden transition-all duration-300 hover-scale',
        featured ? 'border-primary/40 shadow-lg' : 'border-border',
        className
      )}
    >
      <div className="relative">
        <Link to={`/cases/${id}`}>
          <img 
            src={imageUrl} 
            alt={title}
            className="h-48 w-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </Link>
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <VerificationBadge status={verificationStatus} />
          {featured && (
            <span className="inline-flex items-center rounded-full bg-primary text-white text-xs px-2 py-0.5 font-medium">
              Featured
            </span>
          )}
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-semibold hover:text-primary transition-colors">
              <Link to={`/cases/${id}`}>{title}</Link>
            </CardTitle>
            <CardDescription className="mt-1">{condition}</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        <div className="flex items-center text-sm text-muted-foreground mb-3 gap-4">
          <div className="flex items-center">
            <MapPin size={14} className="mr-1" />
            <span>{location}</span>
          </div>
          <div className="flex items-center">
            <Calendar size={14} className="mr-1" />
            <span>{formattedDate}</span>
          </div>
        </div>
        
        <p className="text-sm line-clamp-3 mb-4 text-foreground/80">
          {description}
        </p>
        
        <FundingProgress 
          current={currentFunding} 
          target={targetFunding}
          size="sm"
        />
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-between">
        <Button variant="outline" size="sm" className="text-sm">
          <Heart size={16} className="mr-1.5" />
          Save
        </Button>
        <Button variant="default" size="sm" className="text-sm bg-primary text-white hover:bg-primary/90">
          Donate Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CaseCard;
