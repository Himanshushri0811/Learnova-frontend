import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, BookOpen, CheckCircle2, Clock3, Download, FileText, LoaderCircle, Upload } from 'lucide-react';
import { apiRequest } from '../../lib/api';

type HomeworkStatus = 'PENDING' | 'COMPLETED' | 'SUBMITTED' | 'OVERDUE';
type HomeworkFilter = 'ALL' | 'TODAY' | 'PENDING' | 'COMPLETED' | 'OVERDUE';

interface HomeworkFile {
  name: string;
  contentType: string;
  size: number;
  data: string;
}

interface StudentAssignment {
  _id: string;
  status: HomeworkStatus;
  submissionFiles: HomeworkFile[];
  homeworkId: {
    _id: string;
    title: string;
    description: string;
    assignedDate: string;
    dueDate: string;
    attachments: HomeworkFile[];
    classNumber?: number | null;
    assignmentType: 'CLASS' | 'INDIVIDUAL' | 'ALL_STUDENTS';
    subjectId: { subjectName: string; classNumber: number } | null;
  } | null;
}

interface HomeworkResponse {
  data: { assignments: StudentAssignment[]; assignment?: StudentAssignment };
}

const filters: Array<{ key: HomeworkFilter; label: string }> = [
  { key: 'ALL', label: 'All' },
  { key: 'TODAY', label: "Today's" },
  { key: 'PENDING', label: 'Pending' },
  { key: 'COMPLETED', label: 'Completed' },
  { key: 'OVERDUE', label: 'Overdue' },
];

const indiaToday = () => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Kolkata',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(new Date());

const fileToDataUri = (file: Blob) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => typeof reader.result === 'string'
    ? resolve(reader.result)
    : reject(new Error('Unable to read the selected file.'));
  reader.onerror = () => reject(new Error('Unable to read the selected file.'));
  reader.readAsDataURL(file);
});

