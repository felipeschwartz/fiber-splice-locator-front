// Helpers de formatação/leitura de dados vindos da API.
// Ficavam duplicados em quase toda tela — agora vivem em um único lugar.

export function hasValue(value) {
  return value !== null && value !== undefined && value !== '';
}

// Retorna o primeiro valor definido dentre várias chaves possíveis do
// mesmo objeto. Útil porque a API às vezes devolve o mesmo dado com
// nomes diferentes (ex.: "status" ou "orderStatus").
export function firstValue(object, ...keys) {
  return keys.reduce((result, key) => result ?? object?.[key], null);
}

export function displayValue(value) {
  return hasValue(value) ? String(value) : 'Não informado';
}

export function formatAddress(address) {
  if (!address) return '';
  if (typeof address === 'string') return address;
  return [address.street, address.streetNumber, address.city]
    .filter(Boolean)
    .join(', ');
}

// Alguns registros trazem a geolocalização como string "lat, lng",
// outros como objeto { latitude, longitude }, outros com latitude/longitude
// soltos no próprio objeto. Esta função tenta todos os formatos.
export function formatGeolocation(sources) {
  const direct = sources.reduce(
    (result, source) => result ?? firstValue(source, 'geoLocation', 'geolocation', 'coordinates'),
    null
  );

  if (typeof direct === 'string' && direct.trim()) {
    return direct.trim();
  }

  if (direct && typeof direct === 'object') {
    const latitude = firstValue(direct, 'latitude', 'lat');
    const longitude = firstValue(direct, 'longitude', 'lng', 'lon');
    if (hasValue(latitude) && hasValue(longitude)) {
      return `${latitude}, ${longitude}`;
    }
  }

  const latitude = sources.reduce((result, source) => result ?? firstValue(source, 'latitude', 'lat'), null);
  const longitude = sources.reduce((result, source) => result ?? firstValue(source, 'longitude', 'lng', 'lon'), null);
  return hasValue(latitude) && hasValue(longitude) ? `${latitude}, ${longitude}` : 'Não disponível';
}
