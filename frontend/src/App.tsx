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

const App: React.FC = () => {
  //useAuthRefresh();
  //useLogOut();

  return (
    <>
      {/* <NavigationBar /> */}
      <Routes>
        <Route path="/mission" element={<About />}></Route>
        <Route path="/" element={<Home />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/editor/:projectId" element={<Editor />}></Route>
        <Route path="/reset-password" element={<ResetPasswordModal />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/invite" element={<InviteGuest />} />
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </>
  );
};

export default App;
