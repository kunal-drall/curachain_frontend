// src/contexts/CuraChainContext.tsx
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';

import { PatientService, CaseDetails } from '../services/patientService';
import { VerifierService } from '../services/verifierService';
import { DonationService } from '../services/donationService';
import { AdminService } from '../services/adminService';
import { isAdmin, isVerifier } from '../utils/anchor-curachain';

interface CuraChainContextType {
  // Services
  patientService: PatientService | null;
  verifierService: VerifierService | null;
  donationService: DonationService | null;
  adminService: AdminService | null;
  
  // User roles
  isAdmin: boolean;
  isVerifier: boolean;
  isConnected: boolean;
  
  // Case data
  allCases: CaseDetails[];
  featuredCases: CaseDetails[];
  userCases: CaseDetails[];
  
  // Loading states
  loading: boolean;
  casesLoading: boolean;
  
  // Data fetching methods
  refreshCases: () => Promise<void>;
}

const CuraChainContext = createContext<CuraChainContextType>({
  patientService: null,
  verifierService: null,
  donationService: null,
  adminService: null,
  isAdmin: false,
  isVerifier: false,
  isConnected: false,
  allCases: [],
  featuredCases: [],
  userCases: [],
  loading: true,
  casesLoading: true,
  refreshCases: async () => {},
});

export function CuraChainProvider({ children }: { children: ReactNode }) {
  const { connection } = useConnection();
  const wallet = useWallet();
  
  // Services
  const [patientService, setPatientService] = useState<PatientService | null>(null);
  const [verifierService, setVerifierService] = useState<VerifierService | null>(null);
  const [donationService, setDonationService] = useState<DonationService | null>(null);
  const [adminService, setAdminService] = useState<AdminService | null>(null);
  
  // User roles
  const [isAdminRole, setIsAdminRole] = useState(false);
  const [isVerifierRole, setIsVerifierRole] = useState(false);
  
  // Case data
  const [allCases, setAllCases] = useState<CaseDetails[]>([]);
  const [featuredCases, setFeaturedCases] = useState<CaseDetails[]>([]);
  const [userCases, setUserCases] = useState<CaseDetails[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [casesLoading, setCasesLoading] = useState(true);

  // Initialize services when wallet connects
  useEffect(() => {
    if (wallet.publicKey && wallet.signTransaction) {
      // Create anchor wallet
      const anchorWallet = {
        publicKey: wallet.publicKey,
        signTransaction: wallet.signTransaction,
        signAllTransactions: wallet.signAllTransactions!,
      } as anchor.Wallet;
      
      // Initialize services
      const patient = new PatientService(connection, anchorWallet);
      const verifier = new VerifierService(connection, anchorWallet);
      const donation = new DonationService(connection, anchorWallet);
      const admin = new AdminService(connection, anchorWallet);
      
      setPatientService(patient);
      setVerifierService(verifier);
      setDonationService(donation);
      setAdminService(admin);
      
      // Check user roles
      checkUserRoles(anchorWallet.publicKey);
      
      // Load cases data
      loadCasesData(patient);
    } else {
      // Reset state when wallet disconnects
      setPatientService(null);
      setVerifierService(null);
      setDonationService(null);
      setAdminService(null);
      setIsAdminRole(false);
      setIsVerifierRole(false);
      setUserCases([]);
      
      // Create read-only patient service for browsing cases
      const dummyWallet = new anchor.Wallet(anchor.web3.Keypair.generate());
      const readOnlyPatient = new PatientService(connection, dummyWallet);
      loadCasesData(readOnlyPatient);
    }
    
    setLoading(false);
  }, [wallet.publicKey, wallet.signTransaction, connection]);

  // Check if user is admin or verifier
  const checkUserRoles = async (publicKey: PublicKey) => {
    try {
      // Create dummy wallet for program
      const dummyWallet = new anchor.Wallet(anchor.web3.Keypair.generate());
      const program = new anchor.Program(
        require('../idl/curachain.json'),
        new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID!),
        new anchor.AnchorProvider(connection, dummyWallet, { commitment: 'processed' })
      );
      
      // Check roles in parallel
      const [adminStatus, verifierStatus] = await Promise.all([
        isAdmin(program, publicKey),
        isVerifier(program, publicKey)
      ]);
      
      setIsAdminRole(adminStatus);
      setIsVerifierRole(verifierStatus);
    } catch (error) {
      console.error("Error checking user roles:", error);
      setIsAdminRole(false);
      setIsVerifierRole(false);
    }
  };

  // Load cases data from blockchain
  const loadCasesData = async (service: PatientService) => {
    setCasesLoading(true);
    try {
      // Load all cases
      const cases = await service.listAllCases();
      setAllCases(cases);
      
      // Create featured cases (verified, not fully funded)
      const featured = cases
        .filter(c => c.isVerified && !c.isFunded)
        .sort((a, b) => 
          (b.totalRaised / b.totalAmountNeeded) - (a.totalRaised / a.totalAmountNeeded)
        )
        .slice(0, 3);
      setFeaturedCases(featured);
      
      // Load user's cases if wallet connected
      if (wallet.publicKey) {
        const userCases = await service.listMyCases();
        setUserCases(userCases);
      }
    } catch (error) {
      console.error("Error loading cases:", error);
    } finally {
      setCasesLoading(false);
    }
  };

  // Method to refresh cases data
  const refreshCases = async () => {
    if (patientService) {
      await loadCasesData(patientService);
    } else {
      // Create read-only patient service
      const dummyWallet = new anchor.Wallet(anchor.web3.Keypair.generate());
      const readOnlyPatient = new PatientService(connection, dummyWallet);
      await loadCasesData(readOnlyPatient);
    }
  };

  const value = {
    patientService,
    verifierService,
    donationService,
    adminService,
    isAdmin: isAdminRole,
    isVerifier: isVerifierRole,
    isConnected: !!wallet.publicKey,
    allCases,
    featuredCases,
    userCases,
    loading,
    casesLoading,
    refreshCases,
  };

  return (
    <CuraChainContext.Provider value={value}>
      {children}
    </CuraChainContext.Provider>
  );
}

export function useCuraChain() {
  return useContext(CuraChainContext);
}