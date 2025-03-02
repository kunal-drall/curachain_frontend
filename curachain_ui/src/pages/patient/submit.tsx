// src/pages/patient/submit.tsx
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { PatientService } from '../../services/patientService';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { AnchorWalletAdapter } from '../../utils/wallet-adapter';

const SubmitCasePage = () => {
  const wallet = useWallet();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [description, setDescription] = useState('');
  const [amountNeeded, setAmountNeeded] = useState('');
  const [medicalRecordsLink, setMedicalRecordsLink] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!wallet.publicKey || !wallet.signTransaction || !wallet.signAllTransactions) {
      setError('Please connect your wallet first.');
      return;
    }
    
    if (!description || !amountNeeded || !medicalRecordsLink) {
      setError('Please fill in all fields.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      // For demo purposes, we're using the public records link directly
      // In a real app, you should encrypt this data before sending it to the blockchain
      const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL || 'https://api.devnet.solana.com');
      const anchorWallet = new AnchorWalletAdapter(wallet);
      
      const patientService = new PatientService(connection, anchorWallet);
      const result = await patientService.submitCase(
        description,
        parseInt(amountNeeded),
        medicalRecordsLink
      );
      
      setSuccess(`Case submitted successfully! Case ID: ${result.caseId}`);
      
      // Clear form after successful submission
      setDescription('');
      setAmountNeeded('');
      setMedicalRecordsLink('');
      
      // Redirect to case details page after a delay
      setTimeout(() => {
        router.push(`/cases/${result.caseId}`);
      }, 3000);
    } catch (err: any) {
      console.error('Error submitting case:', err);
      setError(err.message || 'An error occurred while submitting the case.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Submit Medical Case - CuraChain</title>
      </Head>
      
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Submit Medical Case</h1>
        
        {!wallet.publicKey ? (
          <div className="text-center p-6 bg-yellow-50 rounded-lg">
            <p className="text-yellow-700 mb-4">Please connect your wallet to submit a case.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-md">
                {success}
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                Medical Condition Description
              </label>
              <textarea
                id="description"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your medical condition and treatment needs..."
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="amountNeeded" className="block text-gray-700 font-medium mb-2">
                Amount Needed (in lamports)
              </label>
              <input
                id="amountNeeded"
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={amountNeeded}
                onChange={(e) => setAmountNeeded(e.target.value)}
                placeholder="Enter amount needed for treatment"
                min="1"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                1 SOL = 1,000,000,000 lamports
              </p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="medicalRecordsLink" className="block text-gray-700 font-medium mb-2">
                Medical Records Link
              </label>
              <input
                id="medicalRecordsLink"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={medicalRecordsLink}
                onChange={(e) => setMedicalRecordsLink(e.target.value)}
                placeholder="Link to your medical records (e.g., secure cloud storage)"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                This link will be encrypted on the blockchain. Only verified medical professionals will have access.
              </p>
            </div>
            
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Case'}
              </button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
};

export default SubmitCasePage;