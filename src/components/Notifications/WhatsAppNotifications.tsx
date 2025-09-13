import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { Family } from '@/types';
import { MessageSquare, Send, AlertTriangle } from 'lucide-react';

// Helper to determine if it's summer time in Egypt
const isSummerTime = (date: Date) => {
  const year = date.getFullYear();
  const lastFridayOfApril = new Date(year, 3, 30);
  lastFridayOfApril.setDate(30 - lastFridayOfApril.getDay() - (lastFridayOfApril.getDay() < 5 ? 2 : -5));
  
  const lastThursdayOfOctober = new Date(year, 9, 31);
  lastThursdayOfOctober.setDate(31 - lastThursdayOfOctober.getDay() - (lastThursdayOfOctober.getDay() < 4 ? 3 : -4));

  return date >= lastFridayOfApril && date <= lastThursdayOfOctober;
};

export default function WhatsAppNotifications() {
  const [meetingDate] = useState(new Date());
  const families = useLiveQuery(() => db.families.toArray());
  // In a real app, you'd filter absentees based on actual attendance records for the selected meeting
  const absentFamilies = families?.slice(0, 5) || []; 

  const meetingTime = isSummerTime(meetingDate) ? '7:00 مساءً' : '6:30 مساءً';
  const meetingDay = meetingDate.toLocaleDateString('ar-EG', { weekday: 'long' });

  const reminderMessage = `تذكير بميعاد الاجتماع العائلي اليوم (${meetingDay}) الساعة ${meetingTime}. حضوركم يضيف بهجة لليوم!`;
  const followUpMessage = `افتقدناكم في اجتماع اليوم! نأمل أن تكونوا بخير ونتطلع لرؤيتكم الأسبوع القادم.`;

  const generateWhatsAppLink = (phone: string, message: string) => {
    const internationalPhone = phone.startsWith('0') ? `2${phone}` : phone;
    return `https://wa.me/${internationalPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="p-6 font-arabic">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">إشعارات واتساب</h1>
        <p className="text-gray-600 dark:text-dark-subtext">إرسال تذكيرات ومتابعات عبر واتساب</p>
      </div>

      <div className="card bg-yellow-50 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-800 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-1" />
          <div>
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-300">ملاحظة هامة</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              هذه الميزة لا ترسل الرسائل تلقائياً. عند الضغط على زر "إرسال"، سيتم فتح تطبيق واتساب مع رسالة جاهزة، ويجب عليك الضغط على زر الإرسال داخل واتساب بنفسك.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Reminders */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-dark-text">تذكيرات ما قبل الاجتماع</h2>
          <p className="text-sm text-gray-600 dark:text-dark-subtext mb-4">
            إرسال رسالة تذكير لجميع العائلات بميعاد اجتماع اليوم.
          </p>
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
            <p className="text-sm font-medium">نص الرسالة:</p>
            <p className="text-xs text-gray-600 dark:text-dark-subtext">{reminderMessage}</p>
          </div>
          <div className="max-h-80 overflow-y-auto space-y-2 p-2 border dark:border-dark-border rounded-lg">
            {families?.map(family => (
              <div key={family.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-2 rounded-md">
                <span>{family.husbandName} و {family.wifeName}</span>
                <div className="flex gap-2">
                  {family.husbandPhone && (
                    <a href={generateWhatsAppLink(family.husbandPhone, reminderMessage)} target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs p-1">
                      <Send className="h-3 w-3" />
                    </a>
                  )}
                  {family.wifePhone && (
                    <a href={generateWhatsAppLink(family.wifePhone, reminderMessage)} target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs p-1">
                      <Send className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Follow-ups */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-dark-text">متابعة الغائبين</h2>
          <p className="text-sm text-gray-600 dark:text-dark-subtext mb-4">
            إرسال رسالة اطمئنان للعائلات التي لم تحضر اجتماع اليوم.
          </p>
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
            <p className="text-sm font-medium">نص الرسالة:</p>
            <p className="text-xs text-gray-600 dark:text-dark-subtext">{followUpMessage}</p>
          </div>
          <div className="max-h-80 overflow-y-auto space-y-2 p-2 border dark:border-dark-border rounded-lg">
            {absentFamilies.map(family => (
               <div key={family.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-2 rounded-md">
                <span>{family.husbandName} و {family.wifeName}</span>
                <div className="flex gap-2">
                  {family.husbandPhone && (
                    <a href={generateWhatsAppLink(family.husbandPhone, followUpMessage)} target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs p-1">
                      <Send className="h-3 w-3" />
                    </a>
                  )}
                  {family.wifePhone && (
                    <a href={generateWhatsAppLink(family.wifePhone, followUpMessage)} target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs p-1">
                      <Send className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
