// src/utils/anchor-curachain.ts
import * as anchor from '@coral-xyz/anchor';
import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';

// Import or define your IDL
import idl from '../idl/curachain.json'; // You'll need to create this file with your IDL

export const PROGRAM_ID = new PublicKey('FRM52RYMbEqwb4WuBv6E7aiHv16acVZ1wBYaNRDYsnoh');

export function getCuraChainProgram(connection: Connection, wallet: anchor.Wallet) {
  const provider = new anchor.AnchorProvider(
    connection,
    wallet,
    { commitment: 'processed' }
  );
  
  return new Program(idl, PROGRAM_ID, provider);
}

// Helper to derive PDAs (Program Derived Addresses)
export const derivePdaAddresses = {
  // Add functions for deriving different PDAs based on your smart contract
  patientCase: async (patientPubkey: PublicKey): Promise<[PublicKey, number]> => {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('patient'), patientPubkey.toBuffer()],
      PROGRAM_ID
    );
  },
  
  caseCounter: async (): Promise<[PublicKey, number]> => {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('case_counter')],
      PROGRAM_ID
    );
  },

  caseLookup: async (caseId: string): Promise<[PublicKey, number]> => {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('case_lookup'), Buffer.from(caseId)],
      PROGRAM_ID
    );
  },

  // Add more PDA derivation functions as needed
}

// Add more helper functions to interact with your program as needed