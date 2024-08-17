import React, { useState } from 'react';
import { useLoginUserMutation } from '../services/auth';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../slices/authSlice';

const Login: React.FC = () => {
  const [loginUser, { data, error, isLoading }] = useLoginUserMutation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleLogin = async () => {
    const result = await loginUser({ username, password });
    if ('data' in result) {
      dispatch(setCredentials({ accessToken: result.data.accessToken }));
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} disabled={isLoading}>
        Login
      </button>
      {data && <p>Access Token: {data.accessToken}</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};

export default Login;
