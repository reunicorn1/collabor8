import { selectIsAuthenticated } from '@store/selectors/authSelectors';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useAppSelector } from './useApp';
import { selectUserDetails } from '@store/selectors';

const useLogOut = () => {
  const userAuthenticated = useSelector(selectIsAuthenticated);
  const userDetails = useAppSelector(selectUserDetails);
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
      if (userDetails?.roles === 'guest') {
        navigate(`/editor/${localStorage.getItem('project_id')}`);
      }
      navigate('/dashboard');
    }
  }, [location.pathname, navigate, userAuthenticated, userDetails?.roles]);

  // This useEffect handles taking the user into the home page if he's not authenticated anymore
  // It also locks access to any endpoint if user is not authenticated
};

export default useLogOut;
