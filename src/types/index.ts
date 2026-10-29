export type UserRole = 'admin' | 'student' | 'guardian';

export interface UserSession {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

export interface EnquiryFormData {
  studentName: string;
  gradeLevel: string;
  guardianName: string;
  phone: string;
  message?: string;
}

