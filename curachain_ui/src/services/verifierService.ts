// src/services/verifierService.ts
import * as anchor from '@coral-xyz/anchor';
import { Connection, PublicKey, TransactionSignature } from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';
import { 
  PROGRAM_ID, 
  getCuraChainProgram, 
  derivePdaAddresses,
  isVerifier
} from '../utils/anchor-curachain';

// Interface for a verifier account
export interface VerifierInfo {
  address: string;
  isActive: boolean;
}

export class VerifierService {
  program: Program;
  wallet: anchor.Wallet;
  connection: Connection;

  constructor(connection: Connection, wallet: anchor.Wallet) {
    this.connection = connection;
    this.wallet = wallet;
    this.program = getCuraChainProgram(connection, wallet);
  }

  /**
   * Check if the connected wallet is a registered verifier
   * @returns True if the wallet is a verifier
   */
  async checkVerifierStatus(): Promise<boolean> {
    return isVerifier(this.program, this.wallet.publicKey);
  }

  /**
   * Verify a patient case (approve or reject)
   * @param caseId The case ID to verify
   * @param isApproved Whether the case is approved (true) or rejected (false)
   * @returns Transaction signature
   */
  async verifyCase(caseId: string, isApproved: boolean): Promise<TransactionSignature> {
    try {
      // Confirm the wallet is a verifier
      const verifierStatus = await this.checkVerifierStatus();
      if (!verifierStatus) {
        throw new Error("The connected wallet is not a registered verifier");
      }

      // Get all the necessary PDAs
      const [caseLookupPDA] = await derivePdaAddresses.caseLookup(caseId);
      const caseLookup = await this.program.account.caseIdLookup.fetch(caseLookupPDA);
      const patientCasePDA = caseLookup.patientPda;
      
      const [verifierPDA] = await derivePdaAddresses.verifierRole(this.wallet.publicKey);
      const [verifiersListPDA] = await derivePdaAddresses.verifiersList();
      
      // Patient escrow account may or may not exist yet
      const [patientEscrowPDA] = await derivePdaAddresses.patientEscrow(
        caseId,
        patientCasePDA
      );
      
      // Call the verify_patient instruction
      return await this.program.methods
        .verifyPatient(caseId, isApproved)
        .accounts({
          verifier: this.wallet.publicKey,
          verifierAccount: verifierPDA,
          verifiersList: verifiersListPDA,
          caseLookup: caseLookupPDA,
          patientCase: patientCasePDA,
          patientEscrow: patientEscrowPDA,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
    } catch (error) {
      console.error("Error verifying case:", error);
      throw error;
    }
  }

  /**
   * Get a list of cases waiting for verification
   * @returns Array of case IDs pending verification
   */
  async getPendingCases() {
    try {
      // Confirm the wallet is a verifier
      const verifierStatus = await this.checkVerifierStatus();
      if (!verifierStatus) {
        throw new Error("The connected wallet is not a registered verifier");
      }

      // Get all case lookup accounts
      const caseLookups = await this.program.account.caseIdLookup.all();
      
      // Fetch each patient case to check if it's pending
      const pendingCases = [];
      
      for (const lookup of caseLookups) {
        const patientCasePDA = lookup.account.patientPda;
        const patientCase = await this.program.account.patientCase.fetch(patientCasePDA);
        
        // Check if not yet verified and the current verifier hasn't voted
        if (
          !patientCase.isVerified && 
          !patientCase.votedVerifiers.some(pubkey => 
            pubkey.toString() === this.wallet.publicKey.toString()
          )
        ) {
          pendingCases.push({
            caseId: patientCase.caseId,
        isVerified: patientCase.isVerified,
        totalVerifiers,
        votedVerifiers,
        yesVotes,
        noVotes,
        participationRate,
        approvalRate,
        requiredParticipation: 50, // 50% of verifiers must participate
        requiredApproval: 70, // 70% approval required
        hasCurrentVerifierVoted: patientCase.votedVerifiers.some(
          pubkey => pubkey.toString() === this.wallet.publicKey.toString()
        )
      }
    , catch (error) {
      console.error("Error getting case verification status:", error);
      throw error;
    }
  }
}
            description: patientCase.caseDescription,
            amountNeeded: patientCase.totalAmountNeeded.toNumber(),
            yesVotes: patientCase.verificationYesVotes,
            noVotes: patientCase.verificationNoVotes,
            recordsLink: patientCase.linkToRecords,
            patientAddress: patientCase.patientPubkey.toString()
          });
        }
      }
      
      return pendingCases;
    } catch (error) {
      console.error("Error getting pending cases:", error);
      throw error;
    }
  }

  /**
   * Get all verifiers in the system (admin only)
   * @returns Array of verifier information
   */
  async getAllVerifiers(): Promise<VerifierInfo[]> {
    try {
      // Get verifiers list PDA
      const [verifiersListPDA] = await derivePdaAddresses.verifiersList();
      
      // Fetch verifiers list
      const verifiersList = await this.program.account.verifiersList.fetch(verifiersListPDA);
      
      // Get details of each verifier
      const verifiersInfo = await Promise.all(
        verifiersList.allVerifiers.map(async (verifierPubkey) => {
          try {
            const [verifierPDA] = await derivePdaAddresses.verifierRole(verifierPubkey);
            const verifier = await this.program.account.verifier.fetch(verifierPDA);
            
            return {
              address: verifier.verifierKey.toString(),
              isActive: verifier.isVerifier
            };
          } catch (error) {
            console.error(`Error fetching verifier ${verifierPubkey.toString()}:`, error);
            return {
              address: verifierPubkey.toString(),
              isActive: false
            };
          }
        })
      );
      
      return verifiersInfo;
    } catch (error) {
      console.error("Error fetching all verifiers:", error);
      throw error;
    }
  }

  /**
   * Get case verification details
   * @param caseId The case ID to check
   * @returns Verification details
   */
  async getCaseVerificationStatus(caseId: string) {
    try {
      // Get case lookup and patient case accounts
      const [caseLookupPDA] = await derivePdaAddresses.caseLookup(caseId);
      const caseLookup = await this.program.account.caseIdLookup.fetch(caseLookupPDA);
      const patientCase = await this.program.account.patientCase.fetch(caseLookup.patientPda);
      
      // Get verifiers list for total count
      const [verifiersListPDA] = await derivePdaAddresses.verifiersList();
      const verifiersList = await this.program.account.verifiersList.fetch(verifiersListPDA);
      
      // Calculate verification metrics
      const totalVerifiers = verifiersList.allVerifiers.length;
      const votedVerifiers = patientCase.votedVerifiers.length;
      const yesVotes = patientCase.verificationYesVotes;
      const noVotes = patientCase.verificationNoVotes;
      const participationRate = totalVerifiers > 0 ? (votedVerifiers / totalVerifiers) * 100 : 0;
      const approvalRate = votedVerifiers > 0 ? (yesVotes / votedVerifiers) * 100 : 0;
      
      return {
        caseId: patientCase.caseId,