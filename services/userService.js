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

// PATCH /api/user/v1/me/password é self-service: identifica o usuário pelo
// token JWT, não recebe id — por isso não passa por unwrapOne/DTO nenhum,
// só confirma sucesso (204 No Content) ou lança o erro da API.
export async function changeOwnPassword({ currentPassword, newPassword }) {
  await api.patch(API_PATHS.changeOwnPassword, { currentPassword, newPassword });
}
