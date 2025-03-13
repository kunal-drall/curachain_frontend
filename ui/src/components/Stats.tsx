
import React, { useEffect, useState } from 'react';
import { 
  HeartPulse, 
  Users, 
  BadgeCheck, 
  PiggyBank,
  Banknote
} from 'lucide-react';

interface StatsItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
}

const StatsItem: React.FC<StatsItemProps> = ({ icon, label, value, subValue }) => {
  const [displayValue, setDisplayValue] = useState('0');
  const targetValue = parseInt(value.replace(/[^0-9]/g, ''), 10);
  
  useEffect(() => {
    let startValue = 0;
    const duration = 2000;
    const frameRate = 30;
    const totalFrames = duration / (1000 / frameRate);
    const increment = targetValue / totalFrames;
    let currentFrame = 0;
    
    const counter = setInterval(() => {
      currentFrame++;
      startValue += increment;
      
      if (currentFrame === totalFrames) {
        clearInterval(counter);
        setDisplayValue(value);
      } else {
        setDisplayValue(Math.floor(startValue).toLocaleString());
      }
    }, 1000 / frameRate);
    
    return () => clearInterval(counter);
  }, [targetValue, value]);
  
  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow">
      <div className="rounded-full bg-primary-lighter p-3 mb-4">
        {icon}
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-foreground mb-1 animate-fade-in">
          {displayValue}
        </div>
        {subValue && (
          <div className="text-sm text-muted-foreground mb-2">{subValue}</div>
        )}
        <div className="text-sm font-medium text-muted-foreground">
          {label}
        </div>
      </div>
    </div>
  );
};

const Stats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsItem
        icon={<HeartPulse size={24} className="text-primary" />}
        label="Cases Funded"
        value="1,248"
      />
      <StatsItem
        icon={<Users size={24} className="text-primary" />}
        label="Patients Helped"
        value="978"
      />
      <StatsItem
        icon={<BadgeCheck size={24} className="text-primary" />}
        label="Medical Verifiers"
        value="312"
      />
      <StatsItem
        icon={<Banknote size={24} className="text-primary" />}
        label="Total Donated"
        value="$4.2M"
        subValue="Since 2023"
      />
    </div>
  );
};

export default Stats;
