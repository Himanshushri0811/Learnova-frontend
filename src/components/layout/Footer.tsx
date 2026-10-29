import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ShieldCheck, Heart } from 'lucide-react';
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
                  Overview
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-brand-cyan transition-colors">
                  Teaching Approach
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-brand-cyan transition-colors">
                  Academic Tracking Preview
                </a>
              </li>
              <li>
                <a href="#future-saas" className="hover:text-brand-cyan transition-colors">
                  Platform Roadmap
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-brand-cyan transition-colors">
                  Enquiry & Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Platform Access */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Portal Access
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/login?role=student" className="hover:text-brand-cyan transition-colors">
                  Student Portal
                </Link>
              </li>
              <li>
                <Link to="/login?role=guardian" className="hover:text-brand-cyan transition-colors">
                  Guardian Portal
                </Link>
              </li>
              <li>
                <Link to="/login?role=admin" className="hover:text-brand-cyan transition-colors">
                  Admin & Tutor Workspace
                </Link>
              </li>
              <li className="pt-2 text-xs text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-cyan" />
                Role-based access control
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

