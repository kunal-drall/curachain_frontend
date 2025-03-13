
import React from 'react';
import { 
  FileText, 
  ShieldCheck, 
  Heart, 
  TrendingUp, 
  RefreshCw 
} from 'lucide-react';

interface StepProps {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const Step: React.FC<StepProps> = ({ number, title, description, icon }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative mb-4">
        <div className="w-16 h-16 rounded-full bg-primary-lighter flex items-center justify-center">
          {icon}
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs text-white font-bold">
          {number}
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const HowItWorks: React.FC = () => {
  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">How CuraChain Works</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Our transparent verification process ensures your donations reach those who truly need it
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-4">
        <Step
          number={1}
          title="Submit Case"
          description="Patients or caregivers submit medical details and documentation"
          icon={<FileText size={28} className="text-primary" />}
        />
        
        <div className="hidden lg:flex items-center justify-center">
          <div className="w-16 h-0.5 bg-gray-200 relative">
            <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
              <RefreshCw size={16} className="text-muted-foreground" />
            </div>
          </div>
        </div>
        
        <Step
          number={2}
          title="Medical Verification"
          description="Licensed medical professionals verify case details and legitimacy"
          icon={<ShieldCheck size={28} className="text-primary" />}
        />
        
        <div className="hidden lg:flex items-center justify-center">
          <div className="w-16 h-0.5 bg-gray-200 relative">
            <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
              <RefreshCw size={16} className="text-muted-foreground" />
            </div>
          </div>
        </div>
        
        <Step
          number={3}
          title="Transparent Funding"
          description="Donors contribute with full visibility of fund allocation"
          icon={<Heart size={28} className="text-primary" />}
        />
      </div>
      
      <div className="flex justify-center mt-12">
        <div className="max-w-md text-center bg-primary-lighter rounded-lg p-6 shadow-sm">
          <TrendingUp size={32} className="text-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Continuous Monitoring</h3>
          <p className="text-muted-foreground">
            All cases include regular updates on treatment progress and fund utilization, 
            stored securely and transparently on blockchain
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
