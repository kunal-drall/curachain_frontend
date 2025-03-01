// src/services/patientService.ts
import * as anchor from '@coral-xyz/anchor';
import { PublicKey, Connection } from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';
import { PROGRAM_ID, derivePdaAddresses } from '../utils/anchor-curachain';
import idl from '../idl/curachain.json'; // You'll need to add this file

export class PatientService {
  program: Program;
  wallet: anchor.Wallet;
  connection: Connection;

  constructor(connection: Connection, wallet: anchor.Wallet) {
    this.connection = connection;
    this.wallet = wallet;
    const provider = new anchor.AnchorProvider(connection, wallet, {
      commitment: 'processed',
    });
    this.program = new Program(idl, PROGRAM_ID, provider);
  }

  async submitCase(description: string, amountNeeded: number, recordsLink: string) {
    const [patientCasePDA] = await derivePdaAddresses.patientCase(this.wallet.publicKey);
    const [caseCounterPDA] = await derivePdaAddresses.caseCounter();
    
    // Get the current counter value to determine the next case ID
    const caseCounter = await this.program.account.caseCounter.fetch(caseCounterPDA);
    const nextCaseId = `CASE${String(caseCounter.currentId.toNumber() + 1).padStart(4, '0')}`;
    
    const [caseLookupPDA] = await derivePdaAddresses.caseLookup(nextCaseId);

    // Call the submit_cases instruction
    const tx = await this.program.methods
      .submitCases(description, new anchor.BN(amountNeeded), recordsLink)
      .accounts({
        patient: this.wallet.publicKey,
        patientCase: patientCasePDA,
        caseCounter: caseCounterPDA,
        caseLookup: caseLookupPDA,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    return {
      txSignature: tx,
      caseId: nextCaseId,
    };
  }

  async fetchCaseDetails(caseId: string) {
    const [caseLookupPDA] = await derivePdaAddresses.caseLookup(caseId);
    
    try {
      const caseLookup = await this.program.account.caseIdLookup.fetch(caseLookupPDA);
      const patientCasePDA = caseLookup.patientPda;
      
      const patientCase = await this.program.account.patientCase.fetch(patientCasePDA);
      
      return {
        caseId: patientCase.caseId,
        description: patientCase.caseDescription,
        totalAmountNeeded: patientCase.totalAmountNeeded.toNumber(),
        totalRaised: patientCase.totalRaised.toNumber(),
        isVerified: patientCase.isVerified,
        patientAddress: patientCase.patientPubkey.toString(),
        encryptedLink: patientCase.linkToRecords,
        isFunded: patientCase.caseFunded,
      };
    } catch (error) {
      console.error('Error fetching case details:', error);
      throw error;
    }
  }

  // Add more methods as needed
}