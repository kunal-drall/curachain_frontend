// src/services/donationService.ts
import * as anchor from '@coral-xyz/anchor';
import { Connection, PublicKey, TransactionSignature } from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';
import { 
  PROGRAM_ID, 
  getCuraChainProgram, 
  derivePdaAddresses
} from '../utils/anchor-curachain';

export interface DonationInfo {
  caseId: string;
  amount: number;
  donor: string;
  timestamp: Date;
}

export interface DonorSummary {
  address: string;
  totalDonated: number;
  donationCount: number;
}

export class DonationService {
  program: Program;
  wallet: anchor.Wallet;
  connection: Connection;

  constructor(connection: Connection, wallet: anchor.Wallet) {
    this.connection = connection;
    this.wallet = wallet;
    this.program = getCuraChainProgram(connection, wallet);
  }

  /**
   * Donate to a specific medical case
   * @param caseId The case ID to donate to
   * @param amount Amount to donate in lamports
   * @returns Transaction signature
   */
  async donateToCase(caseId: string, amount: number): Promise<TransactionSignature> {
    try {
      // Get case lookup PDA
      const [caseLookupPDA] = await derivePdaAddresses.caseLookup(caseId);
      const caseLookup = await this.program.account.caseIdLookup.fetch(caseLookupPDA);
      
      // Get patient case PDA
      const patientCasePDA = caseLookup.patientPda;
      
      // Get patient case to verify it's approved
      const patientCase = await this.program.account.patientCase.fetch(patientCasePDA);
      if (!patientCase.isVerified) {
        throw new Error("Cannot donate to unverified cases");
      }
      
      // Get patient escrow PDA
      const [patientEscrowPDA] = await derivePdaAddresses.patientEscrow(
        caseId, 
        patientCasePDA
      );
      
      // Get donor account PDA
      const [donorPDA] = await derivePdaAddresses.donorAccount(this.wallet.publicKey);
      
      // Make donation
      return await this.program.methods
        .donate(caseId, new anchor.BN(amount))
        .accounts({
          donor: this.wallet.publicKey,
          caseLookup: caseLookupPDA,
          patientCase: patientCasePDA,
          patientEscrow: patientEscrowPDA,
          donorAccount: donorPDA,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
    } catch (error) {
      console.error("Error donating to case:", error);
      throw error;
    }
  }

  /**
   * Get donation information for the current wallet
   * @returns Summary of user's donations
   */
  async getMyDonations(): Promise<DonorSummary> {
    try {
      // Get donor account PDA
      const [donorPDA] = await derivePdaAddresses.donorAccount(this.wallet.publicKey);
      
      try {
        // Fetch donor account if it exists
        const donorAccount = await this.program.account.donorInfo.fetch(donorPDA);
        
        return {
          address: donorAccount.donorAddress.toString(),
          totalDonated: donorAccount.totalDonations.toNumber(),
          donationCount: 1, // We don't track count in the smart contract
        };
      } catch (error) {
        // Donor account doesn't exist yet
        return {
          address: this.wallet.publicKey.toString(),
          totalDonated: 0,
          donationCount: 0,
        };
      }
    } catch (error) {
      console.error("Error getting user donations:", error);
      throw error;
    }
  }

  /**
   * Get donation events for a specific case
   * @param caseId The case ID to get donations for
   * @returns Array of donation events
   */
  async getCaseDonations(caseId: string): Promise<DonationInfo[]> {
    try {
      // This requires off-chain indexing since donation events are emitted but not stored
      // For now, we'll implement a mock that returns sample data
      // In a production app, this would connect to an indexer or database that tracks events
      
      // Get case lookup and patient case for basic info
      const [caseLookupPDA] = await derivePdaAddresses.caseLookup(caseId);
      const caseLookup = await this.program.account.caseIdLookup.fetch(caseLookupPDA);
      const patientCase = await this.program.account.patientCase.fetch(caseLookup.patientPda);
      
      // For demo purposes, if the case has raised funds, show a mock donation
      if (patientCase.totalRaised.toNumber() > 0) {
        const mockDonations: DonationInfo[] = [
          {
            caseId,
            amount: patientCase.totalRaised.toNumber(),
            donor: "Unknown", // In reality, this would come from indexed events
            timestamp: new Date(),
          }
        ];
        return mockDonations;
      }
      
      return [];
    } catch (error) {
      console.error("Error getting case donations:", error);
      throw error;
    }
  }

  /**
   * Calculate if a case is fully funded
   * @param caseId The case ID to check
   * @returns Whether the case is fully funded
   */
  async isCaseFullyFunded(caseId: string): Promise<boolean> {
    try {
      // Get case lookup and patient case
      const [caseLookupPDA] = await derivePdaAddresses.caseLookup(caseId);
      const caseLookup = await this.program.account.caseIdLookup.fetch(caseLookupPDA);
      const patientCase = await this.program.account.patientCase.fetch(caseLookup.patientPda);
      
      // Check if case is fully funded
      return patientCase.caseFunded || 
        patientCase.totalRaised.toNumber() >= patientCase.totalAmountNeeded.toNumber();
    } catch (error) {
      console.error("Error checking if case is fully funded:", error);
      throw error;
    }
  }

  /**
   * Get a list of all donor accounts in the system
   * This would typically be an admin-only function
   * @returns Array of donor summaries
   */
  async getAllDonors(): Promise<DonorSummary[]> {
    try {
      // Get all donor accounts
      const donorAccounts = await this.program.account.donorInfo.all();
      
      // Format into summary objects
      return donorAccounts.map(({ account }) => ({
        address: account.donorAddress.toString(),
        totalDonated: account.totalDonations.toNumber(),
        donationCount: 1, // Not tracked in contract
      }));
    } catch (error) {
      console.error("Error getting all donors:", error);
      throw error;
    }
  }
}