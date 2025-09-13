import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { Plus, Edit, Trash2, Users, Calendar, Search } from 'lucide-react';
import { FamilyGroup } from '@/types';

export default function FamilyGroups() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<FamilyGroup | null>(null);
  
  const initialFormState = { name: '', description: '', start: '', end: '' };
  const [formData, setFormData] = useState(initialFormState);

  const groups = useLiveQuery(() =>
    db.groups.filter(group =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase())
    ).toArray(),
    [searchTerm]
  );
  
  const families = useLiveQuery(() => db.families.toArray(), []);

  const getFamilyCountForGroup = (group: FamilyGroup) => {
    if (!families || !group.id) return 0;
    return families.filter(family => family.groupId === String(group.id)).length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newGroupData = {
      name: formData.name,
      description: formData.description,
      marriageDateRange: { start: formData.start, end: formData.end },
      createdAt: editingGroup?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingGroup?.id) {
      await db.groups.update(editingGroup.id, newGroupData);
    } else {
      await db.groups.add(newGroupData as FamilyGroup);
    }
    
    setShowAddForm(false);
    setEditingGroup(null);
    setFormData(initialFormState);
  };

  const handleEdit = (group: FamilyGroup) => {
    setEditingGroup(group);
    setFormData({ name: group.name, description: group.description, start: group.marriageDateRange.start, end: group.marriageDateRange.end });
    setShowAddForm(true);
  };

  const handleDelete = async (groupId?: number) => {
    if (groupId && confirm('هل أنت متأكد من حذف هذه المجموعة؟')) {
      await db.groups.delete(groupId);
    }
  };
  
  const closeForm = () => {
    setShowAddForm(false);
    setEditingGroup(null);
    setFormData(initialFormState);
  };

  return (
    <div className="p-6 font-arabic">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">المجموعات العائلية</h1>
        <p className="text-gray-600 dark:text-dark-subtext">تنظيم العائلات في مجموعات حسب تاريخ الزواج</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <button onClick={() => setShowAddForm(true)} className="btn-primary flex items-center gap-2"><Plus className="h-4 w-4" />إضافة مجموعة جديدة</button>
        <div className="relative w-full sm:w-64"><Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" /><input type="text" placeholder="البحث في المجموعات..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-field pr-10" /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups?.map((group) => (
          <div key={group.id} className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">{group.name}</h3>
              <p className="text-sm text-gray-600 dark:text-dark-subtext mt-1">{group.description}</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-dark-subtext"><Calendar className="h-4 w-4" /><span>من {new Date(group.marriageDateRange.start).getFullYear()} إلى {new Date(group.marriageDateRange.end).getFullYear()}</span></div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-dark-subtext"><Users className="h-4 w-4" /><span>{getFamilyCountForGroup(group)} عائلة</span></div>
              <div className="flex gap-2 pt-3">
                <button onClick={() => handleEdit(group)} className="btn-secondary flex items-center gap-1 text-xs"><Edit className="h-3 w-3" />تعديل</button>
                <button onClick={() => handleDelete(group.id)} className="btn-danger flex items-center gap-1 text-xs"><Trash2 className="h-3 w-3" />حذف</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-dark-card rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-dark-text">{editingGroup ? 'تعديل المجموعة' : 'إضافة مجموعة جديدة'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 dark:text-dark-subtext mb-1">اسم المجموعة</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="input-field" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-dark-subtext mb-1">الوصف</label><textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="textarea-field" rows={3} required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 dark:text-dark-subtext mb-1">تاريخ البداية</label><input type="date" value={formData.start} onChange={(e) => setFormData({...formData, start: e.target.value})} className="input-field" required /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-dark-subtext mb-1">تاريخ النهاية</label><input type="date" value={formData.end} onChange={(e) => setFormData({...formData, end: e.target.value})} className="input-field" required /></div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">{editingGroup ? 'تحديث' : 'إضافة'}</button>
                <button type="button" onClick={closeForm} className="btn-secondary flex-1">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
