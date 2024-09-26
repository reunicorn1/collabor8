import React from 'react';
import { Navigate, RouteProps, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAppSelector } from '@hooks/useApp';
import { selectUserDetails } from '@store/selectors';

const ProtectedRoute: React.FC<RouteProps> = ({
  element: Component,
  ...rest
}) => {
  const { isAuthenticated } = useAuth();
  const userDetails = useAppSelector(selectUserDetails);
  const location = useLocation();
  const isGuest = userDetails?.roles === 'guest';

  if (isGuest && !location.pathname.startsWith('/editor')) {
    return (
      <Navigate replace to={`/editor/${localStorage.getItem('project_id')}`} />
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{Component}</>;
};

export default ProtectedRoute;
