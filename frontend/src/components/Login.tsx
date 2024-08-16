import React from 'react';
import { useDispatch } from 'react-redux';
import { useLoginUserMutation } from '../services/auth';
import { setCredentials } from '../slices/authSlice';

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const [loginUser] = useLoginUserMutation();

  const handleLogin = async (username: string, password: string) => {
    try {
      const { accessToken } = await loginUser({ username, password }).unwrap();
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
