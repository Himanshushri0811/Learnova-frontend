
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Search,
  Archive,
  RotateCcw,
  Pencil,
  Users,
  RefreshCw,
  CalendarDays,
  Save,
  ChevronLeft,
  ChevronRight,
  Copy,
  CheckCircle2,
  X,
  Trash2,
} from 'lucide-react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { apiRequest } from '../../lib/api';
import { ClassSubjectsAdminPanel } from '../../components/dashboards/ClassSubjectsAdminPanel';
import { HomeworkAdminPanel } from '../../components/dashboards/HomeworkAdminPanel';
import { EnquiriesAdminPanel } from '../../components/dashboards/EnquiriesAdminPanel';

interface Student {
  _id: string;
  name: string;
  gradeLevel?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  username?: string;
  academicNotes?: string;
  isArchived: boolean;
  createdAt: string;
}

type AttendanceStatus = 'present' | 'absent' | 'leave';

interface AttendanceRecord {
  status: AttendanceStatus;
  remarks?: string;
}

interface AttendanceRow {
  student: Pick<Student, '_id' | 'name' | 'username' | 'gradeLevel'>;
  attendance: AttendanceRecord | null;
}

interface Holiday {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  description?: string;
}

interface AttendanceResponse {
  status: string;
  results: number;
  data: {
    records: AttendanceRow[];
  };
}

interface HolidayResponse {
  data: { holidays: Holiday[]; holiday?: Holiday };
}

const getLocalDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const getIndiaDate = () =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

interface StudentListResponse {
  status: string;
  results: number;
  data: {
    students: Student[];
  };
}

interface StudentResponse {
  status: string;
  data: {
    student: Student;
    credentials?: {
      username: string;
      initialPassword: string;
    };
  };
}

type FeeStatus = 'paid' | 'pending' | 'partial' | 'overdue';
type FeeMethod = 'cash' | 'upi' | 'bank_transfer' | 'card' | 'other';

interface StudentFee {
  _id: string;
  studentId: string | { _id: string; name: string; gradeLevel: string; isArchived?: boolean };
  academicMonth: string;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  dueDate: string;
  status: FeeStatus;
  payments: Array<{
    amount: number;
    paymentDate: string;
    method: FeeMethod;
    transactionReference?: string;
    remarks?: string;
  }>;
}

interface FeesResponse {
  status: string;
  results?: number;
  data: { fees: StudentFee[]; fee?: StudentFee };
}

interface StudentForm {
  name: string;
  gradeLevel: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  academicNotes: string;
  username: string;
  password: string;
}

