// src/pages/_app.tsx
import type { AppProps } from 'next/app';
import { WalletContextProvider } from '../contexts/WalletContextProvider';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WalletContextProvider>
      <Component {...pageProps} />
    </WalletContextProvider>
  );
}

export default MyApp;