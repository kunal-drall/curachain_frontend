// src/utils/wallet-adapter.ts
import { Keypair, PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import { Wallet } from '@coral-xyz/anchor';
import { WalletContextState } from '@solana/wallet-adapter-react';

export class AnchorWalletAdapter implements Wallet {
  payer: Keypair;
  constructor(private wallet: WalletContextState) {
    // Initialize payer with a new keypair
    this.payer = Keypair.generate();
  }

  async signTransaction<T extends Transaction | VersionedTransaction>(tx: T): Promise<T> {
    if (!this.wallet.signTransaction) {
      throw new Error('Wallet does not support transaction signing!');
    }
    return this.wallet.signTransaction(tx) as Promise<T>;
  }

  async signAllTransactions<T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]> {
    if (!this.wallet.signAllTransactions) {
      throw new Error('Wallet does not support signing multiple transactions!');
    }
    return this.wallet.signAllTransactions(txs) as Promise<T[]>;
  }

  get publicKey(): PublicKey {
    if (!this.wallet.publicKey) {
      // Return a dummy public key or throw an error
      throw new Error('Wallet not connected!');
    }
    return this.wallet.publicKey;
  }
}