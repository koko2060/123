import Dexie, { Table } from 'dexie';
import { User, Family, FamilyGroup, Meeting, FollowUp, Servant, AttendanceRecord } from '@/types';

export class AppDB extends Dexie {
  users!: Table<User, number>;
  families!: Table<Family, number>;
  groups!: Table<FamilyGroup, number>;
  meetings!: Table<Meeting, number>;
  followUps!: Table<FollowUp, number>;
  servants!: Table<Servant, number>;
  attendance!: Table<AttendanceRecord, number>;

  constructor() {
    super('FamilyMeetingDB');
    this.version(1).stores({
      users: '++id, username, role',
      families: '++id, husbandName, wifeName, groupId',
      groups: '++id, name',
      meetings: '++id, date',
      followUps: '++id, familyId, followUpDate',
      servants: '++id, name, role',
      attendance: '++id, [familyId+meetingId], status',
    });
  }
}

export const db = new AppDB();
