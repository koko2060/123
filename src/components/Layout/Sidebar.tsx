import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Users, 
  Calendar, 
  BarChart3, 
  Phone,
  Building,
  ClipboardList,
  LogOut,
  X,
  Settings,
  UserCheck,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const navigation = [
  { name: 'لوحة التحكم', href: '/', icon: Home },
  { name: 'إدارة العائلات', href: '/families', icon: Users },
  { name: 'المجموعات العائلية', href: '/groups', icon: Building },
  { name: 'تسجيل الحضور', href: '/attendance', icon: ClipboardList },
  { name: 'الاجتماعات', href: '/meetings', icon: Calendar },
  { name: 'إدارة الخدام', href: '/servants', icon: UserCheck },
  { name: 'المتابعة والزيارات', href: '/follow-ups', icon: Phone },
  { name: 'إشعارات واتساب', href: '/notifications', icon: MessageSquare },
  { name: 'التقارير والإحصائيات', href: '/reports', icon: BarChart3 },
  { name: 'الإعدادات', href: '/settings', icon: Settings },
];

function SidebarContent() {
  const { user, logout } = useAuth();

  const getRoleName = (role: 'super-admin' | 'admin' | 'user') => {
    switch (role) {
      case 'super-admin': return 'مدير عام';
      case 'admin': return 'مدير';
      case 'user': return 'مستخدم';
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-primary-800 dark:bg-gray-900">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <Building className="h-8 w-8 text-primary-300 mr-3"/>
          <h1 className="text-white text-lg font-bold">نظام المتابعة</h1>
        </div>
        <nav className="mt-8 flex-1 px-2 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/'}
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-primary-900 dark:bg-gray-800 text-white'
                    : 'text-primary-100 dark:text-gray-300 hover:bg-primary-700 dark:hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              <item.icon className="ml-3 flex-shrink-0 h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="flex-shrink-0 flex border-t border-primary-700 dark:border-gray-700 p-4">
        <div className="flex items-center w-full">
          <div className="flex-1">
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs text-primary-200 dark:text-gray-400">{user ? getRoleName(user.role) : ''}</p>
          </div>
          <button
            onClick={logout}
            className="ml-3 text-primary-200 dark:text-gray-400 hover:text-white"
            title="تسجيل الخروج"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}


export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  return (
    <>
      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <SidebarContent />
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 flex z-40">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar panel */}
            <motion.div
              initial={{ x: '100%' }} // Start from right for RTL
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative flex-1 flex flex-col max-w-xs w-full bg-primary-800 dark:bg-gray-900"
            >
              <div className="absolute top-0 left-0 -ml-12 pt-2">
                <button
                  type="button"
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sr-only">إغلاق القائمة</span>
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
              <SidebarContent />
            </motion.div>
            
            <div className="flex-shrink-0 w-14" aria-hidden="true">
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
