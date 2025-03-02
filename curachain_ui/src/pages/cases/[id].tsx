// src/pages/cases/[id].tsx
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { NodeWallet } from '@coral-xyz/anchor/dist/cjs/provider';
import { PatientService } from '../../services/patientService';
import { DonationService } from '../../services/donationService';
import { VerifierService } from '../../services/verifierService';

interface CaseDetails {
  caseId: string;
  description: string;
  totalAmountNeeded: number;
  totalRaised: number;
  isVerified: boolean;
  patientAddress: string;
  encryptedLink: string;
  isFunded: boolean;
}

const CaseDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { publicKey, signTransaction, signAllTransactions } = useWallet();
  const [loading, setLoading] = useState(true);
  const [caseDetails, setCaseDetails] = useState<CaseDetails | null>(null);
  const [error, setError] = useState('');
  const [isVerifier, setIsVerifier] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txStatus, setTxStatus] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchCaseDetails = async () => {
      try {
        setLoading(true);
        const connection = new Connection(
          process.env.NEXT_PUBLIC_RPC_URL || 'https://api.devnet.solana.com'
        );

        if (!publicKey || !signTransaction || !signAllTransactions) {
          // Even if wallet is not connected, we can still fetch public case data
          // Simplified approach for this example
          setCaseDetails({
            caseId: id as string,
            description: 'Sample case description',
            totalAmountNeeded: 100000000,
            totalRaised: 50000000,
            isVerified: true,
            patientAddress: 'Sample address',
            encryptedLink: 'encrypted://link',
            isFunded: false,
          });
          return;
        }

        const wallet = new NodeWallet({
          publicKey,
          signTransaction,
          signAllTransactions,
        });

        // Check if the connected user is a verifier
        // This is a placeholder for actual PDA verification
        const isVerifierCheck = false; // Replace with actual check
        setIsVerifier(isVerifierCheck);

        const patientService = new PatientService(connection, wallet);
        const caseData = await patientService.fetchCaseDetails(id as string);
        setCaseDetails(caseData);
      } catch (err: any) {
        console.error('Error fetching case details:', err);
        setError(err.message || 'An error occurred while fetching case details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCaseDetails();
  }, [id, publicKey, signTransaction, signAllTransactions]);

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey || !signTransaction || !signAllTransactions || !id || !caseDetails) {
      setTxStatus({
        message: 'Please connect your wallet first.',
        type: 'error',
      });
      return;
    }

    const amount = parseFloat(donationAmount);
    if (isNaN(amount) || amount <= 0) {
      setTxStatus({
        message: 'Please enter a valid donation amount.',
        type: 'error',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setTxStatus(null);

      const connection = new Connection(
        process.env.NEXT_PUBLIC_RPC_URL || 'https://api.devnet.solana.com'
      );
      const wallet = new NodeWallet({
        publicKey,
        signTransaction,
        signAllTransactions,
      });

      const donationService = new DonationService(connection, wallet);
      const lamports = Math.floor(amount * 1_000_000_000); // Convert SOL to lamports
      const tx = await donationService.donateToCase(id as string, lamports);

      setTxStatus({
        message: `Donation successful! Transaction signature: ${tx}`,
        type: 'success',
      });
      setDonationAmount('');

      // Refresh case details after successful donation
      setTimeout(() => {
        router.reload();
      }, 3000);
    } catch (err: any) {
      console.error('Error donating:', err);
      setTxStatus({
        message: err.message || 'An error occurred while donating.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (approve: boolean) => {
    if (!publicKey || !signTransaction || !signAllTransactions || !id || !caseDetails) {
      setTxStatus({
        message: 'Please connect your wallet first.',
        type: 'error',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setTxStatus(null);

      const connection = new Connection(
        process.env.NEXT_PUBLIC_RPC_URL || 'https://api.devnet.solana.com'
      );
      const wallet = new NodeWallet({
        publicKey,
        signTransaction,
        signAllTransactions,
      });

      const verifierService = new VerifierService(connection, wallet);
      const tx = await verifierService.verifyCase(id as string, approve);

      setTxStatus({
        message: `Verification ${approve ? 'approved' : 'rejected'} successfully! Transaction signature: ${tx}`,
        type: 'success',
      });

      // Refresh case details after successful verification
      setTimeout(() => {
        router.reload();
      }, 3000);
    } catch (err: any) {
      console.error('Error verifying case:', err);
      setTxStatus({
        message: err.message || 'An error occurred during verification.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading case details...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 p-4 rounded-md text-red-700">{error}</div>
        </div>
      </Layout>
    );
  }

  if (!caseDetails) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto text-center py-12">
          <p className="text-gray-600">Case not found.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{caseDetails.caseId} - CuraChain</title>
      </Head>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold text-gray-800">{caseDetails.caseId}</h1>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  caseDetails.isVerified
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {caseDetails.isVerified ? 'Verified' : 'Pending Verification'}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-700 mb-2">Description</h2>
              <p className="text-gray-600">{caseDetails.description}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-700 mb-2">Funding Progress</h2>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className="bg-blue-600 h-4 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      (caseDetails.totalRaised / caseDetails.totalAmountNeeded) * 100
                    )}%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  {((caseDetails.totalRaised / caseDetails.totalAmountNeeded) * 100).toFixed(0)}% funded
                </span>
                <span className="text-gray-700 font-medium">
                  {(caseDetails.totalRaised / 1_000_000_000).toFixed(2)} SOL / {(caseDetails.totalAmountNeeded / 1_000_000_000).toFixed(2)} SOL
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-700 mb-2">Patient Address</h2>
              <p className="text-gray-600 font-mono text-sm break-all">{caseDetails.patientAddress}</p>
            </div>

            {isVerifier && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h2 className="text-lg font-medium text-blue-700 mb-2">Medical Records (Verifiers Only)</h2>
                <p className="text-blue-600 font-mono text-sm break-all mb-4">{caseDetails.encryptedLink}</p>
                
                {!caseDetails.isVerified && (
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleVerify(true)}
                      className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleVerify(false)}
                      className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            )}

            {txStatus && (
              <div
                className={`mb-6 p-4 rounded-md ${
                  txStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}
              >
                {txStatus.message}
              </div>
            )}

            {caseDetails.isVerified && !caseDetails.isFunded && publicKey && (
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Make a Donation</h2>
                <form onSubmit={handleDonate}>
                  <div className="mb-4">
                    <label htmlFor="donationAmount" className="block text-gray-700 font-medium mb-2">
                      Amount (SOL)
                    </label>
                    <input
                      id="donationAmount"
                      type="number"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      placeholder="Enter donation amount"
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Processing...' : 'Donate'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {caseDetails.isFunded && (
              <div className="mt-8 p-6 bg-green-50 rounded-lg">
                <h2 className="text-xl font-semibold text-green-800 mb-2">Funding Goal Reached!</h2>
                <p className="text-green-700">
                  This case has been fully funded. Thank you to all the donors who contributed.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CaseDetailPage;