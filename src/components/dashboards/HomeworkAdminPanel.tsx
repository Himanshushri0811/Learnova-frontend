import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Bell, BookOpen, Check, Clock3, FileText, LoaderCircle, Pencil, Plus, Search, Trash2, Users, X } from 'lucide-react';
import { apiRequest } from '../../lib/api';

type AssignmentType = 'CLASS' | 'INDIVIDUAL' | 'ALL_STUDENTS';
type HomeworkStatus = 'PENDING' | 'COMPLETED' | 'SUBMITTED' | 'OVERDUE';

interface Student {
  _id: string;
  name: string;
  username?: string;
  gradeLevel?: string;
  isArchived: boolean;
}

interface Subject {
  _id: string;
  subjectName: string;
  classNumber: number;
  isActive: boolean;
}

interface HomeworkFile {
  name: string;
  contentType: string;
  size: number;
  data: string;
}

interface StudentAssignment {
  _id: string;
  status: HomeworkStatus;
  studentId: Student | null;
  submissionFiles?: HomeworkFile[];
  submittedAt?: string;
  completedAt?: string;
}

interface Homework {
  _id: string;
  title: string;
  description: string;
  classNumber?: number | null;
  subjectId: Subject | null;
  assignedDate: string;
  dueDate: string;
  assignmentType: AssignmentType;
  attachments: HomeworkFile[];
  recipientCount: number;
  pendingCount: number;
  completedCount: number;
  studentAssignments: StudentAssignment[];
}

interface Notification {
  _id: string;
  attendanceDate: string;
  message: string;
  isRead: boolean;
  isResolved: boolean;
  studentId: Student | null;
}

interface ApiResponse<T> {
  data: T;
}

interface Overview {
  summary: {
    totalAssignedToday: number;
    pendingAssignments: number;
    completedAssignments: number;
    studentsNotSubmitted: number;
  };
  notSubmitted: Array<StudentAssignment & {
    homework: { title: string; dueDate: string } | null;
  }>;
  recentActivity: Array<StudentAssignment & {
    updatedAt: string;
    homework: { title: string; assignedDate: string } | null;
  }>;
  assignments: Homework[];
}

const classOptions = Array.from({ length: 10 }, (_, index) => index + 1);
const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-200';
const allowedTypes = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const indiaToday = () => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Kolkata',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(new Date());

const fileToDataUri = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => typeof reader.result === 'string'
    ? resolve(reader.result)
    : reject(new Error('Unable to read the selected attachment.'));
  reader.onerror = () => reject(new Error('Unable to read the selected attachment.'));
  reader.readAsDataURL(file);
});

const statusColor: Record<HomeworkStatus, string> = {
  PENDING: 'bg-blue-50 text-blue-700',
  COMPLETED: 'bg-emerald-50 text-emerald-700',
  SUBMITTED: 'bg-violet-50 text-violet-700',
  OVERDUE: 'bg-red-50 text-red-700',
};

