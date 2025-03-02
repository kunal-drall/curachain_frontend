// src/components/verifier/CaseVerification.tsx
import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useCuraChain } from '../../contexts/CuraChainContext';
import { lamportsToSol, shortenPubkey } from '../../utils/anchor-curachain';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

interface CaseVerificationProps {
  caseId: string;
}

export const CaseVerification: React.FC<CaseVerificationProps> = ({ caseId }) => {
  const { publicKey } = useWallet();
  const { verifierService, isVerifier, refreshCases } = useCuraChain();
  
  // State
  const [verificationStatus, setVerificationStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [caseDetails, setCaseDetails] = useState<any>(null);
  
  // Load verification status and case details
  useEffect(() => {
    const loadVerificationData = async () => {
      if (!verifierService || !caseId) return;
      
      try {
        setIsLoading(true);
        
        // Load verification status and case details in parallel
        const [status, details] = await Promise.all([
          verifierService.getCaseVerificationStatus(caseId),
          verifierService.program.account.patientCase.fetch(
            (await verifierService.program.account.caseIdLookup.fetch(
              (await PublicKey.findProgramAddressSync(
                [Buffer.from('case_lookup'), Buffer.from(caseId)],
                verifierService.program.programId
              ))[0]
            )).patientPda
          )
        ]);
        
        setVerificationStatus(status);
        setCaseDetails(details);
      } catch (error) {
        console.error('Error loading verification data:', error);
        toast.error('Failed to load case data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadVerificationData();
  }, [verifierService, caseId]);
  
  // Handle verification vote
  const handleVerify = async (approve: boolean) => {
    if (!publicKey || !verifierService || !caseId) {
      toast.error('Please connect your wallet to verify this case');
      return;
    }
    
    try {
      setIsSubmitting(true);
      toast.loading(`${approve ? 'Approving' : 'Rejecting'} this case...`);
      
      // Submit verification to blockchain
      await verifierService.verifyCase(caseId, approve);
      
      // Refresh data
      await refreshCases();
      const status = await verifierService.getCaseVerificationStatus(caseId);
      setVerificationStatus(status);
      
      toast.dismiss();
      toast.success(`Case ${approve ? 'approved' : 'rejected'} successfully`);
    } catch (error) {
      console.error('Error verifying case:', error);
      toast.dismiss();
      
      if (error instanceof Error) {
        toast.error(`Verification failed: ${error.message}`);
      } else {
        toast.error('Verification failed');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Not a verifier
  if (!isVerifier) {
    return (
      <div className="card bg-base-100 shadow-lg w-full max-w-lg mx-auto">
        <div className="card-body">
          <h2 className="card-title">Verify Medical Case</h2>
          <div className="alert alert-warning">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Only registered medical professionals can verify cases.</span>
          </div>
        </div>
      </div>
    );
  }
  
  // Wallet not connected
  if (!publicKey) {
    return (
      <div className="card bg-base-100 shadow-lg w-full max-w-lg mx-auto">
        <div className="card-body">
          <h2 className="card-title">Verify Medical Case</h2>
          <p className="mb-4">Connect your wallet to verify this medical case.</p>
          <div className="flex justify-center">
            <WalletMultiButton />
          </div>
        </div>
      </div>
    );
  }
  
  // Loading state
  if (isLoading) {
    return (
      <div className="card bg-base-100 shadow-lg w-full max-w-lg mx-auto">
        <div className="card-body text-center">
          <h2 className="card-title justify-center mb-4">Verify Medical Case</h2>
          <div className="flex justify-center items-center h-20">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // Already verified or rejected
  if (verificationStatus?.isVerified) {
    return (
      <div className="card bg-base-100 shadow-lg w-full max-w-lg mx-auto">
        <div className="card-body">
          <h2 className="card-title">Case Status: Verified</h2>
          <div className="alert alert-success">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>This case has been verified and is now eligible for donations.</span>
          </div>
          
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Verification Results:</h3>
            <div className="stats shadow w-full">
              <div className="stat">
                <div className="stat-title">Yes Votes</div>
                <div className="stat-value text-success">{verificationStatus.yesVotes}</div>
              </div>
              <div className="stat">
                <div className="stat-title">No Votes</div>
                <div className="stat-value text-error">{verificationStatus.noVotes}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Approval Rate</div>
                <div className="stat-value">{verificationStatus.approvalRate.toFixed(1)}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Current verifier already voted
  if (verificationStatus?.hasCurrentVerifierVoted) {
    return (
      <div className="card bg-base-100 shadow-lg w-full max-w-lg mx-auto">
        <div className="card-body">
          <h2 className="card-title">Already Voted</h2>
          <div className="alert alert-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>You have already submitted your verification for this case.</span>
          </div>
          
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Current Verification Status:</h3>
            <div className="stats shadow w-full">
              <div className="stat">
                <div className="stat-title">Yes Votes</div>
                <div className="stat-value text-success">{verificationStatus.yesVotes}</div>
              </div>
              <div className="stat">
                <div className="stat-title">No Votes</div>
                <div className="stat-value text-error">{verificationStatus.noVotes}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Participation</div>
                <div className="stat-value">{verificationStatus.participationRate.toFixed(1)}%</div>
                <div className="stat-desc">
                  {verificationStatus.votedVerifiers} of {verificationStatus.totalVerifiers} verifiers
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Ready to vote
  return (
    <div className="card bg-base-100 shadow-lg w-full max-w-lg mx-auto">
      <div className="card-body">
        <h2 className="card-title">Verify Medical Case: {caseId}</h2>
        
        {caseDetails && (
          <div className="my-4">
            <div className="bg-base-200 p-4 rounded-lg mb-4">
              <h3 className="font-semibold mb-2">Patient Description:</h3>
              <p className="whitespace-pre-line">{caseDetails.caseDescription}</p>
            </div>
            
            <div className="stats shadow w-full mb-4">
              <div className="stat">
                <div className="stat-title">Patient</div>
                <div className="stat-value text-sm">{shortenPubkey(caseDetails.patientPubkey.toString())}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Amount Needed</div>
                <div className="stat-value text-primary">{lamportsToSol(caseDetails.totalAmountNeeded.toNumber()).toFixed(2)} SOL</div>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Medical Records:</h3>
              <div className="bg-base-200 p-4 rounded-lg">
                <p className="break-all">{caseDetails.linkToRecords}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="alert alert-info mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>
            Please review the case details and medical records before voting.
            Your verification helps ensure the legitimacy of medical cases.
          </span>
        </div>
        
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Current Verification Status:</h3>
          <div className="stats shadow w-full mb-6">
            <div className="stat">
              <div className="stat-title">Yes Votes</div>
              <div className="stat-value text-success">{verificationStatus?.yesVotes || 0}</div>
            </div>
            <div className="stat">
              <div className="stat-title">No Votes</div>
              <div className="stat-value text-error">{verificationStatus?.noVotes || 0}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Participation</div>
              <div className="stat-value">{verificationStatus?.participationRate.toFixed(1) || 0}%</div>
              <div className="stat-desc">
                {verificationStatus?.votedVerifiers || 0} of {verificationStatus?.totalVerifiers || 0} verifiers
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button
            className="btn btn-error flex-1"
            onClick={() => handleVerify(false)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Rejecting...
              </>
            ) : (
              'Reject Case'
            )}
          </button>
          <button
            className="btn btn-success flex-1"
            onClick={() => handleVerify(true)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Approving...
              </>
            ) : (
              'Approve Case'
            )}
          </button>
        </div>
      </div>
    </div>
  );