const emptyForm: StudentForm = {
  name: '',
  gradeLevel: 'Class 1',
  guardianName: '',
  guardianPhone: '',
  guardianEmail: '',
  academicNotes: '',
  username: '',
  password: '',
};

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-200';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<StudentForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [createdCredentials, setCreatedCredentials] = useState<{
    username: string;
    initialPassword: string;
  } | null>(null);
  const [copiedCredentials, setCopiedCredentials] = useState(false);
  const [attendanceDate, setAttendanceDate] = useState(getIndiaDate);
  const [attendanceRows, setAttendanceRows] = useState<AttendanceRow[]>([]);
  const [attendanceStatuses, setAttendanceStatuses] = useState<
    Record<string, AttendanceStatus | ''>
  >({});
  const [attendanceRemarks, setAttendanceRemarks] = useState<
    Record<string, string>
  >({});
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceSaving, setAttendanceSaving] = useState(false);
  const [attendanceError, setAttendanceError] = useState('');
  const [attendanceNotice, setAttendanceNotice] = useState('');
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [holidaysLoading, setHolidaysLoading] = useState(false);
  const [holidaySaving, setHolidaySaving] = useState(false);
  const [holidayError, setHolidayError] = useState('');
  const [holidayNotice, setHolidayNotice] = useState('');
  const [showHolidayForm, setShowHolidayForm] = useState(false);
  const [editingHolidayId, setEditingHolidayId] = useState<string | null>(null);
  const [holidayForm, setHolidayForm] = useState({
    name: '',
    startDate: getIndiaDate(),
    endDate: getIndiaDate(),
    description: '',
  });
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [calendarMonth, setCalendarMonth] = useState(() => `${getIndiaDate().slice(0, 7)}-01`);
  const [calendarHistory, setCalendarHistory] = useState<Record<string, AttendanceRecord | null>>({});
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarError, setCalendarError] = useState('');
  const [fees, setFees] = useState<StudentFee[]>([]);
  const [feesLoading, setFeesLoading] = useState(false);
  const [feesError, setFeesError] = useState('');
  const [feesNotice, setFeesNotice] = useState('');
  const [feeStudentId, setFeeStudentId] = useState('');
  const [feeMonth, setFeeMonth] = useState(() => getLocalDate().slice(0, 7));
  const [feeAmount, setFeeAmount] = useState('');
  const [feeDueDate, setFeeDueDate] = useState(() => getLocalDate());
  const [paymentFeeId, setPaymentFeeId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(() => getLocalDate());
  const [paymentMethod, setPaymentMethod] = useState<FeeMethod>('upi');
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentRemarks, setPaymentRemarks] = useState('');
  const [feesSaving, setFeesSaving] = useState(false);

  const loadStudents = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await apiRequest<StudentListResponse>(
        '/students?includeArchived=true'
      );
      setStudents(response.data.students);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load student records.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStudents();
  }, [loadStudents]);

  const loadFees = useCallback(async () => {
    setFeesLoading(true);
    setFeesError('');
    try {
      const response = await apiRequest<FeesResponse>(
        `/fees?academicMonth=${encodeURIComponent(feeMonth)}`
      );
      setFees(response.data.fees ?? []);
    } catch (err) {
      setFeesError(err instanceof Error ? err.message : 'Unable to load fee records.');
    } finally {
      setFeesLoading(false);
    }
  }, [feeMonth]);

  useEffect(() => {
    if (activeTab === 'fees') void loadFees();
  }, [activeTab, loadFees]);

  const loadAttendance = useCallback(async () => {
    setAttendanceLoading(true);
    setAttendanceError('');

    try {
      const response = await apiRequest<AttendanceResponse>(
        `/attendance?date=${attendanceDate}`
      );

      setAttendanceRows(response.data.records);

      const nextStatuses: Record<string, AttendanceStatus | ''> = {};
      const nextRemarks: Record<string, string> = {};

      for (const row of response.data.records) {
        nextStatuses[row.student._id] = row.attendance?.status ?? '';
        nextRemarks[row.student._id] = row.attendance?.remarks ?? '';
      }

      setAttendanceStatuses(nextStatuses);
      setAttendanceRemarks(nextRemarks);
    } catch (err) {
      setAttendanceError(
        err instanceof Error ? err.message : 'Unable to load attendance.'
      );
    } finally {
      setAttendanceLoading(false);
    }
  }, [attendanceDate]);

  useEffect(() => {
    if (activeTab === 'attendance') {
      void loadAttendance();
    }
  }, [activeTab, loadAttendance]);

  const loadHolidays = useCallback(async () => {
    setHolidaysLoading(true);
    setHolidayError('');
    try {
      const response = await apiRequest<HolidayResponse>('/attendance/holidays');
      setHolidays(response.data.holidays);
    } catch (err) {
      setHolidayError(err instanceof Error ? err.message : 'Unable to load holidays.');
    } finally {
      setHolidaysLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'attendance') void loadHolidays();
  }, [activeTab, loadHolidays]);

  useEffect(() => {
    const firstActiveStudent = students.find((student) => !student.isArchived);
    if (!selectedStudentId && firstActiveStudent) {
      setSelectedStudentId(firstActiveStudent._id);
    }
  }, [students, selectedStudentId]);

  const loadCalendarHistory = useCallback(async () => {
    if (!selectedStudentId) {
      setCalendarHistory({});
      return;
    }

    setCalendarLoading(true);
    setCalendarError('');
    try {
      const [yearText, monthText] = calendarMonth.split('-');
      const year = Number(yearText);
      const month = Number(monthText);
      const daysInMonth = new Date(year, month, 0).getDate();
      const dates = Array.from({ length: daysInMonth }, (_, index) => {
        const day = String(index + 1).padStart(2, '0');
        return `${yearText}-${monthText}-${day}`;
      });

      // Use the existing date-based attendance API and show only this student's real records.
      const responses = await Promise.all(
        dates.map((date) =>
          apiRequest<AttendanceResponse>(`/attendance?date=${date}`)
        )
      );
      const history: Record<string, AttendanceRecord | null> = {};
      responses.forEach((response, index) => {
        const row = response.data.records.find(
          (record) => record.student._id === selectedStudentId
        );
        history[dates[index]] = row?.attendance ?? null;
      });
      setCalendarHistory(history);
    } catch (err) {
      setCalendarError(
        err instanceof Error
          ? err.message
          : 'Unable to load this student’s attendance calendar.'
      );
    } finally {
      setCalendarLoading(false);
    }
  }, [calendarMonth, selectedStudentId]);

  useEffect(() => {
    if (activeTab === 'attendance' && selectedStudentId) {
      void loadCalendarHistory();
    }
  }, [activeTab, selectedStudentId, loadCalendarHistory]);

  const moveCalendarMonth = (offset: number) => {
    const [yearText, monthText] = calendarMonth.split('-');
    const next = new Date(Number(yearText), Number(monthText) - 1 + offset, 1);
    setCalendarMonth(
      `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-01`
    );
  };

  const calendarDays = useMemo(() => {
    const [yearText, monthText] = calendarMonth.split('-');
    const year = Number(yearText);
    const month = Number(monthText);
    const count = new Date(year, month, 0).getDate();
    // Monday-first calendar: Monday=0 ... Sunday=6.
    const offset = (new Date(year, month - 1, 1).getDay() + 6) % 7;
    return [
      ...Array.from({ length: offset }, (_, index) => ({
        key: `empty-${index}`,
        date: '',
        day: 0,
      })),
      ...Array.from({ length: count }, (_, index) => {
        const day = index + 1;
        return {
          key: `${yearText}-${monthText}-${String(day).padStart(2, '0')}`,
          date: `${yearText}-${monthText}-${String(day).padStart(2, '0')}`,
          day,
        };
      }),
    ];
  }, [calendarMonth]);

  const selectedCalendarStudent = students.find(
    (student) => student._id === selectedStudentId
  );

  const selectedDateHoliday = holidays.find(
    (holiday) => attendanceDate >= holiday.startDate && attendanceDate <= holiday.endDate
  );
  const attendanceCounts = useMemo(() => {
    const counts = { present: 0, absent: 0, leave: 0, unmarked: 0 };
    if (selectedDateHoliday) {
      counts.unmarked = attendanceRows.length;
      return counts;
    }
    attendanceRows.forEach((row) => {
      const status = attendanceStatuses[row.student._id];
      if (status === 'present') counts.present += 1;
      else if (status === 'absent') counts.absent += 1;
      else if (status === 'leave') counts.leave += 1;
      else counts.unmarked += 1;
    });
    return counts;
  }, [attendanceRows, attendanceStatuses, selectedDateHoliday]);

  const handleSaveAttendance = async () => {
    const entries = attendanceRows.map((row) => ({
        studentId: row.student._id,
        status: attendanceStatuses[row.student._id] ?? '',
        ...(attendanceRemarks[row.student._id]?.trim()
          ? { remarks: attendanceRemarks[row.student._id].trim() }
          : {}),
      }));

    if (attendanceRows.length === 0) {
      setAttendanceError('There are no active students to save attendance for.');
      return;
    }
    if (attendanceDate > getIndiaDate()) {
      setAttendanceError('Attendance cannot be saved for a future date.');
      return;
    }
    if (selectedDateHoliday) {
      setAttendanceError(`Attendance cannot be marked during ${selectedDateHoliday.name}.`);
      return;
    }

    setAttendanceSaving(true);
    setAttendanceError('');
    setAttendanceNotice('');

    try {
      await apiRequest<AttendanceResponse>('/attendance/bulk', {
        method: 'POST',
        body: JSON.stringify({
          date: attendanceDate,
          entries,
        }),
      });

      setAttendanceNotice('Attendance saved successfully.');
      await loadAttendance();
    } catch (err) {
      setAttendanceError(
        err instanceof Error ? err.message : 'Unable to save attendance.'
      );
    } finally {
      setAttendanceSaving(false);
    }
  };

  const handleBulkAttendance = async (status: AttendanceStatus | '') => {
    if (!attendanceRows.length) return;
    const label = status ? `Mark all students ${status}` : 'Reset all students to unmarked';
    const confirmation = `${label} for ${attendanceDate}? This will save the changes immediately.`;
    if (!window.confirm(confirmation)) return;
    if (attendanceDate > getIndiaDate()) {
      setAttendanceError('Attendance cannot be saved for a future date.');
      return;
    }
    if (selectedDateHoliday) {
      setAttendanceError(`Attendance cannot be marked during ${selectedDateHoliday.name}.`);
      return;
    }

    setAttendanceSaving(true);
    setAttendanceError('');
    setAttendanceNotice('');
    const entries = attendanceRows.map((row) => ({
      studentId: row.student._id,
      status,
      ...(attendanceRemarks[row.student._id]?.trim()
        ? { remarks: attendanceRemarks[row.student._id].trim() }
        : {}),
    }));
    try {
      await apiRequest<AttendanceResponse>('/attendance/bulk', {
        method: 'POST',
        body: JSON.stringify({ date: attendanceDate, entries }),
      });
      setAttendanceStatuses(Object.fromEntries(
        attendanceRows.map((row) => [row.student._id, status])
      ));
      setAttendanceNotice(status
        ? `All students marked ${status} and saved.`
        : 'Attendance reset to unmarked and saved.');
      await loadAttendance();
    } catch (err) {
      setAttendanceError(err instanceof Error ? err.message : 'Unable to save bulk attendance.');
    } finally {
      setAttendanceSaving(false);
    }
  };

  const resetHolidayForm = () => {
    setHolidayForm({
      name: '',
      startDate: attendanceDate,
      endDate: attendanceDate,
      description: '',
    });
    setEditingHolidayId(null);
    setShowHolidayForm(false);
  };

  const handleSaveHoliday = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHolidaySaving(true);
    setHolidayError('');
    setHolidayNotice('');
    try {
      const path = editingHolidayId
        ? `/attendance/holidays/${editingHolidayId}`
        : '/attendance/holidays';
      await apiRequest<HolidayResponse>(path, {
        method: editingHolidayId ? 'PUT' : 'POST',
        body: JSON.stringify({
          ...holidayForm,
          ...(holidayForm.description.trim()
            ? { description: holidayForm.description.trim() }
            : { description: '' }),
        }),
      });
      setHolidayNotice(editingHolidayId ? 'Holiday updated.' : 'Holiday declared.');
      resetHolidayForm();
      await loadHolidays();
      await loadAttendance();
    } catch (err) {
      setHolidayError(err instanceof Error ? err.message : 'Unable to save holiday.');
    } finally {
      setHolidaySaving(false);
    }
  };

  const handleDeleteHoliday = async (holiday: Holiday) => {
    if (!window.confirm(`Delete the holiday "${holiday.name}"?`)) return;
    setHolidayError('');
    setHolidayNotice('');
    try {
      await apiRequest(`/attendance/holidays/${holiday._id}`, { method: 'DELETE' });
      setHolidayNotice('Holiday deleted.');
      await loadHolidays();
      await loadAttendance();
    } catch (err) {
      setHolidayError(err instanceof Error ? err.message : 'Unable to delete holiday.');
    }
  };

  const handleCreateFee = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeesSaving(true);
    setFeesError('');
    setFeesNotice('');
    try {
      await apiRequest<FeesResponse>('/fees', {
        method: 'POST',
        body: JSON.stringify({
          studentId: feeStudentId,
          academicMonth: feeMonth,
          totalAmount: Number(feeAmount),
          dueDate: feeDueDate,
        }),
      });
      setFeesNotice('Monthly fee record saved.');
      setFeeAmount('');
      await loadFees();
    } catch (err) {
      setFeesError(err instanceof Error ? err.message : 'Unable to save fee record.');
    } finally {
      setFeesSaving(false);
    }
  };


  const activeStudents = students.filter((student) => !student.isArchived);
  const archivedStudents = students.filter((student) => student.isArchived);

  const filteredStudents = useMemo(() => {
    const term = search.trim().toLowerCase();

    return students.filter((student) => {
      const matchesStatus = showArchived || !student.isArchived;
      const matchesSearch =
        !term ||
        student.name.toLowerCase().includes(term) ||
        (student.gradeLevel ?? '').toLowerCase().includes(term) ||
        (student.guardianName ?? '').toLowerCase().includes(term) ||
        (student.guardianPhone ?? '').toLowerCase().includes(term);

      return matchesStatus && matchesSearch;
    });
  }, [students, search, showArchived]);

  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setNotice('');
    setError('');
    setCreatedCredentials(null);
    setCopiedCredentials(false);
    setShowForm(true);
  };

  const openEditForm = (student: Student) => {
    setEditingId(student._id);
    setForm({
      name: student.name,
      gradeLevel: student.gradeLevel ?? '',
      guardianName: student.guardianName ?? '',
      guardianPhone: student.guardianPhone ?? '',
      guardianEmail: student.guardianEmail ?? '',
      academicNotes: student.academicNotes ?? '',
      username: student.username ?? '',
      password: '',
    });
    setNotice('');
    setError('');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');

    const payload = {
      name: form.name.trim(),
      gradeLevel: form.gradeLevel,
      guardianName: form.guardianName.trim(),
      guardianPhone: form.guardianPhone.trim(),
      ...(form.guardianEmail.trim()
        ? { guardianEmail: form.guardianEmail.trim() }
        : {}),
      ...(form.academicNotes.trim()
        ? { academicNotes: form.academicNotes.trim() }
        : {}),
      ...(form.username.trim() ? { username: form.username.trim() } : {}),
      ...(form.password ? { password: form.password } : {}),
    };

    try {
      if (editingId) {
        await apiRequest<StudentResponse>(`/students/${editingId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
        setNotice('Student record updated successfully.');
      } else {
        const response = await apiRequest<StudentResponse>('/students', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setNotice('Student enrolled successfully.');
        if (response.data.credentials) {
          setCreatedCredentials(response.data.credentials);
        }
      }

      closeForm();
      await loadStudents();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to save student.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async (student: Student) => {
    const confirmed = window.confirm(
      `Archive ${student.name}? Their record will be preserved.`
    );

    if (!confirmed) return;

    setError('');
    setNotice('');

    try {
      await apiRequest(`/students/${student._id}`, {
        method: 'DELETE',
      });
      setNotice('Student archived successfully.');
      await loadStudents();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to archive student.'
      );
    }
  };

  const handleRestore = async (student: Student) => {
    setError('');
    setNotice('');

    try {
      await apiRequest(`/students/${student._id}/restore`, {
        method: 'POST',
      });
      setNotice('Student record restored successfully.');
      await loadStudents();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to restore student.'
      );
    }
  };

  const copyCreatedCredentials = async () => {
    if (!createdCredentials) return;

    try {
      await navigator.clipboard.writeText(
        `Username: ${createdCredentials.username}\nPassword: ${createdCredentials.initialPassword}`
      );
      setCopiedCredentials(true);
    } catch {
      setError('Clipboard access failed. Copy the credentials manually from this panel.');
    }
  };

  return (
    <DashboardLayout
      role="admin"
      activeTab={activeTab}
      onTabChange={(tab) => {
        setActiveTab(tab);
        setError('');
        setNotice('');
      }}
    >
      {error && (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
          {error.toLowerCase().includes('401') ||
            error.toLowerCase().includes('unauthorized') ? (
            <p className="mt-1">
              Your session may have expired. Sign in again and retry.
            </p>
          ) : null}
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800"
        >
          {notice}
        </div>
      )}

      {createdCredentials && (
        <section
          aria-labelledby="student-credentials-title"
          className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-950"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="student-credentials-title" className="font-semibold">
                Student account created
              </h2>
              <p className="mt-1 text-sm">
                Save these credentials for initial delivery. The password will not be shown again.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setCreatedCredentials(null);
                setCopiedCredentials(false);
              }}
              aria-label="Dismiss student credentials"
              className="rounded p-1 hover:bg-emerald-100"
            >
              <X size={18} />
            </button>
          </div>
          <dl className="mt-3 space-y-2 text-sm">
            <div>
              <dt className="font-medium">Username</dt>
              <dd className="select-all font-mono">{createdCredentials.username}</dd>
            </div>
            <div>
              <dt className="font-medium">Initial password</dt>
              <dd className="select-all font-mono">{createdCredentials.initialPassword}</dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={() => void copyCreatedCredentials()}
            className="mt-3 inline-flex items-center gap-2 rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm font-semibold text-emerald-900"
          >
            {copiedCredentials ? <CheckCircle2 size={16} /> : <Copy size={16} />}
            {copiedCredentials ? 'Copied' : 'Copy credentials'}
          </button>
        </section>
      )}

      {activeTab === 'overview' && (
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-brand-navy">
              Tuition Administration
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Overview based on records currently stored in the database.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                label: 'Active Students',
                value: activeStudents.length,
              },
              {
                label: 'Archived Students',
                value: archivedStudents.length,
              },
              {
                label: 'Total Records',
                value: students.length,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <p className="text-sm text-slate-500">{item.label}</p>
                <p className="mt-2 text-3xl font-bold text-brand-navy">
                  {loading ? '—' : item.value}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-brand-navy">
                  Student Records
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Manage student enrolments and guardian details.
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveTab('students');
                  openCreateForm();
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white"
              >
                <Plus size={16} />
                Add Student
              </button>
            </div>

            {loading && (
              <p className="mt-5 text-sm text-slate-500">
                Loading database records…
              </p>
            )}

            {!loading && students.length === 0 && !error && (
              <p className="mt-5 text-sm text-slate-500">
                No student records found. Add your first student to get started.
              </p>
            )}
          </div>
        </section>
      )}

      {activeTab === 'students' && (
        <section className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-brand-navy">
                Students & Guardians
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Create and manage records saved in MongoDB.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => void loadStudents()}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
              >
                <RefreshCw size={15} />
                Refresh
              </button>
              <button
                onClick={showForm ? closeForm : openCreateForm}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white"
              >
                <Plus size={16} />
                {showForm ? 'Cancel' : 'Enroll Student'}
              </button>
            </div>
          </div>

          {showForm && (
            <form
              onSubmit={handleSave}
              className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5"
            >
              <h3 className="font-semibold text-brand-navy">
                {editingId ? 'Edit Student' : 'New Student'}
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium text-slate-700">
                  Student name *
                  <input
                    className={`${inputClass} mt-1`}
                    required
                    minLength={2}
                    maxLength={100}
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                  />
                </label>

                <label className="text-sm font-medium text-slate-700">
                  Class *
                  <select
                    className={`${inputClass} mt-1`}
                    value={form.gradeLevel}
                    onChange={(e) =>
                      setForm({ ...form, gradeLevel: e.target.value })
                    }
                  >
                    <option value="">Not provided</option>
                    {Array.from({ length: 10 }, (_, index) => (
                      <option key={index + 1} value={`Class ${index + 1}`}>
                        Class {index + 1}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-sm font-medium text-slate-700">
                  Guardian name *
                  <input
                    className={`${inputClass} mt-1`}
                    required
                    minLength={2}
                    maxLength={100}
                    value={form.guardianName}
                    onChange={(e) =>
                      setForm({ ...form, guardianName: e.target.value })
                    }
                  />
                </label>

                <label className="text-sm font-medium text-slate-700">
                  Guardian phone *
                  <input
                    className={`${inputClass} mt-1`}
                    required
                    minLength={7}
                    maxLength={20}
                    value={form.guardianPhone}
                    onChange={(e) =>
                      setForm({ ...form, guardianPhone: e.target.value })
                    }
                  />
                </label>

                <label className="text-sm font-medium text-slate-700">
                  Guardian email (optional)
                  <input
                    className={`${inputClass} mt-1`}
                    type="email"
                    value={form.guardianEmail}
                    onChange={(e) =>
                      setForm({ ...form, guardianEmail: e.target.value })
                    }
                  />
                </label>

                <label className="text-sm font-medium text-slate-700">
                  Student username (optional)
                  <input
                    className={`${inputClass} mt-1`}
                    minLength={4}
                    maxLength={30}
                    autoComplete="off"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase() })}
                  />
                </label>

                <label className="text-sm font-medium text-slate-700">
                  {editingId
                    ? 'New password (leave blank to keep current)'
                    : 'Student password (optional; leave blank to generate one)'}
                  <input
                    className={`${inputClass} mt-1`}
                    type="password"
                    minLength={8}
                    maxLength={128}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </label>

                <label className="text-sm font-medium text-slate-700 sm:col-span-2">
                  Academic notes (optional)
                  <textarea
                    className={`${inputClass} mt-1`}
                    rows={3}
                    maxLength={1000}
                    value={form.academicNotes}
                    onChange={(e) =>
                      setForm({ ...form, academicNotes: e.target.value })
                    }
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {saving
                  ? 'Saving…'
                  : editingId
                    ? 'Save Changes'
                    : 'Save Student'}
              </button>
            </form>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                className={`${inputClass} pl-9`}
                placeholder="Search name, class, guardian or phone…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={showArchived}
                onChange={(e) => setShowArchived(e.target.checked)}
              />
              Include archived
            </label>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {loading ? (
              <p className="p-6 text-sm text-slate-500">
                Loading student records…
              </p>
            ) : filteredStudents.length === 0 ? (
              <div className="p-10 text-center">
                <Users className="mx-auto mb-3 text-slate-400" size={30} />
                <p className="font-semibold text-slate-700">
                  No matching students
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {search
                    ? 'Try a different search term.'
                    : 'No records are available for this filter yet.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Student</th>
                      <th className="px-4 py-3">Class</th>
                      <th className="px-4 py-3">Guardian</th>
                      <th className="px-4 py-3">Enrolled</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map((student) => (
                      <tr key={student._id}>
                        <td className="px-4 py-3 font-medium text-brand-navy">
                          {student.name}
                        </td>
                        <td className="px-4 py-3">{student.gradeLevel || 'Not provided'}</td>
                        <td className="px-4 py-3">
                          <div>{student.guardianName || 'Not provided'}</div>
                          <div className="text-xs text-slate-500">
                            {student.guardianPhone || ''}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                          {new Date(student.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-semibold ${student.isArchived
                              ? 'bg-slate-100 text-slate-600'
                              : 'bg-blue-50 text-blue-800'
                              }`}
                          >
                            {student.isArchived ? 'Archived' : 'Active'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-3">
                            {!student.isArchived && (
                              <>
                                <button
                                  title="Edit student"
                                  onClick={() => openEditForm(student)}
                                  className="text-blue-700 hover:text-blue-900"
                                >
                                  <Pencil size={16} />
                                </button>
                                <button
                                  title="Archive student"
                                  onClick={() => void handleArchive(student)}
                                  className="text-red-700 hover:text-red-900"
                                >
                                  <Archive size={16} />
                                </button>
                              </>
                            )}

                            {student.isArchived && (
                              <button
                                title="Restore student"
                                onClick={() => void handleRestore(student)}
                                className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900"
                              >
                                <RotateCcw size={15} />
                                Restore
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}

      {activeTab === 'fees' && (
        <section className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-brand-navy">Fees Management</h2>
              <p className="mt-1 text-sm text-slate-500">Create monthly fee records and record actual payments saved in MongoDB.</p>
            </div>
            <label className="text-sm font-medium text-slate-700">
              Academic month
              <input type="month" className={`${inputClass} mt-1`} value={feeMonth} onChange={(event) => setFeeMonth(event.target.value)} />
            </label>
          </div>

          {feesError && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{feesError}</div>}
          {feesNotice && <div role="status" className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">{feesNotice}</div>}

          <form onSubmit={handleCreateFee} className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-2 lg:grid-cols-4">
            <h3 className="font-semibold text-brand-navy sm:col-span-2 lg:col-span-4">Set monthly fee</h3>
            <label className="text-sm font-medium text-slate-700">Student *
              <select required className={`${inputClass} mt-1`} value={feeStudentId} onChange={(event) => setFeeStudentId(event.target.value)}>
                <option value="">Select student</option>
                {activeStudents.map((student) => <option key={student._id} value={student._id}>{student.name}{student.gradeLevel ? ` — ${student.gradeLevel}` : ''}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium text-slate-700">Fee amount (₹) *
              <input required type="number" min="1" max="10000000" step="0.01" className={`${inputClass} mt-1`} value={feeAmount} onChange={(event) => setFeeAmount(event.target.value)} />
            </label>
            <label className="text-sm font-medium text-slate-700">Due date *
              <input required type="date" className={`${inputClass} mt-1`} value={feeDueDate} onChange={(event) => setFeeDueDate(event.target.value)} />
            </label>
            <div className="flex items-end">
              <button disabled={feesSaving || activeStudents.length === 0} className="w-full rounded-lg bg-brand-navy px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{feesSaving ? 'Saving…' : 'Save fee'}</button>
            </div>
          </form>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 p-4">
              <h3 className="font-semibold text-brand-navy">Fee records — {feeMonth}</h3>
              <button type="button" onClick={() => void loadFees()} disabled={feesLoading} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:opacity-50"><RefreshCw size={15} />Refresh</button>
            </div>
            {feesLoading ? <p className="p-6 text-sm text-slate-500">Loading fee records…</p> : fees.length === 0 ? (
              <p className="p-8 text-center text-sm text-slate-500">No fee records for this month. Create a monthly fee record above.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">Fee</th><th className="px-4 py-3">Paid</th><th className="px-4 py-3">Balance</th><th className="px-4 py-3">Due date</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Payment history</th><th className="px-4 py-3">Record payment</th></tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {fees.map((fee) => {
                      const student = typeof fee.studentId === 'string' ? students.find((item) => item._id === fee.studentId) : fee.studentId;
                      const statusClass = fee.status === 'paid' ? 'bg-green-100 text-green-800' : fee.status === 'partial' ? 'bg-yellow-100 text-yellow-800' : fee.status === 'overdue' || fee.status === 'pending' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700';
                      return <tr key={fee._id} className="align-top">
                        <td className="px-4 py-3 font-medium text-brand-navy">{student?.name ?? 'Student record'}<div className="text-xs font-normal text-slate-500">{student?.gradeLevel ?? ''}</div></td>
                        <td className="whitespace-nowrap px-4 py-3">₹{fee.totalAmount.toLocaleString('en-IN')}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-green-700">₹{fee.paidAmount.toLocaleString('en-IN')}</td>
                        <td className="whitespace-nowrap px-4 py-3">₹{fee.pendingAmount.toLocaleString('en-IN')}</td>
                        <td className="whitespace-nowrap px-4 py-3">{new Date(fee.dueDate).toLocaleDateString()}</td>
                        <td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClass}`}>{fee.status}</span></td>
                        <td className="min-w-48 px-4 py-3">{fee.payments.length ? <div className="space-y-2">{fee.payments.map((payment, index) => <div key={`${fee._id}-${index}`} className="text-xs text-slate-600">₹{payment.amount.toLocaleString('en-IN')} · {new Date(payment.paymentDate).toLocaleDateString()} · {payment.method}{payment.transactionReference ? <div>Ref: {payment.transactionReference}</div> : null}</div>)}</div> : <span className="text-xs text-slate-400">No payments yet</span>}</td>
                        <td className="min-w-64 px-4 py-3">
                          <form onSubmit={(event) => {
                            event.preventDefault(); setPaymentFeeId(fee._id); void (async () => {
                              setFeesSaving(true); setFeesError(''); setFeesNotice('');
                              try {
                                await apiRequest<FeesResponse>(`/fees/${fee._id}/payments`, { method: 'POST', body: JSON.stringify({ amount: Number(paymentAmount), paymentDate, method: paymentMethod, ...(paymentReference.trim() ? { transactionReference: paymentReference.trim() } : {}), ...(paymentRemarks.trim() ? { remarks: paymentRemarks.trim() } : {}) }) });
                                setFeesNotice('Payment recorded successfully.'); setPaymentAmount(''); setPaymentReference(''); setPaymentRemarks(''); await loadFees();
                              } catch (err) { setFeesError(err instanceof Error ? err.message : 'Unable to record payment.'); }
                              finally { setFeesSaving(false); }
                            })();
                          }} className="space-y-2">
                            <input aria-label="Payment amount" required type="number" min="0.01" max={fee.pendingAmount} step="0.01" placeholder={`Amount (balance ₹${fee.pendingAmount})`} className={inputClass} value={paymentFeeId === fee._id ? paymentAmount : ''} onFocus={() => setPaymentFeeId(fee._id)} onChange={(event) => { setPaymentFeeId(fee._id); setPaymentAmount(event.target.value); }} />
                            <div className="flex gap-2"><input aria-label="Payment date" required type="date" className={inputClass} value={paymentDate} onChange={(event) => setPaymentDate(event.target.value)} /><select aria-label="Payment method" className={inputClass} value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value as FeeMethod)}><option value="upi">UPI</option><option value="cash">Cash</option><option value="bank_transfer">Bank transfer</option><option value="card">Card</option><option value="other">Other</option></select></div>
                            <input aria-label="Transaction reference" placeholder="Transaction reference (optional)" className={inputClass} value={paymentFeeId === fee._id ? paymentReference : ''} onChange={(event) => { setPaymentFeeId(fee._id); setPaymentReference(event.target.value); }} />
                            <input aria-label="Payment remarks" placeholder="Remarks (optional)" className={inputClass} value={paymentFeeId === fee._id ? paymentRemarks : ''} onChange={(event) => { setPaymentFeeId(fee._id); setPaymentRemarks(event.target.value); }} />
                            <button disabled={feesSaving || fee.pendingAmount <= 0} className="rounded-lg bg-brand-navy px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">{feesSaving ? 'Saving…' : 'Add payment'}</button>
                          </form>
                        </td>
                      </tr>;
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}

      {activeTab === 'classes' && <ClassSubjectsAdminPanel />}
      {activeTab === 'homework' && <HomeworkAdminPanel />}
      {activeTab === 'enquiries' && <EnquiriesAdminPanel />}

      {activeTab === 'attendance' ? (
        <section className="space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-brand-navy">
              Attendance Management
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Review attendance by date, update student statuses, and manage holidays.
            </p>
          </div>

          {calendarError && (
            <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {calendarError}
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <label className="block max-w-md text-sm font-medium text-slate-700">
              Select student
              <select
                className={`${inputClass} mt-1`}
                value={selectedStudentId}
                onChange={(event) => setSelectedStudentId(event.target.value)}
              >
                <option value="">Select a student</option>
                {activeStudents.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.name}{student.gradeLevel ? ` — ${student.gradeLevel}` : ''}
                  </option>
                ))}
              </select>
            </label>

            <div className="mt-5 rounded-2xl border border-slate-200 p-4 sm:p-5">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-brand-navy">
                    {new Date(
                      Number(calendarMonth.slice(0, 4)),
                      Number(calendarMonth.slice(5, 7)) - 1,
                      1
                    ).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {selectedCalendarStudent
                      ? `${selectedCalendarStudent.name}${selectedCalendarStudent.gradeLevel ? ` · ${selectedCalendarStudent.gradeLevel}` : ''}`
                      : 'Choose a student to view their calendar'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => moveCalendarMonth(-1)} className="rounded-lg border border-slate-300 p-2 text-slate-700 hover:bg-slate-50" aria-label="Previous month">
                    <ChevronLeft size={18} />
                  </button>
                  <button type="button" onClick={() => moveCalendarMonth(1)} className="rounded-lg border border-slate-300 p-2 text-slate-700 hover:bg-slate-50" aria-label="Next month">
                    <ChevronRight size={18} />
                  </button>
                  <button type="button" onClick={() => void loadCalendarHistory()} disabled={calendarLoading || !selectedStudentId} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:opacity-50">
                    <RefreshCw size={15} />
                    Refresh
                  </button>
                </div>
              </div>

              <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-slate-600">
                <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-green-600" />Present</span>
                <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-red-600" />Absent</span>
                <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-yellow-400" />Leave</span>
                <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-slate-300" />Holiday</span>
              </div>

              {calendarLoading ? (
                <p className="py-10 text-center text-sm text-slate-500">Loading saved attendance…</p>
              ) : !selectedStudentId ? (
                <p className="py-10 text-center text-sm text-slate-500">No active students available. Add a student first.</p>
              ) : (
                <div className="grid grid-cols-7 gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <div key={day} className="py-2 text-center text-xs font-semibold text-slate-500">{day}</div>
                  ))}
                  {calendarDays.map((item) => {
                    if (!item.date) return <div key={item.key} />;
                    const record = calendarHistory[item.date] ?? null;
                    const holiday = holidays.find(
                      (itemHoliday) => item.date >= itemHoliday.startDate && item.date <= itemHoliday.endDate
                    );
                    const isSelected = item.date === attendanceDate;
                    const statusClass =
                      holiday
                        ? 'bg-slate-300 text-slate-700 hover:bg-slate-400'
                        : record?.status === 'present'
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : record?.status === 'absent'
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : record?.status === 'leave'
                            ? 'bg-yellow-400 text-slate-900 hover:bg-yellow-500'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200';
                    return (
                      <button
                        type="button"
                        key={item.key}
                        onClick={() => setAttendanceDate(item.date)}
                        title={holiday ? `${item.date}: Holiday — ${holiday.name}` : record ? `${item.date}: ${record.status}${record.remarks ? ` — ${record.remarks}` : ''}` : `${item.date}: No attendance record`}
                        className={`min-h-12 rounded-lg p-2 text-sm font-semibold transition ${statusClass} ${isSelected ? 'ring-2 ring-brand-navy ring-offset-2' : ''}`}
                      >
                        {item.day}
                      </button>
                    );
                  })}
                </div>
              )}
              {selectedStudentId && !calendarLoading && (
                <p className="mt-4 text-xs text-slate-500">
                  Click a date to select it below. Holiday dates are shaded grey.
                </p>
              )}
            </div>
          </div>

          {attendanceError && (
            <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {attendanceError}
            </div>
          )}
          {attendanceNotice && (
            <div role="status" className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
              {attendanceNotice}
            </div>
          )}

          <div className="flex flex-wrap items-end justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5">
            <div>
              <h3 className="font-semibold text-brand-navy">Mark attendance for a date</h3>
              <p className="mt-1 text-sm text-slate-500">Selected date: {attendanceDate}</p>
            </div>
            <label className="text-sm font-medium text-slate-700">
              <span className="mb-1 flex items-center gap-2"><CalendarDays size={16} />Attendance date</span>
              <input type="date" max={getIndiaDate()} className={inputClass} value={attendanceDate} onChange={(event) => setAttendanceDate(event.target.value)} />
            </label>
            <button type="button" onClick={() => void loadAttendance()} disabled={attendanceLoading} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50">
              <RefreshCw size={15} />Refresh day
            </button>
          </div>

          {selectedDateHoliday && (
            <div role="status" className="rounded-xl border border-slate-300 bg-slate-100 p-3 text-sm text-slate-700">
              <strong>{selectedDateHoliday.name}</strong> is declared as a holiday for this date. Attendance cannot be marked.
            </div>
          )}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {attendanceLoading ? (
              <p className="p-6 text-sm text-slate-500">Loading attendance records…</p>
            ) : attendanceRows.length === 0 ? (
              <p className="p-8 text-center text-sm text-slate-500">No active students found. Add or restore students before marking attendance.</p>
            ) : (
              <>
                <div className="space-y-4 border-b border-slate-200 p-4">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                    {[
                      ['Students', attendanceRows.length, 'text-brand-navy'],
                      ['Present', attendanceCounts.present, 'text-emerald-700'],
                      ['Absent', attendanceCounts.absent, 'text-rose-700'],
                      ['Leave', attendanceCounts.leave, 'text-amber-700'],
                      ['Unmarked', attendanceCounts.unmarked, 'text-slate-600'],
                    ].map(([label, count, color]) => (
                      <div key={label} className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs font-medium text-slate-500">{label}</p>
                        <p className={`mt-1 text-xl font-bold ${color}`}>{count}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => void handleBulkAttendance('present')} disabled={attendanceSaving || Boolean(selectedDateHoliday) || attendanceDate > getIndiaDate()} className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 disabled:opacity-50">Mark All Present</button>
                    <button type="button" onClick={() => void handleBulkAttendance('absent')} disabled={attendanceSaving || Boolean(selectedDateHoliday) || attendanceDate > getIndiaDate()} className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-800 disabled:opacity-50">Mark All Absent</button>
                    <button type="button" onClick={() => void handleBulkAttendance('leave')} disabled={attendanceSaving || Boolean(selectedDateHoliday) || attendanceDate > getIndiaDate()} className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 disabled:opacity-50">Mark All Leave</button>
                    <button type="button" onClick={() => void handleBulkAttendance('')} disabled={attendanceSaving || Boolean(selectedDateHoliday) || attendanceDate > getIndiaDate()} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 disabled:opacity-50">Reset Unmarked</button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                      <tr><th className="px-4 py-3">Student Name</th><th className="px-4 py-3">Username</th><th className="px-4 py-3">Class</th><th className="px-4 py-3">Attendance Status</th><th className="px-4 py-3">Remarks (optional)</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {attendanceRows.map((row) => (
                        <tr key={row.student._id}>
                          <td className="px-4 py-3 font-medium text-brand-navy">{row.student.name}</td>
                          <td className="px-4 py-3 text-slate-600">{row.student.username || '—'}</td>
                          <td className="px-4 py-3">{row.student.gradeLevel || 'Not provided'}</td>
                          <td className="px-4 py-3">
                            <select
                              className={inputClass}
                              value={attendanceStatuses[row.student._id] ?? ''}
                              disabled={Boolean(selectedDateHoliday) || attendanceDate > getIndiaDate()}
                              onChange={(event) => {
                                const value = event.target.value as AttendanceStatus | '';
                                setAttendanceStatuses((previous) => ({ ...previous, [row.student._id]: value }));
                              }}
                            >
                              <option value="">Not marked</option><option value="present">Present</option><option value="absent">Absent</option><option value="leave">Leave</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <input disabled={Boolean(selectedDateHoliday) || attendanceDate > getIndiaDate()} className={inputClass} maxLength={500} placeholder="Optional note" value={attendanceRemarks[row.student._id] ?? ''} onChange={(event) => setAttendanceRemarks((previous) => ({ ...previous, [row.student._id]: event.target.value }))} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 p-4">
                  <p className="text-sm text-slate-500">
                    {attendanceRows.length - attendanceCounts.unmarked} of {attendanceRows.length} students marked
                  </p>
                  <button type="button" onClick={() => void handleSaveAttendance()} disabled={attendanceSaving || attendanceLoading || Boolean(selectedDateHoliday) || attendanceDate > getIndiaDate()} className="inline-flex items-center gap-2 rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                    <Save size={16} />{attendanceSaving ? 'Saving…' : 'Save Attendance'}
                  </button>
                </div>
              </>
            )}
          </div>

          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-brand-navy">Holiday Management</h3>
                <p className="mt-1 text-sm text-slate-500">Declared holiday dates are excluded from attendance.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setHolidayForm({ name: '', startDate: attendanceDate, endDate: attendanceDate, description: '' });
                  setEditingHolidayId(null);
                  setShowHolidayForm((shown) => !shown);
                  setHolidayError('');
                }}
                className="rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white"
              >
                {showHolidayForm ? 'Close form' : 'Declare Holiday'}
              </button>
            </div>
            {holidayError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{holidayError}</p>}
            {holidayNotice && <p role="status" className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">{holidayNotice}</p>}
            {showHolidayForm && (
              <form onSubmit={handleSaveHoliday} className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
                <label className="text-sm font-medium text-slate-700">Holiday name *
                  <input required maxLength={100} className={`${inputClass} mt-1`} value={holidayForm.name} onChange={(event) => setHolidayForm((current) => ({ ...current, name: event.target.value }))} />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="text-sm font-medium text-slate-700">Start date *
                    <input required type="date" className={`${inputClass} mt-1`} value={holidayForm.startDate} onChange={(event) => setHolidayForm((current) => ({ ...current, startDate: event.target.value }))} />
                  </label>
                  <label className="text-sm font-medium text-slate-700">End date *
                    <input required type="date" min={holidayForm.startDate} className={`${inputClass} mt-1`} value={holidayForm.endDate} onChange={(event) => setHolidayForm((current) => ({ ...current, endDate: event.target.value }))} />
                  </label>
                </div>
                <label className="text-sm font-medium text-slate-700 sm:col-span-2">Description (optional)
                  <textarea rows={2} maxLength={500} className={`${inputClass} mt-1`} value={holidayForm.description} onChange={(event) => setHolidayForm((current) => ({ ...current, description: event.target.value }))} />
                </label>
                <div className="flex gap-2 sm:col-span-2">
                  <button disabled={holidaySaving} className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{holidaySaving ? 'Saving…' : editingHolidayId ? 'Update Holiday' : 'Save Holiday'}</button>
                  <button type="button" onClick={resetHolidayForm} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Cancel</button>
                </div>
              </form>
            )}
            {holidaysLoading ? (
              <p className="text-sm text-slate-500">Loading holidays…</p>
            ) : holidays.length === 0 ? (
              <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No holidays have been declared.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {holidays.map((holiday) => (
                  <li key={holiday._id} className="flex flex-wrap items-start justify-between gap-3 py-3">
                    <div>
                      <p className="font-semibold text-brand-navy">{holiday.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{holiday.startDate === holiday.endDate ? holiday.startDate : `${holiday.startDate} to ${holiday.endDate}`}</p>
                      {holiday.description && <p className="mt-1 text-sm text-slate-600">{holiday.description}</p>}
                    </div>
                    <div className="flex gap-2">
                      <button type="button" aria-label={`Edit ${holiday.name}`} onClick={() => {
                        setHolidayForm({ name: holiday.name, startDate: holiday.startDate, endDate: holiday.endDate, description: holiday.description ?? '' });
                        setEditingHolidayId(holiday._id);
                        setShowHolidayForm(true);
                        setHolidayError('');
                      }} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"><Pencil size={16} /></button>
                      <button type="button" aria-label={`Delete ${holiday.name}`} onClick={() => void handleDeleteHoliday(holiday)} className="rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50"><Trash2 size={16} /></button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </section>        ) : !['overview', 'students', 'fees', 'classes', 'homework', 'enquiries'].includes(activeTab) ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-8">
            <h2 className="text-xl font-bold text-brand-navy">
              {activeTab === 'classes'
                ? 'Classes & Subjects'
                : activeTab === 'homework'
                  ? 'Homework Tracker'
                  : activeTab === 'quizzes'
                    ? 'Tests & Assessments'
                    : activeTab === 'reports'
                      ? 'Marks & Progress Reports'
                      : 'Announcements & Settings'}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              This module is not connected to persisted records yet. No sample data is displayed.
            </p>
          </section>
        ) : null}
    </DashboardLayout>
  );
}
