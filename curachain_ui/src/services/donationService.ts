// src/services/donationService.ts
import * as anchor from '@coral-xyz/anchor';
import { PublicKey, Connection } from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';
import { PROGRAM_ID, derivePdaAddresses } from '../utils/anchor-curachain';
import idl from '../idl/curachain.json';

export class DonationService {
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

  async donateToCase(caseId: string, amount: number) {
    try {
      const [caseLookupPDA] = await derivePdaAddresses.caseLookup(caseId);
      const caseLookup = await this.program.account.caseIdLookup.fetch(caseLookupPDA);
      const patientCasePDA = caseLookup.patientPda;
      
      // Derive the patient escrow PDA
      const [patientEscrowPDA] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('patient_escrow'),
          Buffer.from(caseId),
          patientCasePDA.toBuffer(),
        ],
        PROGRAM_ID
      );
      
      // Derive the donor PDA
      const [donorPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from('donor'), this.wallet.publicKey.toBuffer()],
        PROGRAM_ID
      );
      
      // Call the donate instruction
      const tx = await this.program.methods
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
      
      return tx;
    } catch (error) {
      console.error('Error donating to case:', error);
      throw error;
    }
  }

  // Add more methods as needed
}