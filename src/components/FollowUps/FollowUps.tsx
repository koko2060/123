import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { Plus, Phone, Home, Search, Calendar, User, FileText } from 'lucide-react';
import { FollowUp, Family, Servant } from '@/types';
import { Combobox } from '@headlessui/react';

export default function FollowUps() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  
  const initialFormState = { familyId: 0, method: 'call' as 'call' | 'home_visit', responsibleServantIds: [], notes: '', outcome: '', followUpDate: new Date().toISOString().split('T')[0] };
  const [formData, setFormData] = useState(initialFormState);

  const [familyQuery, setFamilyQuery] = useState('');

  const followUps = useLiveQuery(() => db.followUps.reverse().toArray());
  const families = useLiveQuery(() => db.families.toArray());
  const servants = useLiveQuery(() => db.servants.toArray());

  const filteredFamilies = familyQuery === '' ? families : families?.filter(f => `${f.husbandName} ${f.wifeName}`.toLowerCase().includes(familyQuery.toLowerCase()));

  const getFamilyName = (familyId: number) => {
    const family = families?.find(f => f.id === familyId);
    return family ? `${family.husbandName} و ${family.wifeName}` : 'عائلة غير محددة';
  };
  
  const getServantNames = (servantIds: number[]) => {
    return servantIds.map(id => servants?.find(s => s.id === id)?.name || 'خادم غير معروف').join(', ');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.familyId) {
      alert('الرجاء اختيار عائلة');
      return;
    }
    const newFollowUp: Omit<FollowUp, 'id'> = { ...formData, createdBy: 'admin', createdAt: new Date().toISOString() };
    await db.followUps.add(newFollowUp as FollowUp);
    setShowAddForm(false);
    setFormData(initialFormState);
  };

  const handleServantSelection = (servantId: number) => {
    const newIds = formData.responsibleServantIds.includes(servantId)
      ? formData.responsibleServantIds.filter(id => id !== servantId)
      : [...formData.responsibleServantIds, servantId];
    setFormData({ ...formData, responsibleServantIds: newIds });
  };

  return (
    <div className="p-6 font-arabic">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">المتابعة والزيارات</h1>
        <p className="text-gray-600 dark:text-dark-subtext">تسجيل ومتابعة الزيارات والاتصالات مع العائلات</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <button onClick={() => setShowAddForm(true)} className="btn-primary flex items-center gap-2"><Plus className="h-4 w-4" />إضافة متابعة جديدة</button>
        <div className="relative w-full sm:w-64"><Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" /><input type="text" placeholder="البحث..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-field pr-10" /></div>
      </div>

      <div className="space-y-4">
        {followUps?.map((followUp) => (
          <div key={followUp.id} className="card">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-dark-text mb-2">{getFamilyName(followUp.familyId)}</h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-dark-subtext">
                  <div className="flex items-center gap-2">{followUp.method === 'call' ? <Phone className="h-4 w-4 text-blue-500" /> : <Home className="h-4 w-4 text-green-500" />}<span>{followUp.method === 'call' ? 'اتصال هاتفي' : 'زيارة منزلية'}</span></div>
                  <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /><span>{new Date(followUp.followUpDate).toLocaleDateString('ar-SA')}</span></div>
                  <div className="flex items-center gap-2"><User className="h-4 w-4" /><span>{getServantNames(followUp.responsibleServantIds)}</span></div>
                </div>
              </div>
              <div><div className="mb-3"><div className="flex items-center gap-2 mb-2"><FileText className="h-4 w-4" /><span className="font-medium text-gray-800 dark:text-gray-200">ملاحظات:</span></div><p className="text-sm text-gray-600 dark:text-dark-subtext">{followUp.notes}</p></div></div>
              <div><div className="mb-3"><span className="font-medium text-gray-800 dark:text-gray-200">النتيجة:</span><p className="text-sm text-gray-600 dark:text-dark-subtext mt-1">{followUp.outcome}</p></div><div className="text-xs text-gray-400 dark:text-gray-500">تم إضافتها في {new Date(followUp.createdAt).toLocaleDateString('ar-SA')}</div></div>
            </div>
          </div>
        ))}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-dark-card rounded-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-dark-text">إضافة متابعة جديدة</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-subtext mb-1">العائلة</label>
                  <Combobox value={formData.familyId} onChange={(val) => setFormData({...formData, familyId: val})}>
                    <div className="relative">
                      <Combobox.Input onChange={(event) => setFamilyQuery(event.target.value)} displayValue={(familyId: number) => getFamilyName(familyId)} className="input-field" />
                      <Combobox.Options className="absolute z-10 w-full mt-1 bg-white dark:bg-dark-card shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                        {filteredFamilies?.map((family) => (
                          <Combobox.Option key={family.id} value={family.id} className={({ active }) => `cursor-default select-none relative py-2 pl-10 pr-4 ${active ? 'text-white bg-primary-600' : 'text-gray-900 dark:text-dark-text'}`}>
                            {`${family.husbandName} و ${family.wifeName}`}
                          </Combobox.Option>
                        ))}
                      </Combobox.Options>
                    </div>
                  </Combobox>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-dark-subtext mb-1">نوع المتابعة</label><select value={formData.method} onChange={(e) => setFormData({...formData, method: e.target.value as 'call' | 'home_visit'})} className="select-field" required><option value="call">اتصال هاتفي</option><option value="home_visit">زيارة منزلية</option></select></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-dark-subtext mb-1">تاريخ المتابعة</label><input type="date" value={formData.followUpDate} onChange={(e) => setFormData({...formData, followUpDate: e.target.value})} className="input-field" required /></div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-subtext mb-2">الخدام المسؤولون</label>
                <div className="grid grid-cols-2 gap-2 p-2 border dark:border-dark-border rounded-lg max-h-40 overflow-y-auto">
                  {servants?.map(servant => (
                    <div key={servant.id} className="flex items-center">
                      <input type="checkbox" id={`servant-${servant.id}`} checked={formData.responsibleServantIds.includes(servant.id!)} onChange={() => handleServantSelection(servant.id!)} className="ml-2" />
                      <label htmlFor={`servant-${servant.id}`}>{servant.name}</label>
                    </div>
                  ))}
                </div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-dark-subtext mb-1">الملاحظات</label><textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="textarea-field" rows={4} placeholder="اكتب ملاحظات حول المتابعة..." required /></div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-dark-subtext mb-1">النتيجة</label><input type="text" value={formData.outcome} onChange={(e) => setFormData({...formData, outcome: e.target.value})} className="input-field" placeholder="نتيجة المتابعة" required /></div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">إضافة المتابعة</button>
                <button type="button" onClick={() => { setShowAddForm(false); setFormData(initialFormState); }} className="btn-secondary flex-1">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
