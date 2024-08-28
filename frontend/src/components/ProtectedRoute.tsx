import React from 'react';
import { Navigate, RouteProps } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute: React.FC<RouteProps> = ({
  element: Component,
  ...rest
}) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{Component}</>;
};

export default ProtectedRoute;
