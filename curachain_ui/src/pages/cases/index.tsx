// src/pages/cases/index.tsx
import React, { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { CaseList } from '../../components/cases/CaseList';
import { useCuraChain } from '../../contexts/CuraChainContext';

const CasesPage: React.FC = () => {
  const { allCases, casesLoading, refreshCases } = useCuraChain();
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter cases by search term
  const filteredCases = allCases.filter(caseItem => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      caseItem.caseId.toLowerCase().includes(searchLower) ||
      caseItem.description.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Layout>
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Browse Medical Cases</h1>
        
        <div className="flex gap-2">
          <div className="form-control">
            <input
              type="text"
              placeholder="Search cases..."
              className="input input-bordered"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button
            className="btn btn-outline"
            onClick={() => refreshCases()}
            disabled={casesLoading}
          >
            {casesLoading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              'Refresh'
            )}
          </button>
        </div>
      </div>
      
      <div className="divider"></div>
      
      <CaseList
        cases={filteredCases}
        loading={casesLoading}
        filters={true}
      />
      
      {!casesLoading && filteredCases.length === 0 && searchTerm && (
        <div className="bg-base-200 rounded-lg p-8 text-center mt-8">
          <h3 className="text-xl font-semibold mb-2">No Matching Cases</h3>
          <p className="opacity-70">
            No medical cases found matching "{searchTerm}".
          </p>
          <button 
            className="btn btn-primary mt-4"
            onClick={() => setSearchTerm('')}
          >
            Clear Search
          </button>
        </div>
      )}
    </Layout>
  );
};

export default CasesPage;