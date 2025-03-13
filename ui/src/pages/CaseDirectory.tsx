
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CaseCard from '@/components/CaseCard';
import SearchAndFilter from '@/components/SearchAndFilter';
import { cn } from '@/lib/utils';

// Define the type for the case items
type CaseItem = {
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
}

// Sample data for demonstration
const allCases: CaseItem[] = [
  {
    id: '1',
    title: 'Emergency Heart Surgery for Emma',
    patientName: 'Emma Wilson',
    location: 'Boston, MA',
    condition: 'Heart Disease',
    description: 'Emma needs an urgent heart surgery to correct a life-threatening condition. The procedure is her best chance for a normal life but is not covered by insurance.',
    imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    currentFunding: 32000,
    targetFunding: 50000,
    createdAt: '2023-05-15',
    verificationStatus: 'verified',
  },
  {
    id: '2',
    title: 'Specialized Cancer Treatment for Michael',
    patientName: 'Michael Reynolds',
    location: 'Chicago, IL',
    condition: 'Cancer',
    description: 'Michael has been diagnosed with Stage 3 Lymphoma and needs specialized immunotherapy treatment that shows promising results for his specific cancer subtype.',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    currentFunding: 27500,
    targetFunding: 75000,
    createdAt: '2023-06-02',
    verificationStatus: 'verified',
  },
  {
    id: '3',
    title: 'Stem Cell Therapy for Sarah',
    patientName: 'Sarah Johnson',
    location: 'Austin, TX',
    condition: 'Neurological',
    description: 'Sarah is battling progressive Multiple Sclerosis and seeking funding for experimental stem cell therapy that has shown promising results in clinical trials.',
    imageUrl: 'https://images.unsplash.com/photo-1631815590058-860e4f105c9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2342&q=80',
    currentFunding: 18000,
    targetFunding: 60000,
    createdAt: '2023-05-28',
    verificationStatus: 'in-review',
  },
  {
    id: '4',
    title: 'Kidney Transplant for David',
    patientName: 'David Chen',
    location: 'Seattle, WA',
    condition: 'Transplant',
    description: 'David has been on dialysis for 3 years and finally has a kidney donor match. He needs help with the transplant costs and post-operative care that exceeds his insurance coverage.',
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    currentFunding: 45000,
    targetFunding: 120000,
    createdAt: '2023-06-10',
    verificationStatus: 'verified',
  },
  {
    id: '5',
    title: 'Rare Genetic Disorder Treatment for Sophia',
    patientName: 'Sophia Martinez',
    location: 'Miami, FL',
    condition: 'Rare Disease',
    description: 'Sophia was diagnosed with a rare genetic disorder that requires specialized treatment only available at a few medical centers globally. The family needs help covering travel and treatment costs.',
    imageUrl: 'https://images.unsplash.com/photo-1625134673337-519d4d5e97d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2338&q=80',
    currentFunding: 12000,
    targetFunding: 85000,
    createdAt: '2023-05-20',
    verificationStatus: 'pending',
  },
  {
    id: '6',
    title: 'Chemotherapy for James',
    patientName: 'James Wilson',
    location: 'Denver, CO',
    condition: 'Cancer',
    description: 'James was recently diagnosed with pancreatic cancer and needs help covering the costs of chemotherapy and supportive care that go beyond his insurance coverage.',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    currentFunding: 29000,
    targetFunding: 50000,
    createdAt: '2023-06-05',
    verificationStatus: 'verified',
  },
  {
    id: '7',
    title: 'Pediatric Surgery for Lucas',
    patientName: 'Lucas Thompson',
    location: 'Minneapolis, MN',
    condition: 'Pediatric',
    description: 'Lucas requires a specialized pediatric surgery to correct a congenital condition. His family needs help with the medical costs not covered by their insurance.',
    imageUrl: 'https://images.unsplash.com/photo-1559304822-9eb2813c9844?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1936&q=80',
    currentFunding: 17500,
    targetFunding: 40000,
    createdAt: '2023-06-15',
    verificationStatus: 'in-review',
  },
  {
    id: '8',
    title: 'Spinal Surgery for Robert',
    patientName: 'Robert Garcia',
    location: 'Phoenix, AZ',
    condition: 'Neurological',
    description: 'Robert suffered a severe spinal injury in an accident and needs surgery to prevent permanent paralysis. Insurance only covers part of the procedure and he needs help with the rest.',
    imageUrl: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    currentFunding: 38000,
    targetFunding: 90000,
    createdAt: '2023-05-25',
    verificationStatus: 'verified',
  },
  {
    id: '9',
    title: 'Specialized Autism Therapy for Max',
    patientName: 'Max Kim',
    location: 'Portland, OR',
    condition: 'Other',
    description: 'Max, a 6-year-old with autism, needs specialized ABA therapy not fully covered by insurance. The family is seeking help to provide him with the best chance for development.',
    imageUrl: 'https://images.unsplash.com/photo-1588117260148-b47818741c74?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2232&q=80',
    currentFunding: 9000,
    targetFunding: 30000,
    createdAt: '2023-06-08',
    verificationStatus: 'pending',
  },
];

