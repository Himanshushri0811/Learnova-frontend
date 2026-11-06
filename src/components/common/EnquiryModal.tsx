import React, { useRef, useState } from 'react';
import { AlertCircle, CheckCircle, LoaderCircle, PhoneCall, Send, X } from 'lucide-react';
import { BRAND_CONFIG } from '../../utils/config';
import { apiRequest } from '../../lib/api';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface EnquiryForm {
  parentName: string;
  studentName: string;
  phone: string;
  classNumber: string;
  email: string;
  board: string;
  subject: string;
  message: string;
  preferredContactTime: string;
  website: string;
}

const emptyForm: EnquiryForm = {
  parentName: '',
  studentName: '',
  phone: '',
  classNumber: '',
  email: '',
  board: '',
  subject: '',
  message: '',
  preferredContactTime: '',
  website: '',
};

const inputClass = 'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

export const EnquiryModal: React.FC<EnquiryModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<EnquiryForm>(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const submitting = useRef(false);

  if (!isOpen) return null;

  const updateField = (field: keyof EnquiryForm, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setError('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setLoading(true);
    setError('');
    try {
      await apiRequest('/enquiries', {
        method: 'POST',
        body: JSON.stringify({
          parentName: formData.parentName.trim(),
          studentName: formData.studentName.trim(),
          phone: formData.phone.trim(),
          classNumber: Number(formData.classNumber),
          ...(formData.email.trim() ? { email: formData.email.trim() } : {}),
          ...(formData.board ? { board: formData.board } : {}),
          ...(formData.subject.trim() ? { subject: formData.subject.trim() } : {}),
          ...(formData.message.trim() ? { message: formData.message.trim() } : {}),
          ...(formData.preferredContactTime ? { preferredContactTime: formData.preferredContactTime } : {}),
          website: formData.website,
        }),
      });
      setFormData(emptyForm);
      setSubmitted(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Unable to submit your enquiry right now. Please try again or call Learnova.'
      );
    } finally {
      submitting.current = false;
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setSubmitted(false);
    setError('');
    setFormData(emptyForm);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-sm">
      <div role="dialog" aria-modal="true" aria-labelledby="enquiry-title" className="relative my-auto max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-100 bg-white p-5 shadow-2xl sm:p-8">
        <button type="button" onClick={handleClose} disabled={loading} className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40" aria-label="Close enquiry form">
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle className="h-9 w-9" />
            </div>
            <h2 id="enquiry-title" className="text-2xl font-extrabold text-brand-navy">Enquiry received</h2>
            <p role="status" className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-600">
              Thank you for contacting Learnova! Your enquiry has been submitted successfully. Our team will contact you soon.
            </p>
            <button type="button" onClick={handleClose} className="mt-7 rounded-xl bg-brand-navy px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-900">
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="mb-5">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700">Tuition admissions · Classes 1–10</span>
              <h2 id="enquiry-title" className="mt-4 text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl">Enquire About Tuition</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">Share a few details and we’ll get in touch to discuss learning support and offline tuition.</p>
            </div>

            {error && <div role="alert" className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
                <label htmlFor="enquiry-website">Leave this field empty</label>
                <input id="enquiry-website" tabIndex={-1} autoComplete="off" value={formData.website} onChange={(event) => updateField('website', event.target.value)} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-bold uppercase tracking-wide text-brand-navy">
                  Parent / Guardian Name <span className="text-red-600">*</span>
                  <input required minLength={2} maxLength={100} autoComplete="name" value={formData.parentName} onChange={(event) => updateField('parentName', event.target.value)} placeholder="Your name" className={`${inputClass} mt-1.5 normal-case tracking-normal`} />
                </label>
                <label className="text-xs font-bold uppercase tracking-wide text-brand-navy">
                  Student Name <span className="text-red-600">*</span>
                  <input required minLength={2} maxLength={100} autoComplete="off" value={formData.studentName} onChange={(event) => updateField('studentName', event.target.value)} placeholder="Student's name" className={`${inputClass} mt-1.5 normal-case tracking-normal`} />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-bold uppercase tracking-wide text-brand-navy">
                  Mobile Number <span className="text-red-600">*</span>
                  <input required type="tel" inputMode="tel" autoComplete="tel" maxLength={16} pattern="(?:\+?91[\s-]?)?[6-9][0-9\s-]{8,14}" title="Enter a valid Indian mobile number" value={formData.phone} onChange={(event) => updateField('phone', event.target.value)} placeholder="10-digit Indian number" className={`${inputClass} mt-1.5 normal-case tracking-normal`} />
                </label>
                <label className="text-xs font-bold uppercase tracking-wide text-brand-navy">
                  Student’s Class <span className="text-red-600">*</span>
                  <select required value={formData.classNumber} onChange={(event) => updateField('classNumber', event.target.value)} className={`${inputClass} mt-1.5 normal-case tracking-normal`}>
                    <option value="">Select class</option>
                    {Array.from({ length: 10 }, (_, index) => <option key={index + 1} value={index + 1}>Class {index + 1}</option>)}
                  </select>
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-bold uppercase tracking-wide text-brand-navy">
                  Email Address <span className="font-medium normal-case tracking-normal text-slate-400">(optional)</span>
                  <input type="email" maxLength={254} autoComplete="email" value={formData.email} onChange={(event) => updateField('email', event.target.value)} placeholder="you@example.com" className={`${inputClass} mt-1.5 normal-case tracking-normal`} />
                </label>
                <label className="text-xs font-bold uppercase tracking-wide text-brand-navy">
                  Board <span className="font-medium normal-case tracking-normal text-slate-400">(optional)</span>
                  <select value={formData.board} onChange={(event) => updateField('board', event.target.value)} className={`${inputClass} mt-1.5 normal-case tracking-normal`}>
                    <option value="">Select board</option>
                    <option value="CBSE">CBSE</option>
                    <option value="UP_BOARD">UP Board</option>
                  </select>
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-bold uppercase tracking-wide text-brand-navy">
                  Subject of Interest <span className="font-medium normal-case tracking-normal text-slate-400">(optional)</span>
                  <input maxLength={120} value={formData.subject} onChange={(event) => updateField('subject', event.target.value)} placeholder="e.g. Mathematics, Science" className={`${inputClass} mt-1.5 normal-case tracking-normal`} />
                </label>
                <label className="text-xs font-bold uppercase tracking-wide text-brand-navy">
                  Preferred Contact Time <span className="font-medium normal-case tracking-normal text-slate-400">(optional)</span>
                  <select value={formData.preferredContactTime} onChange={(event) => updateField('preferredContactTime', event.target.value)} className={`${inputClass} mt-1.5 normal-case tracking-normal`}>
                    <option value="">Any time</option>
                    <option value="Morning (9 AM–12 PM)">Morning (9 AM–12 PM)</option>
                    <option value="Afternoon (12–4 PM)">Afternoon (12–4 PM)</option>
                    <option value="Evening (4–8 PM)">Evening (4–8 PM)</option>
                  </select>
                </label>
              </div>

              <label className="block text-xs font-bold uppercase tracking-wide text-brand-navy">
                Message / Additional Requirements <span className="font-medium normal-case tracking-normal text-slate-400">(optional)</span>
                <textarea rows={3} maxLength={2000} value={formData.message} onChange={(event) => updateField('message', event.target.value)} placeholder="Tell us what kind of support your child needs…" className={`${inputClass} mt-1.5 resize-y normal-case tracking-normal`} />
              </label>

              <div className="flex flex-col-reverse items-start justify-between gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center">
                <a href={`tel:${BRAND_CONFIG.contact.phoneRaw}`} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700">
                  <PhoneCall className="h-4 w-4 text-brand-blue" />Call {BRAND_CONFIG.contact.phoneDisplay}
                </a>
                <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-blue px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
                  {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {loading ? 'Submitting…' : 'Submit Enquiry'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