export const HomeworkAdminPanel: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filterSubjects, setFilterSubjects] = useState<Subject[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [assignedDate, setAssignedDate] = useState(indiaToday());
  const [classNumber, setClassNumber] = useState(1);
  const [subjectId, setSubjectId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(indiaToday());
  const [assignmentType, setAssignmentType] = useState<AssignmentType>('CLASS');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [studentSearch, setStudentSearch] = useState('');
  const [sourceAttendanceDate, setSourceAttendanceDate] = useState('');
  const [attachments, setAttachments] = useState<HomeworkFile[]>([]);
  const [editingId, setEditingId] = useState('');
  const [selectedNotificationIds, setSelectedNotificationIds] = useState<string[]>([]);

  const [filterDate, setFilterDate] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterStudent, setFilterStudent] = useState('');
  const [submissionHomeworkId, setSubmissionHomeworkId] = useState('');
  const [submissionsByHomework, setSubmissionsByHomework] = useState<Record<string, StudentAssignment[]>>({});
  const [loadingSubmissionsId, setLoadingSubmissionsId] = useState('');

  const loadNotifications = async () => {
    const response = await apiRequest<ApiResponse<{ notifications: Notification[] }>>('/homework/admin/notifications');
    setNotifications(response.data.notifications);
  };

  const loadSubjects = async (classFilter: number) => {
    const response = await apiRequest<ApiResponse<{ subjects: Subject[] }>>(
      `/class-subjects/admin/subjects?classNumber=${classFilter}`
    );
    setSubjects(response.data.subjects);
    setSubjectId((current) => response.data.subjects.some((subject) => subject._id === current && subject.isActive)
      ? current
      : response.data.subjects.find((subject) => subject.isActive)?._id ?? '');
  };

  const loadOverview = async () => {
    const params = new URLSearchParams();
    if (filterDate) params.set('date', filterDate);
    if (filterClass) params.set('classNumber', filterClass);
    if (filterSubject) params.set('subjectId', filterSubject);
    if (filterStudent) params.set('studentId', filterStudent);
    const response = await apiRequest<ApiResponse<Overview>>(`/homework/admin/overview?${params.toString()}`);
    setOverview(response.data);
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    void Promise.all([
      apiRequest<ApiResponse<{ students: Student[] }>>('/students'),
      apiRequest<ApiResponse<{ notifications: Notification[] }>>('/homework/admin/notifications'),
      apiRequest<ApiResponse<{ subjects: Subject[] }>>('/class-subjects/admin/subjects'),
    ]).then(([studentResponse, notificationResponse, subjectResponse]) => {
      if (!active) return;
      setStudents(studentResponse.data.students.filter((student) => !student.isArchived));
      setNotifications(notificationResponse.data.notifications);
      setFilterSubjects(subjectResponse.data.subjects);
    }).catch((loadError: unknown) => {
      if (active) setError(loadError instanceof Error ? loadError.message : 'Unable to load homework data.');
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    void loadSubjects(classNumber).catch((loadError: unknown) => {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load class subjects.');
    });
  }, [classNumber]);

  useEffect(() => {
    void loadOverview().catch((loadError: unknown) => {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load homework overview.');
    });
  }, [filterDate, filterClass, filterSubject, filterStudent]);

  const classStudents = useMemo(() => students.filter((student) =>
    student.gradeLevel?.trim().toLowerCase() === `class ${classNumber}`
  ), [classNumber, students]);

  const searchedStudents = useMemo(() => {
    const query = studentSearch.trim().toLowerCase();
    return classStudents.filter((student) =>
      !query || student.name.toLowerCase().includes(query) || student.username?.toLowerCase().includes(query)
    );
  }, [classStudents, studentSearch]);

  const toggleStudent = (id: string) => {
    setSelectedStudentIds((current) => current.includes(id)
      ? current.filter((studentId) => studentId !== id)
      : [...current, id]);
  };

  const selectAbsentStudents = () => {
    setError('');
    const chosen = notifications.filter((notification) => selectedNotificationIds.includes(notification._id));
    if (!chosen.length) {
      setError('Select at least one absent-student notification first.');
      return;
    }
    const classNumbers = new Set(chosen.map((notification) => {
      const match = notification.studentId?.gradeLevel?.match(/^Class\s*(10|[1-9])$/i);
      return match ? Number(match[1]) : null;
    }));
    const dates = new Set(chosen.map((notification) => notification.attendanceDate));
    if (classNumbers.size !== 1 || classNumbers.has(null) || dates.size !== 1) {
      setError('Select absent students from the same class and attendance date so they can share one homework task.');
      return;
    }
    const classValue = [...classNumbers][0] as number;
    const dateValue = [...dates][0];
    setClassNumber(classValue);
    setAssignmentType('INDIVIDUAL');
    setSourceAttendanceDate(dateValue);
    setSelectedStudentIds(chosen.map((notification) => notification.studentId!._id));
    setAssignedDate(indiaToday());
    setNotice(`${chosen.length} absent student${chosen.length === 1 ? '' : 's'} added to the homework recipients.`);
    document.getElementById('homework-assignment-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const toggleSubmissions = async (homework: Homework) => {
    if (submissionHomeworkId === homework._id) {
      setSubmissionHomeworkId('');
      return;
    }
    setSubmissionHomeworkId(homework._id);
    setLoadingSubmissionsId(homework._id);
    setError('');
    try {
      const response = await apiRequest<ApiResponse<{ submissions: StudentAssignment[] }>>(
        `/homework/admin/assignments/${homework._id}/submissions`
      );
      setSubmissionsByHomework((current) => ({ ...current, [homework._id]: response.data.submissions }));
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Unable to load student submissions.');
      setSubmissionHomeworkId('');
    } finally {
      setLoadingSubmissionsId('');
    }
  };

  const resetForm = () => {
    setEditingId('');
    setTitle('');
    setDescription('');
    setDueDate(indiaToday());
    setAssignedDate(indiaToday());
    setAssignmentType('CLASS');
    setSelectedStudentIds([]);
    setSourceAttendanceDate('');
    setAttachments([]);
    setSelectedNotificationIds([]);
  };

  const handleAttachmentSelect = async (files: FileList | null) => {
    if (!files?.length) return;
    setError('');
    try {
      let total = attachments.reduce((sum, file) => sum + file.size, 0);
      const next = [...attachments];
      for (const file of Array.from(files)) {
        if (!allowedTypes.has(file.type)) throw new Error('Attachments must be PDF, image, DOC, or DOCX files.');
        if (file.size < 1 || file.size > 300 * 1024) throw new Error('Each attachment must be no larger than 300 KB.');
        total += file.size;
        if (total > 300 * 1024) throw new Error('Combined attachments cannot exceed 300 KB.');
        next.push({ name: file.name, contentType: file.type, size: file.size, data: await fileToDataUri(file) });
      }
      if (next.length > 5) throw new Error('Attach up to five files.');
      setAttachments(next);
    } catch (attachmentError) {
      setError(attachmentError instanceof Error ? attachmentError.message : 'Unable to add attachment.');
    }
  };

  const submitHomework = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');
    try {
      if (editingId) {
        await apiRequest(`/homework/admin/assignments/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify({ title: title.trim(), description: description.trim(), dueDate, attachments }),
        });
        setNotice('Homework assignment updated.');
      } else {
        if (assignmentType !== 'ALL_STUDENTS' && !subjectId) {
          throw new Error('Add an active subject to this class before assigning homework.');
        }
        if (assignmentType === 'INDIVIDUAL' && !selectedStudentIds.length) {
          throw new Error('Select at least one student for individual homework.');
        }
        const absentNotificationIds = sourceAttendanceDate ? selectedNotificationIds : [];
        await apiRequest('/homework/admin/assignments', {
          method: 'POST',
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            assignedDate,
            dueDate,
            assignmentType,
            ...(assignmentType !== 'ALL_STUDENTS' ? { classNumber, subjectId } : {}),
            targetStudentIds: assignmentType === 'INDIVIDUAL' ? selectedStudentIds : [],
            ...(sourceAttendanceDate ? { sourceAttendanceDate } : {}),
            attachments,
          }),
        });
        setNotice(`Homework assigned to ${assignmentType === 'CLASS' ? classStudents.length : selectedStudentIds.length} student${(assignmentType === 'CLASS' ? classStudents.length : selectedStudentIds.length) === 1 ? '' : 's'}.`);
        resetForm();
        if (absentNotificationIds.length) {
          try {
            await Promise.all(absentNotificationIds.map((id) =>
              apiRequest(`/homework/admin/notifications/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ isRead: true, isResolved: true }),
              })
            ));
          } catch (notificationError) {
            setError(`Homework was assigned, but one or more absence notifications could not be resolved: ${notificationError instanceof Error ? notificationError.message : 'unknown error'}`);
          }
        }
      }
      await Promise.all([loadOverview(), loadNotifications()]);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save homework.');
    } finally {
      setSaving(false);
    }
  };

  const editAssignment = (homework: Homework) => {
    setEditingId(homework._id);
    setAssignmentType(homework.assignmentType);
    setClassNumber(homework.classNumber ?? 1);
    setSubjectId(homework.subjectId?._id ?? '');
    setTitle(homework.title);
    setDescription(homework.description);
    setDueDate(homework.dueDate);
    setAttachments(homework.attachments ?? []);
    document.getElementById('homework-assignment-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const deleteAssignment = async (homework: Homework) => {
    if (!window.confirm(`Delete "${homework.title}" and all student assignment records?`)) return;
    setSaving(true);
    setError('');
    setNotice('');
    try {
      await apiRequest(`/homework/admin/assignments/${homework._id}`, { method: 'DELETE' });
      setNotice('Homework and its student assignment records were deleted.');
      await loadOverview();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete homework.');
    } finally {
      setSaving(false);
    }
  };

  const updateNotification = async (notification: Notification, updates: { isRead?: boolean; isResolved?: boolean }) => {
    try {
      await apiRequest(`/homework/admin/notifications/${notification._id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      await loadNotifications();
    } catch (notificationError) {
      setError(notificationError instanceof Error ? notificationError.message : 'Unable to update notification.');
    }
  };

  const summary = overview?.summary;
  const previewStudents = assignmentType === 'ALL_STUDENTS'
    ? students
    : assignmentType === 'CLASS'
      ? classStudents
      : students.filter((student) => selectedStudentIds.includes(student._id));

  return (
    <section className="space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Academic work</p>
        <h2 className="mt-1 text-2xl font-extrabold text-brand-navy">Homework Management</h2>
        <p className="mt-1 text-sm text-slate-500">Prepare classwork, assign it to selected students, and follow submissions.</p>
      </header>

      {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle size={17} className="mt-0.5 shrink-0" />{error}</div>}
      {notice && <div role="status" className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"><Check size={17} className="mt-0.5 shrink-0" />{notice}</div>}

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-bold text-brand-navy"><Bell size={19} className="text-amber-600" />Absent student notifications</h3>
            <p className="mt-1 text-sm text-slate-500">These appear after attendance is saved. Absence never assigns homework automatically.</p>
          </div>
          <button type="button" onClick={selectAbsentStudents} className="rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-amber-600">Assign to selected absent students</button>
        </div>
        {notifications.length ? (
          <ul className="mt-4 divide-y divide-slate-100">
            {notifications.map((notification) => (
              <li key={notification._id} className="flex flex-wrap items-center gap-3 py-3">
                <input
                  type="checkbox"
                  aria-label={`Select ${notification.studentId?.name ?? 'student'} absence`}
                  checked={selectedNotificationIds.includes(notification._id)}
                  onChange={() => setSelectedNotificationIds((current) => current.includes(notification._id)
                    ? current.filter((id) => id !== notification._id)
                    : [...current, notification._id])}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600"
                />
                <div className="min-w-[14rem] flex-1">
                  <p className={`text-sm ${notification.isRead ? 'text-slate-600' : 'font-bold text-brand-navy'}`}>{notification.message}</p>
                  {notification.studentId?.username && <p className="mt-0.5 text-xs text-slate-500">@{notification.studentId.username}</p>}
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${notification.isResolved ? 'bg-slate-100 text-slate-500' : 'bg-amber-50 text-amber-800'}`}>{notification.isResolved ? 'Resolved' : 'Needs follow-up'}</span>
                {!notification.isRead && <button type="button" onClick={() => void updateNotification(notification, { isRead: true })} className="text-xs font-semibold text-blue-700 hover:underline">Mark read</button>}
                {!notification.isResolved && <button type="button" onClick={() => void updateNotification(notification, { isResolved: true })} className="text-xs font-semibold text-slate-500 hover:underline">Resolve</button>}
              </li>
            ))}
          </ul>
        ) : <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No unresolved absence notifications.</p>}
      </section>

      <section id="homework-assignment-form" className="scroll-mt-5 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-brand-navy">{editingId ? 'Edit homework' : 'Create homework'}</h3>
            <p className="mt-1 text-sm text-slate-500">{editingId ? 'Update its instructions, due date, or attachments.' : 'Set the assignment and preview the students who will receive it.'}</p>
          </div>
          {editingId && <button type="button" onClick={resetForm} aria-label="Cancel edit" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={18} /></button>}
        </div>

        <form onSubmit={submitHomework} className="mt-5 space-y-4">
          <div className={`grid gap-3 sm:grid-cols-2 ${assignmentType === 'ALL_STUDENTS' ? 'lg:grid-cols-2' : 'lg:grid-cols-4'}`}>
            <label className="text-xs font-semibold text-slate-600">Assigned date
              <input type="date" required disabled={!!editingId} value={assignedDate} onChange={(event) => setAssignedDate(event.target.value)} className={`${inputClass} mt-1`} />
            </label>
            {assignmentType !== 'ALL_STUDENTS' && <>
              <label className="text-xs font-semibold text-slate-600">Class
                <select disabled={!!editingId} value={classNumber} onChange={(event) => { setClassNumber(Number(event.target.value)); setSelectedStudentIds([]); setSourceAttendanceDate(''); }} className={`${inputClass} mt-1`}>
                  {classOptions.map((item) => <option key={item} value={item}>Class {item}</option>)}
                </select>
              </label>
              <label className="text-xs font-semibold text-slate-600">Subject
                <select required disabled={!!editingId} value={subjectId} onChange={(event) => setSubjectId(event.target.value)} className={`${inputClass} mt-1`}>
                  <option value="">Select a subject</option>
                  {subjects.filter((subject) => subject.isActive).map((subject) => <option key={subject._id} value={subject._id}>{subject.subjectName}</option>)}
                </select>
              </label>
            </>}
            <label className="text-xs font-semibold text-slate-600">Due date
              <input type="date" required min={assignedDate} value={dueDate} onChange={(event) => setDueDate(event.target.value)} className={`${inputClass} mt-1`} />
            </label>
          </div>

          {!editingId && (
            <div className="flex flex-wrap gap-2">
              {(['CLASS', 'INDIVIDUAL', 'ALL_STUDENTS'] as AssignmentType[]).map((type) => (
                <button key={type} type="button" onClick={() => {
                  setAssignmentType(type);
                  setSelectedStudentIds([]);
                  if (type !== 'INDIVIDUAL') setSourceAttendanceDate('');
                }} aria-pressed={assignmentType === type} className={`rounded-xl border px-4 py-2 text-sm font-bold ${assignmentType === type ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                  {type === 'CLASS' ? 'Assign to one class' : type === 'INDIVIDUAL' ? 'Select individual students' : 'Common homework · all classes'}
                </button>
              ))}
            </div>
          )}
          {!editingId && assignmentType === 'ALL_STUDENTS' && <p className="rounded-xl bg-cyan-50 p-3 text-sm text-cyan-900">This common homework will be assigned to every active student in Classes 1–10. Students can upload their work, and you can review each submission below.</p>}

          <label className="block text-xs font-semibold text-slate-600">Homework title
            <input required maxLength={120} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Fractions practice" className={`${inputClass} mt-1`} />
          </label>
          <label className="block text-xs font-semibold text-slate-600">Instructions
            <textarea required maxLength={5000} rows={4} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Explain what students should complete…" className={`${inputClass} mt-1 resize-y`} />
          </label>

          {!editingId && assignmentType === 'INDIVIDUAL' && (
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><p className="text-sm font-bold text-brand-navy">Choose students · Class {classNumber}</p><p className="mt-1 text-xs text-slate-500">Only active students in this class are listed.</p></div>
                <label className="relative w-full sm:max-w-xs"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={studentSearch} onChange={(event) => setStudentSearch(event.target.value)} placeholder="Search students" aria-label="Search students for homework" className={`${inputClass} pl-9`} /></label>
              </div>
              <div className="mt-3 max-h-52 overflow-y-auto rounded-lg border border-slate-100">
                {searchedStudents.length ? searchedStudents.map((student) => (
                  <label key={student._id} className="flex cursor-pointer items-center gap-3 border-b border-slate-100 px-3 py-2.5 last:border-0 hover:bg-slate-50">
                    <input type="checkbox" checked={selectedStudentIds.includes(student._id)} onChange={() => toggleStudent(student._id)} className="h-4 w-4 rounded border-slate-300 text-blue-600" />
                    <span className="min-w-0 flex-1 text-sm font-semibold text-slate-700">{student.name}</span>
                    <span className="text-xs text-slate-400">{student.username ? `@${student.username}` : student.gradeLevel}</span>
                  </label>
                )) : <p className="p-4 text-sm text-slate-500">No students found for this class.</p>}
              </div>
              {sourceAttendanceDate && <p className="mt-2 text-xs font-semibold text-amber-700">Selected from saved absences on {sourceAttendanceDate}.</p>}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">
              <Plus size={15} />Add PDF, image, or document
              <input type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx" className="sr-only" onChange={(event) => { void handleAttachmentSelect(event.target.files); event.currentTarget.value = ''; }} />
            </label>
            <span className="text-xs text-slate-500">Up to 5 files · 300 KB combined maximum</span>
          </div>
          {attachments.length > 0 && <ul className="flex flex-wrap gap-2">{attachments.map((file, index) => <li key={`${file.name}-${index}`} className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600"><FileText size={14} />{file.name}<button type="button" aria-label={`Remove ${file.name}`} onClick={() => setAttachments((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="text-slate-400 hover:text-red-600"><X size={14} /></button></li>)}</ul>}

          <div className="rounded-xl bg-blue-50/70 p-4">
            <p className="flex items-center gap-2 text-sm font-bold text-blue-900"><Users size={17} />{assignmentType === 'ALL_STUDENTS' ? 'All active students · Classes 1–10' : 'Recipient preview'} · {previewStudents.length} student{previewStudents.length === 1 ? '' : 's'}</p>
            <p className="mt-1 text-xs leading-5 text-blue-800">{previewStudents.slice(0, 12).map((student) => student.name).join(', ')}{previewStudents.length > 12 ? ` and ${previewStudents.length - 12} more` : ''}{!previewStudents.length ? 'No students currently match this class or selection.' : ''}</p>
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            {editingId && <button type="button" onClick={resetForm} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600">Cancel</button>}
            <button type="submit" disabled={saving || loading || (!editingId && assignmentType === 'CLASS' && !classStudents.length) || (!editingId && assignmentType === 'ALL_STUDENTS' && !students.length)} className="inline-flex items-center gap-2 rounded-xl bg-brand-navy px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">
              {saving ? <LoaderCircle size={16} className="animate-spin" /> : <Check size={16} />}{saving ? 'Saving…' : editingId ? 'Save changes' : 'Assign homework'}
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-brand-navy">Homework overview</h3>
          <p className="mt-1 text-sm text-slate-500">Filter assignments and review completion across students.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Assigned today', value: summary?.totalAssignedToday ?? 0, tint: 'bg-blue-50 text-blue-700' },
            { label: 'Pending', value: summary?.pendingAssignments ?? 0, tint: 'bg-amber-50 text-amber-700' },
            { label: 'Completed / submitted', value: summary?.completedAssignments ?? 0, tint: 'bg-emerald-50 text-emerald-700' },
            { label: 'Not submitted', value: summary?.studentsNotSubmitted ?? 0, tint: 'bg-red-50 text-red-700' },
          ].map((item) => <article key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs font-semibold text-slate-500">{item.label}</p><p className={`mt-2 inline-flex rounded-xl px-3 py-1.5 text-xl font-extrabold ${item.tint}`}>{item.value}</p></article>)}
        </div>

        {overview?.notSubmitted.length ? (
          <section className="rounded-2xl border border-red-100 bg-white p-4">
            <h4 className="font-bold text-red-800">Students who have not submitted</h4>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {overview.notSubmitted.slice(0, 20).map((assignment) => (
                <li key={assignment._id} className="rounded-xl bg-red-50/70 px-3 py-2 text-sm">
                  <span className="font-semibold text-brand-navy">{assignment.studentId?.name ?? 'Student'}</span>
                  <span className="text-slate-600"> · {assignment.homework?.title ?? 'Homework'}</span>
                </li>
              ))}
            </ul>
            {overview.notSubmitted.length > 20 && <p className="mt-2 text-xs text-slate-500">Showing 20 of {overview.notSubmitted.length} pending assignments.</p>}
          </section>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-xs font-semibold text-slate-500">Assigned date
            <input type="date" value={filterDate} onChange={(event) => setFilterDate(event.target.value)} className={`${inputClass} mt-1`} />
          </label>
          <label className="text-xs font-semibold text-slate-500">Class
            <select value={filterClass} onChange={(event) => { setFilterClass(event.target.value); setFilterSubject(''); }} className={`${inputClass} mt-1`}><option value="">All classes</option>{classOptions.map((item) => <option key={item} value={item}>Class {item}</option>)}</select>
          </label>
          <label className="text-xs font-semibold text-slate-500">Student
            <select value={filterStudent} onChange={(event) => setFilterStudent(event.target.value)} className={`${inputClass} mt-1`}><option value="">All students</option>{students.map((student) => <option key={student._id} value={student._id}>{student.name}</option>)}</select>
          </label>
          <label className="text-xs font-semibold text-slate-500">Subject
            <select value={filterSubject} onChange={(event) => setFilterSubject(event.target.value)} className={`${inputClass} mt-1`}><option value="">All subjects</option>{filterSubjects.filter((subject) => !filterClass || subject.classNumber === Number(filterClass)).map((subject) => <option key={subject._id} value={subject._id}>{subject.subjectName} · Class {subject.classNumber}</option>)}</select>
          </label>
        </div>

        {overview?.recentActivity.length ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-4">
            <h4 className="flex items-center gap-2 font-bold text-brand-navy"><Clock3 size={17} className="text-blue-600" />Recent homework activity</h4>
            <ul className="mt-3 divide-y divide-slate-100">
              {overview.recentActivity.slice(0, 8).map((activity) => (
                <li key={activity._id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
                  <span className="text-slate-700"><strong className="text-brand-navy">{activity.studentId?.name ?? 'Student'}</strong> · {activity.homework?.title ?? 'Homework'} · {activity.status.toLowerCase()}</span>
                  <time className="text-xs text-slate-400">{new Date(activity.updatedAt).toLocaleString('en-IN')}</time>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {loading ? <div className="flex items-center gap-2 rounded-2xl bg-white p-6 text-sm text-slate-500"><LoaderCircle size={18} className="animate-spin" />Loading homework…</div> : overview?.assignments.length ? (
          <div className="grid gap-3">
            {overview.assignments.map((homework) => (
              <article key={homework._id} className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2"><h4 className="font-bold text-brand-navy">{homework.title}</h4><span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">{homework.assignmentType === 'ALL_STUDENTS' ? 'All classes' : `${homework.subjectId?.subjectName ?? 'Subject'} · Class ${homework.classNumber}`}</span><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">{homework.assignmentType === 'ALL_STUDENTS' ? 'COMMON' : homework.assignmentType}</span></div>
                    <p className="mt-2 line-clamp-2 whitespace-pre-wrap text-sm text-slate-600">{homework.description}</p>
                    <p className="mt-2 flex items-center gap-1 text-xs text-slate-500"><Clock3 size={13} />Assigned {homework.assignedDate} · Due {homework.dueDate} · {homework.recipientCount} students</p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button type="button" aria-label={`Edit ${homework.title}`} onClick={() => editAssignment(homework)} className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-700"><Pencil size={16} /></button>
                    <button type="button" disabled={saving} aria-label={`Delete ${homework.title}`} onClick={() => void deleteAssignment(homework)} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold"><span className="text-amber-700">{homework.pendingCount} pending</span><span className="text-emerald-700">{homework.completedCount} completed/submitted</span></div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {homework.studentAssignments.slice(0, 20).map((assignment) => <span key={assignment._id} className={`rounded-full px-2.5 py-1 text-xs ${statusColor[assignment.status]}`}>{assignment.studentId?.name ?? 'Student'} · {assignment.status.toLowerCase()}</span>)}
                  {homework.studentAssignments.length > 20 && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">+{homework.studentAssignments.length - 20} more</span>}
                </div>
                <div className="mt-4 border-t border-slate-100 pt-3">
                  <button type="button" onClick={() => void toggleSubmissions(homework)} className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900">
                    <FileText size={16} />{loadingSubmissionsId === homework._id ? 'Loading submissions…' : `${submissionHomeworkId === homework._id ? 'Hide' : 'View'} student submissions`}
                  </button>
                  {submissionHomeworkId === homework._id && (
                    loadingSubmissionsId === homework._id ? (
                      <p className="mt-3 text-sm text-slate-500">Loading student work…</p>
                    ) : (
                      <div className="mt-3 grid gap-3">
                        {(submissionsByHomework[homework._id] ?? []).filter((item) => item.submissionFiles?.length).length ? (
                          (submissionsByHomework[homework._id] ?? []).filter((item) => item.submissionFiles?.length).map((submission) => (
                            <div key={submission._id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="text-sm font-bold text-brand-navy">{submission.studentId?.name ?? 'Student'} <span className="font-normal text-slate-500">· Class {submission.studentId?.gradeLevel?.replace(/^Class\\s*/i, '') ?? '—'}</span></p>
                                <p className="text-xs text-slate-500">Submitted {submission.submittedAt ? new Date(submission.submittedAt).toLocaleString('en-IN') : '—'}</p>
                              </div>
                              <div className="mt-3 flex flex-wrap gap-3">
                                {submission.submissionFiles?.map((file, index) => (
                                  <a key={`${submission._id}-${file.name}-${index}`} href={file.data} download={file.name} className="group block max-w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-700 hover:border-blue-300">
                                    {file.contentType.startsWith('image/') ? <img src={file.data} alt={`${submission.studentId?.name ?? 'Student'} submission`} className="mb-2 h-36 max-w-[220px] rounded-md object-contain" /> : <span className="mb-2 flex h-24 items-center justify-center rounded-md bg-slate-50 text-slate-500"><FileText size={26} /></span>}
                                    <span className="flex items-center gap-1.5"><FileText size={14} />{file.name}</span>
                                  </a>
                                ))}
                              </div>
                            </div>
                          ))
                        ) : <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500">No student uploads yet. Completed work without a file is marked in the student status list above.</p>}
                      </div>
                    )
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-9 text-center"><BookOpen className="mx-auto h-8 w-8 text-slate-300" /><p className="mt-3 font-semibold text-slate-700">No homework matches these filters</p><p className="mt-1 text-sm text-slate-500">Create an assignment above or adjust the filters.</p></div>}
      </section>
    </section>
  );
};
