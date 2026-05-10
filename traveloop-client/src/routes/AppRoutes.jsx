import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import Overview from '../pages/dashboard/Overview';
import Trips from '../pages/dashboard/Trips';
import TripDetail from '../pages/dashboard/TripDetail';
import Profile from '../pages/dashboard/profile/Profile';
import Explore from '../pages/dashboard/Explore';
import CityDetail from '../pages/dashboard/CityDetail';
import Search from '../pages/dashboard/Search';
import Community from '../pages/dashboard/Community';
import PostDetail from '../pages/dashboard/PostDetail';
import Saved from '../pages/dashboard/Saved';
import Notifications from '../pages/dashboard/Notifications';
import AIChat from '../pages/dashboard/AIChat';
import Analytics from '../pages/dashboard/Analytics';
import AdminLayout from '../pages/admin/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminTrips from '../pages/admin/AdminTrips';
import SharedTrip from '../pages/SharedTrip';
import Landing from '../pages/Landing';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
    </div>;
  }

  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  return !user ? children : <Navigate to="/dashboard" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />
      <Route path="/forgot-password" element={
        <PublicRoute>
          <ForgotPassword />
        </PublicRoute>
      } />
      <Route path="/reset-password/:token" element={
        <PublicRoute>
          <ResetPassword />
        </PublicRoute>
      } />
      <Route path="/" element={<Landing />} />
      <Route path="/shared/:shareCode" element={<SharedTrip />} />
      <Route path="/dashboard" element={
        <PrivateRoute>
          <DashboardLayout />
        </PrivateRoute>
      }>
        <Route index element={<Overview />} />
        <Route path="trips" element={<Trips />} />
        <Route path="trips/:tripId" element={<TripDetail />} />
        <Route path="explore" element={<Explore />} />
        <Route path="explore/city/:cityId" element={<CityDetail />} />
        <Route path="search" element={<Search />} />
        <Route path="community" element={<Community />} />
        <Route path="community/:postId" element={<PostDetail />} />
        <Route path="saved" element={<Saved />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="ai" element={<AIChat />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="/admin" element={
        <PrivateRoute>
          <AdminLayout />
        </PrivateRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="trips" element={<AdminTrips />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
