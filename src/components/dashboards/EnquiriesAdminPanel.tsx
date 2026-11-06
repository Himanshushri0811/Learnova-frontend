import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Clock3, ExternalLink, LoaderCircle, MessageCircle, PhoneCall, RefreshCw, Search, Trash2, X } from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { BRAND_CONFIG } from '../../utils/config';

type EnquiryStatus = 'NEW' | 'CONTACTED' | 'ADMISSION_CONFIRMED' | 'NOT_INTERESTED';
type EnquiryBoard = 'CBSE' | 'UP_BOARD';

interface Enquiry {
  _id: string;
  parentName: string;
  studentName: string;
  phone: string;
  email?: string;
  classNumber: number;
  board?: EnquiryBoard;
  subject?: string;
  message?: string;
  preferredContactTime?: string;
  status: EnquiryStatus;
  adminNotes: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EnquiryStats {
  total: number;
  new: number;
  contacted: number;
  admissionConfirmed: number;
  notInterested: number;
  unread: number;
}

interface ApiResponse<T> {
  status: string;
  data: T;
  enquiries?: Enquiry[];
  pagination?: { page: number; limit: number; total: number; totalPages: number };
}

const statuses: Array<{ value: EnquiryStatus; label: string }> = [
  { value: 'NEW', label: 'New' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'ADMISSION_CONFIRMED', label: 'Admission Confirmed' },
  { value: 'NOT_INTERESTED', label: 'Not Interested' },
];

const statusClass: Record<EnquiryStatus, string> = {
  NEW: 'bg-blue-50 text-blue-700',
  CONTACTED: 'bg-amber-50 text-amber-800',
  ADMISSION_CONFIRMED: 'bg-emerald-50 text-emerald-700',
  NOT_INTERESTED: 'bg-slate-100 text-slate-600',
};

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100';
const classOptions = Array.from({ length: 10 }, (_, index) => index + 1);
const formatDate = (value: string) => new Date(value).toLocaleString('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

export const EnquiriesAdminPanel: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [stats, setStats] = useState<EnquiryStats | null>(null);
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [statusDraft, setStatusDraft] = useState<EnquiryStatus>('NEW');
  const [notesDraft, setNotesDraft] = useState('');
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadStats = useCallback(async () => {
    const response = await apiRequest<{ data: EnquiryStats }>('/enquiries/stats');
    setStats(response.data);
  }, []);

  const loadEnquiries = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: String(page), limit: '25' });
      if (search.trim()) params.set('search', search.trim());
      if (classFilter) params.set('classNumber', classFilter);
      if (statusFilter) params.set('status', statusFilter);
      if (dateFilter) {
        params.set('startDate', dateFilter);
        params.set('endDate', dateFilter);
      }
      const response = await apiRequest<ApiResponse<never>>(`/enquiries?${params.toString()}`);
      setEnquiries(response.enquiries ?? []);
      setTotal(response.pagination?.total ?? 0);
      setTotalPages(response.pagination?.totalPages ?? 0);
      await loadStats();
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load enquiries.');
    } finally {
      if (!silent) setLoading(false);
    }
  }, [classFilter, dateFilter, loadStats, page, search, statusFilter]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadEnquiries(), search ? 300 : 0);
    return () => window.clearTimeout(timer);
  }, [loadEnquiries]);

  useEffect(() => {
    const timer = window.setInterval(() => void loadEnquiries(true), 30000);
    return () => window.clearInterval(timer);
  }, [loadEnquiries]);

  const openEnquiry = async (item: Enquiry) => {
    setDetailLoading(true);
    setError('');
    try {
      const response = await apiRequest<{ data: { enquiry: Enquiry } }>(`/enquiries/${item._id}`);
      setSelected(response.data.enquiry);
      setStatusDraft(response.data.enquiry.status);
      setNotesDraft(response.data.enquiry.adminNotes ?? '');
      if (!item.isRead) {
        setEnquiries((current) => current.map((enquiry) =>
          enquiry._id === item._id ? { ...enquiry, isRead: true } : enquiry
        ));
        await loadStats();
      }
    } catch (detailError) {
      setError(detailError instanceof Error ? detailError.message : 'Unable to open this enquiry.');
    } finally {
      setDetailLoading(false);
    }
  };

  const saveEnquiry = async () => {
    if (!selected) return;
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const response = await apiRequest<{ data: { enquiry: Enquiry } }>(`/enquiries/${selected._id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: statusDraft,
          adminNotes: notesDraft,
          isRead: true,
        }),
      });
      setSelected(response.data.enquiry);
      setNotice('Enquiry details updated.');
      await loadEnquiries(true);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to update enquiry.');
    } finally {
      setSaving(false);
    }
  };

  const deleteEnquiry = async () => {
    if (!selected || !window.confirm(`Delete the enquiry from ${selected.parentName}? This cannot be undone.`)) return;
    setSaving(true);
    setError('');
    setNotice('');
    try {
      await apiRequest(`/enquiries/${selected._id}`, { method: 'DELETE' });
      setSelected(null);
      setNotice('Enquiry deleted.');
      await loadEnquiries(true);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete enquiry.');
    } finally {
      setSaving(false);
    }
  };

  const markAllRead = async () => {
    const ids = enquiries.filter((item) => !item.isRead).map((item) => item._id);
    if (!ids.length) return;
    setSaving(true);
    setError('');
    try {
      await apiRequest('/enquiries/mark-read', {
        method: 'POST',
        body: JSON.stringify({ ids }),
      });
      setNotice('Visible new enquiries marked as read.');
      await loadEnquiries(true);
    } catch (markError) {
      setError(markError instanceof Error ? markError.message : 'Unable to mark enquiries as read.');
    } finally {
      setSaving(false);
    }
  };

  const pageItems = useMemo(() => enquiries, [enquiries]);

  return (
    <section className="space-y-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Website leads</p>
          <h2 className="mt-1 flex flex-wrap items-center gap-2 text-2xl font-extrabold text-brand-navy">
            Enquiries
            {!!stats?.unread && <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-extrabold text-amber-800">{stats.unread} unread</span>}
          </h2>
          <p className="mt-1 text-sm text-slate-500">Review tuition enquiries, follow up with families, and track admission decisions.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={markAllRead} disabled={saving || !enquiries.some((item) => !item.isRead)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-white disabled:opacity-50">Mark visible as read</button>
          <button type="button" onClick={() => void loadEnquiries()} disabled={loading} aria-label="Refresh enquiries" className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-white disabled:opacity-50"><RefreshCw size={17} className={loading ? 'animate-spin' : ''} /></button>
        </div>
      </header>

      {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle size={17} className="mt-0.5 shrink-0" />{error}</div>}
      {notice && <div role="status" className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"><CheckCircle2 size={17} className="mt-0.5 shrink-0" />{notice}</div>}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[
          { label: 'Total Enquiries', value: stats?.total ?? 0, tint: 'bg-blue-50 text-blue-800' },
          { label: 'New Enquiries', value: stats?.new ?? 0, tint: 'bg-cyan-50 text-cyan-800' },
          { label: 'Contacted', value: stats?.contacted ?? 0, tint: 'bg-amber-50 text-amber-800' },
          { label: 'Admission Confirmed', value: stats?.admissionConfirmed ?? 0, tint: 'bg-emerald-50 text-emerald-800' },
          { label: 'Not Interested', value: stats?.notInterested ?? 0, tint: 'bg-slate-100 text-slate-700' },
        ].map((card) => (
          <article key={card.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold text-slate-500">{card.label}</p>
            <p className={`mt-2 inline-flex rounded-xl px-3 py-1.5 text-xl font-extrabold ${card.tint}`}>{card.value}</p>
          </article>
        ))}
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-3 border-b border-slate-200 p-4 sm:grid-cols-2 xl:grid-cols-4">
          <label className="relative sm:col-span-2 xl:col-span-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search parent, student, phone" aria-label="Search enquiries" className={`${inputClass} pl-9`} />
          </label>
          <label className="text-xs font-semibold text-slate-500">Class
            <select value={classFilter} onChange={(event) => { setClassFilter(event.target.value); setPage(1); }} className={`${inputClass} mt-1`}>
              <option value="">All classes</option>
              {classOptions.map((item) => <option key={item} value={item}>Class {item}</option>)}
            </select>
          </label>
          <label className="text-xs font-semibold text-slate-500">Status
            <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }} className={`${inputClass} mt-1`}>
              <option value="">All statuses</option>
              {statuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
            </select>
          </label>
          <label className="text-xs font-semibold text-slate-500">Enquiry date
            <input type="date" value={dateFilter} onChange={(event) => { setDateFilter(event.target.value); setPage(1); }} className={`${inputClass} mt-1`} />
          </label>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 p-12 text-sm text-slate-500"><LoaderCircle size={19} className="animate-spin text-blue-600" />Loading enquiries…</div>
        ) : pageItems.length ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr><th className="px-4 py-3">Parent Name</th><th className="px-4 py-3">Student Name</th><th className="px-4 py-3">Phone Number</th><th className="px-4 py-3">Class</th><th className="px-4 py-3">Board</th><th className="px-4 py-3">Enquiry Date</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pageItems.map((item) => (
                    <tr key={item._id} onClick={() => void openEnquiry(item)} className={`cursor-pointer transition hover:bg-blue-50/50 ${!item.isRead ? 'bg-blue-50/30' : ''}`}>
                      <td className="px-4 py-3"><span className="flex items-center gap-2 font-semibold text-brand-navy">{!item.isRead && <span aria-label="Unread" className="h-2 w-2 rounded-full bg-blue-600" />}{item.parentName}</span></td>
                      <td className="px-4 py-3 text-slate-700">{item.studentName}</td>
                      <td className="px-4 py-3"><a href={`tel:${item.phone}`} onClick={(event) => event.stopPropagation()} className="font-medium text-blue-700 hover:underline">{item.phone}</a></td>
                      <td className="px-4 py-3 text-slate-600">Class {item.classNumber}</td>
                      <td className="px-4 py-3 text-slate-600">{item.board === 'UP_BOARD' ? 'UP Board' : item.board ?? '—'}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">{formatDate(item.createdAt)}</td>
                      <td className="px-4 py-3"><span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${statusClass[item.status]}`}>{statuses.find((status) => status.value === item.status)?.label}</span></td>
                      <td className="px-4 py-3"><button type="button" onClick={(event) => { event.stopPropagation(); void openEnquiry(item); }} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-white">View</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3">
              <p className="text-xs text-slate-500">Showing {total ? (page - 1) * 25 + 1 : 0}–{Math.min(page * 25, total)} of {total} enquiries · Newest first</p>
              <div className="flex items-center gap-2">
                <button type="button" disabled={page <= 1} onClick={() => setPage((current) => current - 1)} className="rounded-lg border border-slate-200 p-2 text-slate-600 disabled:opacity-40"><ChevronLeft size={16} /></button>
                <span className="text-xs font-semibold text-slate-600">Page {page} of {totalPages || 1}</span>
                <button type="button" disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)} className="rounded-lg border border-slate-200 p-2 text-slate-600 disabled:opacity-40"><ChevronRight size={16} /></button>
              </div>
            </div>
          </>
        ) : (
          <div className="px-6 py-14 text-center">
            <MessageCircle className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-4 font-bold text-brand-navy">No enquiries found</h3>
            <p className="mt-2 text-sm text-slate-500">{total ? 'Try adjusting your filters.' : 'Website enquiries submitted by families will appear here.'}</p>
          </div>
        )}
      </section>

      {detailLoading && !selected && <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/30"><LoaderCircle size={28} className="animate-spin text-white" /></div>}

      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/45" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) setSelected(null); }}>
          <aside role="dialog" aria-modal="true" aria-labelledby="enquiry-detail-title" className="h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-slate-200 bg-white/95 p-5 backdrop-blur">
              <div><p className="text-xs font-bold uppercase tracking-wide text-blue-600">Enquiry details</p><h3 id="enquiry-detail-title" className="mt-1 text-xl font-extrabold text-brand-navy">{selected.parentName}</h3></div>
              <button type="button" aria-label="Close enquiry details" onClick={() => setSelected(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={19} /></button>
            </div>
            <div className="space-y-5 p-5">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><p className="text-xs font-semibold uppercase text-slate-400">Parent / Guardian</p><p className="mt-1 font-bold text-brand-navy">{selected.parentName}</p></div>
                  <div><p className="text-xs font-semibold uppercase text-slate-400">Student</p><p className="mt-1 font-bold text-brand-navy">{selected.studentName}</p></div>
                  <div><p className="text-xs font-semibold uppercase text-slate-400">Class & Board</p><p className="mt-1 text-sm text-slate-700">Class {selected.classNumber} · {selected.board === 'UP_BOARD' ? 'UP Board' : selected.board ?? 'Board not specified'}</p></div>
                  <div><p className="text-xs font-semibold uppercase text-slate-400">Submitted</p><p className="mt-1 inline-flex items-center gap-1.5 text-sm text-slate-700"><CalendarDays size={14} />{formatDate(selected.createdAt)}</p></div>
                  <div><p className="text-xs font-semibold uppercase text-slate-400">Phone</p><p className="mt-1 font-semibold text-slate-700">{selected.phone}</p></div>
                  <div><p className="text-xs font-semibold uppercase text-slate-400">Email</p><p className="mt-1 break-all text-sm text-slate-700">{selected.email || 'Not provided'}</p></div>
                  <div><p className="text-xs font-semibold uppercase text-slate-400">Subject of interest</p><p className="mt-1 text-sm text-slate-700">{selected.subject || 'Not specified'}</p></div>
                  <div><p className="text-xs font-semibold uppercase text-slate-400">Preferred contact</p><p className="mt-1 text-sm text-slate-700">{selected.preferredContactTime || 'Any time'}</p></div>
                </div>
                <div className="mt-4 border-t border-slate-200 pt-4"><p className="text-xs font-semibold uppercase text-slate-400">Message / Requirements</p><p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">{selected.message || 'No additional message provided.'}</p></div>
              </div>

              <div className="flex flex-wrap gap-2">
                <a href={`tel:${selected.phone}`} className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"><PhoneCall size={16} />Call Parent</a>
                <a href={`https://wa.me/91${selected.phone}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"><MessageCircle size={16} />WhatsApp<ExternalLink size={14} /></a>
              </div>

              <label className="block text-xs font-bold uppercase tracking-wide text-slate-600">Enquiry status
                <select value={statusDraft} onChange={(event) => setStatusDraft(event.target.value as EnquiryStatus)} className={`${inputClass} mt-1.5 normal-case tracking-normal`}>
                  {statuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
                </select>
              </label>

              <label className="block text-xs font-bold uppercase tracking-wide text-slate-600">Internal Admin notes
                <textarea rows={5} maxLength={2000} value={notesDraft} onChange={(event) => setNotesDraft(event.target.value)} placeholder="Add private follow-up notes…" className={`${inputClass} mt-1.5 resize-y normal-case tracking-normal`} />
              </label>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <button type="button" onClick={() => void deleteEnquiry()} disabled={saving} className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"><Trash2 size={16} />Delete</button>
                <button type="button" onClick={() => void saveEnquiry()} disabled={saving || (statusDraft === selected.status && notesDraft === selected.adminNotes)} className="inline-flex items-center gap-2 rounded-xl bg-brand-navy px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-900 disabled:opacity-50">
                  {saving ? <LoaderCircle size={16} className="animate-spin" /> : <Clock3 size={16} />}{saving ? 'Saving…' : 'Save updates'}
                </button>
              </div>
              <p className="text-[11px] leading-5 text-slate-400">Notes are visible only to Admin users. Learnova’s enquiry phone: {BRAND_CONFIG.contact.phoneDisplay}.</p>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
};
