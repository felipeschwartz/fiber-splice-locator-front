// Emulador Android: 'http://10.0.2.2:8080' (alias especial que só existe
// dentro do emulador, aponta pro localhost da própria máquina — não
// depende de firewall/rede, por isso é o padrão do projeto).
// Dispositivo físico na mesma rede: IP local da máquina que roda o
// backend (ex.: 'http://192.168.3.14:8080' — veja com `ipconfig`), e
// exige liberar a porta 8080 no firewall e a rede como "Privada".
export const API_BASE_URL = 'http://10.0.2.2:8080';

export const API_PATHS = {
  login: '/api/auth/v1/login',
  forgotPassword: '/api/auth/v1/forgot-password',
  resetPassword: '/api/auth/v1/reset-password',

  ceos: '/api/ceo/v1',
  ceoById: (id) => `/api/ceo/v1/id/${encodeURIComponent(id)}`,
  ceoByBoxNumber: (boxNumber) => `/api/ceo/v1/box-number/${encodeURIComponent(boxNumber)}`,
  ceoSearch: (query) => `/api/ceo/v1/search?q=${encodeURIComponent(query)}`,

  serviceOrders: '/api/service_orders/v1',
  serviceOrdersByCeo: (ceoId) => `/api/service_orders/v1/ceo/${encodeURIComponent(ceoId)}`,
  openServiceOrder: '/api/service_orders/v1/open',
  serviceOrderById: (id) => `/api/service_orders/v1/id/${encodeURIComponent(id)}`,
  updateServiceOrder: (id) => `/api/service_orders/v1/${encodeURIComponent(id)}`,
  serviceOrderAttendance: (id) => `/api/service_orders/v1/${encodeURIComponent(id)}/attendance`,

  serviceOrderPhotos: (id) => `/api/service_order_photos/v1/service-order/${encodeURIComponent(id)}`,
  serviceOrderStatusDescriptions: (id) =>
    `/api/service_orders_status_descriptions/v1/service-order/${encodeURIComponent(id)}`,

  users: '/api/user/v1',
  userSearch: (query) => `/api/user/v1/search?q=${encodeURIComponent(query)}`,
  changeOwnPassword: '/api/user/v1/me/password',
};
