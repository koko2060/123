import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { Plus, Search, Download, Upload, Edit, Trash2 } from 'lucide-react';
import { Family } from '@/types';
import FamilyForm from './FamilyForm';

export default function FamilyList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingFamily, setEditingFamily] = useState<Family | null>(null);

  const families = useLiveQuery(() => 
    db.families.filter(family => 
      family.husbandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      family.wifeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      family.church.toLowerCase().includes(searchTerm.toLowerCase())
    ).reverse().toArray(), 
  [searchTerm]);

  const groups = useLiveQuery(() => db.groups.toArray(), []);

  const handleExportExcel = () => alert('سيتم تصدير البيانات إلى ملف Excel');
  const handleImportExcel = () => alert('سيتم استيراد البيانات من ملف Excel');

  const handleAddClick = () => {
    setEditingFamily(null);
    setShowForm(true);
  };

  const handleEditClick = (family: Family) => {
    setEditingFamily(family);
    setShowForm(true);
  };

  const handleDeleteClick = async (familyId?: number) => {
    if (familyId && confirm('هل أنت متأكد من حذف هذه العائلة؟')) {
      await db.families.delete(familyId);
    }
  };

  const handleFormSubmit = async (data: Family) => {
    if (data.id) {
      await db.families.update(data.id, data);
    } else {
      await db.families.add(data);
    }
    setShowForm(false);
    setEditingFamily(null);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">إدارة العائلات</h1>
        <p className="text-gray-600 dark:text-dark-subtext">إدارة بيانات العائلات المشاركة في الاجتماعات</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button onClick={handleAddClick} className="btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" />
            إضافة عائلة جديدة
          </button>
          <button onClick={handleImportExcel} className="btn-secondary flex items-center gap-2">
            <Upload className="h-4 w-4" />
            استيراد من Excel
          </button>
          <button onClick={handleExportExcel} className="btn-secondary flex items-center gap-2">
            <Download className="h-4 w-4" />
            تصدير إلى Excel
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="البحث في العائلات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pr-10"
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-border">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">اسم الزوج</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">اسم الزوجة</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">عدد الأطفال</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">الكنيسة</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">تاريخ الزواج</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-card divide-y dark:divide-dark-border divide-gray-200">
              {families?.map((family) => (
                <tr key={family.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text">{family.husbandName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-subtext">{family.wifeName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-subtext">{family.children.length}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-subtext">{family.church}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-subtext">{new Date(family.marriageDate).toLocaleDateString('ar-SA')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2 space-x-reverse">
                      <button onClick={() => handleEditClick(family)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDeleteClick(family.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <FamilyForm
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
          initialData={editingFamily}
          groups={groups || []}
        />
      )}
    </div>
  );
}
