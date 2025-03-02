// src/pages/dashboard/index.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Layout } from '../../components/layout/Layout';
import { CaseList } from '../../components/cases/CaseList';
import { useCuraChain } from '../../contexts/CuraChainContext';
import { lamportsToSol, shortenPubkey } from '../../utils/anchor-curachain';
import { toast } from 'react-hot-toast';

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const { publicKey } = useWallet();
  const { 
    patientService,
    donationService,
    verifierService,
    adminService,
    isVerifier,
    isAdmin,
    userCases,
    isConnected,
    loading,
    casesLoading,
    refreshCases
  } = useCuraChain();
  
  // User data
  const [donations, setDonations] = useState<any>({
    totalDonated: 0,
    donationCount: 0,
  });
  
  const [pendingVerifications, setPendingVerifications] = useState<any[]>([]);
  const [loadingVerifications, setLoadingVerifications] = useState(false);
  const [platformStats, setPlatformStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  
  // Load user donations and other data
  useEffect(() => {
    const loadUserData = async () => {
      if (!isConnected || !donationService) return;
      
      try {
        const donationInfo = await donationService.getMyDonations();
        setDonations(donationInfo);
      } catch (error) {
        console.error('Error loading donation data:', error);
      }
    };
    
    loadUserData();
  }, [isConnected, donationService]);
  
  // Load pending verifications for medical professionals
  useEffect(() => {
    const loadVerifications = async () => {
      if (!isConnected || !isVerifier || !verifierService) return;
      
      try {
        setLoadingVerifications(true);
        const pendingCases = await verifierService.getPendingCases();
        setPendingVerifications(pendingCases);
      } catch (error) {
        console.error('Error loading pending verifications:', error);
        toast.error('Failed to load pending verifications');
      } finally {
        setLoadingVerifications(false);
      }
    };
    
    loadVerifications();
  }, [isConnected, isVerifier, verifierService]);
  
  // Load platform stats for admins
  useEffect(() => {
    const loadPlatformStats = async () => {
      if (!isConnected || !isAdmin || !adminService) return;
      
      try {
        setLoadingStats(true);
        const stats = await adminService.getPlatformStats();
        setPlatformStats(stats);
      } catch (error) {
        console.error('Error loading platform stats:', error);
        toast.error('Failed to load platform statistics');
      } finally {
        setLoadingStats(false);
      }
    };
    
    loadPlatformStats();
  }, [isConnected, isAdmin, adminService]);
  
  // Wallet not connected
  if (!publicKey) {
    return (
      <Layout>
        <div className="card bg-base-100 shadow-lg max-w-2xl mx-auto">
          <div className="card-body text-center">
            <h2 className="card-title text-2xl justify-center mb-4">Dashboard</h2>
            <p className="mb-6">Connect your wallet to access your dashboard.</p>
            
            <div className="flex justify-center">
              <WalletMultiButton />
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      
      {/* User overview */}
      <div className="card bg-base-100 shadow-lg mb-8">
        <div className="card-body">
          <h2 className="card-title">Account Overview</h2>
          <p className="font-mono">Address: {shortenPubkey(publicKey.toString())}</p>
          
          <div className="stats shadow mt-4">
            <div className="stat">
              <div className="stat-title">Your Cases</div>
              <div className="stat-value">{userCases.length}</div>
              <div className="stat-desc">Submitted medical cases</div>
            </div>
            
            <div className="stat">
              <div className="stat-title">Donated</div>
              <div className="stat-value">{lamportsToSol(donations.totalDonated).toFixed(2)} SOL</div>
              <div className="stat-desc">Total donations made</div>
            </div>
            
            {isVerifier && (
              <div className="stat">
                <div className="stat-title">Pending Verifications</div>
                <div className="stat-value">{pendingVerifications.length}</div>
                <div className="stat-desc">Cases awaiting your review</div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* User roles section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Patient role */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Patient</h2>
            <p>Submit medical cases for verification and funding.</p>
            <div className="card-actions justify-end mt-4">
              <Link href="/submit-case" className="btn btn-primary">
                Submit New Case
              </Link>
            </div>
          </div>
        </div>
        
        {/* Donor role */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Donor</h2>
            <p>Browse and donate to verified medical cases.</p>
            <div className="card-actions justify-end mt-4">
              <Link href="/cases" className="btn btn-primary">
                Browse Cases
              </Link>
            </div>
          </div>
        </div>
        
        {/* Verifier role */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">
              Medical Verifier
              {isVerifier && <div className="badge badge-success">Active</div>}
            </h2>
            <p>
              {isVerifier 
                ? "Review and verify submitted medical cases."
                : "Only registered medical professionals can verify cases."}
            </p>
            <div className="card-actions justify-end mt-4">
              {isVerifier && pendingVerifications.length > 0 && (
                <Link href="/dashboard/verifications" className="btn btn-primary">
                  Review Cases
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* User's cases */}
      {userCases.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Your Medical Cases</h2>
          <CaseList
            cases={userCases}
            loading={casesLoading}
          />
        </div>
      )}
      
      {/* Pending verifications for medical professionals */}
      {isVerifier && pendingVerifications.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Pending Verifications</h2>
          
          {loadingVerifications ? (
            <div className="flex justify-center my-8">
              <div className="loading loading-spinner loading-lg"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Case ID</th>
                    <th>Description</th>
                    <th>Amount Needed</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingVerifications.map((caseItem) => (
                    <tr key={caseItem.caseId}>
                      <td>{caseItem.caseId}</td>
                      <td className="max-w-sm truncate">{caseItem.description}</td>
                      <td>{lamportsToSol(caseItem.amountNeeded).toFixed(2)} SOL</td>
                      <td>
                        <Link 
                          href={`/cases/${caseItem.caseId}`} 
                          className="btn btn-sm btn-primary"
                        >
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="text-center mt-4">
            <Link href="/dashboard/verifications" className="btn btn-outline">
              View All Pending Verifications
            </Link>
          </div>
        </div>
      )}
      
      {/* Platform statistics for admins */}
      {isAdmin && platformStats && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Platform Statistics</h2>
          
          {loadingStats ? (
            <div className="flex justify-center my-8">
              <div className="loading loading-spinner loading-lg"></div>
            </div>
          ) : (
            <div className="stats shadow w-full">
              <div className="stat">
                <div className="stat-title">Total Cases</div>
                <div className="stat-value">{platformStats.totalCasesSubmitted}</div>
                <div className="stat-desc">All time</div>
              </div>
              
              <div className="stat">
                <div className="stat-title">Verified Cases</div>
                <div className="stat-value">{platformStats.verifiedCases}</div>
                <div className="stat-desc">{((platformStats.verifiedCases / platformStats.activeCases) * 100).toFixed(0)}% verification rate</div>
              </div>
              
              <div className="stat">
                <div className="stat-title">Total Funded</div>
                <div className="stat-value">{platformStats.fullyFundedCases}</div>
                <div className="stat-desc">{((platformStats.fullyFundedCases / platformStats.verifiedCases) * 100).toFixed(0)}% funded rate</div>
              </div>
              
              <div className="stat">
                <div className="stat-title">Total Raised</div>
                <div className="stat-value">{lamportsToSol(platformStats.totalRaised).toFixed(2)} SOL</div>
                <div className="stat-desc">All time</div>
              </div>
            </div>
          )}
          
          <div className="text-center mt-4">
            <Link href="/dashboard/admin" className="btn btn-outline">
              Open Admin Panel
            </Link>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default DashboardPage;