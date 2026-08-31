import { api } from './api';
import { API_PATHS } from '../config/api';

export async function login(email, password) {
  const { data } = await api.post(API_PATHS.login, { email, password });
  return data;
}
