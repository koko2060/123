import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { Building } from 'lucide-react';

interface LoginForm {
  username: string;
  password: string;
}

export default function Login() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [bgImage, setBgImage] = useState('');

  useEffect(() => {
    const savedBg = localStorage.getItem('loginBgImage');
    if (savedBg) {
      setBgImage(savedBg);
    }
  }, []);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError('');
    
    const success = await login(data.username, data.password);
    
    if (!success) {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
    
    setIsLoading(false);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className={`max-w-md w-full space-y-8 p-10 rounded-xl ${bgImage ? 'bg-black bg-opacity-60' : 'bg-white'}`}>
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-100">
            <Building className="h-8 w-8 text-primary-600" />
          </div>
          <h2 className={`mt-6 text-center text-3xl font-bold ${bgImage ? 'text-white' : 'text-gray-900'}`}>
            تسجيل الدخول
          </h2>
          <p className={`mt-2 text-center text-sm ${bgImage ? 'text-gray-300' : 'text-gray-600'}`}>
            نظام متابعة حضور الاجتماعات العائلية
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className={`block text-sm font-medium ${bgImage ? 'text-gray-200' : 'text-gray-700'}`}>
                اسم المستخدم
              </label>
              <input
                {...register('username', { required: 'اسم المستخدم مطلوب' })}
                type="text"
                className="input-field mt-1"
                placeholder="أدخل اسم المستخدم"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-400">{errors.username.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className={`block text-sm font-medium ${bgImage ? 'text-gray-200' : 'text-gray-700'}`}>
                كلمة المرور
              </label>
              <input
                {...register('password', { required: 'كلمة المرور مطلوبة' })}
                type="password"
                className="input-field mt-1"
                placeholder="أدخل كلمة المرور"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary"
            >
              {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>
          </div>
          
          <div className={`text-sm text-center ${bgImage ? 'text-gray-300' : 'text-gray-600'}`}>
            <p>حسابات تجريبية:</p>
            <p><strong>مدير عام:</strong> superadmin / superadmin123</p>
            <p><strong>مدير:</strong> admin / admin123</p>
            <p><strong>مستخدم:</strong> servant / servant123</p>
          </div>
        </form>
      </div>
    </div>
  );
}
