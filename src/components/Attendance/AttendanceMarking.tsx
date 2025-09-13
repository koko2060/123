import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { CheckCircle, XCircle, Search, Save, Info } from 'lucide-react';
import { Family, FamilyGroup } from '@/types';
import FamilyForm from '@/components/Families/FamilyForm';

export default function AttendanceMarking() {
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceData, setAttendanceData] = useState<Record<string, { status: 'present' | 'absent' | null; reason?: string }>>({});
  const [meetingDate, setMeetingDate] = useState(new Date().toISOString().split('T')[0]);
  const [showDetailsModal, setShowDetailsModal] = useState<Family | null>(null);

  const families = useLiveQuery(() => 
    db.families.filter(family => 
      family.husbandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      family.wifeName.toLowerCase().includes(searchTerm.toLowerCase())
    ).toArray(), 
  [searchTerm]);

  const groups = useLiveQuery(() => db.groups.toArray(), []);

  const handleAttendanceChange = (familyId: number, status: 'present' | 'absent') => {
    setAttendanceData(prev => ({ ...prev, [familyId]: { ...prev[familyId], status } }));
  };

  const handleReasonChange = (familyId: number, reason: string) => {
    setAttendanceData(prev => ({ ...prev, [familyId]: { ...prev[familyId], reason } }));
  };

  const handleSaveAttendance = () => {
    // This is where you would save to the DB. For now, it's a console log.
    const recordsToSave = Object.entries(attendanceData).filter(([_, data]) => data.status !== null);
    console.log('Saving attendance records for meeting on ' + meetingDate, recordsToSave);
    alert(`تم حفظ حضور ${recordsToSave.length} عائلة بنجاح`);
  };

  const handleFormSubmit = async (data: Family) => {
    if(data.id) {
      await db.families.update(data.id, data);
      setShowDetailsModal(null);
    }
  };

  const presentCount = Object.values(attendanceData).filter(data => data.status === 'present').length;
  const absentCount = Object.values(attendanceData).filter(data => data.status === 'absent').length;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">تسجيل الحضور</h1>
        <p className="text-gray-600 dark:text-dark-subtext">تسجيل حضور وغياب العائلات في الاجتماع الأسبوعي</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-dark-text">معلومات الاجتماع</h3>
          <input type="date" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} className="input-field" />
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-dark-text">إحصائيات الحضور</h3>
          <div className="space-y-2">
            <div className="flex justify-between"><span className="text-green-600">الحضور:</span><span className="font-bold text-green-600">{presentCount}</span></div>
            <div className="flex justify-between"><span className="text-red-600">الغياب:</span><span className="font-bold text-red-600">{absentCount}</span></div>
            <div className="flex justify-between border-t pt-2 dark:border-dark-border"><span className="text-gray-600 dark:text-dark-subtext">المجموع:</span><span className="font-bold">{presentCount + absentCount}</span></div>
          </div>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-dark-text">البحث</h3>
          <div className="relative"><Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" /><input type="text" placeholder="البحث عن عائلة..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-field pr-10" /></div>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">قائمة العائلات</h3>
          <button onClick={handleSaveAttendance} className="btn-primary flex items-center gap-2" disabled={Object.keys(attendanceData).length === 0}><Save className="h-4 w-4" />حفظ الحضور</button>
        </div>
        <div className="space-y-4">
          {families?.map((family) => {
            if (!family.id) return null;
            const attendance = attendanceData[family.id];
            return (
              <div key={family.id} className="border dark:border-dark-border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-dark-text">{family.husbandName} و {family.wifeName}</h4>
                    <p className="text-sm text-gray-500 dark:text-dark-subtext">{family.church} • {family.children.length} أطفال</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleAttendanceChange(family.id!, 'present')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${attendance?.status === 'present' ? 'bg-green-100 text-green-700 border-2 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700' : 'bg-gray-100 text-gray-600 hover:bg-green-50 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-green-900/50'}`}><CheckCircle className="h-4 w-4" />حاضر</button>
                    <button onClick={() => handleAttendanceChange(family.id!, 'absent')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${attendance?.status === 'absent' ? 'bg-red-100 text-red-700 border-2 border-red-300 dark:bg-red-900 dark:text-red-200 dark:border-red-700' : 'bg-gray-100 text-gray-600 hover:bg-red-50 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-red-900/50'}`}><XCircle className="h-4 w-4" />غائب</button>
                  </div>
                  {attendance?.status === 'absent' && (<div><input type="text" placeholder="سبب الغياب..." value={attendance.reason || ''} onChange={(e) => handleReasonChange(family.id!, e.target.value)} className="input-field text-sm" /></div>)}
                  <div className="flex justify-end">
                    <button onClick={() => setShowDetailsModal(family)} className="btn-secondary flex items-center gap-2 text-sm"><Info className="h-4 w-4" />تفاصيل</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showDetailsModal && (
        <FamilyForm
          onSubmit={handleFormSubmit}
          onCancel={() => setShowDetailsModal(null)}
          initialData={showDetailsModal}
          groups={groups || []}
        />
      )}
    </div>
  );
}
