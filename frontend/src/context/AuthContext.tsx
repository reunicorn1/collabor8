import React, { createContext, ReactNode } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/useApp';
import { selectIsAuthenticated } from '@store/selectors/authSelectors';
import { setCredentials, unsetCredentials } from '@store/slices/authSlice';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const dispatch = useAppDispatch();

  const login = (token: string) => {
    dispatch(setCredentials({ accessToken: token }));
  };

  const logout = () => {
    dispatch(unsetCredentials());
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
