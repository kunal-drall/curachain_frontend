// src/pages/index.tsx
import React, { useEffect, useState } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import Link from 'next/link';
import { Layout } from '../components/layout/Layout';
import { CaseList } from '../components/cases/CaseList';
import { useCuraChain } from '../contexts/CuraChainContext';
import { PatientService, CaseDetails } from '../services/patientService';

const HomePage: React.FC = () => {
  const { connection } = useConnection();
  const { featuredCases, casesLoading, allCases } = useCuraChain();
  
  // Platform statistics
  const [stats, setStats] = useState({
    totalCases: 0,
    verifiedCases: 0,
    totalFunded: 0,
    totalRaised: 0,
  });
  
  // Calculate statistics
  useEffect(() => {
    if (allCases.length > 0) {
      const verifiedCount = allCases.filter(c => c.isVerified).length;
      const fundedCount = allCases.filter(c => c.isFunded).length;
      const totalRaised = allCases.reduce((sum, c) => sum + c.totalRaised, 0);
      
      setStats({
        totalCases: allCases.length,
        verifiedCases: verifiedCount,
        totalFunded: fundedCount,
        totalRaised: totalRaised,
      });
    }
  }, [allCases]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero min-h-[70vh] bg-base-200 rounded-xl overflow-hidden">
        <div className="hero-content text-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold">Medical Crowdfunding on Solana</h1>
            <p className="py-6 text-lg">
              CuraChain connects patients in need with verified medical professionals 
              and generous donors to fund critical medical treatments globally.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/submit-case" className="btn btn-primary">
                Submit Medical Case
              </Link>
              <Link href="/cases" className="btn btn-outline">
                Browse Cases
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="my-12">
        <div className="stats shadow w-full">
          <div className="stat">
            <div className="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="stat-title">Total Cases</div>
            <div className="stat-value">{stats.totalCases}</div>
            <div className="stat-desc">Medical cases submitted</div>
          </div>
          
          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
              </svg>
            </div>
            <div className="stat-title">Verified Cases</div>
            <div className="stat-value">{stats.verifiedCases}</div>
            <div className="stat-desc">By medical professionals</div>
          </div>
          
          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
              </svg>
            </div>
            <div className="stat-title">Treatments Funded</div>
            <div className="stat-value">{stats.totalFunded}</div>
            <div className="stat-desc">Fully funded cases</div>
          </div>
          
          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12m-8-6h16"></path>
              </svg>
            </div>
            <div className="stat-title">Total Raised</div>
            <div className="stat-value">{(stats.totalRaised / 1_000_000_000).toFixed(2)} SOL</div>
            <div className="stat-desc">In donations</div>
          </div>
        </div>
      </section>

      {/* Featured Cases Section */}
      <section className="my-12">
        <CaseList
          cases={featuredCases}
          title="Featured Medical Cases"
          loading={casesLoading}
          compact={true}
        />
        
        {featuredCases.length > 0 && (
          <div className="text-center mt-6">
            <Link href="/cases" className="btn btn-outline">
              View All Cases
            </Link>
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <section className="my-12">
        <h2 className="text-3xl font-bold mb-6 text-center">How CuraChain Works</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <div className="flex justify-center mb-4">
                <div className="badge badge-primary badge-lg">1</div>
              </div>
              <h3 className="text-xl font-bold text-center">Submit Your Case</h3>
              <p className="text-center">
                Patients submit their medical cases with documentation of their condition and treatment needs.
              </p>
            </div>
          </div>
          
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <div className="flex justify-center mb-4">
                <div className="badge badge-primary badge-lg">2</div>
              </div>
              <h3 className="text-xl font-bold text-center">Expert Verification</h3>
              <p className="text-center">
                Medical professionals verify the legitimacy and urgency of each case through a decentralized voting system.
              </p>
            </div>
          </div>
          
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <div className="flex justify-center mb-4">
                <div className="badge badge-primary badge-lg">3</div>
              </div>
              <h3 className="text-xl font-bold text-center">Secure Funding</h3>
              <p className="text-center">
                Donors contribute SOL to verified cases, with funds held securely in escrow until treatment requirements are met.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="my-12">
        <div className="card bg-primary text-primary-content">
          <div className="card-body text-center">
            <h2 className="card-title text-2xl justify-center">Ready to make a difference?</h2>
            <p>Join the CuraChain community today and help fund life-changing medical treatments.</p>
            <div className="card-actions justify-center mt-4">
              <Link href="/cases" className="btn">
                Browse Cases
              </Link>
              <Link href="/submit-case" className="btn btn-secondary">
                Submit a Case
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;