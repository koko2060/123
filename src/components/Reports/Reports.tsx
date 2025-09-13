import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { Users, TrendingUp, Download, Filter, UserCheck, Phone } from 'lucide-react';

const attendanceByMonth = [ { month: 'يناير', present: 112, absent: 36 }, { month: 'فبراير', present: 108, absent: 40 }, { month: 'مارس', present: 118, absent: 30 }, { month: 'أبريل', present: 95, absent: 53 }, { month: 'مايو', present: 125, absent: 23 }, { month: 'يونيو', present: 119, absent: 29 }, ];
const attendanceByGroup = [ { name: 'مجموعة المتزوجين حديثاً', present: 35, absent: 8 }, { name: 'مجموعة الجيل الثاني', present: 42, absent: 15 }, { name: 'مجموعة الرواد', present: 35, absent: 13 }, ];
const followUpStats = [ { type: 'اتصالات هاتفية', count: 45, success: 38 }, { type: 'زيارات منزلية', count: 23, success: 21 }, { type: 'متابعات مؤجلة', count: 12, success: 0 }, ];
const weeklyTrend = [ { week: 'الأسبوع 1', attendance: 78 }, { week: 'الأسبوع 2', attendance: 73 }, { week: 'الأسبوع 3', attendance: 80 }, { week: 'الأسبوع 4', attendance: 64 }, { week: 'الأسبوع 5', attendance: 76 }, { week: 'الأسبوع 6', attendance: 82 }, ];
const servantActivity = [ { name: 'أبونا يوحنا', type: 'عظة الاجتماع', count: 4 }, { name: 'الخادم مايكل', type: 'فقرة أسئلة', count: 8 }, { name: 'أم يوسف', type: 'ندوة', count: 2 }, { name: 'الأنبا بيشوي', type: 'فقرة ترانيم', count: 6 }, ];

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState('attendance');
  const [dateRange, setDateRange] = useState({ start: '2025-01-01', end: '2025-01-31' });

  const exportReport = () => alert('سيتم تصدير التقرير إلى ملف PDF');

  const reportTypes = [
    { id: 'attendance', name: 'تقرير الحضور', icon: Users },
    { id: 'groups', name: 'تقرير المجموعات', icon: Users },
    { id: 'followups', name: 'تقرير المتابعة (الافتقاد)', icon: Phone },
    { id: 'servants', name: 'تقرير خدمة الخدام', icon: UserCheck },
    { id: 'trends', name: 'الاتجاهات الأسبوعية', icon: TrendingUp },
  ];

  return (
    <div className="p-6 font-arabic">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">التقارير والإحصائيات</h1>
        <p className="text-gray-600 dark:text-dark-subtext">تحليل بيانات الحضور والمتابعات</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h3 className="font-semibold text-gray-900 dark:text-dark-text mb-3">نوع التقرير</h3>
          <div className="space-y-2">{reportTypes.map((type) => (<button key={type.id} onClick={() => setSelectedReport(type.id)} className={`w-full text-right p-3 rounded-lg transition-colors ${selectedReport === type.id ? 'bg-primary-100 text-primary-700 border border-primary-300 dark:bg-primary-900/50 dark:text-primary-200 dark:border-primary-700' : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}><div className="flex items-center gap-3"><type.icon className="h-4 w-4" /><span>{type.name}</span></div></button>))}</div>
        </div>
        <div className="card">
          <h3 className="font-semibold text-gray-900 dark:text-dark-text mb-3">الفترة الزمنية</h3>
          <div className="space-y-3">
            <div><label className="block text-sm font-medium text-gray-700 dark:text-dark-subtext mb-1">من تاريخ</label><input type="date" value={dateRange.start} onChange={(e) => setDateRange({...dateRange, start: e.target.value})} className="input-field" /></div>
            <div><label className="block text-sm font-medium text-gray-700 dark:text-dark-subtext mb-1">إلى تاريخ</label><input type="date" value={dateRange.end} onChange={(e) => setDateRange({...dateRange, end: e.target.value})} className="input-field" /></div>
          </div>
        </div>
        <div className="card">
          <h3 className="font-semibold text-gray-900 dark:text-dark-text mb-3">إجراءات</h3>
          <div className="space-y-2">
            <button onClick={exportReport} className="btn-primary w-full flex items-center justify-center gap-2"><Download className="h-4 w-4" />تصدير التقرير</button>
            <button className="btn-secondary w-full flex items-center justify-center gap-2"><Filter className="h-4 w-4" />تطبيق فلتر متقدم</button>
          </div>
        </div>
      </div>

      {selectedReport === 'attendance' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card"><h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">الحضور الشهري</h3><ResponsiveContainer width="100%" height={300}><BarChart data={attendanceByMonth}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip formatter={(value, name) => [value, name === 'present' ? 'حاضر' : 'غائب']} /><Legend /><Bar dataKey="present" fill="#10B981" name="حاضر" /><Bar dataKey="absent" fill="#EF4444" name="غائب" /></BarChart></ResponsiveContainer></div>
            <div className="card"><h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">معدل الحضور</h3><ResponsiveContainer width="100%" height={300}><PieChart><Pie data={[{ name: 'حاضر', value: 112 }, { name: 'غائب', value: 36 }]} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} dataKey="value"><Cell fill="#10B981" /><Cell fill="#EF4444" /></Pie><Tooltip /></PieChart></ResponsiveContainer></div>
          </div>
        </div>
      )}

      {selectedReport === 'groups' && (
        <div className="card"><h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">الحضور حسب المجموعة</h3><ResponsiveContainer width="100%" height={400}><BarChart data={attendanceByGroup} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" /><YAxis dataKey="name" type="category" width={150} /><Tooltip formatter={(value, name) => [value, name === 'present' ? 'حاضر' : 'غائب']} /><Legend /><Bar dataKey="present" stackId="a" fill="#10B981" name="حاضر" /><Bar dataKey="absent" stackId="a" fill="#EF4444" name="غائب" /></BarChart></ResponsiveContainer></div>
      )}
      
      {selectedReport === 'followups' && (
        <div className="card"><h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">إحصائيات المتابعة (الافتقاد)</h3><ResponsiveContainer width="100%" height={400}><BarChart data={followUpStats}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="type" /><YAxis /><Tooltip /><Legend /><Bar dataKey="count" stackId="a" fill="#3B82F6" name="الإجمالي" /><Bar dataKey="success" stackId="a" fill="#10B981" name="الناجح" /></BarChart></ResponsiveContainer></div>
      )}

      {selectedReport === 'servants' && (
        <div className="card"><h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">نشاط الخدام في الاجتماعات</h3><ResponsiveContainer width="100%" height={400}><BarChart data={servantActivity} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" /><YAxis dataKey="name" type="category" width={120} /><Tooltip /><Legend /><Bar dataKey="count" name="عدد الفقرات" fill="#8B5CF6" /></BarChart></ResponsiveContainer></div>
      )}

      {selectedReport === 'trends' && (
        <div className="card"><h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">الاتجاه الأسبوعي لنسبة الحضور (%)</h3><ResponsiveContainer width="100%" height={400}><LineChart data={weeklyTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="week" /><YAxis /><Tooltip /><Line type="monotone" dataKey="attendance" name="نسبة الحضور" stroke="#3B82F6" strokeWidth={3} /></LineChart></ResponsiveContainer></div>
      )}
    </div>
  );
}
