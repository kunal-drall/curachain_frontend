// src/services/patientService.ts
import * as anchor from '@coral-xyz/anchor';
import { Connection, PublicKey, TransactionSignature } from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';
import { 
  PROGRAM_ID, 
  getCuraChainProgram, 
  derivePdaAddresses,
  formatCaseId
} from '../utils/anchor-curachain';

export interface CaseDetails {
  caseId: string;
  patientAddress: string;
  description: string;
  totalAmountNeeded: number;
  totalRaised: number;
  isVerified: boolean;
  isFunded: boolean;
  recordsLink: string;
  yesVotes: number;
  noVotes: number;
  verifiers: string[];
  createdAt?: Date;
}

export class PatientService {
  program: Program;
  wallet: anchor.Wallet;
  connection: Connection;

  constructor(connection: Connection, wallet: anchor.Wallet) {
    this.connection = connection;
    this.wallet = wallet;
    this.program = getCuraChainProgram(connection, wallet);
  }

  /**
   * Submit a new medical case
   * @param description Description of the medical condition and treatment needed
   * @param amountNeeded Total amount needed for treatment in lamports
   * @param recordsLink Link to medical records (will be encrypted on-chain)
   * @returns Transaction signature and case ID
   */
  async submitCase(
    description: string, 
    amountNeeded: number, 
    recordsLink: string
  ): Promise<{ txSignature: TransactionSignature; caseId: string }> {
    try {
      // Get PDAs needed for transaction
      const [patientCasePDA] = await derivePdaAddresses.patientCase(this.wallet.publicKey);
      const [caseCounterPDA] = await derivePdaAddresses.caseCounter();
      
      // Get current case counter to generate next case ID
      let caseCounter;
      try {
        caseCounter = await this.program.account.caseCounter.fetch(caseCounterPDA);
      } catch (error) {
        console.error("Error fetching case counter:", error);
        throw new Error("Could not access case counter. Is the program initialized?");
      }
      
      const nextCaseId = formatCaseId(caseCounter.currentId.toNumber() + 1);
      
      // Derive case lookup PDA
      const [caseLookupPDA] = await derivePdaAddresses.caseLookup(nextCaseId);

      // Submit the case transaction
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
    } catch (error) {
      console.error("Error submitting case:", error);
      throw error;
    }
  }

  /**
   * Fetch details for a specific case
   * @param caseId The unique case identifier
   * @returns Case details
   */
  async fetchCaseDetails(caseId: string): Promise<CaseDetails> {
    try {
      // Get the case lookup account
      const [caseLookupPDA] = await derivePdaAddresses.caseLookup(caseId);
      const caseLookup = await this.program.account.caseIdLookup.fetch(caseLookupPDA);
      
      // Get the patient case account
      const patientCasePDA = caseLookup.patientPda;
      const patientCase = await this.program.account.patientCase.fetch(patientCasePDA);
      
      // Format case details for frontend
      return {
        caseId: patientCase.caseId,
        patientAddress: patientCase.patientPubkey.toString(),
        description: patientCase.caseDescription,
        totalAmountNeeded: patientCase.totalAmountNeeded.toNumber(),
        totalRaised: patientCase.totalRaised.toNumber(),
        isVerified: patientCase.isVerified,
        isFunded: patientCase.caseFunded,
        recordsLink: patientCase.linkToRecords,
        yesVotes: patientCase.verificationYesVotes,
        noVotes: patientCase.verificationNoVotes,
        verifiers: patientCase.votedVerifiers.map(pubkey => pubkey.toString()),
      };
    } catch (error) {
      console.error("Error fetching case details:", error);
      throw error;
    }
  }

  /**
   * List all cases submitted by the connected wallet
   * @returns Array of case IDs and basic information
   */
  async listMyCases(): Promise<CaseDetails[]> {
    try {
      // Get patient case PDA for the current wallet
      const [patientCasePDA] = await derivePdaAddresses.patientCase(this.wallet.publicKey);
      
      // If the account doesn't exist, the user has no cases
      try {
        const patientCase = await this.program.account.patientCase.fetch(patientCasePDA);
        return [await this.fetchCaseDetails(patientCase.caseId)];
      } catch (error) {
        // No case found for this user
        return [];
      }
    } catch (error) {
      console.error("Error listing user cases:", error);
      throw error;
    }
  }

  /**
   * List all cases in the system
   * @returns Array of case details
   */
  async listAllCases(): Promise<CaseDetails[]> {
    try {
      // Get all case lookup accounts
      const caseLookups = await this.program.account.caseIdLookup.all();
      
      // Fetch details for each case
      const casePromises = caseLookups.map(async (lookup) => {
        const caseId = lookup.account.caseIdInLookup;
        return this.fetchCaseDetails(caseId);
      });
      
      return Promise.all(casePromises);
    } catch (error) {
      console.error("Error listing all cases:", error);
      throw error;
    }
  }

  /**
   * Close a rejected case (only available to the patient who created it)
   * @param caseId The case ID to close
   * @returns Transaction signature
   */
  async closeRejectedCase(caseId: string): Promise<TransactionSignature> {
    try {
      // Get needed PDAs
      const [caseLookupPDA] = await derivePdaAddresses.caseLookup(caseId);
      const caseLookup = await this.program.account.caseIdLookup.fetch(caseLookupPDA);
      const patientCasePDA = caseLookup.patientPda;
      
      // Get the verifiers list PDA
      const [verifiersListPDA] = await derivePdaAddresses.verifiersList();
      
      // Close the rejected case
      return await this.program.methods
        .closeRejectedCase(caseId)
        .accounts({
          user: this.wallet.publicKey,
          caseLookup: caseLookupPDA,
          patientCase: patientCasePDA,
          verifiersList: verifiersListPDA,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
    } catch (error) {
      console.error("Error closing rejected case:", error);
      throw error;
    }
  }

  /**
   * View details of a specific case (public method that doesn't require signing)
   * @param connection The Solana connection
   * @param caseId The case ID to view
   * @returns Case details
   */
  static async viewCaseDetails(
    connection: Connection,
    caseId: string
  ): Promise<CaseDetails> {
    try {
      // Create a dummy wallet for read-only operations
      const dummyWallet = new anchor.Wallet(anchor.web3.Keypair.generate());
      
      // Get the program
      const program = getCuraChainProgram(connection, dummyWallet);
      
      // Get case lookup PDA
      const [caseLookupPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from('case_lookup'), Buffer.from(caseId)],
        PROGRAM_ID
      );
      
      // Fetch lookup account
      const caseLookup = await program.account.caseIdLookup.fetch(caseLookupPDA);
      
      // Fetch patient case account
      const patientCase = await program.account.patientCase.fetch(caseLookup.patientPda);
      
      // Format case details
      return {
        caseId: patientCase.caseId,
        patientAddress: patientCase.patientPubkey.toString(),
        description: patientCase.caseDescription,
        totalAmountNeeded: patientCase.totalAmountNeeded.toNumber(),
        totalRaised: patientCase.totalRaised.toNumber(),
        isVerified: patientCase.isVerified,
        isFunded: patientCase.caseFunded,
        recordsLink: patientCase.linkToRecords,
        yesVotes: patientCase.verificationYesVotes,
        noVotes: patientCase.verificationNoVotes,
        verifiers: patientCase.votedVerifiers.map(pubkey => pubkey.toString()),
      };
    } catch (error) {
      console.error("Error viewing case details:", error);
      throw error;
    }
  }
}