// src/pages/cases/[caseId].tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useConnection } from '@solana/wallet-adapter-react';
import { Layout } from '../../components/layout/Layout';
import { DonationForm } from '../../components/donation/DonationForm';
import { CaseVerification } from '../../components/verifier/CaseVerification';
import { useCuraChain } from '../../contexts/CuraChainContext';
import { PatientService, CaseDetails } from '../../services/patientService';
import { 
  calculateFundingPercentage,
  lamportsToSol, 
  shortenPubkey 
} from '../../utils/anchor-curachain';
import { toast } from 'react-hot-toast';

const CaseDetailPage: React.FC = () => {
  const router = useRouter();
  const { caseId } = router.query;
  const { connection } = useConnection();
  const { isVerifier, isConnected, refreshCases } = useCuraChain();
  
  // State
  const [caseDetails, setCaseDetails] = useState<CaseDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [donations, setDonations] = useState<any[]>([]);
  
  // Load case details
  useEffect(() => {
    const loadCaseDetails = async () => {
      if (!caseId || typeof caseId !== 'string') return;
      
      try {
        setIsLoading(true);
        const details = await PatientService.viewCaseDetails(connection, caseId);
        setCaseDetails(details);
        
        // In a real application, you would load donation history here
        // For now, we'll use mock data if the case has received donations
        if (details.totalRaised > 0) {
          setDonations([
            {
              donor: 'Anonymous',
              amount: details.totalRaised,
              timestamp: new Date(),
            }
          ]);
        }
      } catch (error) {
        console.error('Error loading case details:', error);
        toast.error('Failed to load case details');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCaseDetails();
  }, [caseId, connection]);
  
  // Handle case refresh after donation
  const handleDonationSuccess = async () => {
    if (!caseId || typeof caseId !== 'string') return;
    
    try {
      // Refresh case details
      const details = await PatientService.viewCaseDetails(connection, caseId);
      setCaseDetails(details);
      
      // Update global case data
      await refreshCases();
    } catch (error) {
      console.error('Error refreshing case details:', error);
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      </Layout>
    );
  }
  
  // Case not found
  if (!caseDetails) {
    return (
      <Layout>
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body text-center">
            <h2 className="card-title text-2xl justify-center">Case Not Found</h2>
            <p>The medical case you're looking for could not be found.</p>
            <div className="card-actions justify-center mt-4">
              <Link href="/cases" className="btn btn-primary">
                Browse Cases
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Calculate funding percentage
  const fundingPercentage = calculateFundingPercentage(
    caseDetails.totalRaised,
    caseDetails.totalAmountNeeded
  );
  
  // Format amounts for display
  const amountNeededSol = lamportsToSol(caseDetails.totalAmountNeeded);
  const amountRaisedSol = lamportsToSol(caseDetails.totalRaised);
  const remainingAmountSol = Math.max(0, amountNeededSol - amountRaisedSol);
  
  // Get status badge
  const getStatusBadge = () => {
    if (!caseDetails.isVerified) {
      return <span className="badge badge-warning">Pending Verification</span>;
    }
    if (caseDetails.totalRaised >= caseDetails.totalAmountNeeded) {
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

  return (
    <Layout>
      {/* Back to cases link */}
      <div className="mb-6">
        <Link href="/cases" className="btn btn-sm btn-ghost">
          &larr; Back to Cases
        </Link>
      </div>
      
      {/* Case header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            {caseDetails.caseId}
            {getStatusBadge()}
          </h1>
          <p className="text-sm mt-2">
            Submitted by: <span className="font-mono">{shortenPubkey(caseDetails.patientAddress)}</span>
          </p>
        </div>
        
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Funding Progress</div>
            <div className="stat-value text-primary">{fundingPercentage.toFixed(1)}%</div>
            <div className="stat-desc">
              {amountRaisedSol.toFixed(2)} / {amountNeededSol.toFixed(2)} SOL
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Case details column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Case description card */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title">Medical Condition</h2>
              <p className="whitespace-pre-line">{caseDetails.description}</p>
            </div>
          </div>
          
          {/* Funding progress card */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title">Funding Progress</h2>
              
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span>Progress towards goal</span>
                  <span className="font-semibold">{fundingPercentage.toFixed(1)}%</span>
                </div>
                <progress 
                  className={`progress w-full ${getProgressColor()}`} 
                  value={fundingPercentage} 
                  max="100"
                ></progress>
              </div>
              
              <div className="stats shadow">
                <div className="stat">
                  <div className="stat-title">Goal</div>
                  <div className="stat-value">{amountNeededSol.toFixed(2)} SOL</div>
                  <div className="stat-desc">Total needed for treatment</div>
                </div>
                
                <div className="stat">
                  <div className="stat-title">Raised</div>
                  <div className="stat-value">{amountRaisedSol.toFixed(2)} SOL</div>
                  <div className="stat-desc">From all donations</div>
                </div>
                
                <div className="stat">
                  <div className="stat-title">Remaining</div>
                  <div className="stat-value">{remainingAmountSol.toFixed(2)} SOL</div>
                  <div className="stat-desc">Still needed</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Donation history card */}
          {donations.length > 0 && (
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title">Donation History</h2>
                
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Donor</th>
                        <th>Amount</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donations.map((donation, index) => (
                        <tr key={index}>
                          <td>{donation.donor}</td>
                          <td>{lamportsToSol(donation.amount).toFixed(2)} SOL</td>
                          <td>{donation.timestamp.toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {/* Verification section for medical professionals */}
          {isVerifier && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Medical Verification</h2>
              <CaseVerification caseId={caseDetails.caseId} />
            </div>
          )}
        </div>
        
        {/* Donation column */}
        <div className="lg:col-span-1">
          {/* Donation form */}
          <DonationForm
            caseId={caseDetails.caseId}
            amountNeeded={caseDetails.totalAmountNeeded}
            amountRaised={caseDetails.totalRaised}
            isVerified={caseDetails.isVerified}
            isFunded={caseDetails.isFunded}
            onSuccess={handleDonationSuccess}
          />
          
          {/* Case status card */}
          <div className="card bg-base-100 shadow-lg mt-6">
            <div className="card-body">
              <h2 className="card-title">Case Status</h2>
              
              <div className="space-y-4 mt-2">
                <div className="flex items-center gap-2">
                  <div className={`badge ${caseDetails.isVerified ? 'badge-success' : 'badge-warning'}`}>
                    {caseDetails.isVerified ? 'Verified' : 'Pending'}
                  </div>
                  <span>Verification</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`badge ${caseDetails.isFunded ? 'badge-success' : 'badge-info'}`}>
                    {caseDetails.isFunded ? 'Complete' : 'In Progress'}
                  </div>
                  <span>Funding</span>
                </div>
                
                {caseDetails.isVerified && (
                  <div>
                    <p className="text-sm opacity-70">
                      This case has been verified by medical professionals and is eligible for donations.
                    </p>
                  </div>
                )}
                
                {!caseDetails.isVerified && (
                  <div>
                    <p className="text-sm opacity-70">
                      This case is currently under review by medical professionals. Donations will be enabled once verified.
                    </p>
                  </div>
                )}
                
                {caseDetails.isFunded && (
                  <div className="alert alert-success">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>This case has been fully funded. Thank you to all donors!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Share card */}
          <div className="card bg-base-100 shadow-lg mt-6">
            <div className="card-body">
              <h2 className="card-title">Share This Case</h2>
              <p className="text-sm">Help spread the word to find more donors for this medical case.</p>
              
              <div className="flex gap-2 mt-2">
                <button className="btn btn-outline btn-sm flex-1">
                  Twitter
                </button>
                <button className="btn btn-outline btn-sm flex-1">
                  Facebook
                </button>
                <button className="btn btn-outline btn-sm flex-1">
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CaseDetailPage;