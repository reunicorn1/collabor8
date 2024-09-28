import React, { useEffect, Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import useAuthRefresh from './hooks/useAuthRefresh';
import useLogOut from './hooks/useLogOut';
import ResetPasswordModal from '@components/Modals/ResetPassword';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from '@components/ProtectedRoute';
import ThemedLoader from '@utils/Spinner';
import TagManager from 'react-gtm-module';
import './App.css';

const Verify = lazy(() => import('@pages/Verify'));
const NotFound = lazy(() => import('@pages/404_page'));
const About = lazy(() => import('@pages/About'));
const Profile = lazy(() => import('@pages/Profile'));
const Editor = lazy(() => import('@pages/Editor'));
const Home = lazy(() => import('@pages/Home'));
const Dashboard = lazy(() => import('@pages/DashboardPage'));
const InviteGuest = lazy(() => import('@components/Invite'));

const App: React.FC = () => {
  useAuthRefresh();
  useLogOut();

  useEffect(() => {
    // Google Analytics Initialization
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', import.meta.env.VITE_GA_ID);
  }, []);

  return (
    <AuthProvider>
      <Suspense fallback={<ThemedLoader />}>
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
      </Suspense>
    </AuthProvider>
  );
};

export default App;
