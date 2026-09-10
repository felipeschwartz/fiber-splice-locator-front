import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { login as loginRequest } from '../services/authService';
import { tokenStorage, userStorage, lastEmailStorage } from '../services/storage';
import { registerForPushNotificationsAsync } from '../services/pushNotificationService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // true = já existe uma sessão salva, mas ainda não foi confirmada por
  // biometria nesta abertura do app (só é usado quando o token vem do
  // storage; um login recém-digitado nunca passa por aqui).
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    Promise.all([tokenStorage.get(), userStorage.get()])
      .then(async ([storedToken, storedUser]) => {
        setToken(storedToken);
        setUser(storedUser);

        if (storedToken) {
          const canUseBiometrics =
            (await LocalAuthentication.hasHardwareAsync()) && (await LocalAuthentication.isEnrolledAsync());
          setLocked(canUseBiometrics);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const unlock = useCallback(async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Confirme sua identidade',
      cancelLabel: 'Cancelar',
    });
    if (result.success) setLocked(false);
    return result.success;
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await loginRequest(email, password);
    if (!data?.token) throw new Error('A resposta do servidor não contém um token.');

    await Promise.all([tokenStorage.set(data.token), lastEmailStorage.set(email)]);
    setToken(data.token);
    setLocked(false);
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
    setLocked(false);
  }, []);

  const value = useMemo(
    () => ({ token, user, loading, locked, isAuthenticated: Boolean(token), login, logout, unlock }),
    [token, user, loading, locked, login, logout, unlock]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  return context;
}
