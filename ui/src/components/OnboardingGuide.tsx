import React, { useState, useEffect } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle,
  SheetFooter,
  SheetTrigger
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight, X, Info, User, HeartHandshake, CheckCircle2, UserCog } from 'lucide-react';
import { Search, BarChart3, ClipboardList, FileText } from 'lucide-react';

type UserRole = 'patient' | 'donor' | 'verifier' | 'admin' | null;

interface OnboardingStep {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const roleSteps: Record<NonNullable<UserRole>, OnboardingStep[]> = {
  patient: [
    {
      title: 'Submit Your Case',
      description: 'Start by creating a detailed case explaining your medical condition and funding needs.',
      icon: <User className="h-10 w-10 text-primary" />
    },
    {
      title: 'Verification Process',
      description: 'Our medical professionals will review your case to verify the medical information.',
      icon: <CheckCircle2 className="h-10 w-10 text-yellow-500" />
    },
    {
      title: 'Receive Funding',
      description: 'Once verified, donors can contribute to your treatment costs.',
      icon: <HeartHandshake className="h-10 w-10 text-green-500" />
    },
  ],
  donor: [
    {
      title: 'Browse Verified Cases',
      description: 'Find patients in need with cases verified by medical professionals.',
      icon: <Search className="h-10 w-10 text-primary" />
    },
    {
      title: 'Make a Donation',
      description: 'Contribute any amount to help fund medical treatments.',
      icon: <HeartHandshake className="h-10 w-10 text-green-500" />
    },
    {
      title: 'Track Your Impact',
      description: 'Follow the progress of cases you\'ve funded and see your impact.',
      icon: <BarChart3 className="h-10 w-10 text-blue-500" />
    },
  ],
  verifier: [
    {
      title: 'Review Case Queue',
      description: 'Access cases awaiting medical verification.',
      icon: <ClipboardList className="h-10 w-10 text-primary" />
    },
    {
      title: 'Verify Medical Details',
      description: 'Review medical documents and validate patient information.',
      icon: <CheckCircle2 className="h-10 w-10 text-yellow-500" />
    },
    {
      title: 'Approve or Request More Info',
      description: 'Complete the verification process or request additional documentation.',
      icon: <FileText className="h-10 w-10 text-green-500" />
    },
  ],
  admin: [
    {
      title: 'Manage Users',
      description: 'Review and manage patient, donor, and verifier accounts.',
      icon: <UserCog className="h-10 w-10 text-primary" />
    },
    {
      title: 'Oversee Verifications',
      description: 'Monitor the verification process and review verifier actions.',
      icon: <CheckCircle2 className="h-10 w-10 text-yellow-500" />
    },
    {
      title: 'System Analytics',
      description: 'Access platform metrics and performance statistics.',
      icon: <BarChart3 className="h-10 w-10 text-blue-500" />
    },
  ]
};

interface OnboardingGuideProps {
  userRole: UserRole;
  onComplete?: () => void;
  onDismiss?: () => void;
}

const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ 
  userRole, 
  onComplete, 
  onDismiss 
}) => {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeen, setHasSeen] = useState(false);
  
  const steps = userRole ? roleSteps[userRole] : null;
  
  useEffect(() => {
    if (userRole && !hasSeen) {
      const timer = setTimeout(() => {
        setOpen(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [userRole, hasSeen]);
  
  const handleComplete = () => {
    setHasSeen(true);
    setOpen(false);
    if (onComplete) onComplete();
  };
  
  const handleDismiss = () => {
    setHasSeen(true);
    setOpen(false);
    if (onDismiss) onDismiss();
  };
  
  const nextStep = () => {
    if (steps && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  if (!userRole || !steps) return null;
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="gap-1 text-xs" size="sm">
          <Info className="h-3.5 w-3.5" />
          <span className="sm:inline hidden">How It Works</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md flex flex-col">
        <SheetHeader className="px-1">
          <SheetTitle className="text-xl flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            Getting Started as a {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
          </SheetTitle>
          <SheetDescription>
            Follow these steps to make the most of CuraChain
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex-1 overflow-auto py-6">
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
            
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`relative pl-14 mb-6 transition-opacity duration-300 ${
                  index === currentStep ? 'opacity-100' : 'opacity-50'
                }`}
              >
                <div className={`absolute left-0 flex items-center justify-center w-12 h-12 rounded-full z-10 
                  ${index === currentStep 
                    ? 'bg-primary text-white' 
                    : index < currentStep 
                      ? 'bg-green-100 text-green-500' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                  {index < currentStep ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    step.icon || <span className="font-bold">{index + 1}</span>
                  )}
                </div>
                <h3 className="font-medium text-lg">{step.title}</h3>
                <p className="text-muted-foreground mt-1">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <SheetFooter className="flex justify-between sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDismiss}
            >
              <X className="h-4 w-4 mr-1" />
              Skip
            </Button>
            
            {currentStep > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={prevStep}
              >
                Back
              </Button>
            )}
          </div>
          
          <Button onClick={nextStep}>
            {currentStep < steps.length - 1 ? (
              <>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </>
            ) : (
              <>
                Get Started
                <Check className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default OnboardingGuide;
