// src/components/cases/CaseList.tsx
import React, { useState } from 'react';
import { CaseCard } from './CaseCard';
import { CaseDetails } from '../../services/patientService';

interface CaseListProps {
  cases: CaseDetails[];
  title?: string;
  loading?: boolean;
  compact?: boolean;
  filters?: boolean;
}

export const CaseList: React.FC<CaseListProps> = ({
  cases,
  title,
  loading = false,
  compact = false,
  filters = false,
}) => {
  // Filter states
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'funding'>('newest');
  
  // Apply filters and sorting
  const filteredCases = cases.filter(caseItem => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'verified') return caseItem.isVerified;
    if (statusFilter === 'pending') return !caseItem.isVerified;
    return true;
  });
  
  // Sort cases
  const sortedCases = [...filteredCases].sort((a, b) => {
    if (sortOrder === 'funding') {
      // Sort by funding percentage (highest first)
      const aPercentage = a.totalRaised / a.totalAmountNeeded;
      const bPercentage = b.totalRaised / b.totalAmountNeeded;
      return bPercentage - aPercentage;
    } else {
      // Sort by case ID (newest first - higher ID is newer)
      const aId = parseInt(a.caseId.replace('CASE', ''));
      const bId = parseInt(b.caseId.replace('CASE', ''));
      return bId - aId;
    }
  });

  if (loading) {
    return (
      <div className="w-full">
        {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      </div>
    );
  }

  if (sortedCases.length === 0) {
    return (
      <div className="w-full">
        {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
        <div className="bg-base-200 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold mb-2">No Cases Found</h3>
          <p className="opacity-70">
            There are currently no medical cases matching your criteria.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
      
      {filters && (
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="join">
            <button 
              className={`btn btn-sm join-item ${statusFilter === 'all' ? 'btn-active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All
            </button>
            <button 
              className={`btn btn-sm join-item ${statusFilter === 'verified' ? 'btn-active' : ''}`}
              onClick={() => setStatusFilter('verified')}
            >
              Verified
            </button>
            <button 
              className={`btn btn-sm join-item ${statusFilter === 'pending' ? 'btn-active' : ''}`}
              onClick={() => setStatusFilter('pending')}
            >
              Pending
            </button>
          </div>
          
          <div className="join ml-auto">
            <button 
              className={`btn btn-sm join-item ${sortOrder === 'newest' ? 'btn-active' : ''}`}
              onClick={() => setSortOrder('newest')}
            >
              Newest
            </button>
            <button 
              className={`btn btn-sm join-item ${sortOrder === 'funding' ? 'btn-active' : ''}`}
              onClick={() => setSortOrder('funding')}
            >
              Funding %
            </button>
          </div>
        </div>
      )}
      
      <div className={`grid gap-6 ${compact ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
        {sortedCases.map((caseItem) => (
          <CaseCard 
            key={caseItem.caseId} 
            caseData={caseItem} 
            compact={compact}
          />
        ))}
      </div>
    </div>
  );
};