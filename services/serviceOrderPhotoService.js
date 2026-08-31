import { api } from './api';
import { API_PATHS } from '../config/api';

export async function listServiceOrderPhotos(serviceOrderId) {
  const { data } = await api.get(API_PATHS.serviceOrderPhotos(serviceOrderId));
  if (Array.isArray(data)) return data;
  return data?.content || data?.items || data?.photos || data?.serviceOrderPhotos || [];
}

export async function uploadServiceOrderPhoto(serviceOrderId, asset) {
  const formData = new FormData();
  formData.append('file', {
    uri: asset.uri,
    name: asset.fileName || `os-${serviceOrderId}-${Date.now()}.jpg`,
    type: asset.mimeType || 'image/jpeg',
  });

  const { data } = await api.post(API_PATHS.serviceOrderPhotos(serviceOrderId), formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
