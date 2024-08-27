import { selectIsAuthenticated } from '@store/selectors/authSelectors';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const useLogOut = () => {
  const userAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const protectedRoutes = ['/dashboard', '/profile', '/editor/'];
    if (
      !userAuthenticated &&
      protectedRoutes.some((route) => location.pathname.startsWith(route))
    ) {
      console.log('User is not authenticated anymore', userAuthenticated);
      navigate('/');
    }
    if (userAuthenticated && location.pathname === '/') {
      navigate('/dashboard');
    }
  }, [location.pathname, navigate, userAuthenticated]);

  // This useEffect handles taking the user into the home page if he's not authenticated anymore
  // It also locks access to any endpoint if user is not authenticated
};

export default useLogOut;
