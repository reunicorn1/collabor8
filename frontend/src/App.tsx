import React from 'react';
import { Route, Routes } from 'react-router-dom';
import useAuthRefresh from './hooks/useAuthRefresh';
import useLogOut from './hooks/useLogOut';
import ResetPasswordModal from '@components/Modals/ResetPassword';
import {
  Verify,
  NotFound,
  About,
  Profile,
  Editor,
  Home,
  Dashboard,
} from '@pages/index';
import './App.css';
import InviteGuest from '@components/Invite';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from '@components/ProtectedRoute';

const App: React.FC = () => {
  useAuthRefresh();
  useLogOut();

  return (
    <AuthProvider>
      {' '}
      {/* Wrap the whole app with AuthProvider */}
      <Routes>
        <Route path="/mission" element={<About />} />
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<Dashboard />} />}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute element={<Profile />} />}
        />
        <Route
          path="/editor/:projectId"
          element={<ProtectedRoute element={<Editor />} />}
        />
        <Route path="/reset-password" element={<ResetPasswordModal />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/invite" element={<InviteGuest />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
