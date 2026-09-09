import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { login as loginRequest } from '../services/authService';
import { tokenStorage, userStorage } from '../services/storage';
import { registerForPushNotificationsAsync } from '../services/pushNotificationService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([tokenStorage.get(), userStorage.get()])
      .then(([storedToken, storedUser]) => {
        setToken(storedToken);
        setUser(storedUser);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await loginRequest(email, password);
    if (!data?.token) throw new Error('A resposta do servidor não contém um token.');

    await tokenStorage.set(data.token);
    setToken(data.token);
    registerForPushNotificationsAsync();

    if (data.user) {
      await userStorage.set(data.user);
      setUser(data.user);
    }
  }, []);

  const logout = useCallback(async () => {
    await Promise.all([tokenStorage.clear(), userStorage.clear()]);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ token, user, loading, isAuthenticated: Boolean(token), login, logout }),
    [token, user, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  return context;
}
