import * as Location from 'expo-location';

export async function getCurrentGeoLocation() {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (!permission.granted) {
    const error = new Error('Permissão de localização negada.');
    error.code = permission.canAskAgain === false ? 'LOCATION_BLOCKED' : 'LOCATION_DENIED';
    throw error;
  }

  const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
  const { latitude, longitude } = position.coords || {};

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error('O dispositivo não retornou coordenadas válidas.');
  }

  return `${latitude}, ${longitude}`;
}
