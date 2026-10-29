import React, { useState } from 'react';
import { X, CheckCircle, Send, PhoneCall } from 'lucide-react';
import { BRAND_CONFIG } from '../../utils/config';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    gradeLevel: 'Class 8',
    guardianName: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate submission / send to API if reachable
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setFormData({
      studentName: '',
      gradeLevel: 'Class 8',
      guardianName: '',
      phone: '',
      message: '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 overflow-hidden border border-slate-100">
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-brand-navy mb-2">
              Enquiry Received
            </h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Thank you for reaching out. We will get in touch with you shortly to discuss tuition timings, batch availability, and syllabus coverage.
            </p>
            <button
              onClick={handleResetAndClose}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-brand-navy hover:bg-brand-navyLight rounded-xl transition-colors"
            >
              Close Window
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-brand-blue">
                Tuition Admissions
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Classes 1–10 (Offline)
              </span>
            </div>

            <h3 className="text-2xl font-bold text-brand-navy tracking-tight mb-2">
              Enquire About Tuition
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Share student details to discuss personal attention, syllabus pacing, and offline batch scheduling.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wider mb-1">
                    Student Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent text-brand-text"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wider mb-1">
                    Class / Grade *
                  </label>
                  <select
                    value={formData.gradeLevel}
                    onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent text-brand-text bg-white"
                  >
                    {Array.from({ length: 10 }, (_, i) => `Class ${i + 1}`).map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wider mb-1">
                    Parent / Guardian Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.guardianName}
                    onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                    placeholder="e.g. Ramesh Sharma"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent text-brand-text"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wider mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent text-brand-text"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wider mb-1">
                  Subjects / Specific Areas for Improvement (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="e.g. Mathematics and Science foundation, homework assistance"
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent text-brand-text"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <PhoneCall className="w-3.5 h-3.5 text-brand-blue" />
                  {BRAND_CONFIG.contact.phoneDisplay}
                </span>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-brand-blue hover:bg-brand-blueHover rounded-xl transition-colors disabled:opacity-50 shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Submitting...' : 'Submit Enquiry'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

