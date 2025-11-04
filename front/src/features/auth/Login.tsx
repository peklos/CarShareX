import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { loginSchema, LoginFormData } from '../../utils/validators';
import { authApi, employeeAuthApi } from './authApi';
import { useAppDispatch } from '../../app/hooks';
import { loginStart, loginSuccess, loginFailure } from './authSlice';
import { ROUTES } from '../../utils/constants';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isEmployee, setIsEmployee] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    dispatch(loginStart());

    try {
      if (isEmployee) {
        // Admin login
        const response = await employeeAuthApi.login(data);
        dispatch(loginSuccess({
          user: response.employee,
          role: 'admin',
        }));
        toast.success(`Добро пожаловать, ${response.employee.first_name}!`);
        navigate(ROUTES.ADMIN_DASHBOARD);
      } else {
        // Client login
        const response = await authApi.login(data);
        dispatch(loginSuccess({
          user: response.user,
          role: 'client',
        }));
        toast.success(`Добро пожаловать, ${response.user.first_name}!`);
        navigate(ROUTES.VEHICLES);
      }
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Ошибка входа';
      dispatch(loginFailure(message));
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 via-primary-50 to-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        <div>
          <h2 className="mt-6 text-center text-4xl font-bold text-gradient">
            CarShareX
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-400">
            Каршеринг нового поколения
          </p>
        </div>

        <div className="bg-neutral-800 rounded-2xl shadow-xl p-8">
          {/* Toggle buttons */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setIsEmployee(false)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                !isEmployee
                  ? 'bg-primary-9000 text-white shadow-md'
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
              }`}
            >
              Клиент
            </button>
            <button
              type="button"
              onClick={() => setIsEmployee(true)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                isEmployee
                  ? 'bg-primary-9000 text-white shadow-md'
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
              }`}
            >
              Сотрудник
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              {...register('email')}
              type="email"
              label="Email"
              placeholder="your@email.com"
              error={errors.email?.message}
              icon={<EnvelopeIcon className="h-5 w-5 text-neutral-400" />}
            />

            <Input
              {...register('password')}
              type="password"
              label="Пароль"
              placeholder="••••••••"
              error={errors.password?.message}
              icon={<LockClosedIcon className="h-5 w-5 text-neutral-400" />}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={isLoading}
            >
              Войти
            </Button>
          </form>

          {!isEmployee && (
            <div className="mt-6 text-center">
              <p className="text-sm text-neutral-400">
                Нет аккаунта?{' '}
                <Link
                  to={ROUTES.REGISTER}
                  className="font-medium text-primary-500 hover:text-primary-600 transition-colors"
                >
                  Зарегистрироваться
                </Link>
              </p>
            </div>
          )}

          {/* Test credentials */}
          <div className="mt-6 p-4 bg-neutral-900 rounded-lg">
            <p className="text-xs font-semibold text-neutral-300 mb-2">Тестовые данные:</p>
            {!isEmployee ? (
              <div className="text-xs text-neutral-400 space-y-1">
                <p>Email: morozov@mail.ru</p>
                <p>Пароль: user123</p>
              </div>
            ) : (
              <div className="text-xs text-neutral-400 space-y-1">
                <p>Email: ivanov@carsharex.ru</p>
                <p>Пароль: admin123</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
