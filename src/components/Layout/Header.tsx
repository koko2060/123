import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth();

  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-dark-card shadow px-4 sm:px-6 py-4">
      <div className="flex justify-between items-center">
        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden -mr-3 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          onClick={onMenuClick}
        >
          <span className="sr-only">فتح القائمة</span>
          <Menu className="h-6 w-6" />
        </button>
        
        <div className="flex-1 flex justify-center md:justify-start">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text">
            أهلاً وسهلاً، {user?.name}
          </h2>
        </div>

        <div className="flex items-center space-x-4 space-x-reverse">
          <button className="text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-white">
            <span className="sr-only">عرض الإشعارات</span>
            <Bell className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
