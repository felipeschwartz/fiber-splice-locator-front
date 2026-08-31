import { api } from './api';
import { API_PATHS } from '../config/api';

// Devolve apenas id, name e email (o backend não expõe mais que isso
// nessa busca, por design — ver GET /api/user/v1/search).
export async function searchUsers(query) {
  const { data } = await api.get(API_PATHS.userSearch(query));
  if (Array.isArray(data)) return data;
  return data?.content || data?.items || data?.users || [];
}

export async function createUser({ name, email, password, roles, active = true }) {
  const { data } = await api.post(API_PATHS.users, { name, email, password, roles, active });
  return data;
}
