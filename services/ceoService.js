import { api } from './api';
import { API_PATHS } from '../config/api';

function unwrapList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?._embedded?.ceos)) return data._embedded.ceos;
  if (Array.isArray(data?.ceos)) return data.ceos;
  if (data?.id !== undefined || data?.boxNumber !== undefined) return [data];
  return [];
}

function unwrapOne(data) {
  return data?.content ?? data?.ceo ?? data;
}

export async function listCeos(query = '') {
  const value = String(query).trim();
  if (!value) {
    const response = await api.get(API_PATHS.ceos);
    return unwrapList(response.data);
  }

  if (/^\d+$/.test(value)) {
    try {
      const response = await api.get(API_PATHS.ceoById(value));
      return unwrapList(response.data);
    } catch {
      const response = await api.get(API_PATHS.ceoByBoxNumber(value));
      return unwrapList(response.data);
    }
  }

  const response = await api.get(API_PATHS.ceoByBoxNumber(value));
  return unwrapList(response.data);
}

export async function getCeo(ceoId) {
  const response = await api.get(API_PATHS.ceoById(ceoId));
  return unwrapOne(response.data);
}

// A API expõe atualização de CEO em PUT /api/ceo/v1/id/{id} — o mesmo
// caminho usado para buscar por id.
export async function updateCeo(ceoId, ceo) {
  const response = await api.put(API_PATHS.ceoById(ceoId), ceo);
  return unwrapOne(response.data);
}
