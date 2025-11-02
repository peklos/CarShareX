import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  CreditCardIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchUserTransactions, createTransaction } from './transactionsSlice';
import { updateUser } from '../auth/authSlice';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import { formatCurrency } from '../../utils/helpers';

const Transactions: React.FC = () => {
  const dispatch = useAppDispatch();
  const { transactions, loading, error, createLoading } = useAppSelector(
    (state) => state.transactions
  );
  const { user } = useAppSelector((state) => state.auth);

  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');

  useEffect(() => {
    dispatch(fetchUserTransactions());
  }, [dispatch]);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Введите корректную сумму');
      return;
    }

    try {
      await dispatch(
        createTransaction({
          transaction_type: 'deposit',
          amount,
          description: 'Пополнение баланса',
        })
      ).unwrap();

      // Update user balance
      if (user && 'balance' in user) {
        dispatch(updateUser({ ...user, balance: user.balance + amount }));
      }

      toast.success('Баланс пополнен успешно!');
      setShowDepositModal(false);
      setDepositAmount('');
    } catch (error: any) {
      toast.error('Ошибка пополнения баланса');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowUpIcon className="h-5 w-5 text-green-500" />;
      case 'payment':
      case 'penalty':
        return <ArrowDownIcon className="h-5 w-5 text-red-500" />;
      default:
        return <CreditCardIcon className="h-5 w-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      deposit: 'Пополнение',
      payment: 'Оплата',
      penalty: 'Штраф',
    };
    return labels[type] || type;
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'deposit':
        return <Badge variant="green">Пополнение</Badge>;
      case 'payment':
        return <Badge variant="blue">Оплата</Badge>;
      case 'penalty':
        return <Badge variant="red">Штраф</Badge>;
      default:
        return <Badge variant="gray">{type}</Badge>;
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-20">
          <Spinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <CreditCardIcon className="h-8 w-8 text-primary-500" />
              <h1 className="text-3xl md:text-4xl font-bold text-gradient">
                Транзакции
              </h1>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowDepositModal(true)}
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Пополнить баланс
            </Button>
          </div>
          <p className="text-neutral-600">История операций с балансом</p>
        </motion.div>

        {/* Balance Card */}
        {user && 'balance' in user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-primary-500 to-orange-500">
              <div className="p-6 text-white">
                <p className="text-sm opacity-90 mb-1">Текущий баланс</p>
                <p className="text-4xl font-bold">{formatCurrency(user.balance)}</p>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Transactions count */}
        {!loading && transactions.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-neutral-600">
              Всего операций: <span className="font-semibold">{transactions.length}</span>
            </p>
          </div>
        )}

        {/* Transactions list */}
        {!loading && transactions.length > 0 && (
          <div className="space-y-3">
            {transactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {getTypeIcon(transaction.transaction_type)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-neutral-900">
                              {getTypeLabel(transaction.transaction_type)}
                            </h3>
                            {getTypeBadge(transaction.transaction_type)}
                          </div>
                          {transaction.description && (
                            <p className="text-sm text-neutral-600">
                              {transaction.description}
                            </p>
                          )}
                          <p className="text-xs text-neutral-500 mt-1">
                            {formatDateTime(transaction.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-xl font-bold ${
                            transaction.transaction_type === 'deposit'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {transaction.transaction_type === 'deposit' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && transactions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <CreditCardIcon className="h-24 w-24 text-neutral-300 mb-4" />
            <h3 className="text-xl font-semibold text-neutral-700 mb-2">
              У вас пока нет транзакций
            </h3>
            <p className="text-neutral-500 mb-6">
              Пополните баланс для начала работы с сервисом
            </p>
            <Button
              variant="primary"
              onClick={() => setShowDepositModal(true)}
            >
              Пополнить баланс
            </Button>
          </motion.div>
        )}

        {/* Deposit Modal */}
        {showDepositModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                  Пополнение баланса
                </h2>
                <form onSubmit={handleDeposit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Сумма пополнения
                    </label>
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      min="1"
                      step="0.01"
                      required
                      placeholder="1000"
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setShowDepositModal(false);
                        setDepositAmount('');
                      }}
                    >
                      Отмена
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      className="flex-1"
                      loading={createLoading}
                    >
                      Пополнить
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Transactions;
