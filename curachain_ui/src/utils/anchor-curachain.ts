// src/utils/anchor-curachain.ts
import * as anchor from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';

// The Program ID is specified in the .env file and loaded via Next.js config
export const PROGRAM_ID = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID || 'FRM52RYMbEqwb4WuBv6E7aiHv16acVZ1wBYaNRDYsnoh');

// This function gets the CuraChain program from Anchor
export function getCuraChainProgram(connection: Connection, wallet: anchor.Wallet) {
  const provider = new anchor.AnchorProvider(
    connection,
    wallet,
    { commitment: 'processed' }
  );
  
  // Dynamic import of IDL to avoid bundling issues
  const idl = require('../idl/curachain.json');
  return new Program(idl, PROGRAM_ID, provider);
}

// Helper to derive PDAs (Program Derived Addresses)
export const derivePdaAddresses = {
  // For patient case PDAs
  patientCase: async (patientPubkey: PublicKey): Promise<[PublicKey, number]> => {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('patient'), patientPubkey.toBuffer()],
      PROGRAM_ID
    );
  },
  
  // For case counter PDA
  caseCounter: async (): Promise<[PublicKey, number]> => {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('case_counter')],
      PROGRAM_ID
    );
  },

  // For case lookup PDA based on case ID
  caseLookup: async (caseId: string): Promise<[PublicKey, number]> => {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('case_lookup'), Buffer.from(caseId)],
      PROGRAM_ID
    );
  },

  // For patient escrow PDA
  patientEscrow: async (caseId: string, patientCase: PublicKey): Promise<[PublicKey, number]> => {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('patient_escrow'), Buffer.from(caseId), patientCase.toBuffer()],
      PROGRAM_ID
    );
  },

  // For verifier registry list PDA
  verifiersList: async (): Promise<[PublicKey, number]> => {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('verifiers_list')],
      PROGRAM_ID
    );
  },

  // For individual verifier role PDA
  verifierRole: async (verifierPubkey: PublicKey): Promise<[PublicKey, number]> => {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('verifier_role'), verifierPubkey.toBuffer()],
      PROGRAM_ID
    );
  },

  // For donor account PDA
  donorAccount: async (donorPubkey: PublicKey): Promise<[PublicKey, number]> => {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('donor'), donorPubkey.toBuffer()],
      PROGRAM_ID
    );
  },

  // For admin account PDA
  adminAccount: async (adminPubkey: PublicKey): Promise<[PublicKey, number]> => {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('admin'), adminPubkey.toBuffer()],
      PROGRAM_ID
    );
  }
};

// Format lamports to SOL for display
export function lamportsToSol(lamports: number): number {
  return lamports / 1_000_000_000;
}

// Format SOL to lamports for transactions
export function solToLamports(sol: number): number {
  return sol * 1_000_000_000;
}

// Format case ID with proper padding
export function formatCaseId(counter: number): string {
  return `CASE${String(counter).padStart(4, '0')}`;
}

// Helper to check if a wallet is a verifier
export async function isVerifier(
  program: Program,
  walletPublicKey: PublicKey
): Promise<boolean> {
  try {
    const [verifierPDA] = await derivePdaAddresses.verifierRole(walletPublicKey);
    const verifierAccount = await program.account.verifier.fetch(verifierPDA);
    return verifierAccount.isVerifier;
  } catch (error) {
    console.error("Error checking verifier status:", error);
    return false;
  }
}

// Helper to check if a wallet is an admin
export async function isAdmin(
  program: Program,
  walletPublicKey: PublicKey
): Promise<boolean> {
  try {
    const [adminPDA] = await derivePdaAddresses.adminAccount(walletPublicKey);
    const adminAccount = await program.account.administrator.fetch(adminPDA);
    return adminAccount.isActive;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

// Generate a truncated pubkey string for display
export function shortenPubkey(pubkey: string, startLength = 4, endLength = 4): string {
  if (!pubkey) return '';
  return `${pubkey.substring(0, startLength)}...${pubkey.substring(pubkey.length - endLength)}`;
}

// Calculate verification percentage
export function calculateVerificationPercentage(yesVotes: number, totalVotes: number): number {
  if (totalVotes === 0) return 0;
  return (yesVotes / totalVotes) * 100;
}

// Calculate funding percentage
export function calculateFundingPercentage(amountRaised: number, totalNeeded: number): number {
  if (totalNeeded === 0) return 0;
  return Math.min((amountRaised / totalNeeded) * 100, 100);
}