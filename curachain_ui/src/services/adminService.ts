// src/services/adminService.ts
import * as anchor from '@coral-xyz/anchor';
import { Connection, PublicKey, TransactionSignature } from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';
import { 
  PROGRAM_ID, 
  getCuraChainProgram, 
  derivePdaAddresses,
  isAdmin
} from '../utils/anchor-curachain';

export enum VerifierOperationType {
  Add = 0,
  Remove = 1
}

export class AdminService {
  program: Program;
  wallet: anchor.Wallet;
  connection: Connection;

  constructor(connection: Connection, wallet: anchor.Wallet) {
    this.connection = connection;
    this.wallet = wallet;
    this.program = getCuraChainProgram(connection, wallet);
  }

  /**
   * Check if the connected wallet is an administrator
   * @returns True if the wallet is an admin
   */
  async checkAdminStatus(): Promise<boolean> {
    return isAdmin(this.program, this.wallet.publicKey);
  }

  /**
   * Initialize the administrator account
   * This should only be called once during initial setup
   * @param adminAddress The public key to set as admin
   * @returns Transaction signature
   */
  async initializeAdministrator(adminAddress: PublicKey): Promise<TransactionSignature> {
    try {
      // Get admin account PDA
      const [adminPDA] = await derivePdaAddresses.adminAccount(adminAddress);
      
      // Initialize admin
      return await this.program.methods
        .initializeAdministrator(adminAddress)
        .accounts({
          adminAccount: adminPDA,
          initializer: this.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
    } catch (error) {
      console.error("Error initializing administrator:", error);
      throw error;
    }
  }

  /**
   * Initialize the global verifiers list and case counter
   * This should only be called once during initial setup
   * @returns Transaction signature
   */
  async initializeGlobalRegistryAndCounter(): Promise<TransactionSignature> {
    try {
      // Verify caller is admin
      const isAdminAccount = await this.checkAdminStatus();
      if (!isAdminAccount) {
        throw new Error("Only administrators can initialize the global registry");
      }
      
      // Get needed PDAs
      const [adminPDA] = await derivePdaAddresses.adminAccount(this.wallet.publicKey);
      const [verifiersListPDA] = await derivePdaAddresses.verifiersList();
      const [caseCounterPDA] = await derivePdaAddresses.caseCounter();
      
      // Initialize registry and counter
      return await this.program.methods
        .initializeGlobalVerifiersListAndCaseCounter()
        .accounts({
          admin: this.wallet.publicKey,
          adminAccount: adminPDA,
          verifiersRegistryList: verifiersListPDA,
          caseCounter: caseCounterPDA,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
    } catch (error) {
      console.error("Error initializing global registry and counter:", error);
      throw error;
    }
  }

  /**
   * Add or remove a verifier
   * @param verifierAddress The public key of the verifier to add/remove
   * @param operationType Whether to add or remove
   * @returns Transaction signature
   */
  async manageVerifier(
    verifierAddress: PublicKey, 
    operationType: VerifierOperationType
  ): Promise<TransactionSignature> {
    try {
      // Verify caller is admin
      const isAdminAccount = await this.checkAdminStatus();
      if (!isAdminAccount) {
        throw new Error("Only administrators can manage verifiers");
      }
      
      // Get needed PDAs
      const [adminPDA] = await derivePdaAddresses.adminAccount(this.wallet.publicKey);
      const [verifierPDA] = await derivePdaAddresses.verifierRole(verifierAddress);
      const [verifiersListPDA] = await derivePdaAddresses.verifiersList();
      
      // Add or remove the verifier
      return await this.program.methods
        .addOrRemoveVerifier(verifierAddress, operationType)
        .accounts({
          admin: this.wallet.publicKey,
          adminAccount: adminPDA,
          verifier: verifierPDA,
          verifiersList: verifiersListPDA,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
    } catch (error) {
      console.error("Error managing verifier:", error);
      throw error;
    }
  }

  /**
   * Release funds from a fully funded case to the medical facility
   * @param caseId The case ID to release funds for
   * @param facilityAddress The public key of the medical facility
   * @param verifier1 First verifier to approve release
   * @param verifier2 Second verifier to approve release
   * @param verifier3 Third verifier to approve release
   * @returns Transaction signature
   */
  async releaseFunds(
    caseId: string, 
    facilityAddress: PublicKey,
    verifier1: PublicKey,
    verifier2: PublicKey,
    verifier3: PublicKey
  ): Promise<TransactionSignature> {
    try {
      // Verify caller is admin
      const isAdminAccount = await this.checkAdminStatus();
      if (!isAdminAccount) {
        throw new Error("Only administrators can release funds");
      }
      
      // Get needed PDAs
      const [adminPDA] = await derivePdaAddresses.adminAccount(this.wallet.publicKey);
      const [caseLookupPDA] = await derivePdaAddresses.caseLookup(caseId);
      const caseLookup = await this.program.account.caseIdLookup.fetch(caseLookupPDA);
      const patientCasePDA = caseLookup.patientPda;
      
      // Patient escrow account
      const [patientEscrowPDA] = await derivePdaAddresses.patientEscrow(
        caseId,
        patientCasePDA
      );
      
      // Verifier PDAs
      const [verifier1PDA] = await derivePdaAddresses.verifierRole(verifier1);
      const [verifier2PDA] = await derivePdaAddresses.verifierRole(verifier2);
      const [verifier3PDA] = await derivePdaAddresses.verifierRole(verifier3);
      const [verifiersListPDA] = await derivePdaAddresses.verifiersList();
      
      // Release funds to facility
      return await this.program.methods
        .releaseFunds(caseId)
        .accounts({
          caseLookup: caseLookupPDA,
          patientCase: patientCasePDA,
          patientEscrow: patientEscrowPDA,
          facilityAddress: facilityAddress,
          admin: this.wallet.publicKey,
          adminAccount: adminPDA,
          verifier1: verifier1,
          verifier2: verifier2,
          verifier3: verifier3,
          verifier1Pda: verifier1PDA,
          verifier2Pda: verifier2PDA,
          verifier3Pda: verifier3PDA,
          verifiersList: verifiersListPDA,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
    } catch (error) {
      console.error("Error releasing funds:", error);
      throw error;
    }
  }

  /**
   * Get platform statistics
   * @returns Object with platform statistics
   */
  async getPlatformStats() {
    try {
      // Get case counter
      const [caseCounterPDA] = await derivePdaAddresses.caseCounter();
      const caseCounter = await this.program.account.caseCounter.fetch(caseCounterPDA);
      
      // Get all case lookups
      const caseLookups = await this.program.account.caseIdLookup.all();
      
      // Get verifiers list
      const [verifiersListPDA] = await derivePdaAddresses.verifiersList();
      const verifiersList = await this.program.account.verifiersList.fetch(verifiersListPDA);
      
      // Calculate statistics
      let totalCases = caseLookups.length;
      let totalVerifiedCases = 0;
      let totalFundedCases = 0;
      let totalAmountRaised = 0;
      
      // Iterate through cases to gather statistics
      for (const lookup of caseLookups) {
        const patientCase = await this.program.account.patientCase.fetch(lookup.account.patientPda);
        
        if (patientCase.isVerified) {
          totalVerifiedCases++;
        }
        
        if (patientCase.caseFunded) {
          totalFundedCases++;
        }
        
        totalAmountRaised += patientCase.totalRaised.toNumber();
      }
      
      return {
        totalCasesSubmitted: caseCounter.currentId.toNumber(),
        activeCases: totalCases,
        verifiedCases: totalVerifiedCases,
        fullyFundedCases: totalFundedCases,
        totalRaised: totalAmountRaised,
        totalVerifiers: verifiersList.allVerifiers.length
      };
    } catch (error) {
      console.error("Error getting platform stats:", error);
      throw error;
    }
  }
}