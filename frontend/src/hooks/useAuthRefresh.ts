import { useRefreshTokenMutation } from '@store/services/auth';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

/**
 * Custom React hook for handling authentication token refresh.
 *
 * This hook automatically attempts to refresh the authentication token
 * when the hook is first used, provided that an access token is present
 * in local storage. It ensures that the application maintains a valid
 * authentication state by refreshing the token as needed.
 */
const useAuthRefresh = () => {
  const dispatch = useDispatch();
  const [refreshToken, { isLoading, isSuccess, isError }] =
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
  // The hook does not return any values; its primary purpose is to
  // handle the side effect of refreshing the token.
};

export default useAuthRefresh;
