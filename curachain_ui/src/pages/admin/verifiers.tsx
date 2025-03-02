// src/pages/admin/verifiers.tsx
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PROGRAM_ID } from '../../utils/anchor-curachain';
import { NodeWallet } from '@coral-xyz/anchor/dist/cjs/provider';
import * as anchor from '@coral-xyz/anchor';

interface Verifier {
  address: string;
  isActive: boolean;
}

const VerifiersManagement = () => {
  const { publicKey, signTransaction, signAllTransactions } = useWallet();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [verifiers, setVerifiers] = useState<Verifier[]>([]);
  const [newVerifierAddress, setNewVerifierAddress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!publicKey) {
      setLoading(false);
      return;
    }

    const checkAdminStatusAndLoadVerifiers = async () => {
      try {
        setLoading(true);
        const connection = new Connection(
          process.env.NEXT_PUBLIC_RPC_URL || 'https://api.devnet.solana.com'
        );
        
        // Check if user is an admin
        const [adminPDA] = PublicKey.findProgramAddressSync(
          [Buffer.from('admin'), publicKey.toBuffer()],
          PROGRAM_ID
        );
        
        try {
          // Try to fetch the admin account
          const adminAccount = await connection.getAccountInfo(adminPDA);
          if (adminAccount === null) {
            setIsAdmin(false);
            return;
          }
          setIsAdmin(true);
          
          // Fetch verifiers list
          const [verifiersListPDA] = PublicKey.findProgramAddressSync(
            [Buffer.from('verifiers_list')],
            PROGRAM_ID
          );
          
          // This is a placeholder - in a real implementation, you would
          // deserialize the verifiers list account to get all verifiers
          setVerifiers([
            {
              address: 'FhntCGtmFEBivoX7i6mVKbAhvb3FgP5MJoDQX5T7BYD5',
              isActive: true,
            },
            {
              address: '8VFaNqjf7YJxGY7JKSgMMUGJePbj7vgmXGZPpTSLFQwb',
              isActive: true,
            },
          ]);
        } catch (err) {
          console.error('Error checking admin status:', err);
          setIsAdmin(false);
        }
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatusAndLoadVerifiers();
  }, [publicKey]);

  const handleAddVerifier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey || !signTransaction || !signAllTransactions) {
      setError('Please connect your wallet first.');
      return;
    }
    
    if (!newVerifierAddress) {
      setError('Please enter a verifier address.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      setSuccess('');
      
      // Validate the address format
      let verifierPublicKey: PublicKey;
      try {
        verifierPublicKey = new PublicKey(newVerifierAddress);
      } catch (err) {
        setError('Invalid Solana address format.');
        setIsSubmitting(false);
        return;
      }
      
      const connection = new Connection(
        process.env.NEXT_PUBLIC_RPC_URL || 'https://api.devnet.solana.com'
      );
      
      const wallet = new NodeWallet({
        publicKey,
        signTransaction,
        signAllTransactions,
      });
      
      const provider = new anchor.AnchorProvider(connection, wallet, {
        commitment: 'processed',
      });
      
      // This is where you would call your add_or_remove_verifier instruction
      // For this example, we'll just simulate the request
      
      // Simulate successful addition
      setTimeout(() => {
        setVerifiers([
          ...verifiers,
          {
            address: verifierPublicKey.toString(),
            isActive: true,
          },
        ]);
        
        setSuccess(`Verifier ${verifierPublicKey.toString()} added successfully!`);
        setNewVerifierAddress('');
        setIsSubmitting(false);
      }, 1000);
      
    } catch (err: any) {
      console.error('Error adding verifier:', err);
      setError(err.message || 'An error occurred while adding the verifier.');
      setIsSubmitting(false);
    }
  };

  const handleRemoveVerifier = async (address: string) => {
    if (!publicKey || !signTransaction || !signAllTransactions) {
      setError('Please connect your wallet first.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      setSuccess('');
      
      const connection = new Connection(
        process.env.NEXT_PUBLIC_RPC_URL || 'https://api.devnet.solana.com'
      );
      
      const wallet = new NodeWallet({
        publicKey,
        signTransaction,
        signAllTransactions,
      });
      
      const provider = new anchor.AnchorProvider(connection, wallet, {
        commitment: 'processed',
      });
      
      // This is where you would call your add_or_remove_verifier instruction
      // For this example, we'll just simulate the request
      
      // Simulate successful removal
      setTimeout(() => {
        setVerifiers(verifiers.filter(v => v.address !== address));
        setSuccess(`Verifier ${address} removed successfully!`);
        setIsSubmitting(false);
      }, 1000);
      
    } catch (err: any) {
      console.error('Error removing verifier:', err);
      setError(err.message || 'An error occurred while removing the verifier.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!publicKey) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-4">Verifiers Management</h1>
          <p className="text-gray-600 mb-8">Please connect your wallet to access this page.</p>
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">You do not have administrator privileges.</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Manage Verifiers - CuraChain</title>
      </Head>

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Verifiers</h1>
          <Link href="/admin" className="text-blue-600 hover:underline">
            Back to Admin Dashboard
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-md text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 rounded-md text-green-700">
            {success}
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Verifier</h2>
          <form onSubmit={handleAddVerifier} className="space-y-4">
            <div>
              <label htmlFor="verifierAddress" className="block text-gray-700 font-medium mb-2">
                Verifier Wallet Address
              </label>
              <input
                id="verifierAddress"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newVerifierAddress}
                onChange={(e) => setNewVerifierAddress(e.target.value)}
                placeholder="Enter Solana wallet address"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Add Verifier'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <h2 className="text-xl font-semibold p-6 bg-gray-50 border-b">Current Verifiers</h2>
          
          {verifiers.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No verifiers have been added yet.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
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
                {verifiers.map((verifier) => (
                  <tr key={verifier.address}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900">{verifier.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        verifier.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {verifier.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleRemoveVerifier(verifier.address)}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                        disabled={isSubmitting}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default VerifiersManagement;