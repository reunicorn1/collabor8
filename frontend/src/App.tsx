import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
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

const App: React.FC = () => {
  useAuthRefresh();
  useLogOut();

  return (
    <>
      {/* <NavigationBar /> */}
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/notfound" element={<NotFound />}></Route>
        <Route path="/" element={<Home />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/editor/:projectId" element={<Editor />}></Route>
        <Route path="/reset-password" element={<ResetPasswordModal />} />
        <Route path="/verify" element={<Verify />} />
      </Routes>
    </>
  );
};

export default App;