const CaseDirectory = () => {
  const [filteredCases, setFilteredCases] = useState<CaseItem[]>(allCases);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    condition: 'all',
    location: 'all',
    sortBy: 'newest'
  });
  
  // Filter and sort cases based on search term and filters
  useEffect(() => {
    let result = [...allCases];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        caseItem => 
          caseItem.title.toLowerCase().includes(term) || 
          caseItem.description.toLowerCase().includes(term) ||
          caseItem.patientName.toLowerCase().includes(term) ||
          caseItem.condition.toLowerCase().includes(term) ||
          caseItem.location.toLowerCase().includes(term)
      );
    }
    
    // Filter by status
    if (filters.status !== 'all') {
      if (filters.status === 'urgent') {
        result = result.filter(caseItem => 
          (caseItem.targetFunding - caseItem.currentFunding) > 20000 && 
          caseItem.verificationStatus === 'verified'
        );
      } else {
        result = result.filter(caseItem => caseItem.verificationStatus === filters.status);
      }
    }
    
    // Filter by condition
    if (filters.condition !== 'all') {
      result = result.filter(caseItem => 
        caseItem.condition.toLowerCase() === filters.condition.toLowerCase()
      );
    }
    
    // Filter by location (simplified for demo)
    if (filters.location !== 'all') {
      if (filters.location === 'north-america') {
        result = result.filter(caseItem => 
          ['Boston, MA', 'Chicago, IL', 'Austin, TX', 'Seattle, WA', 'Miami, FL', 
           'Denver, CO', 'Minneapolis, MN', 'Phoenix, AZ', 'Portland, OR'].includes(caseItem.location)
        );
      }
    }
    
    // Sort cases
    switch (filters.sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'urgency':
        result.sort((a, b) => {
          const aUrgency = (a.targetFunding - a.currentFunding) / a.targetFunding;
          const bUrgency = (b.targetFunding - b.currentFunding) / b.targetFunding;
          return bUrgency - aUrgency;
        });
        break;
      case 'goal-asc':
        result.sort((a, b) => a.targetFunding - b.targetFunding);
        break;
      case 'goal-desc':
        result.sort((a, b) => b.targetFunding - a.targetFunding);
        break;
      case 'progress':
        result.sort((a, b) => {
          const aProgress = a.currentFunding / a.targetFunding;
          const bProgress = b.currentFunding / b.targetFunding;
          return bProgress - aProgress;
        });
        break;
      default:
        break;
    }
    
    setFilteredCases(result);
  }, [searchTerm, filters]);
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-background">
        {/* Page Header */}
        <section className="bg-primary text-white py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Find Cases to Support</h1>
              <p className="text-lg text-white/80">
                Browse verified medical cases that need your help. Every donation makes a difference.
              </p>
            </div>
          </div>
        </section>
        
        {/* Case Directory */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SearchAndFilter 
              onSearch={handleSearch}
              onFilterChange={handleFilterChange}
              className="mb-8"
            />
            
            {filteredCases.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No cases found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCases.map((caseItem) => (
                  <CaseCard
                    key={caseItem.id}
                    {...caseItem}
                    className={cn(
                      "animate-fade-in",
                      caseItem.verificationStatus === 'verified' && filters.status === 'all' && 
                      "ring-1 ring-primary/20"
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default CaseDirectory;
