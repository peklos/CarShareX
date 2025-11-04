import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { UserIcon, EnvelopeIcon, PhoneIcon, LockClosedIcon, IdentificationIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { registerSchema, RegisterFormData } from '../../utils/validators';
import { authApi } from './authApi';
import { ROUTES } from '../../utils/constants';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      // Remove confirmPassword before sending
      const { confirmPassword, ...userData } = data;
      await authApi.register(userData);

      toast.success('Регистрация успешна! Войдите в систему');
      navigate(ROUTES.LOGIN);
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Ошибка регистрации';
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
            Регистрация
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-400">
            Создайте аккаунт для доступа к каршерингу
          </p>
        </div>

        <div className="bg-neutral-800 rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                {...register('first_name')}
                label="Имя"
                placeholder="Иван"
                error={errors.first_name?.message}
                icon={<UserIcon className="h-5 w-5 text-neutral-400" />}
              />

              <Input
                {...register('last_name')}
                label="Фамилия"
                placeholder="Иванов"
                error={errors.last_name?.message}
                icon={<UserIcon className="h-5 w-5 text-neutral-400" />}
              />
            </div>

            <Input
              {...register('email')}
              type="email"
              label="Email"
              placeholder="your@email.com"
              error={errors.email?.message}
              icon={<EnvelopeIcon className="h-5 w-5 text-neutral-400" />}
            />

            <Input
              {...register('phone')}
              type="tel"
              label="Телефон"
              placeholder="+7 (999) 123-45-67"
              error={errors.phone?.message}
              icon={<PhoneIcon className="h-5 w-5 text-neutral-400" />}
            />

            <Input
              {...register('drivers_license')}
              label="Водительское удостоверение (опционально)"
              placeholder="77 12 345678"
              error={errors.drivers_license?.message}
              icon={<IdentificationIcon className="h-5 w-5 text-neutral-400" />}
            />

            <Input
              {...register('password')}
              type="password"
              label="Пароль"
              placeholder="••••••••"
              error={errors.password?.message}
              icon={<LockClosedIcon className="h-5 w-5 text-neutral-400" />}
            />

            <Input
              {...register('confirmPassword')}
              type="password"
              label="Подтвердите пароль"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              icon={<LockClosedIcon className="h-5 w-5 text-neutral-400" />}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={isLoading}
            >
              Зарегистрироваться
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-400">
              Уже есть аккаунт?{' '}
              <Link
                to={ROUTES.LOGIN}
                className="font-medium text-primary-500 hover:text-primary-600 transition-colors"
              >
                Войти
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
