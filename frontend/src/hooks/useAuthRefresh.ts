import { useRefreshTokenMutation } from '@store/services/auth';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useAuthRefresh = () => {
  const dispatch = useDispatch();
  const [refreshToken, { isLoadind, isSuccess, isError }] =
    useRefreshTokenMutation();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        await refreshToken().unwrap();
      } catch (error) {
        console.error('Failed to refresh token:', error);
      }
    };
    const storedAccessToken = localStorage.getItem('accessToken');
    if (storedAccessToken) {
      fetchToken();
    }
  }, [dispatch, refreshToken]);
};

export default useAuthRefresh;
