import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  XMarkIcon,
  TruckIcon,
  CalendarIcon,
  CreditCardIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-neutral-800 p-6 text-left align-middle shadow-xl transition-all border border-neutral-700">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-bold text-gradient"
                  >
                    Справка по пользованию CarShareX
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                  {/* Introduction */}
                  <div className="bg-gradient-primary rounded-xl p-4 text-white">
                    <p className="text-lg">
                      Добро пожаловать в CarShareX! Эта инструкция поможет вам быстро разобраться с основными функциями сервиса каршеринга.
                    </p>
                  </div>

                  {/* Step 1: View Vehicles */}
                  <div className="bg-neutral-700 rounded-xl p-5">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <TruckIcon className="h-8 w-8 text-primary-400" />
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-neutral-100 mb-2">
                          1. Просмотр доступных автомобилей
                        </h4>
                        <p className="text-neutral-300 mb-3">
                          Перейдите в раздел <span className="font-bold text-primary-400">"Автомобили"</span> в верхнем меню. Там вы найдете все доступные машины.
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-neutral-300 ml-4">
                          <li>Используйте фильтры, чтобы найти подходящий автомобиль</li>
                          <li>Нажмите на карточку машины, чтобы увидеть подробную информацию</li>
                          <li>Посмотрите фотографии, характеристики и цены</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Book Vehicle */}
                  <div className="bg-neutral-700 rounded-xl p-5">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <CalendarIcon className="h-8 w-8 text-primary-400" />
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-neutral-100 mb-2">
                          2. Как забронировать автомобиль
                        </h4>
                        <p className="text-neutral-300 mb-3">
                          Бронирование машины — это просто!
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-neutral-300 ml-4">
                          <li>На странице автомобиля нажмите кнопку <span className="font-bold text-primary-400">"Забронировать"</span></li>
                          <li>Выберите дату и время начала аренды</li>
                          <li>Выберите дату и время окончания аренды</li>
                          <li>Проверьте итоговую стоимость</li>
                          <li>Нажмите <span className="font-bold text-primary-400">"Подтвердить бронирование"</span></li>
                          <li>Деньги спишутся с вашего баланса автоматически</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: My Bookings */}
                  <div className="bg-neutral-700 rounded-xl p-5">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <CheckCircleIcon className="h-8 w-8 text-primary-400" />
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-neutral-100 mb-2">
                          3. Где смотреть свои бронирования
                        </h4>
                        <p className="text-neutral-300 mb-3">
                          Все ваши бронирования находятся в разделе <span className="font-bold text-primary-400">"Мои поездки"</span> в верхнем меню.
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-neutral-300 ml-4">
                          <li>Здесь вы увидите активные бронирования</li>
                          <li>Также здесь отображается история завершенных поездок</li>
                          <li>Можно отменить бронирование (если оно еще не началось)</li>
                          <li>Для активных поездок доступны кнопки "Начать поездку" и "Завершить поездку"</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Step 4: Balance */}
                  <div className="bg-neutral-700 rounded-xl p-5">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <CreditCardIcon className="h-8 w-8 text-primary-400" />
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-neutral-100 mb-2">
                          4. Как пополнить и проверить баланс
                        </h4>
                        <p className="text-neutral-300 mb-3">
                          Ваш баланс всегда отображается в правом верхнем углу экрана (рядом с вашим именем).
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-neutral-300 ml-4">
                          <li>Чтобы пополнить баланс, перейдите в раздел <span className="font-bold text-primary-400">"Профиль"</span></li>
                          <li>Нажмите кнопку <span className="font-bold text-primary-400">"Пополнить баланс"</span></li>
                          <li>Введите сумму пополнения</li>
                          <li>Выберите способ оплаты и подтвердите</li>
                          <li>Деньги сразу зачислятся на ваш счет</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Step 5: Profile */}
                  <div className="bg-neutral-700 rounded-xl p-5">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <UserIcon className="h-8 w-8 text-primary-400" />
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-neutral-100 mb-2">
                          5. Управление профилем
                        </h4>
                        <p className="text-neutral-300 mb-3">
                          В разделе <span className="font-bold text-primary-400">"Профиль"</span> вы можете:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-neutral-300 ml-4">
                          <li>Просмотреть и изменить личные данные</li>
                          <li>Загрузить водительское удостоверение</li>
                          <li>Посмотреть текущий баланс</li>
                          <li>Пополнить баланс</li>
                          <li>Посмотреть статистику поездок</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Step 6: Transactions */}
                  <div className="bg-neutral-700 rounded-xl p-5">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <ClockIcon className="h-8 w-8 text-primary-400" />
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-neutral-100 mb-2">
                          6. История транзакций
                        </h4>
                        <p className="text-neutral-300 mb-3">
                          Чтобы посмотреть все операции по балансу:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-neutral-300 ml-4">
                          <li>Нажмите на свой аватар в правом верхнем углу</li>
                          <li>Выберите <span className="font-bold text-primary-400">"История транзакций"</span></li>
                          <li>Здесь отображаются все пополнения и списания</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="bg-gradient-to-r from-primary-900 to-orange-900 rounded-xl p-5 border border-primary-700">
                    <h4 className="text-xl font-semibold text-white mb-3">
                      Полезные советы
                    </h4>
                    <ul className="space-y-2 text-neutral-100">
                      <li className="flex items-start">
                        <span className="text-primary-300 mr-2">•</span>
                        <span>Всегда проверяйте состояние автомобиля перед началом поездки</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary-300 mr-2">•</span>
                        <span>Следите за уровнем топлива — штрафы за низкий уровень могут быть высокими</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary-300 mr-2">•</span>
                        <span>Заканчивайте поездку только на официальных парковках</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary-300 mr-2">•</span>
                        <span>Держите баланс положительным, чтобы избежать блокировки аккаунта</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-gradient-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    Понятно, спасибо!
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default UserGuideModal;
