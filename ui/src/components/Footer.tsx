
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary-dark text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="flex items-center justify-center rounded-md bg-white p-1.5">
                <span className="text-primary-dark font-bold text-xl">C</span>
              </div>
              <span className="font-display font-semibold text-xl">CuraChain</span>
            </div>
            <p className="text-sm text-white/80 mb-6">
              Transforming medical crowdfunding with transparency, trust, and verification through blockchain technology.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/cases" className="text-white/80 hover:text-white transition-colors">
                  Find Cases
                </Link>
              </li>
              <li>
                <Link to="/patients" className="text-white/80 hover:text-white transition-colors">
                  For Patients
                </Link>
              </li>
              <li>
                <Link to="/verifiers" className="text-white/80 hover:text-white transition-colors">
                  For Verifiers
                </Link>
              </li>
              <li>
                <Link to="/impact" className="text-white/80 hover:text-white transition-colors">
                  Impact
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white/80 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/faq" className="text-white/80 hover:text-white transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-white/80 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-white/80 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-white/80 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Mail size={16} className="mr-2 text-white/70" />
                <a href="mailto:info@curachain.org" className="text-white/80 hover:text-white transition-colors">
                  info@curachain.org
                </a>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-2 text-white/70" />
                <a href="tel:+1234567890" className="text-white/80 hover:text-white transition-colors">
                  (123) 456-7890
                </a>
              </li>
              <li className="flex items-start">
                <MapPin size={16} className="mr-2 mt-1 text-white/70" />
                <span className="text-white/80">
                  123 Blockchain Way<br />
                  San Francisco, CA 94107
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 py-6 text-center text-sm text-white/60">
          <p>© {new Date().getFullYear()} CuraChain. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
