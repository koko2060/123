import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { Plus, Edit, Trash2, Search, User, Phone, FileText } from 'lucide-react';
import { Servant, FamilyGroup } from '@/types';

const servantRoles = {
  priest: 'الكاهن المسؤول',
  male_leader: 'أمين الخدمة',
  female_leader: 'أمينة الخدمة',
  assistant: 'خادم مساعد',
};

export default function ServantManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingServant, setEditingServant] = useState<Servant | null>(null);
  
  const initialFormState: Omit<Servant, 'id'> = { name: '', role: 'assistant', contact: '', notes: '', responsibleGroupIds: [] };
  const [formData, setFormData] = useState<Omit<Servant, 'id'>>(initialFormState);

  const servants = useLiveQuery(() => 
    db.servants.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).toArray(),
    [searchTerm]
  );
  
  const groups = useLiveQuery(() => db.groups.toArray());

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingServant?.id) {
      await db.servants.update(editingServant.id, { ...formData, id: editingServant.id });
    } else {
      await db.servants.add(formData);
    }
    setShowForm(false);
    setEditingServant(null);
    setFormData(initialFormState);
  };

  const handleEdit = (servant: Servant) => {
    setEditingServant(servant);
    setFormData({
        name: servant.name,
        role: servant.role,
        contact: servant.contact || '',
        notes: servant.notes || '',
        responsibleGroupIds: servant.responsibleGroupIds || []
    });
    setShowForm(true);
  };

  const handleDelete = async (servantId?: number) => {
    if (servantId && confirm('هل أنت متأكد من حذف هذا الخادم؟')) {
      await db.servants.delete(servantId);
    }
  };
  
  const handleGroupSelection = (groupId: string) => {
    const currentIds = formData.responsibleGroupIds || [];
    if (currentIds === 'all') return;

    const newIds = currentIds.includes(groupId)
      ? currentIds.filter(id => id !== groupId)
      : [...currentIds, groupId];
    setFormData({ ...formData, responsibleGroupIds: newIds });
  };

  return (
    <div className="p-6 font-arabic">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">إدارة الخدام</h1>
        <p className="text-gray-600 dark:text-dark-subtext">إدارة بيانات خدام الاجتماع وأدوارهم</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <button onClick={() => { setEditingServant(null); setFormData(initialFormState); setShowForm(true); }} className="btn-primary flex items-center gap-2"><Plus className="h-4 w-4" />إضافة خادم جديد</button>
        <div className="relative w-full sm:w-64"><Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" /><input type="text" placeholder="البحث عن خادم..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-field pr-10" /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servants?.map((servant) => (
          <div key={servant.id} className="card">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">{servant.name}</h3>
                <p className="text-sm font-medium text-primary-600 dark:text-primary-400">{servantRoles[servant.role]}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(servant)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"><Edit className="h-4 w-4" /></button>
                <button onClick={() => handleDelete(servant.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-dark-subtext">
              {servant.contact && <div className="flex items-center gap-2"><Phone className="h-4 w-4" /><span>{servant.contact}</span></div>}
              {servant.notes && <div className="flex items-center gap-2"><FileText className="h-4 w-4" /><span>{servant.notes}</span></div>}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-dark-card rounded-xl p-6 w-full max-w-lg max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-dark-text">{editingServant ? 'تعديل بيانات الخادم' : 'إضافة خادم جديد'}</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 dark:text-dark-subtext mb-1">الاسم</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-dark-subtext mb-1">الدور</label><select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value as Servant['role'] })} className="select-field" required>{Object.entries(servantRoles).map(([key, value]) => (<option key={key} value={key}>{value}</option>))}</select></div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-dark-subtext mb-1">رقم الهاتف (للإشعارات)</label><input type="tel" value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} className="input-field" /></div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-dark-subtext mb-1">ملاحظات</label><textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="textarea-field" rows={3} /></div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-subtext mb-2">المجموعات المسئول عنها</label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="all-groups" checked={formData.responsibleGroupIds === 'all'} onChange={() => setFormData({...formData, responsibleGroupIds: formData.responsibleGroupIds === 'all' ? [] : 'all'})} className="ml-2" />
                    <label htmlFor="all-groups">خادم عام (مسؤول عن كل المجموعات)</label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                  {groups?.map(group => (
                    <div key={group.id} className="flex items-center">
                      <input type="checkbox" id={`group-${group.id}`} checked={formData.responsibleGroupIds === 'all' || (Array.isArray(formData.responsibleGroupIds) && formData.responsibleGroupIds.includes(String(group.id)))} onChange={() => handleGroupSelection(String(group.id))} disabled={formData.responsibleGroupIds === 'all'} className="ml-2" />
                      <label htmlFor={`group-${group.id}`}>{group.name}</label>
                    </div>
                  ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">{editingServant ? 'حفظ التعديلات' : 'إضافة'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
