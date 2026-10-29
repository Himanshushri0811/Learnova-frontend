import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, Send } from 'lucide-react';

interface NavbarProps {
  onOpenEnquiry?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenEnquiry }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (!isHome) {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Full Wordmark */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/brand/learnova-wordmark.svg"
              alt="Learnova — A New Way to Learn"
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-sm font-medium text-brand-text hover:text-brand-blue transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-sm font-medium text-brand-text hover:text-brand-blue transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-sm font-medium text-brand-text hover:text-brand-blue transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('founder')}
              className="text-sm font-medium text-brand-text hover:text-brand-blue transition-colors"
            >
              Founder
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-sm font-medium text-brand-text hover:text-brand-blue transition-colors"
            >
              Contact
            </button>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenEnquiry || (() => scrollToSection('contact'))}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-brand-blue bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
            >
              <Send className="w-4 h-4 text-brand-blue" />
              <span>Enquire About Tuition</span>
            </button>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-navy hover:bg-brand-navyLight rounded-lg transition-colors shadow-sm"
            >
              <LogIn className="w-4 h-4 text-brand-cyan" />
              <span>Student Login</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-brand-navy hover:text-brand-blue rounded-md focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-left py-2 text-sm font-medium text-brand-navy"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-left py-2 text-sm font-medium text-brand-navy"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-left py-2 text-sm font-medium text-brand-navy"
            >
              Features & Preview
            </button>
            <button
              onClick={() => scrollToSection('founder')}
              className="text-left py-2 text-sm font-medium text-brand-navy"
            >
              Founder
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-left py-2 text-sm font-medium text-brand-navy"
            >
              Contact
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenEnquiry) onOpenEnquiry();
                else scrollToSection('contact');
              }}
              className="w-full inline-flex justify-center items-center gap-2 px-4 py-2.5 text-sm font-semibold text-brand-blue bg-blue-50 border border-blue-200 rounded-lg"
            >
              <Send className="w-4 h-4" />
              <span>Enquire About Tuition</span>
            </button>
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex justify-center items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-brand-navy rounded-lg"
            >
              <LogIn className="w-4 h-4 text-brand-cyan" />
              <span>Student Login</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

