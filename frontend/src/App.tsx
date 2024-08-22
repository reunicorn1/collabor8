import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import DashboardPage from './pages/DashboardPage';
import Editor from './pages/Editor';
import Login from './components/Login';
import Profile from './pages/Profile';
import NavigationBar from './components/Bars/NavigationBar';
import useAuthRefresh from './hooks/useAuthRefresh';

const App: React.FC = () => {
  useAuthRefresh();
  return (
    <>
      {/* <NavigationBar /> */}
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/" element={<Home />}></Route>
        <Route path="/dashboard" element={<DashboardPage />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/editor/:projectId" element={<Editor />}></Route>
      </Routes>
    </>
  );
};

export default App;
