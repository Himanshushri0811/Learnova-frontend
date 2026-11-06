import React, { useCallback, useEffect, useState } from 'react';
import {
  BookOpen,
  Clock3,
  GraduationCap,
  LoaderCircle,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { apiRequest } from '../../lib/api';

interface ClassSubject {
  _id: string;
  classNumber: number;
  subjectName: string;
  isActive: boolean;
  studentCount: number;
}

interface SubjectStudent {
  student: { _id: string; name: string; username?: string; gradeLevel?: string };
  classNumber: number;
  selectedSubjects: Array<{ _id: string; subjectName: string; classNumber: number }>;
}

interface SubjectRequest {
  _id: string;
  requestedSubjectName: string;
  classNumber: number;
  createdAt: string;
  studentId: { name: string; username?: string; gradeLevel?: string };
}

interface Overview {
  totalClasses: number;
  activeSubjects: number;
  studentsWithSelectedSubjects: number;
}

interface ApiResponse<T> {
  data: T;
  results?: number;
}

const classOptions = Array.from({ length: 10 }, (_, index) => index + 1);
const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-200';

export const ClassSubjectsAdminPanel: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState(1);
  const [subjects, setSubjects] = useState<ClassSubject[]>([]);
  const [filterSubjects, setFilterSubjects] = useState<ClassSubject[]>([]);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [students, setStudents] = useState<SubjectStudent[]>([]);
  const [requests, setRequests] = useState<SubjectRequest[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [search, setSearch] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [editingSubjectId, setEditingSubjectId] = useState('');
  const [loading, setLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadOverview = useCallback(async () => {
    const response = await apiRequest<ApiResponse<Overview>>('/class-subjects/admin/overview');
    setOverview(response.data);
  }, []);

  const loadClassSubjects = useCallback(async () => {
    const response = await apiRequest<ApiResponse<{ subjects: ClassSubject[] }>>(
      `/class-subjects/admin/subjects?classNumber=${selectedClass}`
    );
    setSubjects(response.data.subjects);
  }, [selectedClass]);

  const loadRequests = useCallback(async () => {
    const response = await apiRequest<ApiResponse<{ requests: SubjectRequest[] }>>(
      '/class-subjects/admin/requests'
    );
    setRequests(response.data.requests);
  }, []);

  const loadPanel = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      await Promise.all([loadOverview(), loadClassSubjects(), loadRequests()]);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load class subjects.');
    } finally {
      setLoading(false);
    }
  }, [loadClassSubjects, loadOverview, loadRequests]);

  useEffect(() => {
    void loadPanel();
  }, [loadPanel]);

  const loadStudents = useCallback(async () => {
    setStudentsLoading(true);
    setError('');
    const params = new URLSearchParams();
    if (classFilter) params.set('classNumber', classFilter);
    if (subjectFilter) params.set('subjectId', subjectFilter);
    if (nameFilter.trim()) params.set('search', nameFilter.trim());
    try {
      const response = await apiRequest<ApiResponse<{ students: SubjectStudent[] }>>(
        `/class-subjects/admin/students?${params.toString()}`
      );
      setStudents(response.data.students);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load student subject selections.');
    } finally {
      setStudentsLoading(false);
    }
  }, [classFilter, nameFilter, subjectFilter]);

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadStudents(), 250);
    return () => window.clearTimeout(timeout);
  }, [loadStudents]);

  useEffect(() => {
    let cancelled = false;
    const loadFilterSubjects = async () => {
      try {
        const query = classFilter ? `?classNumber=${classFilter}` : '';
        const response = await apiRequest<ApiResponse<{ subjects: ClassSubject[] }>>(
          `/class-subjects/admin/subjects${query}`
        );
        if (!cancelled) setFilterSubjects(response.data.subjects);
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load subject filters.');
        }
      }
    };
    void loadFilterSubjects();
    return () => {
      cancelled = true;
    };
  }, [classFilter]);

  const saveSubject = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');
    try {
      await apiRequest(
        editingSubjectId
          ? `/class-subjects/admin/subjects/${editingSubjectId}`
          : '/class-subjects/admin/subjects',
        {
          method: editingSubjectId ? 'PUT' : 'POST',
          body: JSON.stringify(
            editingSubjectId
              ? { subjectName: subjectName.trim() }
              : { classNumber: selectedClass, subjectName: subjectName.trim() }
          ),
        }
      );
      setSubjectName('');
      setEditingSubjectId('');
      setNotice(editingSubjectId ? 'Subject updated.' : `Subject added to Class ${selectedClass}.`);
      await Promise.all([loadClassSubjects(), loadOverview()]);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save subject.');
    } finally {
      setSaving(false);
    }
  };

  const toggleSubject = async (subject: ClassSubject) => {
    setSaving(true);
    setError('');
    setNotice('');
    try {
      await apiRequest(`/class-subjects/admin/subjects/${subject._id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: !subject.isActive }),
      });
      setNotice(`${subject.subjectName} ${subject.isActive ? 'deactivated' : 'activated'}.`);
      await Promise.all([loadClassSubjects(), loadOverview()]);
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : 'Unable to update subject status.');
    } finally {
      setSaving(false);
    }
  };

  const deleteSubject = async (subject: ClassSubject) => {
    if (!window.confirm(`Remove ${subject.subjectName} from Class ${selectedClass}?`)) return;
    setSaving(true);
    setError('');
    setNotice('');
    try {
      await apiRequest(`/class-subjects/admin/subjects/${subject._id}`, { method: 'DELETE' });
      setNotice(`${subject.subjectName} removed.`);
      if (selectedSubjectId === subject._id) setSelectedSubjectId('');
      await Promise.all([loadClassSubjects(), loadOverview()]);
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : 'Unable to remove subject.');
    } finally {
      setSaving(false);
    }
  };

  const reviewRequest = async (request: SubjectRequest, status: 'APPROVED' | 'REJECTED') => {
    const action = status === 'APPROVED' ? 'approve' : 'reject';
    if (!window.confirm(`${action[0].toUpperCase()}${action.slice(1)} ${request.requestedSubjectName} for Class ${request.classNumber}?`)) return;
    setSaving(true);
    setError('');
    setNotice('');
    try {
      await apiRequest(`/class-subjects/admin/requests/${request._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      setNotice(`Subject request ${action}d.`);
      await Promise.all([loadRequests(), loadOverview(), loadClassSubjects()]);
    } catch (reviewError) {
      setError(reviewError instanceof Error ? reviewError.message : 'Unable to review subject request.');
    } finally {
      setSaving(false);
    }
  };

  const selectClass = (classNumber: number) => {
    setSelectedClass(classNumber);
    setSelectedSubjectId('');
    setEditingSubjectId('');
    setSubjectName('');
    setSubjectFilter('');
    setClassFilter(String(classNumber));
  };

  return (
    <section className="space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Academic setup</p>
        <h2 className="mt-1 text-2xl font-extrabold text-brand-navy">Classes &amp; Subjects</h2>
        <p className="mt-1 text-sm text-slate-500">Manage each class catalogue, see student selections and review requests.</p>
      </header>

      {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {notice && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</div>}

      {loading ? (
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">
          <LoaderCircle className="h-5 w-5 animate-spin" /> Loading class and subject records…
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Total classes', value: overview?.totalClasses ?? 10, icon: GraduationCap, tint: 'bg-blue-50 text-blue-700' },
              { label: 'Active subjects', value: overview?.activeSubjects ?? 0, icon: BookOpen, tint: 'bg-cyan-50 text-cyan-700' },
              { label: 'Students with selections', value: overview?.studentsWithSelectedSubjects ?? 0, icon: Users, tint: 'bg-violet-50 text-violet-700' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.label} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.tint}`}><Icon size={22} /></span>
                  <div><p className="text-sm text-slate-500">{item.label}</p><p className="text-2xl font-extrabold text-brand-navy">{item.value}</p></div>
                </article>
              );
            })}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="font-bold text-brand-navy">Select a class</h3>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5 lg:grid-cols-10">
              {classOptions.map((classNumber) => (
                <button
                  type="button"
                  key={classNumber}
                  onClick={() => selectClass(classNumber)}
                  aria-pressed={selectedClass === classNumber}
                  className={`rounded-xl border px-3 py-3 text-sm font-bold transition ${
                    selectedClass === classNumber
                      ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:border-blue-200 hover:bg-blue-50'
                  }`}
                >
                  Class {classNumber}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-brand-navy">Class {selectedClass} subjects</h3>
                  <p className="mt-1 text-sm text-slate-500">Select a subject to view its students.</p>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{subjects.length} total</span>
              </div>

              <form onSubmit={saveSubject} className="mt-5 flex flex-col gap-2 sm:flex-row">
                <input
                  required
                  maxLength={80}
                  value={subjectName}
                  onChange={(event) => setSubjectName(event.target.value)}
                  placeholder={editingSubjectId ? 'Edit subject name' : `Add a subject to Class ${selectedClass}`}
                  aria-label="Subject name"
                  className={inputClass}
                />
                <button disabled={saving} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">
                  {editingSubjectId ? <Pencil size={16} /> : <Plus size={16} />}
                  {editingSubjectId ? 'Save changes' : 'Add subject'}
                </button>
                {editingSubjectId && (
                  <button type="button" onClick={() => { setEditingSubjectId(''); setSubjectName(''); }} aria-label="Cancel edit" className="rounded-xl border border-slate-200 px-3 text-slate-500 hover:bg-slate-50"><X size={18} /></button>
                )}
              </form>

              {subjects.length ? (
                <ul className="mt-4 divide-y divide-slate-100">
                  {subjects.map((subject) => (
                    <li key={subject._id} className={`flex flex-wrap items-center justify-between gap-3 py-3 ${selectedSubjectId === subject._id ? 'rounded-xl bg-blue-50 px-3' : ''}`}>
                      <button type="button" onClick={() => {
                        setSelectedSubjectId(subject._id);
                        setSubjectFilter(subject._id);
                      }} className="min-w-0 flex-1 text-left">
                        <span className="block truncate font-semibold text-brand-navy">{subject.subjectName}</span>
                        <span className="mt-1 block text-xs text-slate-500">{subject.studentCount} {subject.studentCount === 1 ? 'student' : 'students'} · <span className={subject.isActive ? 'text-emerald-700' : 'text-slate-500'}>{subject.isActive ? 'Active' : 'Inactive'}</span></span>
                      </button>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => { setEditingSubjectId(subject._id); setSubjectName(subject.subjectName); }} aria-label={`Edit ${subject.subjectName}`} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-700"><Pencil size={16} /></button>
                        <button type="button" disabled={saving} onClick={() => void toggleSubject(subject)} className={`rounded-full px-3 py-1.5 text-xs font-bold disabled:opacity-50 ${subject.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{subject.isActive ? 'Deactivate' : 'Activate'}</button>
                        <button type="button" onClick={() => void deleteSubject(subject)} aria-label={`Remove ${subject.subjectName}`} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center">
                  <BookOpen className="mx-auto h-8 w-8 text-slate-300" />
                  <p className="mt-3 font-semibold text-slate-700">No subjects added for Class {selectedClass}</p>
                  <p className="mt-1 text-sm text-slate-500">Add the first subject using the form above.</p>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-brand-navy">Subject requests</h3>
                  <p className="mt-1 text-sm text-slate-500">Review student-submitted catalogue requests.</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800"><Clock3 size={14} />{requests.length}</span>
              </div>
              {requests.length ? (
                <ul className="mt-4 divide-y divide-slate-100">
                  {requests.map((request) => (
                    <li key={request._id} className="py-4">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-brand-navy">{request.requestedSubjectName}</p>
                          <p className="mt-1 text-xs text-slate-500">Class {request.classNumber} · {request.studentId?.name ?? 'Student'}{request.studentId?.username ? ` (@${request.studentId.username})` : ''}</p>
                        </div>
                        <p className="text-[11px] text-slate-400">{new Date(request.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button type="button" disabled={saving} onClick={() => void reviewRequest(request, 'APPROVED')} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white disabled:opacity-50">Approve &amp; add subject</button>
                        <button type="button" disabled={saving} onClick={() => void reviewRequest(request, 'REJECTED')} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 disabled:opacity-50">Reject</button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No pending subject requests.</p>
              )}
            </section>
          </div>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-brand-navy">Students by subject</h3>
                  <p className="mt-1 text-sm text-slate-500">Filter actual student selections by class and subject.</p>
                </div>
                <form onSubmit={(event) => { event.preventDefault(); void loadStudents(); }} className="flex min-w-[min(100%,18rem)] flex-1 gap-2 sm:max-w-sm">
                  <label className="relative min-w-0 flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input value={search} onChange={(event) => { setSearch(event.target.value); setNameFilter(event.target.value); }} placeholder="Search name or username" aria-label="Search students" className={`${inputClass} pl-9`} />
                  </label>
                  <button className="rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50">Search</button>
                </form>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="text-xs font-semibold text-slate-500">Class filter
                  <select value={classFilter} onChange={(event) => { setClassFilter(event.target.value); setSubjectFilter(''); setSelectedSubjectId(''); }} className={`${inputClass} mt-1`}>
                    <option value="">All classes</option>
                    {classOptions.map((classNumber) => <option key={classNumber} value={classNumber}>Class {classNumber}</option>)}
                  </select>
                </label>
                <label className="text-xs font-semibold text-slate-500">Subject filter
                  <select value={subjectFilter} onChange={(event) => setSubjectFilter(event.target.value)} className={`${inputClass} mt-1`}>
                    <option value="">All selected subjects</option>
                    {filterSubjects.map((subject) => <option key={subject._id} value={subject._id}>{subject.subjectName} (Class {subject.classNumber})</option>)}
                  </select>
                </label>
              </div>
            </div>
            {studentsLoading ? (
              <p className="p-8 text-center text-sm text-slate-500">Loading student selections…</p>
            ) : students.length ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-3">Student</th><th className="px-5 py-3">Username</th><th className="px-5 py-3">Class</th><th className="px-5 py-3">Selected subjects</th></tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.map(({ student, classNumber, selectedSubjects }) => (
                      <tr key={student._id}>
                        <td className="px-5 py-3 font-semibold text-brand-navy">{student.name}</td>
                        <td className="px-5 py-3 text-slate-600">{student.username || '—'}</td>
                        <td className="px-5 py-3 text-slate-600">{classNumber ? `Class ${classNumber}` : student.gradeLevel || '—'}</td>
                        <td className="px-5 py-3">
                          <div className="flex flex-wrap gap-1.5">
                            {selectedSubjects.length ? selectedSubjects.map((subject) => <span key={subject._id} className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">{subject.subjectName}</span>) : <span className="text-xs text-slate-400">No matching subjects</span>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-9 text-center">
                <Users className="mx-auto h-8 w-8 text-slate-300" />
                <p className="mt-3 font-semibold text-slate-700">No student selections found</p>
                <p className="mt-1 text-sm text-slate-500">Students with matching subject selections will appear here.</p>
              </div>
            )}
          </section>
        </>
      )}
    </section>
  );
};
