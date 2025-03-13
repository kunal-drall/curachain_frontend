
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Stats from '@/components/Stats';
import FeaturedCases from '@/components/FeaturedCases';
import HowItWorks from '@/components/HowItWorks';
import { 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  HeartPulse, 
  ArrowRight 
} from 'lucide-react';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-primary-dark to-primary py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRoLTJWMGgydjM0em0tNCAwVjBoMnYzNGgtMnptLTUgMGgtMlYwaDF2MzRoMXptLTYgMGgtMlYwaDF2MzRoMXptLTUgMGgtMlYwaDJ2MzR6bS02IDBoLTJWMGgydjM0em0tNSAwaC0yVjBoMnYzNHoiLz48L2c+PC9nPjwvc3ZnPg==')] bg-repeat"></div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-6 animate-fade-in">
                <ShieldCheck size={16} className="mr-2" />
                Transparent, Verified Medical Crowdfunding
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight animate-fade-in" style={{ animationDelay: '100ms' }}>
                Empowering Patients with <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">Transparent</span> Healthcare Funding
              </h1>
              
              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
                CuraChain connects patients with donors through a transparent, blockchain-verified platform. Every case is verified by medical professionals to ensure your donations reach those who truly need it.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
                <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 button-glow">
                  <Link to="/cases">
                    Find Cases to Support
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                  <Link to="/patients">
                    Submit Your Case
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Stats Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Stats />
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="section bg-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <HowItWorks />
          </div>
        </section>
        
        {/* Featured Cases Section */}
        <section className="section bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <FeaturedCases />
          </div>
        </section>
        
        {/* User Types Section */}
        <section className="section bg-gradient-to-br from-primary-lighter to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Who Can Use CuraChain?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our platform connects patients, donors, and medical professionals in a transparent ecosystem
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-sm p-8 text-center hover-scale">
                <div className="rounded-full bg-primary-lighter p-4 inline-block mb-4">
                  <HeartPulse size={28} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Patients</h3>
                <p className="text-muted-foreground mb-5">
                  Create verified fundraising campaigns for medical treatments, surgeries, or specialized care not covered by insurance
                </p>
                <Button asChild variant="outline">
                  <Link to="/patients">
                    Learn More
                  </Link>
                </Button>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-8 text-center hover-scale">
                <div className="rounded-full bg-primary-lighter p-4 inline-block mb-4">
                  <FileText size={28} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Donors</h3>
                <p className="text-muted-foreground mb-5">
                  Support verified medical cases with confidence, knowing that your donations go directly to legitimate healthcare needs
                </p>
                <Button asChild variant="outline">
                  <Link to="/cases">
                    Find Cases
                  </Link>
                </Button>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-8 text-center hover-scale">
                <div className="rounded-full bg-primary-lighter p-4 inline-block mb-4">
                  <CheckCircle2 size={28} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Medical Verifiers</h3>
                <p className="text-muted-foreground mb-5">
                  Healthcare professionals can join our network to verify medical cases and help ensure platform integrity
                </p>
                <Button asChild variant="outline">
                  <Link to="/verifiers">
                    Become a Verifier
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-primary-dark text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
              <p className="text-xl text-white/80 mb-8">
                Join our community of donors and help someone get the critical medical care they need
              </p>
              <Button asChild size="lg" className="bg-white text-primary-dark hover:bg-white/90">
                <Link to="/cases">
                  Browse Verified Cases
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
