// src/pages/dashboard.tsx
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import Head from 'next/head';
import Link from 'next/link';
import { NodeWallet } from '@coral-xyz/anchor/dist/cjs/provider';
import { PROGRAM_ID } from '../utils/anchor-curachain';

interface Case {
  caseId: string;
  description: string;
  totalAmountNeeded: number;
  totalRaised: number;
  isVerified: boolean;
}

interface Donation {
  caseId: string;
  amount: number;
  timestamp: number;
}

const Dashboard = () => {
  const { publicKey, signTransaction, signAllTransactions } = useWallet();
  const [loading, setLoading] = useState(true);
  const [isVerifier, setIsVerifier] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [patientCases, setPatientCases] = useState<Case[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [pendingVerifications, setPendingVerifications] = useState<Case[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!publicKey || !signTransaction || !signAllTransactions) {
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const connection = new Connection(
          process.env.NEXT_PUBLIC_RPC_URL || 'https://api.devnet.solana.com'
        );
        const wallet = new NodeWallet({
          publicKey,
          signTransaction,
          signAllTransactions,
        });

        // Check if user is a verifier
        // This is a placeholder for actual PDA checking
        const [verifierPDA] = PublicKey.findProgramAddressSync(
          [Buffer.from('verifier_role'), publicKey.toBuffer()],
          PROGRAM_ID
        );
        
        try {
          // Try to fetch the verifier account
          // If it exists, this user is a verifier
          await connection.getAccountInfo(verifierPDA);
          setIsVerifier(true);
          
          // If user is a verifier, fetch pending cases for verification
          // Placeholder for actual fetching logic
          setPendingVerifications([
            {
              caseId: 'CASE0002',
              description: 'Pending verification case',
              totalAmountNeeded: 100000000,
              totalRaised: 0,
              isVerified: false,
            },
          ]);
        } catch {
          // If account doesn't exist, user is not a verifier
          setIsVerifier(false);
        }
        
        // Check if user is an admin
        // This is a placeholder for actual PDA checking
        const [adminPDA] = PublicKey.findProgramAddressSync(
          [Buffer.from('admin'), publicKey.toBuffer()],
          PROGRAM_ID
        );
        
        try {
          // Try to fetch the admin account
          await connection.getAccountInfo(adminPDA);
          setIsAdmin(true);
        } catch {
          // If account doesn't exist, user is not an admin
          setIsAdmin(false);
        }

        // Fetch patient cases submitted by this user
        // Placeholder for actual fetching logic
        setPatientCases([
          {
            caseId: 'CASE0001',
            description: 'Sample patient case',
            totalAmountNeeded: 100000000,
            totalRaised: 50000000,
            isVerified: true,
          },
        ]);
        
        // Fetch donations made by this user
        // Placeholder for actual fetching logic
        setDonations([
          {
            caseId: 'CASE0001',
            amount: 10000000,
            timestamp: Date.now(),
          },
        ]);
      } catch (err: any) {
        console.error('Error fetching user data:', err);
        setError(err.message || 'An error occurred while fetching your data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [publicKey, signTransaction, signAllTransactions]);

  if (!publicKey) {
    return (
      <Layout>
        <Head>
          <title>Dashboard - CuraChain</title>
        </Head>
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
          <p className="text-gray-600 mb-8">Please connect your wallet to view your dashboard.</p>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Dashboard - CuraChain</title>
      </Head>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>

        {error && (
          <div className="bg-red-50 p-4 rounded-md text-red-700 mb-6">{error}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Wallet</h2>
            <p className="text-gray-500 break-all font-mono text-sm">{publicKey.toString()}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Role</h2>
            <div className="space-y-2">
              {isAdmin && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  Admin
                </span>
              )}
              {isVerifier && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  Verifier
                </span>
              )}
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Patient/Donor
              </span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Actions</h2>
            <div className="space-y-2">
              <Link href="/patient/submit" className="text-blue-600 hover:underline block">
                Submit Medical Case
              </Link>
              <Link href="/cases" className="text-blue-600 hover:underline block">
                Browse Cases
              </Link>
              {isAdmin && (
                <Link href="/admin" className="text-blue-600 hover:underline block">
                  Admin Panel
                </Link>
              )}
            </div>
          </div>
        </div>

        {patientCases.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Your Medical Cases</h2>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Case ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount Needed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount Raised
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patientCases.map((caseItem) => (
                    <tr key={caseItem.caseId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{caseItem.caseId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 truncate max-w-xs">{caseItem.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{(caseItem.totalAmountNeeded / 1_000_000_000).toFixed(2)} SOL</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{(caseItem.totalRaised / 1_000_000_000).toFixed(2)} SOL</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          caseItem.isVerified
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {caseItem.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        <Link href={`/cases/${caseItem.caseId}`} className="hover:underline">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {donations.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Your Donations</h2>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Case ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {donations.map((donation, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{donation.caseId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{(donation.amount / 1_000_000_000).toFixed(2)} SOL</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{new Date(donation.timestamp).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        <Link href={`/cases/${donation.caseId}`} className="hover:underline">
                          View Case
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {isVerifier && pendingVerifications.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Pending Verifications</h2>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Case ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount Needed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingVerifications.map((caseItem) => (
                    <tr key={caseItem.caseId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{caseItem.caseId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 truncate max-w-xs">{caseItem.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{(caseItem.totalAmountNeeded / 1_000_000_000).toFixed(2)} SOL</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        <Link href={`/cases/${caseItem.caseId}`} className="hover:underline">
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {isAdmin && (
          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Admin Actions</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="space-y-2">
                <Link href="/admin/verifiers" className="text-blue-600 hover:underline block">
                  Manage Verifiers
                </Link>
                <Link href="/admin/cases" className="text-blue-600 hover:underline block">
                  Manage Cases
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;