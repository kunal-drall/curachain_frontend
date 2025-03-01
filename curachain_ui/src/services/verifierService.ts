// src/services/verifierService.ts
import * as anchor from '@coral-xyz/anchor';
import { PublicKey, Connection } from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';
import { PROGRAM_ID, derivePdaAddresses } from '../utils/anchor-curachain';
import idl from '../idl/curachain.json';

export class VerifierService {
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

  async verifyCase(caseId: string, isApproved: boolean) {
    try {
      const [caseLookupPDA] = await derivePdaAddresses.caseLookup(caseId);
      const caseLookup = await this.program.account.caseIdLookup.fetch(caseLookupPDA);
      const patientCasePDA = caseLookup.patientPda;
      
      // Derive the verifier PDA
      const [verifierPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from('verifier_role'), this.wallet.publicKey.toBuffer()],
        PROGRAM_ID
      );
      
      // Get the verifiers list PDA
      const [verifiersListPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from('verifiers_list')],
        PROGRAM_ID
      );
      
      // Derive the patient escrow PDA
      const [patientEscrowPDA] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('patient_escrow'),
          Buffer.from(caseId),
          patientCasePDA.toBuffer(),
        ],
        PROGRAM_ID
      );
      
      // Call the verify_patient instruction
      const tx = await this.program.methods
        .verifyPatient(caseId, isApproved)
        .accounts({
          verifier: this.wallet.publicKey,
          patientCase: patientCasePDA,
          verifierAccount: verifierPDA,
          caseLookup: caseLookupPDA,
          verifiersList: verifiersListPDA,
          patientEscrow: patientEscrowPDA,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      
      return tx;
    } catch (error) {
      console.error('Error verifying case:', error);
      throw error;
    }
  }

  // Add more methods as needed
}