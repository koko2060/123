import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun, Users, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const canManageUsers = user?.role === 'super-admin' || user?.role === 'admin';

  return (
    <div className="p-6 font-arabic">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">الإعدادات</h1>
        <p className="text-gray-600 dark:text-dark-subtext">إدارة تفضيلات التطبيق والمستخدمين</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Theme Settings */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            {theme === 'light' ? <Sun className="h-6 w-6 text-yellow-500" /> : <Moon className="h-6 w-6 text-blue-400" />}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">المظهر</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-dark-subtext mb-4">
            اختر بين المظهر الفاتح أو الداكن لواجهة التطبيق.
          </p>
          <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-lg p-2">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              الوضع الحالي: {theme === 'light' ? 'فاتح' : 'داكن'}
            </span>
            <button
              onClick={toggleTheme}
              className="btn-primary text-sm py-1 px-3"
            >
              تبديل المظهر
            </button>
          </div>
        </div>

        {/* User Management */}
        {canManageUsers && (
          <Link to="/settings/users" className="card hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-6 w-6 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">إدارة المستخدمين</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-dark-subtext">
              إضافة وتعديل صلاحيات المستخدمين في النظام.
            </p>
          </Link>
        )}

        {/* Permissions (placeholder) */}
        {user?.role === 'super-admin' && (
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">إدارة الصلاحيات</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-dark-subtext">
              تحديد الصلاحيات المتقدمة للأدوار المختلفة (قيد التطوير).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
