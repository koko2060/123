import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/types';
import { Edit, Shield, Trash2, Image as ImageIcon } from 'lucide-react';

const mockUsersList: User[] = [
  { id: 0, username: 'superadmin', role: 'super-admin', name: 'المدير العام', email: 'superadmin@church.com' },
  { id: 1, username: 'admin', role: 'admin', name: 'مدير النظام', email: 'admin@church.com' },
  { id: 2, username: 'servant', role: 'user', name: 'خادم الكنيسة', email: 'servant@church.com' },
  { id: 3, username: 'servant2', role: 'user', name: 'خادم آخر', email: 'servant2@church.com' },
];

const roleNames = {
  'super-admin': 'مدير عام',
  'admin': 'مدير',
  'user': 'مستخدم',
};

export default function UserManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>(mockUsersList);
  const [loginBg, setLoginBg] = useState(localStorage.getItem('loginBgImage') || '');

  const handleRoleChange = (userId: number, newRole: User['role']) => {
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  const handleBgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setLoginBg(url);
    localStorage.setItem('loginBgImage', url);
  };

  const canEditUser = (targetUser: User) => {
    if (!currentUser) return false;
    if (currentUser.role === 'super-admin') return true;
    if (currentUser.role === 'admin' && targetUser.role === 'user') return true;
    return false;
  };

  return (
    <div className="p-6 font-arabic">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">إدارة المستخدمين</h1>
        <p className="text-gray-600 dark:text-dark-subtext">تعديل أدوار وصلاحيات المستخدمين</p>
      </div>

      {currentUser?.role === 'super-admin' && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-3">تخصيص شاشة الدخول</h3>
          <div className="flex items-center gap-4">
            <ImageIcon className="h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="أدخل رابط صورة الخلفية..."
              value={loginBg}
              onChange={handleBgChange}
              className="input-field flex-grow"
            />
          </div>
          {loginBg && <img src={loginBg} alt="معاينة الخلفية" className="mt-4 rounded-lg max-h-32 object-cover w-full" />}
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-border">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">المستخدم</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">الدور</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-dark-border">
              {users.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900 dark:text-dark-text">{user.name}</div>
                    <div className="text-sm text-gray-500 dark:text-dark-subtext">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {canEditUser(user) && user.id !== undefined ? (
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id!, e.target.value as User['role'])}
                        className="select-field text-sm"
                        disabled={!canEditUser(user)}
                      >
                        {currentUser?.role === 'super-admin' && <option value="super-admin">مدير عام</option>}
                        {(currentUser?.role === 'super-admin' || currentUser?.role === 'admin') && <option value="admin">مدير</option>}
                        <option value="user">مستخدم</option>
                      </select>
                    ) : (
                      <span className="badge badge-info">{roleNames[user.role]}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {canEditUser(user) && user.id !== currentUser?.id ? (
                      <div className="flex gap-4">
                        <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"><Edit className="h-4 w-4" /> تعديل</button>
                        <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1"><Trash2 className="h-4 w-4" /> حذف</button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-400">
                        <Shield className="h-4 w-4" />
                        <span>لا يمكن التعديل</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