const compressImageForUpload = async (file: File): Promise<{ blob: Blob; name: string }> => {
  const image = await createImageBitmap(file);
  try {
    const scale = Math.min(1, 1600 / Math.max(image.width, image.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Your browser cannot prepare this image for upload.');
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    for (const quality of [0.82, 0.7, 0.58, 0.48]) {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/jpeg', quality)
      );
      if (blob && blob.size <= 300 * 1024) {
        return { blob, name: `${file.name.replace(/\.[^.]+$/, '')}.jpg` };
      }
    }
    throw new Error('This photo is still too large after compression. Choose a smaller image.');
  } finally {
    image.close();
  }
};

const allowedTypes = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const statusClass: Record<HomeworkStatus, string> = {
  PENDING: 'bg-blue-50 text-blue-700',
  COMPLETED: 'bg-emerald-50 text-emerald-700',
  SUBMITTED: 'bg-violet-50 text-violet-700',
  OVERDUE: 'bg-red-50 text-red-700',
};

const prettyDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

export const MyHomeworkPanel: React.FC = () => {
  const [assignments, setAssignments] = useState<StudentAssignment[]>([]);
  const [filter, setFilter] = useState<HomeworkFilter>('ALL');
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadHomework = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiRequest<HomeworkResponse>('/homework/mine');
      setAssignments(response.data.assignments);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load your homework.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadHomework();
  }, []);

  const visibleAssignments = useMemo(() => assignments.filter((assignment) => {
    const homework = assignment.homeworkId;
    if (!homework) return false;
    if (filter === 'TODAY') return homework.assignedDate === indiaToday();
    if (filter === 'PENDING') return assignment.status === 'PENDING';
    if (filter === 'COMPLETED') return assignment.status === 'COMPLETED' || assignment.status === 'SUBMITTED';
    if (filter === 'OVERDUE') return assignment.status === 'OVERDUE';
    return true;
  }), [assignments, filter]);

  const completeHomework = async (assignmentId: string) => {
    setBusyId(assignmentId);
    setError('');
    setNotice('');
    try {
      await apiRequest(`/homework/mine/${assignmentId}/complete`, { method: 'PATCH' });
      setNotice('Homework marked as completed.');
      await loadHomework();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to update homework status.');
    } finally {
      setBusyId('');
    }
  };

  const submitFiles = async (assignmentId: string, file?: File) => {
    if (!file) return;
    setBusyId(assignmentId);
    setError('');
    setNotice('');
    try {
      if (!allowedTypes.has(file.type)) throw new Error('Choose a PDF, image, DOC, or DOCX file.');
      let uploadBlob: Blob = file;
      let uploadName = file.name;
      let uploadType = file.type;
      if (file.type.startsWith('image/')) {
        const compressed = await compressImageForUpload(file);
        uploadBlob = compressed.blob;
        uploadName = compressed.name;
        uploadType = 'image/jpeg';
      }
      if (uploadBlob.size < 1 || uploadBlob.size > 300 * 1024) throw new Error('Each submission must be no larger than 300 KB after compression.');
      const data = await fileToDataUri(uploadBlob);
      await apiRequest(`/homework/mine/${assignmentId}/submissions`, {
        method: 'POST',
        body: JSON.stringify({
          files: [{ name: uploadName, contentType: uploadType, size: uploadBlob.size, data }],
        }),
      });
      setNotice('Your homework submission was uploaded.');
      await loadHomework();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to upload your submission.');
    } finally {
      setBusyId('');
    }
  };

  return (
    <section className="space-y-5">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Learning tasks</p>
        <h2 className="mt-1 text-2xl font-extrabold text-[#0b1f4d]">My Homework</h2>
        <p className="mt-1 text-sm text-slate-500">Review instructions, due dates, and your submission status.</p>
      </header>

      {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle size={17} className="mt-0.5 shrink-0" />{error}</div>}
      {notice && <div role="status" className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"><CheckCircle2 size={17} className="mt-0.5 shrink-0" />{notice}</div>}

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter homework">
        {filters.map((item) => (
          <button
            type="button"
            role="tab"
            aria-selected={filter === item.key}
            key={item.key}
            onClick={() => setFilter(item.key)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${filter === item.key ? 'bg-[#0b1f4d] text-white' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500"><LoaderCircle className="h-5 w-5 animate-spin text-blue-600" />Loading your homework…</div>
      ) : visibleAssignments.length ? (
        <div className="grid gap-4">
          {visibleAssignments.map((assignment) => {
            const homework = assignment.homeworkId!;
            const busy = busyId === assignment._id;
            return (
              <article key={assignment._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700"><BookOpen size={21} /></span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wide text-blue-700">{homework.assignmentType === 'ALL_STUDENTS' ? 'Common homework · All classes' : homework.subjectId?.subjectName ?? 'Subject'}</p>
                      <h3 className="mt-1 text-lg font-extrabold text-[#0b1f4d]">{homework.title}</h3>
                    </div>
                  </div>
                  <span className={`rounded-full px-3 py-1.5 text-xs font-extrabold ${statusClass[assignment.status]}`}>
                    {assignment.status === 'SUBMITTED' ? 'Submitted' : assignment.status[0] + assignment.status.slice(1).toLowerCase()}
                  </span>
                </div>

                <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-600">{homework.description}</p>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-slate-500">
                  <span>Assigned {prettyDate(homework.assignedDate)}</span>
                  <span className={`inline-flex items-center gap-1 ${assignment.status === 'OVERDUE' ? 'text-red-600' : ''}`}><Clock3 size={14} />Due {prettyDate(homework.dueDate)}</span>
                </div>

                {homework.attachments.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {homework.attachments.map((file) => (
                      <a key={`${homework._id}-${file.name}`} href={file.data} download={file.name} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50">
                        <FileText size={15} />{file.name}<Download size={14} />
                      </a>
                    ))}
                  </div>
                )}

                {assignment.submissionFiles.length > 0 && (
                  <div className="mt-4 rounded-xl bg-violet-50 p-3">
                    <p className="text-xs font-bold text-violet-800">Your submission</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {assignment.submissionFiles.map((file) => (
                        <a key={`${assignment._id}-${file.name}`} href={file.data} download={file.name} className="inline-flex items-center gap-2 text-xs font-semibold text-violet-800 underline"><FileText size={14} />{file.name}</a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-5 flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 pt-4">
                  {assignment.status !== 'COMPLETED' && (
                    <>
                      <label className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 ${busy ? 'pointer-events-none opacity-50' : ''}`}>
                        <Upload size={15} />{busy ? 'Working…' : 'Upload work'}
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx"
                          className="sr-only"
                          disabled={busy}
                          onChange={(event) => {
                            void submitFiles(assignment._id, event.target.files?.[0]);
                            event.currentTarget.value = '';
                          }}
                        />
                      </label>
                      <button type="button" disabled={busy} onClick={() => void completeHomework(assignment._id)} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white disabled:opacity-50">
                        <CheckCircle2 size={15} />Mark complete
                      </button>
                    </>
                  )}
                  {assignment.status === 'COMPLETED' && <span className="text-xs font-semibold text-emerald-700">Completed successfully</span>}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-slate-300" />
          <h3 className="mt-4 font-bold text-[#0b1f4d]">{assignments.length ? 'No homework in this filter' : 'You’re all caught up'}</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            {assignments.length ? 'Try another status filter to find your assignments.' : 'New homework assigned to your class will appear here.'}
          </p>
        </div>
      )}
    </section>
  );
};
