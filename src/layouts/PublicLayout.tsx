import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { EnquiryModal } from '../components/common/EnquiryModal';

export const PublicLayout: React.FC = () => {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-brand-surface font-sans">
      <Navbar onOpenEnquiry={() => setIsEnquiryOpen(true)} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
      />
    </div>
  );
};

