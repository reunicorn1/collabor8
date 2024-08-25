import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import DashboardPage from './pages/DashboardPage';
import Editor from './pages/Editor';
import Login from './components/Login';
import Profile from './pages/Profile';
import NotFoundPage from './pages/404_page';
import About from './pages/About';
// import NavigationBar from './components/Bars/NavigationBar';
import useAuthRefresh from './hooks/useAuthRefresh';
import useLogOut from './hooks/useLogOut';
import ResetPasswordModal from '@components/Modals/ResetPassword';

const App: React.FC = () => {
  useAuthRefresh();
  useLogOut();

  return (
    <>
      {/* <NavigationBar /> */}
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/notfound" element={<NotFoundPage />}></Route>
        <Route path="/" element={<Home />}></Route>
        <Route path="/dashboard" element={<DashboardPage />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/editor/:projectId" element={<Editor />}></Route>
        <Route path="/reset_password" element={<ResetPasswordModal />} />
      </Routes>
    </>
  );
};

export default App;
