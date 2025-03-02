// src/components/donation/DonationForm.tsx
import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useCuraChain } from '../../contexts/CuraChainContext';
import { solToLamports, lamportsToSol } from '../../utils/anchor-curachain';
import { toast } from 'react-hot-toast';

interface DonationFormProps {
  caseId: string;
  amountNeeded: number;
  amountRaised: number;
  isVerified: boolean;
  isFunded: boolean;
  onSuccess?: () => void;
}

export const DonationForm: React.FC<DonationFormProps> = ({
  caseId,
  amountNeeded,
  amountRaised,
  isVerified,
  isFunded,
  onSuccess,
}) => {
  const { publicKey } = useWallet();
  const { donationService, refreshCases } = useCuraChain();
  
  const [donationAmount, setDonationAmount] = useState('0.1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calculate remaining amount needed
  const remainingAmount = Math.max(0, amountNeeded - amountRaised);
  const remainingSol = lamportsToSol(remainingAmount);
  
  // Handle donation submission
  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!publicKey || !donationService) {
      toast.error('Please connect your wallet to donate');
      return;
    }
    
    if (!isVerified) {
      toast.error('This case has not been verified yet');
      return;
    }
    
    if (isFunded) {
      toast.error('This case has already been fully funded');
      return;
    }
    
    const amount = parseFloat(donationAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid donation amount');
      return;
    }
    
    // Convert SOL to lamports
    const lamports = solToLamports(amount);
    
    try {
      setIsSubmitting(true);
      toast.loading('Processing donation...');
      
      // Submit donation to blockchain
      const txSignature = await donationService.donateToCase(caseId, lamports);
      
      // Refresh case data
      await refreshCases();
      
      toast.dismiss();
      toast.success('Donation successful!');
      
      // Reset form
      setDonationAmount('0.1');
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error making donation:', error);
      toast.dismiss();
      
      if (error instanceof Error) {
        const errorMessage = error.message.includes('0x1') 
          ? 'Insufficient funds in your wallet'
          : error.message;
        toast.error(`Donation failed: ${errorMessage}`);
      } else {
        toast.error('Donation failed');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Preset donation amounts in SOL
  const presetAmounts = [0.1, 0.5, 1, 2];
  
  // If the case is not verified or is fully funded, show disabled form
  if (!isVerified || isFunded) {
    return (
      <div className="card bg-base-100 shadow-lg w-full max-w-md mx-auto">
        <div className="card-body">
          <h2 className="card-title">Donate to this case</h2>
          
          {!isVerified ? (
            <div className="alert alert-warning">
              <span>This case has not been verified yet. Donations are only accepted for verified cases.</span>
            </div>
          ) : (
            <div className="alert alert-success">
              <span>This case has been fully funded! Thank you to all donors who contributed.</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // If wallet not connected, show connect prompt
  if (!publicKey) {
    return (
      <div className="card bg-base-100 shadow-lg w-full max-w-md mx-auto">
        <div className="card-body">
          <h2 className="card-title">Donate to this case</h2>
          <p className="mb-4">Connect your wallet to donate SOL to this medical case.</p>
          
          <div className="flex justify-center">
            <WalletMultiButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-lg w-full max-w-md mx-auto">
      <div className="card-body">
        <h2 className="card-title">Donate to this case</h2>
        
        <div className="mb-4">
          <p>Remaining needed: <span className="font-semibold">{remainingSol.toFixed(2)} SOL</span></p>
        </div>
        
        <form onSubmit={handleDonate}>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Donation Amount (SOL)</span>
            </label>
            <input 
              type="number" 
              className="input input-bordered w-full" 
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              min="0.001"
              step="0.001"
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div className="flex gap-2 mb-6">
            {presetAmounts.map(amount => (
              <button
                key={amount}
                type="button"
                className="btn btn-outline btn-sm flex-1"
                onClick={() => setDonationAmount(amount.toString())}
                disabled={isSubmitting}
              >
                {amount} SOL
              </button>
            ))}
          </div>
          
          <div className="form-control">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Processing...
                </>
              ) : (
                `Donate ${donationAmount} SOL`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};