import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Family, FamilyGroup, Child } from '@/types';

interface FamilyFormProps {
  onSubmit: (data: Family) => void;
  onCancel: () => void;
  initialData?: Family | null;
  groups: FamilyGroup[];
}

const FamilyForm: React.FC<FamilyFormProps> = ({ onSubmit, onCancel, initialData, groups }) => {
  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<Family>({
    defaultValues: initialData || {
      husbandName: '',
      wifeName: '',
      husbandPhone: '',
      wifePhone: '',
      homePhone: '',
      children: [],
      church: '',
      husbandSpiritualFather: '',
      wifeSpiritualFather: '',
      address: '',
      husbandOccupation: '',
      wifeOccupation: '',
      marriageDate: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'children',
  });

  const [assignedGroup, setAssignedGroup] = useState<string | null>(null);
  const marriageDate = watch('marriageDate');

  useEffect(() => {
    if (marriageDate && groups.length > 0) {
      const marriageTime = new Date(marriageDate).getTime();
      const foundGroup = groups.find(group => {
        const startTime = new Date(group.marriageDateRange.start).getTime();
        const endTime = new Date(group.marriageDateRange.end).getTime();
        return marriageTime >= startTime && marriageTime <= endTime;
      });
      setAssignedGroup(foundGroup ? foundGroup.name : 'لا تنتمي لمجموعة حالية');
      if (foundGroup) {
        setValue('groupId', String(foundGroup.id));
      }
    } else {
      setAssignedGroup(null);
    }
  }, [marriageDate, groups, setValue]);

  const handleFormSubmit = (data: Family) => {
    const finalData: Family = {
      ...initialData,
      ...data,
      id: initialData?.id,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      children: data.children.filter(child => child.name && child.name.trim() !== ''),
    };
    onSubmit(finalData);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-dark-card rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-dark-text">
          {initialData ? 'تعديل بيانات العائلة' : 'إضافة عائلة جديدة'}
        </h2>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" {...register('husbandName', { required: 'اسم الزوج مطلوب' })} placeholder="اسم الزوج" className="input-field" />
            <input type="text" {...register('wifeName', { required: 'اسم الزوجة مطلوب' })} placeholder="اسم الزوجة" className="input-field" />
            <input type="tel" {...register('husbandPhone')} placeholder="رقم موبايل الزوج" className="input-field" />
            <input type="tel" {...register('wifePhone')} placeholder="رقم موبايل الزوجة" className="input-field" />
            <input type="tel" {...register('homePhone')} placeholder="رقم تليفون المنزل" className="input-field" />
            <input type="text" {...register('husbandSpiritualFather')} placeholder="أب اعتراف الزوج" className="input-field" />
            <input type="text" {...register('wifeSpiritualFather')} placeholder="أب اعتراف الزوجة" className="input-field" />
            <input type="text" {...register('husbandOccupation')} placeholder="وظيفة الزوج" className="input-field" />
            <input type="text" {...register('wifeOccupation')} placeholder="وظيفة الزوجة" className="input-field" />
            <input type="text" {...register('church', { required: 'الكنيسة مطلوبة' })} placeholder="الكنيسة" className="input-field" />
            <input type="date" {...register('marriageDate', { required: 'تاريخ الزواج مطلوب' })} className="input-field" />
          </div>

          {assignedGroup && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/50 rounded-lg text-center">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-200">المجموعة المقترحة: {assignedGroup}</span>
            </div>
          )}

          <input type="text" {...register('address')} placeholder="العنوان" className="input-field" />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-subtext mb-2">الأبناء</label>
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3 p-3 border dark:border-dark-border rounded-lg">
                <input {...register(`children.${index}.name`)} placeholder={`اسم الابن/الابنة`} className="input-field" />
                <input type="date" {...register(`children.${index}.birthDate`)} className="input-field" title="تاريخ الميلاد" />
                <input {...register(`children.${index}.schoolGrade`)} placeholder="المرحلة الدراسية" className="input-field" />
                <input {...register(`children.${index}.notes`)} placeholder="ملاحظات" className="input-field" />
                <button type="button" onClick={() => remove(index)} className="btn-danger px-3 py-2 text-xs md:col-start-4">حذف</button>
              </div>
            ))}
            <button type="button" onClick={() => append({ id: `child-${Date.now()}`, name: '' })} className="btn-secondary text-xs">إضافة ابن/ابنة</button>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              {initialData ? 'حفظ التعديلات' : 'إضافة العائلة'}
            </button>
            <button type="button" onClick={onCancel} className="btn-secondary flex-1">
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FamilyForm;
