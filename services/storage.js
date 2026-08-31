import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'fiber_splice_locator_jwt';
const USER_KEY = 'fiber_splice_locator_user';

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
