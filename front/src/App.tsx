import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Layout from './components/layout/Layout';
import ProtectedRoute from './features/auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Vehicles from './features/vehicles/Vehicles';
import VehicleDetail from './features/vehicles/VehicleDetail';
import Bookings from './features/bookings/Bookings';
import Transactions from './features/transactions/Transactions';
import Profile from './features/profile/Profile';
import AdminDashboard from './features/admin/AdminDashboard';
import AdminUsers from './features/admin/AdminUsers';
import AdminVehicles from './features/admin/AdminVehicles';
import AdminBookings from './features/admin/AdminBookings';
import AdminIncidents from './features/admin/AdminIncidents';
import AdminEmployees from './features/admin/AdminEmployees';
import AdminTariffs from './features/admin/AdminTariffs';
import AdminParking from './features/admin/AdminParking';
import AdminBranches from './features/admin/AdminBranches';

import { ROUTES } from './utils/constants';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#292524',
            color: '#fafaf9',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
            border: '1px solid #44403c',
          },
          success: {
            iconTheme: {
              primary: '#f97316',
              secondary: '#292524',
            },
          },
        }}
      />

      <Routes>
        {/* Public routes without layout */}
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />

        {/* Public routes with layout */}
        <Route
          path={ROUTES.HOME}
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />

        {/* Vehicles catalog */}
        <Route path={ROUTES.VEHICLES} element={<Vehicles />} />
        <Route path="/vehicles/:id" element={<VehicleDetail />} />

        {/* Protected client routes */}
        <Route
          path={ROUTES.PROFILE}
          element={
            <ProtectedRoute requireRole="client">
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.BOOKINGS}
          element={
            <ProtectedRoute requireRole="client">
              <Bookings />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.TRANSACTIONS}
          element={
            <ProtectedRoute requireRole="client">
              <Transactions />
            </ProtectedRoute>
          }
        />

        {/* Protected admin routes */}
        <Route
          path={ROUTES.ADMIN_DASHBOARD}
          element={
            <ProtectedRoute requireRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.ADMIN_USERS}
          element={
            <ProtectedRoute requireRole="admin">
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.ADMIN_VEHICLES}
          element={
            <ProtectedRoute requireRole="admin">
              <AdminVehicles />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.ADMIN_BOOKINGS}
          element={
            <ProtectedRoute requireRole="admin">
              <AdminBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.ADMIN_INCIDENTS}
          element={
            <ProtectedRoute requireRole="admin">
              <AdminIncidents />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.ADMIN_EMPLOYEES}
          element={
            <ProtectedRoute requireRole="admin">
              <AdminEmployees />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.ADMIN_TARIFFS}
          element={
            <ProtectedRoute requireRole="admin">
              <AdminTariffs />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.ADMIN_PARKING}
          element={
            <ProtectedRoute requireRole="admin">
              <AdminParking />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.ADMIN_BRANCHES}
          element={
            <ProtectedRoute requireRole="admin">
              <AdminBranches />
            </ProtectedRoute>
          }
        />

        {/* Redirect /admin to dashboard */}
        <Route path={ROUTES.ADMIN} element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />} />

        {/* 404 */}
        <Route
          path="*"
          element={
            <Layout>
              <div className="text-center py-20">
                <h2 className="text-4xl font-bold mb-4">404</h2>
                <p className="text-neutral-400">Страница не найдена</p>
              </div>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
