
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CaseCard from '@/components/CaseCard';
import { ArrowRight } from 'lucide-react';

const featuredCasesData = [
  {
    id: '1',
    title: 'Emergency Heart Surgery for Emma',
    patientName: 'Emma Wilson',
    location: 'Boston, MA',
    condition: 'Congenital Heart Disease',
    description: 'Emma needs an urgent heart surgery to correct a life-threatening condition. The procedure is her best chance for a normal life but is not covered by insurance.',
    imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    currentFunding: 32000,
    targetFunding: 50000,
    createdAt: '2023-05-15',
    verificationStatus: 'verified' as const,
  },
  {
    id: '2',
    title: 'Specialized Cancer Treatment for Michael',
    patientName: 'Michael Reynolds',
    location: 'Chicago, IL',
    condition: 'Stage 3 Lymphoma',
    description: 'Michael has been diagnosed with Stage 3 Lymphoma and needs specialized immunotherapy treatment that shows promising results for his specific cancer subtype.',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    currentFunding: 27500,
    targetFunding: 75000,
    createdAt: '2023-06-02',
    verificationStatus: 'verified' as const,
  },
  {
    id: '3',
    title: 'Stem Cell Therapy for Sarah',
    patientName: 'Sarah Johnson',
    location: 'Austin, TX',
    condition: 'Multiple Sclerosis',
    description: 'Sarah is battling progressive Multiple Sclerosis and seeking funding for experimental stem cell therapy that has shown promising results in clinical trials.',
    imageUrl: 'https://images.unsplash.com/photo-1631815590058-860e4f105c9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2342&q=80',
    currentFunding: 18000,
    targetFunding: 60000,
    createdAt: '2023-05-28',
    verificationStatus: 'in-review' as const,
  }
];

const FeaturedCases: React.FC = () => {
  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Featured Cases</h2>
          <p className="text-muted-foreground mt-2">
            These verified cases need your help the most
          </p>
        </div>
        <Link to="/cases">
          <Button variant="outline" className="mt-4 sm:mt-0">
            View All Cases
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredCasesData.map((caseItem) => (
          <CaseCard
            key={caseItem.id}
            {...caseItem}
            featured={true}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedCases;
