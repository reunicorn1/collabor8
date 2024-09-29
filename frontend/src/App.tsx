import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import useAuthRefresh from './hooks/useAuthRefresh';
import useLogOut from './hooks/useLogOut';
import ResetPasswordModal from '@components/Modals/ResetPassword';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from '@components/ProtectedRoute';
import ThemedLoader from '@utils/Spinner';
import './App.css';

const Verify = lazy(() => import('@pages/Verify'));
const NotFound = lazy(() => import('@pages/404_page'));
const About = lazy(() => import('@pages/About'));
const Profile = lazy(() => import('@pages/Profile'));
const Editor = lazy(() => import('@pages/Editor'));
const Home = lazy(() => import('@pages/Home'));
const Dashboard = lazy(() => import('@pages/DashboardPage'));
const InviteGuest = lazy(() => import('@components/Invite'));
const CookiePolicy = lazy(() => import('@pages/CookiePolicy'));

const App: React.FC = () => {
  useAuthRefresh();
  useLogOut();

  return (
    <AuthProvider>
      <Suspense fallback={<ThemedLoader />}>
        <Routes>
          <Route path="/mission" element={<About />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
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
      </Suspense>
    </AuthProvider>
  );
};

export default App;
