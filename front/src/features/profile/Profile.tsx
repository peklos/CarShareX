import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  IdentificationIcon,
  CreditCardIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { updateUser } from '../auth/authSlice';
import { profileApi, UpdateProfileData } from './profileApi';
import { profileUpdateSchema, ProfileUpdateFormData } from '../../utils/validators';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { formatCurrency } from '../../utils/helpers';
import { User } from '../../types';

// Type guard to check if user is a User (not Employee)
const isUser = (user: any): user is User => {
  return user && 'phone' in user;
};

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('1000');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      phone: (user && isUser(user)) ? user.phone : '',
      drivers_license: (user && isUser(user)) ? user.drivers_license : '',
    },
  });

  useEffect(() => {
    if (user && isUser(user)) {
      reset({
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        drivers_license: user.drivers_license || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileUpdateFormData) => {
    setLoading(true);

    try {
      const updateData: UpdateProfileData = {
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        drivers_license: data.drivers_license || undefined,
      };

      const updatedUser = await profileApi.updateProfile(updateData);
      dispatch(updateUser(updatedUser));

      toast.success('Профиль обновлен успешно!');
      setIsEditing(false);
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Ошибка обновления профиля';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user && isUser(user)) {
      reset({
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        drivers_license: user.drivers_license || '',
      });
    }
    setIsEditing(false);
  };

  const handleTopUp = async () => {
    const amount = parseFloat(topUpAmount);

    if (isNaN(amount) || amount <= 0) {
      toast.error('Введите корректную сумму');
      return;
    }

    setLoading(true);
    try {
      const updatedUser = await profileApi.topUpBalance(amount);
      dispatch(updateUser(updatedUser));
      toast.success(`Баланс пополнен на ${amount.toFixed(2)} ₽`);
      setShowTopUp(false);
      setTopUpAmount('1000');
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Ошибка пополнения баланса';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !isUser(user)) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p className="text-neutral-400">Профиль доступен только для клиентов</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <UserIcon className="h-8 w-8 text-primary-500" />
              <h1 className="text-3xl md:text-4xl font-bold text-gradient">
                Мой профиль
              </h1>
            </div>
            {!isEditing && (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                <PencilIcon className="h-5 w-5 mr-2" />
                Редактировать
              </Button>
            )}
          </div>
          <p className="text-neutral-400">Управление личной информацией</p>
        </motion.div>

        {/* Balance Card */}
        {'balance' in user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="bg-gradient-to-r from-primary-500 to-orange-500">
              <div className="p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <CreditCardIcon className="h-6 w-6" />
                    <p className="text-sm opacity-90">Текущий баланс</p>
                  </div>
                  <button
                    onClick={() => setShowTopUp(true)}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
                  >
                    Пополнить
                  </button>
                </div>
                <p className="text-4xl font-bold">{formatCurrency(user.balance)}</p>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Profile Form/Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <div className="p-6">
              {isEditing ? (
                /* Edit Mode */
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    {...register('phone')}
                    type="tel"
                    label="Телефон"
                    placeholder="+7 (999) 123-45-67"
                    error={errors.phone?.message}
                    icon={<PhoneIcon className="h-5 w-5 text-neutral-400" />}
                  />

                  <Input
                    {...register('drivers_license')}
                    type="text"
                    label="Водительское удостоверение (опционально)"
                    placeholder="77 12 345678"
                    maxLength={12}
                    pattern="[0-9\s]*"
                    onKeyPress={(e) => {
                      if (!/[0-9\s]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    error={errors.drivers_license?.message}
                    icon={<IdentificationIcon className="h-5 w-5 text-neutral-400" />}
                  />

                  <div className="flex space-x-3 pt-4">
                    <Button
                      type="submit"
                      variant="primary"
                      loading={loading}
                      className="flex-1"
                    >
                      <CheckIcon className="h-5 w-5 mr-2" />
                      Сохранить
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={loading}
                      className="flex-1"
                    >
                      <XMarkIcon className="h-5 w-5 mr-2" />
                      Отмена
                    </Button>
                  </div>
                </form>
              ) : (
                /* View Mode */
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-1">
                        Имя
                      </label>
                      <div className="flex items-center space-x-2">
                        <UserIcon className="h-5 w-5 text-neutral-400" />
                        <p className="text-lg font-medium text-neutral-50">
                          {user.first_name}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-400 mb-1">
                        Фамилия
                      </label>
                      <div className="flex items-center space-x-2">
                        <UserIcon className="h-5 w-5 text-neutral-400" />
                        <p className="text-lg font-medium text-neutral-50">
                          {user.last_name}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1">
                      Email
                    </label>
                    <div className="flex items-center space-x-2">
                      <EnvelopeIcon className="h-5 w-5 text-neutral-400" />
                      <p className="text-lg font-medium text-neutral-50">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1">
                      Телефон
                    </label>
                    <div className="flex items-center space-x-2">
                      <PhoneIcon className="h-5 w-5 text-neutral-400" />
                      <p className="text-lg font-medium text-neutral-50">
                        {user.phone}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1">
                      Водительское удостоверение
                    </label>
                    <div className="flex items-center space-x-2">
                      <IdentificationIcon className="h-5 w-5 text-neutral-400" />
                      <p className="text-lg font-medium text-neutral-50">
                        {user.drivers_license || 'Не указано'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Top Up Modal */}
        {showTopUp && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-neutral-900 rounded-xl p-6 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold text-neutral-50 mb-4">
                Пополнение баланса
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Сумма пополнения (₽)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-800 text-neutral-50 border border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="1000"
                  />
                </div>
                <div className="flex space-x-2">
                  {[500, 1000, 2500, 5000].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setTopUpAmount(amount.toString())}
                      className="flex-1 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-50 rounded-lg text-sm transition-colors"
                    >
                      {amount} ₽
                    </button>
                  ))}
                </div>
                <div className="flex space-x-3 pt-4">
                  <Button
                    variant="primary"
                    onClick={handleTopUp}
                    loading={loading}
                    className="flex-1"
                  >
                    Пополнить
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowTopUp(false)}
                    disabled={loading}
                    className="flex-1"
                  >
                    Отмена
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Profile;
