import React from 'react';
import { useDispatch } from 'react-redux';
import { useLoginUserMutation } from '../services/auth';
import { setCredentials } from '../slices/authSlice';
import { UserAPI } from '../utils/api_endpoints';

const Login: React.FC = () => {
  const api = new UserAPI();
  const dispatch = useDispatch();
  const [loginUser] = useLoginUserMutation();
  const user_login = {
    username: 'mo',
    password: 'password',
  };

  const handleLogin = async (username: string, password: string) => {
    try {
      const { accessToken } = await loginUser({ username, password }).unwrap();
      // const { accessToken } = await api.signInUser(user_login);
      console.log('accessToken:', accessToken);
      dispatch(setCredentials({ accessToken }));
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      <button onClick={() => handleLogin('qqqq', '123')}>Login</button>
    </div>
  );
};

export default Login;
