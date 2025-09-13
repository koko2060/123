import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { Users, Calendar, TrendingUp, Phone } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const totalFamilies = useLiveQuery(() => db.families.count(), []) ?? 0;
  const meetings = useLiveQuery(() => db.meetings.orderBy('date').reverse().limit(1).toArray(), []);
  const followUpsCount = useLiveQuery(() => db.followUps.count(), []) ?? 0;

  const latestMeeting = meetings?.[0];
  const presentCount = latestMeeting?.totalAttendance ?? 0;
  const absentCount = totalFamilies > 0 ? totalFamilies - presentCount : 0;
  const attendanceRate = totalFamilies > 0 ? Math.round((presentCount / totalFamilies) * 100) : 0;

  const stats = [
    { name: 'إجمالي العائلات', value: String(totalFamilies), icon: Users, color: 'bg-blue-500' },
    { name: 'الحضور هذا الأسبوع', value: String(presentCount), icon: Calendar, color: 'bg-green-500' },
    { name: 'معدل الحضور', value: `${attendanceRate}%`, icon: TrendingUp, color: 'bg-purple-500' },
    { name: 'إجمالي المتابعات', value: String(followUpsCount), icon: Phone, color: 'bg-orange-500' },
  ];

  const weeklyData = useLiveQuery(async () => {
    const last5Meetings = await db.meetings.orderBy('date').reverse().limit(5).toArray();
    return last5Meetings.map(m => ({
      week: new Date(m.date).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' }),
      attendance: m.totalAttendance,
    })).reverse();
  }, []) ?? [];

  const attendanceData = presentCount + absentCount > 0 ? [
    { name: 'حاضر', value: presentCount, color: '#10B981' },
    { name: 'غائب', value: absentCount, color: '#EF4444' },
  ] : [];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">لوحة التحكم</h1>
        <p className="text-gray-600 dark:text-dark-subtext">نظرة عامة حية على حضور الاجتماعات العائلية</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="mr-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-dark-text">{stat.value}</p>
                <p className="text-sm text-gray-600 dark:text-dark-subtext">{stat.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Attendance Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">اتجاه الحضور لآخر 5 اجتماعات</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--tw-prose-invert-hr)" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip
                contentStyle={{ backgroundColor: '#2d3748', border: 'none', color: '#e2e8f0' }}
                itemStyle={{ color: '#e2e8f0' }}
                formatter={(value: number) => [value, 'الحضور']}
              />
              <Bar dataKey="attendance" fill="#3B82F6" name="الحضور" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Attendance Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">توزيع الحضور لآخر اجتماع</h3>
          <ResponsiveContainer width="100%" height={300}>
            {attendanceData.length > 0 ? (
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#2d3748', border: 'none', color: '#e2e8f0' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
              </PieChart>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">لا توجد بيانات حضور لعرضها</div>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
