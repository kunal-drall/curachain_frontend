// src/components/cases/CaseCard.tsx
import React from 'react';
import Link from 'next/link';
import { 
  calculateFundingPercentage, 
  lamportsToSol, 
  shortenPubkey
} from '../../utils/anchor-curachain';
import { CaseDetails } from '../../services/patientService';

interface CaseCardProps {
  caseData: CaseDetails;
  compact?: boolean;
}

export const CaseCard: React.FC<CaseCardProps> = ({ caseData, compact = false }) => {
  const {
    caseId,
    description,
    totalAmountNeeded,
    totalRaised,
    isVerified,
    patientAddress,
  } = caseData;

  // Calculate funding percentage
  const fundingPercentage = calculateFundingPercentage(totalRaised, totalAmountNeeded);
  
  // Format amounts for display
  const amountNeededSol = lamportsToSol(totalAmountNeeded);
  const amountRaisedSol = lamportsToSol(totalRaised);
  
  // Determine status badge
  const getBadge = () => {
    if (!isVerified) {
      return <span className="badge badge-warning">Pending Verification</span>;
    }
    if (totalRaised >= totalAmountNeeded) {
      return <span className="badge badge-success">Fully Funded</span>;
    }
    return <span className="badge badge-info">Verified</span>;
  };
  
  // Get appropriate progress bar color
  const getProgressColor = () => {
    if (fundingPercentage < 30) return 'progress-error';
    if (fundingPercentage < 70) return 'progress-warning';
    return 'progress-success';
  };

  // Compact view for featured cases
  if (compact) {
    return (
      <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
        <div className="card-body p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="card-title text-lg">
              {caseId}
              {getBadge()}
            </h3>
          </div>
          
          <p className="text-sm mb-3 line-clamp-2">{description}</p>
          
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span>Funding Progress</span>
              <span className="font-semibold">{fundingPercentage.toFixed(1)}%</span>
            </div>
            <progress 
              className={`progress w-full h-2 ${getProgressColor()}`} 
              value={fundingPercentage} 
              max="100"
            ></progress>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Raised: {amountRaisedSol.toFixed(2)} SOL</span>
            <span>Goal: {amountNeededSol.toFixed(2)} SOL</span>
          </div>
          
          <div className="card-actions justify-end mt-3">
            <Link href={`/cases/${caseId}`} className="btn btn-sm btn-primary">
              View Details
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Full case card
  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <div className="flex justify-between items-start">
          <h2 className="card-title">
            {caseId}
            {getBadge()}
          </h2>
          <div className="text-right">
            <div className="text-sm opacity-70">
              Patient: {shortenPubkey(patientAddress)}
            </div>
          </div>
        </div>
        
        <p className="py-4">{description}</p>
        
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span>Funding Progress</span>
            <span className="font-semibold">{fundingPercentage.toFixed(1)}%</span>
          </div>
          <progress 
            className={`progress w-full ${getProgressColor()}`} 
            value={fundingPercentage} 
            max="100"
          ></progress>
          <div className="flex justify-between mt-1 text-sm opacity-70">
            <span>Raised: {amountRaisedSol.toFixed(2)} SOL</span>
            <span>Goal: {amountNeededSol.toFixed(2)} SOL</span>
          </div>
        </div>
        
        <div className="card-actions justify-end">
          <Link href={`/cases/${caseId}`} className="btn btn-primary">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );