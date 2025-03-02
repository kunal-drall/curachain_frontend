// src/pages/admin/index.tsx
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PROGRAM_ID } from '../../utils/anchor-curachain';

const AdminDashboard = () => {
  const { publicKey } = useWallet();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!publicKey) {
      setLoading(false);
      return;
    }

    const checkAdminStatus = async () => {
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
          setIsAdmin(adminAccount !== null);
        } catch {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error('Error checking admin status:', err);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [publicKey]);

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
          <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-gray-600 mb-8">Please connect your wallet to access the admin dashboard.</p>
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
        <title>Admin Dashboard - CuraChain</title>
      </Head>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4">Manage Verifiers</h2>
            <p className="text-gray-600 mb-4">
              Add or remove medical professionals as verified entities in the system.
            </p>
            <Link href="/admin/verifiers" className="text-blue-600 hover:underline">
              Manage Verifiers →
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4">System Statistics</h2>
            <p className="text-gray-600 mb-4">
              View statistics about cases, donations, and verifications.
            </p>
            <Link href="/admin/statistics" className="text-blue-600 hover:underline">
              View Statistics →
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;