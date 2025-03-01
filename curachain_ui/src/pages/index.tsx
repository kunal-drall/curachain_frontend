// src/pages/index.tsx
import type { NextPage } from 'next';
import Head from 'next/head';
import { Layout } from '../components/layout/Layout';
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>CuraChain - Medical Crowdfunding on Solana</title>
        <meta name="description" content="Decentralized crowdsourcing platform for medical treatments" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">Medical Crowdfunding</span>
          <span className="block text-blue-600">on the Blockchain</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          CuraChain connects patients with verified medical professionals and philanthropic donors to fund critical medical treatments.
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            <Link href="/patient/submit" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
              Submit Medical Case
            </Link>
          </div>
          <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
            <Link href="/cases" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
              Browse Cases
            </Link>
          </div>
        </div>
      </div>

      {/* Add more home page content here */}
    </Layout>
  );
};

export default Home;