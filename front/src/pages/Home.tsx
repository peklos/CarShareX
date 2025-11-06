import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BoltIcon,
  ClockIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import UserGuideModal from '../components/ui/UserGuideModal';
import { ROUTES } from '../utils/constants';
import { useAppSelector } from '../app/hooks';

const Home: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const features = [
    {
      icon: BoltIcon,
      title: 'Быстро',
      description: 'Бронируйте автомобиль за пару кликов',
    },
    {
      icon: ClockIcon,
      title: '24/7',
      description: 'Доступно круглосуточно без выходных',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Надежно',
      description: 'Все автомобили застрахованы и проверены',
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Выгодно',
      description: 'Гибкие тарифы для любых задач',
    },
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="text-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-neutral-50 mb-6">
            Каршеринг <span className="text-gradient">нового поколения</span>
          </h1>
          <p className="text-xl text-neutral-400 mb-8 max-w-2xl mx-auto">
            Более 40 автомобилей от эконома до премиума.
            Арендуйте на минуты, часы или сутки.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to={ROUTES.VEHICLES}>
              <Button variant="primary" size="lg">
                Посмотреть автомобили
              </Button>
            </Link>
            {isAuthenticated ? (
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsGuideOpen(true)}
              >
                <QuestionMarkCircleIcon className="h-5 w-5 mr-2 inline" />
                Справка по пользованию
              </Button>
            ) : (
              <Link to={ROUTES.REGISTER}>
                <Button variant="outline" size="lg">
                  Зарегистрироваться
                </Button>
              </Link>
            )}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-12">
          Почему выбирают нас
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card hover className="text-center h-full">
                <feature.icon className="h-12 w-12 text-primary-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-neutral-400">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section - only for non-authenticated users */}
      {!isAuthenticated && (
        <section className="bg-gradient-primary rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Готовы начать?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Зарегистрируйтесь сейчас и получите 500 ₽ на первую поездку
        </p>
          <Link to={ROUTES.REGISTER}>
            <Button variant="secondary" size="lg">
              Начать прямо сейчас
            </Button>
          </Link>
        </section>
      )}

      {/* User Guide Modal */}
      <UserGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
};

export default Home;
