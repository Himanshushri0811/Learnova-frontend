import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Heart } from 'lucide-react';
import { BRAND_CONFIG } from '../../utils/config';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-navy text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/brand/learnova-mark.svg"
                alt="Learnova Icon"
                className="w-8 h-8 rounded-lg"
              />
              <span className="text-xl font-bold text-white tracking-tight">
                Learn<span className="text-brand-cyan">ova</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 mb-4 italic">
              "{BRAND_CONFIG.tagline}"
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Offline tuition program focused on concept clarity, homework follow-up, and structured assessment for Classes 1–10.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#hero" className="hover:text-brand-cyan transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-brand-cyan transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-brand-cyan transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#founder" className="hover:text-brand-cyan transition-colors">
                  Founder
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-brand-cyan transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Portal */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact & Student Login
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={`tel:${BRAND_CONFIG.contact.phoneRaw}`}
                  className="hover:text-brand-cyan transition-colors"
                >
                  Phone: {BRAND_CONFIG.contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${BRAND_CONFIG.contact.whatsappRaw}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-cyan transition-colors"
                >
                  WhatsApp
                </a>
              </li>
              {BRAND_CONFIG.contact.email && !BRAND_CONFIG.contact.email.endsWith('.local') && (
                <li>
                  <a
                    href={`mailto:${BRAND_CONFIG.contact.email}`}
                    className="hover:text-brand-cyan transition-colors"
                  >
                    {BRAND_CONFIG.contact.email}
                  </a>
                </li>
              )}
              <li>
                <Link to="/student/login" className="hover:text-brand-cyan transition-colors">
                  Student Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Founder & Transparency */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Founder & Leadership
            </h4>
            <p className="text-sm text-slate-300 font-medium">
              {BRAND_CONFIG.founder.name}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Founder & Educator ({BRAND_CONFIG.founder.experienceYears} Years Teaching Experience)
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Scope: {BRAND_CONFIG.founder.scope}
            </p>
            <div className="mt-4">
              <a
                href={BRAND_CONFIG.founder.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-brand-cyan hover:text-cyan-300 font-medium"
              >
                <span>View LinkedIn Profile</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} Learnova. All rights reserved.
          </div>
          <div className="flex items-center gap-2">
            <span>Built with care for students and parents</span>
            <Heart className="w-3 h-3 text-red-400 fill-red-400" />
          </div>
        </div>
      </div>
    </footer>
  );
};
