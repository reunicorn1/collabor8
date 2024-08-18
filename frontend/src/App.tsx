import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import DashboardPage from './pages/DashboardPage';
import Editor from './pages/Editor';

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/dashboard" element={<DashboardPage />}></Route>
        <Route path="/editor/:projectId" element={<Editor />}></Route>
      </Routes>
    </>
  );
};

export default App;
