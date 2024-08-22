import React, { useState } from 'react';
import { useLoginUserMutation, useGetProfileQuery } from '@store/services/auth';

const Login: React.FC = () => {
  const [
    loginUser,
    { data: loginData, error: loginError, isLoading: loginLoading },
  ] = useLoginUserMutation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const {
    data: profileData,
    error: profileError,
    isFetching: profileFetching,
    refetch,
  } = useGetProfileQuery();

  const handleLogin = async () => {
    await loginUser({ username, password });
  };

  const handleFetchProfile = () => {
    refetch(); // Manually trigger the profile fetch
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
      <button onClick={handleLogin} disabled={loginLoading}>
        Login
      </button>
      {loginData && <p>Access Token: {loginData.accessToken}</p>}
      {loginError && <p>Error: {loginError.data.message}</p>}

      <h2>Test Automatic Token Refresh</h2>
      <button
        onClick={handleFetchProfile}
        disabled={profileFetching || !loginData}
      >
        Fetch User Profile
      </button>
      {profileData && <p>Profile: {JSON.stringify(profileData)}</p>}
      {profileError && <p>Error: {profileError.data.message}</p>}
    </div>
  );
};

export default Login;
