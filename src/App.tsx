import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Login from '@/components/Login';
import Dashboard from '@/components/Dashboard';
import FamilyList from '@/components/Families/FamilyList';
import AttendanceMarking from '@/components/Attendance/AttendanceMarking';
import FamilyGroups from '@/components/Groups/FamilyGroups';
import MeetingManagement from '@/components/Meetings/MeetingManagement';
import FollowUps from '@/components/FollowUps/FollowUps';
import Reports from '@/components/Reports/Reports';
import ServantManagement from '@/components/Servants/ServantManagement';
import Settings from '@/components/Settings/Settings';
import UserManagement from '@/components/Settings/UserManagement';
import WhatsAppNotifications from '@/components/Notifications/WhatsAppNotifications';
import Sidebar from '@/components/Layout/Sidebar';
import Header from '@/components/Layout/Header';

function AppContent() {
  const { user, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-dark-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-dark-subtext font-arabic">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100 dark:bg-dark-bg font-arabic">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="md:pr-64 flex flex-col flex-1 w-0 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/families" element={<FamilyList />} />
            <Route path="/attendance" element={<AttendanceMarking />} />
            <Route path="/groups" element={<FamilyGroups />} />
            <Route path="/meetings" element={<MeetingManagement />} />
            <Route path="/follow-ups" element={<FollowUps />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/servants" element={<ServantManagement />} />
            <Route path="/notifications" element={<WhatsAppNotifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/users" element={<UserManagement />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
