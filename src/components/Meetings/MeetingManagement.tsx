import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { Plus, Edit, Trash2, Calendar, Clock, User, Search } from 'lucide-react';
import { Meeting, MeetingSegment } from '@/types';

const segmentTypes = {
  opening: 'فقرة افتتاحية',
  hymns: 'فقرة ترانيم',
  sermon: 'عظة',
  seminar: 'ندوة',
  qa: 'فقرة أسئلة',
};

export default function MeetingManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [formData, setFormData] = useState<{ title: string; date: string; agenda: MeetingSegment[] }>({ title: '', date: '', agenda: [] });

  const meetings = useLiveQuery(() => 
    db.meetings.filter(m => m.title.toLowerCase().includes(searchTerm.toLowerCase())).reverse().toArray(),
    [searchTerm]
  );
  
  const totalFamilies = useLiveQuery(() => db.families.count(), []) || 0;

  const addSegment = () => {
    const newSegment: MeetingSegment = { id: `segment-${Date.now()}`, title: '', description: '', duration: 15, responsibleServant: '', order: formData.agenda.length + 1, type: 'sermon' };
    setFormData({ ...formData, agenda: [...formData.agenda, newSegment] });
  };

  const updateSegment = (index: number, field: keyof MeetingSegment, value: string | number) => {
    const updatedAgenda = [...formData.agenda];
    const segmentToUpdate = updatedAgenda[index];
    (segmentToUpdate as any)[field] = value;
    setFormData({ ...formData, agenda: updatedAgenda });
  };

  const removeSegment = (index: number) => {
    setFormData({ ...formData, agenda: formData.agenda.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const meetingData: Meeting = {
      ...editingMeeting,
      title: formData.title, 
      date: formData.date, 
      agenda: formData.agenda,
      totalAttendance: editingMeeting ? editingMeeting.totalAttendance : 0,
      totalFamilies: totalFamilies,
      createdBy: 'admin', 
      createdAt: editingMeeting?.createdAt || new Date().toISOString(),
    };

    if (editingMeeting?.id) {
      await db.meetings.update(editingMeeting.id, meetingData);
    } else {
      await db.meetings.add(meetingData);
    }
    
    setShowAddForm(false);
    setEditingMeeting(null);
    setFormData({ title: '', date: '', agenda: [] });
  };

  const handleEdit = (meeting: Meeting) => {
    setEditingMeeting(meeting);
    setFormData({ title: meeting.title, date: meeting.date, agenda: meeting.agenda });
    setShowAddForm(true);
  };

  const handleDelete = async (meetingId?: number) => {
    if (meetingId && confirm('هل أنت متأكد من حذف هذا الاجتماع؟')) {
      await db.meetings.delete(meetingId);
    }
  };

  return (
    <div className="p-6 font-arabic">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">إدارة الاجتماعات</h1>
        <p className="text-gray-600 dark:text-dark-subtext">تخطيط وإدارة برامج الاجتماعات الأسبوعية</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <button onClick={() => { setEditingMeeting(null); setFormData({ title: '', date: '', agenda: [] }); setShowAddForm(true); }} className="btn-primary flex items-center gap-2"><Plus className="h-4 w-4" />إضافة اجتماع جديد</button>
        <div className="relative w-full sm:w-64"><Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" /><input type="text" placeholder="البحث في الاجتماعات..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-field pr-10" /></div>
      </div>

      <div className="space-y-6">
        {meetings?.map((meeting) => (
          <div key={meeting.id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">{meeting.title}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-dark-subtext">
                  <div className="flex items-center gap-1"><Calendar className="h-4 w-4" /><span>{new Date(meeting.date).toLocaleDateString('ar-SA')}</span></div>
                  <div className="flex items-center gap-1"><Clock className="h-4 w-4" /><span>{meeting.agenda.reduce((t, s) => t + s.duration, 0)} دقيقة</span></div>
                  <div className="flex items-center gap-1"><User className="h-4 w-4" /><span className="ltr-numbers">{meeting.totalAttendance}/{meeting.totalFamilies}</span></div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(meeting)} className="btn-secondary flex items-center gap-1 text-xs"><Edit className="h-3 w-3" />تعديل</button>
                <button onClick={() => handleDelete(meeting.id)} className="btn-danger flex items-center gap-1 text-xs"><Trash2 className="h-3 w-3" />حذف</button>
              </div>
            </div>
            <div className="border-t dark:border-dark-border pt-4">
              <h4 className="font-medium text-gray-900 dark:text-dark-text mb-3">برنامج الاجتماع:</h4>
              <div className="space-y-2">
                {meeting.agenda.map((segment, index) => (
                  <div key={segment.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-800 dark:text-gray-200">{index + 1}. {segment.title} <span className="badge badge-info">{segmentTypes[segment.type]}</span></span>
                      <p className="text-sm text-gray-600 dark:text-dark-subtext">{segment.description}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-600 dark:text-dark-subtext">{segment.responsibleServant}</p>
                      <p className="text-xs text-gray-500 ltr-numbers">{segment.duration} دقيقة</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-dark-card rounded-xl p-6 w-full max-w-3xl max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-dark-text">{editingMeeting ? 'تعديل الاجتماع' : 'إضافة اجتماع جديد'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 dark:text-dark-subtext mb-1">عنوان الاجتماع</label><input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="input-field" required /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-dark-subtext mb-1">تاريخ الاجتماع</label><input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="input-field" required /></div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text">برنامج الاجتماع</h3>
                  <button type="button" onClick={addSegment} className="btn-secondary text-sm flex items-center gap-1"><Plus className="h-3 w-3" />إضافة فقرة</button>
                </div>
                <div className="space-y-4">
                  {formData.agenda.map((segment, index) => (
                    <div key={index} className="border dark:border-dark-border rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-dark-subtext mb-1">عنوان الفقرة</label><input type="text" value={segment.title} onChange={(e) => updateSegment(index, 'title', e.target.value)} className="input-field" required /></div>
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-dark-subtext mb-1">نوع الفقرة</label><select value={segment.type} onChange={(e) => updateSegment(index, 'type', e.target.value as MeetingSegment['type'])} className="select-field" required>{Object.entries(segmentTypes).map(([key, value]) => (<option key={key} value={key}>{value}</option>))}</select></div>
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-dark-subtext mb-1">الخادم القائم بالفقرة</label><input type="text" value={segment.responsibleServant} onChange={(e) => updateSegment(index, 'responsibleServant', e.target.value)} className="input-field" required /></div>
                        <div className="md:col-span-2 lg:col-span-3"><label className="block text-sm font-medium text-gray-700 dark:text-dark-subtext mb-1">الوصف</label><textarea value={segment.description} onChange={(e) => updateSegment(index, 'description', e.target.value)} className="textarea-field" rows={2} /></div>
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-dark-subtext mb-1">المدة (بالدقائق)</label><input type="number" value={segment.duration} onChange={(e) => updateSegment(index, 'duration', parseInt(e.target.value))} className="input-field" min="1" required /></div>
                        <div className="flex items-end"><button type="button" onClick={() => removeSegment(index)} className="btn-danger text-sm w-full">حذف الفقرة</button></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">{editingMeeting ? 'تحديث' : 'إضافة'}</button>
                <button type="button" onClick={() => { setShowAddForm(false); setEditingMeeting(null); setFormData({ title: '', date: '', agenda: [] }); }} className="btn-secondary flex-1">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
