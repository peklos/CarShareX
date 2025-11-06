import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  TruckIcon,
  CalendarIcon,
  UserIcon,
  CreditCardIcon,
  ArrowRightOnRectangleIcon,
  BanknotesIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { ROUTES } from '../utils/constants';
import Card from '../components/ui/Card';
import { useAppDispatch } from '../app/hooks';
import { logout } from '../features/auth/authSlice';
import { toast } from 'react-hot-toast';

interface SearchOption {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  keywords: string[];
}

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Вы вышли из системы');
    navigate(ROUTES.LOGIN);
  };

  const searchOptions: SearchOption[] = [
    {
      id: 'vehicles',
      title: 'Забронировать автомобиль',
      description: 'Посмотреть доступные автомобили и создать бронирование',
      icon: TruckIcon,
      action: () => navigate(ROUTES.VEHICLES),
      keywords: ['забронировать', 'автомобиль', 'машина', 'арендовать', 'взять', 'каршеринг', 'авто', 'транспорт'],
    },
    {
      id: 'bookings',
      title: 'Мои поездки',
      description: 'Просмотр активных и завершенных бронирований',
      icon: CalendarIcon,
      action: () => navigate(ROUTES.BOOKINGS),
      keywords: ['поездки', 'бронирования', 'аренда', 'мои', 'история', 'текущие', 'активные', 'завершенные'],
    },
    {
      id: 'profile',
      title: 'Мой профиль',
      description: 'Управление личными данными и настройками',
      icon: UserIcon,
      action: () => navigate(ROUTES.PROFILE),
      keywords: ['профиль', 'личные данные', 'настройки', 'аккаунт', 'информация', 'редактировать', 'изменить'],
    },
    {
      id: 'topup',
      title: 'Пополнить баланс',
      description: 'Добавить средства на ваш счет',
      icon: BanknotesIcon,
      action: () => navigate(ROUTES.PROFILE),
      keywords: ['пополнить', 'баланс', 'деньги', 'счет', 'оплата', 'внести', 'добавить', 'средства'],
    },
    {
      id: 'transactions',
      title: 'История транзакций',
      description: 'Просмотр всех операций по балансу',
      icon: CreditCardIcon,
      action: () => navigate(ROUTES.TRANSACTIONS),
      keywords: ['транзакции', 'история', 'операции', 'платежи', 'баланс', 'списания', 'пополнения'],
    },
    {
      id: 'logout',
      title: 'Выйти из аккаунта',
      description: 'Завершить текущую сессию',
      icon: ArrowRightOnRectangleIcon,
      action: handleLogout,
      keywords: ['выйти', 'выход', 'logout', 'завершить', 'сессия', 'разлогиниться'],
    },
  ];

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) {
      return searchOptions;
    }

    const query = searchQuery.toLowerCase().trim();
    return searchOptions.filter((option) => {
      // Поиск в заголовке
      if (option.title.toLowerCase().includes(query)) {
        return true;
      }
      // Поиск в описании
      if (option.description.toLowerCase().includes(query)) {
        return true;
      }
      // Поиск в ключевых словах
      return option.keywords.some((keyword) => keyword.toLowerCase().includes(query));
    });
  }, [searchQuery]);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-neutral-50 mb-2">
            Поиск по сайту
          </h1>
          <p className="text-neutral-400">
            Введите запрос, чтобы быстро найти нужный раздел
          </p>
        </motion.div>

        {/* Search Input */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Например: забронировать автомобиль, профиль, баланс..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-lg"
              autoFocus
            />
          </div>
        </motion.div>

        {/* Search Results */}
        <div className="space-y-3">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <button
                  onClick={option.action}
                  className="w-full text-left"
                >
                  <Card hover className="cursor-pointer group">
                    <div className="flex items-center space-x-4 p-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                          <option.icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-lg font-semibold text-neutral-100 mb-1">
                          {option.title}
                        </h3>
                        <p className="text-sm text-neutral-400">
                          {option.description}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <ChevronRightIcon className="h-5 w-5 text-neutral-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Card>
                </button>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="text-center py-12">
                <MagnifyingGlassIcon className="h-12 w-12 text-neutral-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-neutral-300 mb-2">
                  Ничего не найдено
                </h3>
                <p className="text-neutral-500">
                  Попробуйте изменить запрос или использовать другие ключевые слова
                </p>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Quick Tips */}
        {!searchQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="mt-8"
          >
            <Card className="bg-gradient-to-r from-primary-900/30 to-orange-900/30 border-primary-700/50">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-neutral-100 mb-3">
                  Подсказки для поиска:
                </h3>
                <ul className="space-y-2 text-neutral-300">
                  <li className="flex items-start">
                    <span className="text-primary-400 mr-2">•</span>
                    <span>Используйте простые слова: "авто", "баланс", "профиль"</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-400 mr-2">•</span>
                    <span>Можно искать по действию: "забронировать", "пополнить", "посмотреть"</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-400 mr-2">•</span>
                    <span>Не нужно вводить весь запрос целиком - достаточно части слова</span>
                  </li>
                </ul>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Search;
