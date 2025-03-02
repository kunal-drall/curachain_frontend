// src/components/cases/CaseSubmissionForm.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useCuraChain } from '../../contexts/CuraChainContext';
import { solToLamports } from '../../utils/anchor-curachain';
import { toast } from 'react-hot-toast';

export const CaseSubmissionForm: React.FC = () => {
  const router = useRouter();
  const { publicKey } = useWallet();
  const { patientService, refreshCases } = useCuraChain();
  
  // Form state
  const [description, setDescription] = useState('');
  const [amountNeeded, setAmountNeeded] = useState('');
  const [recordsLink, setRecordsLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!publicKey || !patientService) {
      toast.error('Please connect your wallet to submit a case');
      return;
    }
    
    try {
      setIsSubmitting(true);
      toast.loading('Submitting your case to the blockchain...');
      
      // Convert SOL amount to lamports
      const lamports = solToLamports(parseFloat(amountNeeded));
      
      // Submit case to blockchain
      const result = await patientService.submitCase(
        description,
        lamports,
        recordsLink
      );
      
      // Refresh cases data
      await refreshCases();
      
      toast.dismiss();
      toast.success('Case submitted successfully!');
      
      // Redirect to case details page
      router.push(`/cases/${result.caseId}`);
    } catch (error) {
      console.error('Error submitting case:', error);
      toast.dismiss();
      
      if (error instanceof Error) {
        toast.error(`Submission failed: ${error.message}`);
      } else {
        toast.error('Submission failed');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Next and back step handlers
  const handleNextStep = () => {
    if (step === 1 && !description.trim()) {
      toast.error('Please provide a description of your medical condition');
      return;
    }
    
    if (step === 2) {
      const amount = parseFloat(amountNeeded);
      if (isNaN(amount) || amount <= 0) {
        toast.error('Please enter a valid amount needed');
        return;
      }
    }
    
    setStep(step + 1);
  };
  
  const handleBackStep = () => {
    setStep(step - 1);
  };
  
  // Wallet not connected
  if (!publicKey) {
    return (
      <div className="card bg-base-100 shadow-lg max-w-3xl mx-auto">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Submit Medical Case</h2>
          
          <div className="alert alert-info mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Please connect your wallet to submit a medical case for verification and funding.</span>
          </div>
          
          <div className="flex justify-center">
            <WalletMultiButton />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="card bg-base-100 shadow-lg max-w-3xl mx-auto">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-2">Submit Medical Case</h2>
        <p className="mb-6 opacity-70">
          Submit your medical treatment needs for verification by our medical professionals.
          Once verified, your case will be available for donors to contribute.
        </p>
        
        {/* Step indicator */}
        <ul className="steps w-full mb-6">
          <li className={`step ${step >= 1 ? 'step-primary' : ''}`}>Medical Information</li>
          <li className={`step ${step >= 2 ? 'step-primary' : ''}`}>Funding Needs</li>
          <li className={`step ${step >= 3 ? 'step-primary' : ''}`}>Medical Records</li>
          <li className={`step ${step >= 4 ? 'step-primary' : ''}`}>Review & Submit</li>
        </ul>
        
        <form onSubmit={handleSubmit}>
          {/* Step 1: Medical Information */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Medical Condition Description</span>
                </label>
                <textarea 
                  className="textarea textarea-bordered h-48"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your medical condition, required treatment, and how this funding will help you."
                  required
                />
              </div>
              
              <div className="alert alert-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>
                  Be thorough and specific about your medical needs. This helps medical professionals verify your case.
                </span>
              </div>
              
              <div className="flex justify-end">
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleNextStep}
                >
                  Next
                </button>
              </div>
            </div>
          )}
          
          {/* Step 2: Funding Needs */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Amount Needed (SOL)</span>
                </label>
                <input 
                  type="number" 
                  className="input input-bordered"
                  value={amountNeeded}
                  onChange={(e) => setAmountNeeded(e.target.value)}
                  placeholder="Enter amount needed in SOL"
                  min="0.001"
                  step="0.001"
                  required
                />
                <label className="label">
                  <span className="label-text-alt">Enter the total amount needed for your treatment in SOL.</span>
                </label>
              </div>
              
              <div className="alert alert-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>
                  Make sure the amount accurately reflects your needs. Medical professionals will verify this against standard costs.
                </span>
              </div>
              
              <div className="flex justify-between">
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={handleBackStep}
                >
                  Back
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleNextStep}
                >
                  Next
                </button>
              </div>
            </div>
          )}
          
          {/* Step 3: Medical Records */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Medical Records Link</span>
                </label>
                <input 
                  type="text" 
                  className="input input-bordered"
                  value={recordsLink}
                  onChange={(e) => setRecordsLink(e.target.value)}
                  placeholder="Enter secure link to your medical records"
                  required
                />
                <label className="label">
                  <span className="label-text-alt">
                    Provide a secure link to your medical records. Only verified medical professionals will have access.
                  </span>
                </label>
              </div>
              
              <div className="alert alert-warning">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>
                  Use a password-protected cloud storage link (Google Drive, Dropbox, etc.) and share the password only with verifiers.
                </span>
              </div>
              
              <div className="flex justify-between">
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={handleBackStep}
                >
                  Back
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleNextStep}
                >
                  Next
                </button>
              </div>
            </div>
          )}
          
          {/* Step 4: Review & Submit */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Review Your Submission</h3>
              
              <div className="bg-base-200 p-4 rounded-lg">
                <div className="mb-4">
                  <h4 className="font-semibold">Medical Description:</h4>
                  <p className="whitespace-pre-line">{description}</p>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold">Amount Needed:</h4>
                  <p>{amountNeeded} SOL</p>
                </div>
                
                <div>
                  <h4 className="font-semibold">Medical Records Link:</h4>
                  <p>{recordsLink}</p>
                </div>
              </div>
              
              <div className="alert alert-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>
                  After submission, your case will be reviewed by medical professionals.
                  This may take 2-3 days. You will be notified when your case is verified.
                </span>
              </div>
              
              <div className="flex justify-between">
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={handleBackStep}
                  disabled={isSubmitting}
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Submitting...
                    </>
                  ) : (
                    'Submit Case'
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};