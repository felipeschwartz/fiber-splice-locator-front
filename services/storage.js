import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'fiber_splice_locator_jwt';
const USER_KEY = 'fiber_splice_locator_user';
const LAST_EMAIL_KEY = 'fiber_splice_locator_last_email';

export const tokenStorage = {
  async get() {
    return SecureStore.getItemAsync(TOKEN_KEY);
  },
  async set(token) {
    return SecureStore.setItemAsync(TOKEN_KEY, token);
  },
  async clear() {
    return SecureStore.deleteItemAsync(TOKEN_KEY);
  },
};

// Guarda os dados do usuário autenticado (id, name, email, roles) devolvidos
// pelo login, para telas que precisam saber "quem sou eu" sem decodificar o
// JWT — ex.: preencher o usuário responsável ao abrir uma OS.
export const userStorage = {
  async get() {
    const raw = await SecureStore.getItemAsync(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  async set(user) {
    return SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
  },
  async clear() {
    return SecureStore.deleteItemAsync(USER_KEY);
  },
};

// E-mail não é segredo, então usa AsyncStorage (mais simples) em vez do
// SecureStore — só pra pré-preencher o campo de login da próxima vez.
export const lastEmailStorage = {
  async get() {
    return AsyncStorage.getItem(LAST_EMAIL_KEY);
  },
  async set(email) {
    return AsyncStorage.setItem(LAST_EMAIL_KEY, email);
  },
};
