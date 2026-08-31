import { api } from './api';
import { API_PATHS } from '../config/api';

export async function listServiceOrderStatusDescriptions(serviceOrderId) {
  const { data } = await api.get(API_PATHS.serviceOrderStatusDescriptions(serviceOrderId));
  if (Array.isArray(data)) return data;
  return data?.content || data?.items || [];
}
