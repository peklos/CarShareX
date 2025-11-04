import React, { Fragment } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Transition, Disclosure } from '@headlessui/react';
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  TruckIcon,
  CalendarIcon,
  UserIcon,
  CreditCardIcon,
  ChartBarIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';
import { ROUTES } from '../../utils/constants';
import { formatCurrency, getInitials } from '../../utils/helpers';
import Button from '../ui/Button';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, role } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Вы вышли из системы');
    navigate(ROUTES.LOGIN);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const clientNavigation = [
    { name: 'Главная', href: ROUTES.HOME, icon: HomeIcon },
    { name: 'Автомобили', href: ROUTES.VEHICLES, icon: TruckIcon },
    { name: 'Мои поездки', href: ROUTES.BOOKINGS, icon: CalendarIcon },
    { name: 'Профиль', href: ROUTES.PROFILE, icon: UserIcon },
  ];

  const adminNavigation = [
    { name: 'Панель управления', href: ROUTES.ADMIN_DASHBOARD, icon: ChartBarIcon },
    { name: 'Пользователи', href: ROUTES.ADMIN_USERS, icon: UserGroupIcon },
    { name: 'Автомобили', href: ROUTES.ADMIN_VEHICLES, icon: TruckIcon },
    { name: 'Бронирования', href: ROUTES.ADMIN_BOOKINGS, icon: CalendarIcon },
    { name: 'Инциденты', href: ROUTES.ADMIN_INCIDENTS, icon: ExclamationTriangleIcon },
    { name: 'Тарифы', href: ROUTES.ADMIN_TARIFFS, icon: CurrencyDollarIcon },
    { name: 'Парковки', href: ROUTES.ADMIN_PARKING, icon: MapPinIcon },
    { name: 'Офисы', href: ROUTES.ADMIN_BRANCHES, icon: BuildingOfficeIcon },
    { name: 'Сотрудники', href: ROUTES.ADMIN_EMPLOYEES, icon: UserGroupIcon },
  ];

  const navigation = role === 'admin' ? adminNavigation : clientNavigation;

  return (
    <header className="bg-neutral-800 shadow-sm sticky top-0 z-50 border-b border-neutral-700">
      <Disclosure as="nav">
        {({ open }) => (
          <>
            <div className="container-custom">
              <div className="flex items-center justify-between h-16">
                {/* Logo */}
                <div className="flex items-center">
                  <Link to={ROUTES.HOME} className="flex items-center space-x-2">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <h1 className="text-2xl font-bold text-gradient">CarShareX</h1>
                    </motion.div>
                  </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex md:items-center md:space-x-4">
                  {isAuthenticated ? (
                    <>
                      {/* Navigation Links */}
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium transition-all ${
                            isActive(item.href)
                              ? 'bg-primary-900 text-primary-400'
                              : 'text-neutral-300 hover:bg-neutral-700 hover:text-primary-400'
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.name}</span>
                        </Link>
                      ))}

                      {/* Balance (for clients) */}
                      {role === 'client' && user && 'balance' in user && (
                        <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-900 to-orange-900 rounded-lg border border-primary-700">
                          <CreditCardIcon className="h-5 w-5 text-primary-400" />
                          <div className="flex flex-col">
                            <span className="text-xs text-neutral-400">Баланс</span>
                            <span className="text-sm font-bold text-primary-300">
                              {formatCurrency(user.balance)}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* User Menu */}
                      <Menu as="div" className="relative">
                        <Menu.Button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-neutral-700 transition-colors">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-primary text-white font-semibold text-sm">
                            {user && getInitials(user.first_name, user.last_name)}
                          </div>
                          <div className="hidden lg:block text-left">
                            <p className="text-sm font-medium text-neutral-200">
                              {user?.first_name || 'Пользователь'}
                            </p>
                            <p className="text-xs text-neutral-400">
                              {role === 'admin' ? 'Администратор' : 'Клиент'}
                            </p>
                          </div>
                        </Menu.Button>

                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-neutral-700 rounded-lg bg-neutral-800 shadow-lg ring-1 ring-neutral-700 focus:outline-none">
                            <div className="px-4 py-3">
                              <p className="text-sm font-medium text-neutral-100">
                                {user?.first_name} {user?.last_name}
                              </p>
                              <p className="text-sm text-neutral-400 truncate">
                                {user?.email}
                              </p>
                            </div>

                            <div className="py-1">
                              {role === 'client' && (
                                <>
                                  <Menu.Item>
                                    {({ active }) => (
                                      <Link
                                        to={ROUTES.PROFILE}
                                        className={`${
                                          active ? 'bg-neutral-700' : ''
                                        } flex items-center space-x-2 px-4 py-2 text-sm text-neutral-300`}
                                      >
                                        <UserIcon className="h-4 w-4" />
                                        <span>Мой профиль</span>
                                      </Link>
                                    )}
                                  </Menu.Item>
                                  <Menu.Item>
                                    {({ active }) => (
                                      <Link
                                        to={ROUTES.TRANSACTIONS}
                                        className={`${
                                          active ? 'bg-neutral-700' : ''
                                        } flex items-center space-x-2 px-4 py-2 text-sm text-neutral-300`}
                                      >
                                        <CreditCardIcon className="h-4 w-4" />
                                        <span>История транзакций</span>
                                      </Link>
                                    )}
                                  </Menu.Item>
                                </>
                              )}
                            </div>

                            <div className="py-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={handleLogout}
                                    className={`${
                                      active ? 'bg-red-900 text-red-300' : 'text-neutral-300'
                                    } flex items-center space-x-2 w-full px-4 py-2 text-sm text-left`}
                                  >
                                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                                    <span>Выйти</span>
                                  </button>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </>
                  ) : (
                    <>
                      <Link
                        to={ROUTES.VEHICLES}
                        className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                          isActive(ROUTES.VEHICLES)
                            ? 'text-primary-400'
                            : 'text-neutral-300 hover:text-primary-400'
                        }`}
                      >
                        Автомобили
                      </Link>
                      <Link to={ROUTES.LOGIN}>
                        <Button variant="outline" size="sm">
                          Войти
                        </Button>
                      </Link>
                      <Link to={ROUTES.REGISTER}>
                        <Button variant="primary" size="sm">
                          Регистрация
                        </Button>
                      </Link>
                    </>
                  )}
                </div>

                {/* Mobile menu button */}
                <div className="flex md:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-lg text-neutral-300 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
                    <span className="sr-only">Открыть меню</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            {/* Mobile menu */}
            <Transition
              enter="transition duration-200 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-100 ease-in"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Disclosure.Panel className="md:hidden border-t border-neutral-700">
                <div className="px-4 pt-2 pb-3 space-y-1">
                  {isAuthenticated ? (
                    <>
                      {/* User info */}
                      <div className="flex items-center space-x-3 px-3 py-3 bg-neutral-700 rounded-lg mb-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-primary text-white font-semibold">
                          {user && getInitials(user.first_name, user.last_name)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neutral-100">
                            {user?.first_name} {user?.last_name}
                          </p>
                          <p className="text-xs text-neutral-400">
                            {role === 'admin' ? 'Администратор' : 'Клиент'}
                          </p>
                        </div>
                      </div>

                      {/* Balance (mobile) */}
                      {role === 'client' && user && 'balance' in user && (
                        <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-primary-900 to-orange-900 rounded-lg border border-primary-700 mb-3">
                          <span className="text-sm font-medium text-neutral-300">Баланс:</span>
                          <span className="text-lg font-bold text-primary-300">
                            {formatCurrency(user.balance)}
                          </span>
                        </div>
                      )}

                      {/* Navigation links */}
                      {navigation.map((item) => (
                        <Disclosure.Button
                          key={item.name}
                          as={Link}
                          to={item.href}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                            isActive(item.href)
                              ? 'bg-primary-900 text-primary-400'
                              : 'text-neutral-300 hover:bg-neutral-700'
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.name}</span>
                        </Disclosure.Button>
                      ))}

                      {/* Additional links for client */}
                      {role === 'client' && (
                        <Disclosure.Button
                          as={Link}
                          to={ROUTES.TRANSACTIONS}
                          className="flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-neutral-300 hover:bg-neutral-700"
                        >
                          <CreditCardIcon className="h-5 w-5" />
                          <span>Транзакции</span>
                        </Disclosure.Button>
                      )}

                      {/* Logout button */}
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg font-medium text-red-400 hover:bg-red-900 transition-colors"
                      >
                        <ArrowRightOnRectangleIcon className="h-5 w-5" />
                        <span>Выйти</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Disclosure.Button
                        as={Link}
                        to={ROUTES.VEHICLES}
                        className="block px-3 py-2 rounded-lg font-medium text-neutral-300 hover:bg-neutral-700"
                      >
                        Автомобили
                      </Disclosure.Button>
                      <Disclosure.Button
                        as={Link}
                        to={ROUTES.LOGIN}
                        className="block px-3 py-2 rounded-lg font-medium text-neutral-300 hover:bg-neutral-700"
                      >
                        Войти
                      </Disclosure.Button>
                      <Disclosure.Button
                        as={Link}
                        to={ROUTES.REGISTER}
                        className="block px-3 py-2 rounded-lg font-medium text-primary-400 hover:bg-primary-900"
                      >
                        Регистрация
                      </Disclosure.Button>
                    </>
                  )}
                </div>
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
    </header>
  );
};

export default Header;
