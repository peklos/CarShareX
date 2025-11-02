import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRightOnRectangleIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';
import { ROUTES } from '../../utils/constants';
import { formatCurrency } from '../../utils/helpers';
import Button from '../ui/Button';
import { toast } from 'react-hot-toast';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, role } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Вы вышли из системы');
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-gradient">CarShareX</h1>
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                {role === 'client' && (
                  <>
                    <Link
                      to={ROUTES.VEHICLES}
                      className="text-neutral-700 hover:text-primary-500 transition-colors font-medium"
                    >
                      Автомобили
                    </Link>
                    <Link
                      to={ROUTES.BOOKINGS}
                      className="text-neutral-700 hover:text-primary-500 transition-colors font-medium"
                    >
                      Мои поездки
                    </Link>
                    <Link
                      to={ROUTES.PROFILE}
                      className="text-neutral-700 hover:text-primary-500 transition-colors font-medium"
                    >
                      Профиль
                    </Link>

                    {user && 'balance' in user && (
                      <div className="flex items-center space-x-2 px-4 py-2 bg-primary-50 rounded-lg">
                        <span className="text-sm font-medium text-neutral-600">Баланс:</span>
                        <span className="text-lg font-bold text-primary-600">
                          {formatCurrency(user.balance)}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {role === 'admin' && (
                  <>
                    <Link
                      to={ROUTES.ADMIN_DASHBOARD}
                      className="text-neutral-700 hover:text-primary-500 transition-colors font-medium"
                    >
                      Панель управления
                    </Link>
                  </>
                )}

                <div className="flex items-center space-x-2">
                  <UserCircleIcon className="h-6 w-6 text-neutral-600" />
                  <span className="text-sm font-medium text-neutral-700">
                    {user?.first_name || 'Пользователь'}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-neutral-700 hover:text-red-500 transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">Выйти</span>
                </button>
              </>
            ) : (
              <>
                <Link to={ROUTES.VEHICLES} className="text-neutral-700 hover:text-primary-500 transition-colors font-medium">
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
        </div>
      </nav>
    </header>
  );
};

export default Header;
