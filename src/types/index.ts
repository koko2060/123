export interface User {
  id?: number;
  username: string;
  role: 'super-admin' | 'admin' | 'user';
  name: string;
  email?: string;
}

export interface Child {
  id: string;
  name: string;
  birthDate?: string;
  schoolGrade?: string;
  notes?: string;
}

export interface Servant {
  id?: number;
  name: string;
  role: 'priest' | 'male_leader' | 'female_leader' | 'assistant';
  contact?: string;
  notes?: string;
  responsibleGroupIds?: string[] | 'all'; // 'all' for general servant
}

export interface Family {
  id?: number;
  husbandName: string;
  wifeName: string;
  husbandPhone?: string;
  wifePhone?: string;
  homePhone?: string;
  children: Child[];
  church: string;
  husbandSpiritualFather: string;
  wifeSpiritualFather: string;
  address: string;
  husbandOccupation: string;
  wifeOccupation: string;
  marriageDate: string;
  groupId?: string;
  reasonForAbsence?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FamilyGroup {
  id?: number;
  name: string;
  description: string;
  marriageDateRange: {
    start: string;
    end: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceRecord {
  id?: number;
  familyId: number;
  meetingId: number;
  status: 'present' | 'absent';
  reasonForAbsence?: string;
  recordedBy: string;
  recordedAt: string;
}

export interface Meeting {
  id?: number;
  title: string;
  date: string;
  agenda: MeetingSegment[];
  totalAttendance: number;
  totalFamilies: number;
  createdBy: string;
  createdAt: string;
}

export interface MeetingSegment {
  id: string;
  title: string;
  description: string;
  duration: number;
  responsibleServant: string;
  order: number;
  type: 'sermon' | 'opening' | 'hymns' | 'qa' | 'seminar';
}

export interface FollowUp {
  id?: number;
  familyId: number;
  method: 'call' | 'home_visit';
  responsibleServantIds: number[];
  notes: string;
  outcome: string;
  followUpDate: string;
  createdBy: string;
  createdAt: string;
}

export interface Statistics {
  totalFamilies: number;
  presentFamilies: number;
  absentFamilies: number;
  attendanceRate: number;
  weeklyTrend: {
    date: string;
    attendance: number;
  }[];
}
