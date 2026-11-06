import React, { FormEvent, useEffect, useState } from 'react';
import { AlertCircle, BookOpen, CheckCircle2, LoaderCircle, Plus, Save } from 'lucide-react';
import { apiRequest } from '../../lib/api';

interface ClassSubject {
  _id: string;
  classNumber: number;
  subjectName: string;
  isActive: boolean;
}

interface SubjectsData {
  classNumber: number | null;
  availableSubjects: ClassSubject[];
  selectedSubjectIds: string[];
}

interface SubjectsResponse {
  data: SubjectsData;
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-200';

export const MySubjectsPanel: React.FC = () => {
  const [data, setData] = useState<SubjectsData | null>(null);
  const [draftIds, setDraftIds] = useState<string[]>([]);
  const [requestName, setRequestName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadSubjects = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiRequest<SubjectsResponse>('/class-subjects/mine');
      setData(response.data);
      setDraftIds(response.data.selectedSubjectIds);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load your subjects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSubjects();
  }, []);

  const toggleSubject = (subjectId: string) => {
    setNotice('');
    setDraftIds((current) =>
      current.includes(subjectId)
        ? current.filter((id) => id !== subjectId)
        : [...current, subjectId]
    );
  };

  const saveSelections = async () => {
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const response = await apiRequest<SubjectsResponse>('/class-subjects/mine', {
        method: 'PUT',
        body: JSON.stringify({ subjectIds: draftIds }),
      });
      setData(response.data);
      setDraftIds(response.data.selectedSubjectIds);
      setNotice('Your subject selections have been saved.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save your subjects.');
    } finally {
      setSaving(false);
    }
  };

  const submitRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRequesting(true);
    setError('');
    setNotice('');
    try {
      await apiRequest('/class-subjects/mine/requests', {
        method: 'POST',
        body: JSON.stringify({ requestedSubjectName: requestName.trim() }),
      });
      setRequestName('');
      setNotice('Your subject request was sent to Learnova for review.');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to submit your subject request.');
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return (
      <section className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">
        <LoaderCircle className="h-5 w-5 animate-spin text-blue-600" /> Loading subjects for your class…
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Your learning</p>
        <h2 className="mt-1 text-2xl font-extrabold text-[#0b1f4d]">My Subjects</h2>
        <p className="mt-1 text-sm text-slate-500">
          Choose from the subjects available for your class. Your choices are saved to your student account.
        </p>
      </header>

      {error && (
        <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle size={17} className="mt-0.5 shrink-0" /> {error}
        </div>
      )}
      {notice && (
        <div role="status" className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          <CheckCircle2 size={17} className="mt-0.5 shrink-0" /> {notice}
        </div>
      )}

      {!data?.classNumber ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-slate-300" />
          <h3 className="mt-4 font-bold text-[#0b1f4d]">Add your class to get started</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Your subject list is based on the class saved in your student profile. Update your class in My Profile to see the right subjects.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-sm"><BookOpen size={22} /></span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-blue-700">Your class</p>
                <p className="text-lg font-extrabold text-[#0b1f4d]">Class {data.classNumber}</p>
              </div>
            </div>
            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-600">
              {draftIds.length} {draftIds.length === 1 ? 'subject selected' : 'subjects selected'}
            </span>
          </div>

          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-[#0b1f4d]">Available subjects</h3>
                <p className="mt-1 text-sm text-slate-500">Select or remove subjects, then save your changes.</p>
              </div>
              <button
                type="button"
                onClick={() => void loadSubjects()}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Refresh
              </button>
            </div>

            {data.availableSubjects.length ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {data.availableSubjects.map((subject) => {
                  const selected = draftIds.includes(subject._id);
                  return (
                    <label
                      key={subject._id}
                      className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                        selected ? 'border-blue-300 bg-blue-50/70 ring-1 ring-blue-100' : 'border-slate-200 hover:border-blue-200'
                      } ${!subject.isActive ? 'opacity-75' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleSubject(subject._id)}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-[#0b1f4d]">{subject.subjectName}</span>
                        <span className="mt-1 block text-xs text-slate-500">
                          {subject.isActive ? `Available for Class ${data.classNumber}` : 'Inactive subject · remove if no longer needed'}
                        </span>
                      </span>
                      {selected && <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-600" />}
                    </label>
                  );
                })}
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center">
                <BookOpen className="mx-auto h-8 w-8 text-slate-300" />
                <p className="mt-3 font-semibold text-slate-700">No subjects are available yet</p>
                <p className="mt-1 text-sm text-slate-500">You can request a subject below for Admin review.</p>
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <p className="text-xs text-slate-500">You can update your choices at any time.</p>
              <button
                type="button"
                onClick={() => void saveSelections()}
                disabled={saving || !data.availableSubjects.length}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-navy px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
              >
                <Save size={16} /> {saving ? 'Saving…' : 'Save my subjects'}
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700"><Plus size={19} /></span>
              <div>
                <h3 className="font-bold text-[#0b1f4d]">Need a different subject?</h3>
                <p className="mt-1 text-sm text-slate-500">Send a request. An Admin must approve it before it appears in the catalogue.</p>
              </div>
            </div>
            <form onSubmit={submitRequest} className="mt-4 flex flex-col gap-2 sm:flex-row">
              <input
                required
                maxLength={80}
                value={requestName}
                onChange={(event) => setRequestName(event.target.value)}
                placeholder="Enter subject name"
                aria-label="Requested subject name"
                className={inputClass}
              />
              <button disabled={requesting} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-bold text-blue-700 disabled:opacity-50">
                <Plus size={16} /> {requesting ? 'Sending…' : 'Request subject'}
              </button>
            </form>
          </section>
        </>
      )}
    </section>
  );
};
