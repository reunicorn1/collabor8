import React, { useState } from 'react';
import { useLoginUserMutation, useGetProfileQuery, useRefreshTokenMutation } from '@store/services/auth';

const Login: React.FC = () => {
  const [loginUser, { data, error, isLoading }] = useLoginUserMutation();
  const getProfile = useGetProfileQuery();
  const [refreshToken] = useRefreshTokenMutation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState('');

  const handleLogin = async () => {
    const res = loginUser({ username, password }).unwrap();
    console.log(res);
  };

  const handleProfile = async () => {
    const resp = getProfile.refetch();
    setProfile(JSON.stringify(resp));
    console.log('getProfile:--------------', getProfile.data);
    }

  const handleRefreshToken = async () => {
    await refreshToken();
  }

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

      <div>
        <button onClick={handleProfile}>Profile</button>
        <p>{profile}</p>

        <button onClick={handleRefreshToken}>Refresh Token</button>
      </div>


    </div>
  );
};

export default Login;
