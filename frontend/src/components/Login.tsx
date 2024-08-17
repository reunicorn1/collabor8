import React, { useState } from 'react';
import { useLoginUserMutation } from '../store/services/auth';

const Login: React.FC = () => {
  const [loginUser, { data, error, isLoading }] = useLoginUserMutation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    await loginUser({ username, password });
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
      {error && <p>Error: {error.data.message}</p>}
    </div>
  );
};

export default Login;
