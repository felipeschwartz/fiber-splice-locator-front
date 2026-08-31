export const API_BASE_URL = 'http://10.0.2.2:8080';

export const API_PATHS = {
  login: '/api/auth/v1/login',

  ceos: '/api/ceo/v1',
  ceoById: (id) => `/api/ceo/v1/id/${encodeURIComponent(id)}`,
  ceoByBoxNumber: (boxNumber) => `/api/ceo/v1/box-number/${encodeURIComponent(boxNumber)}`,
  ceoSearch: (query) => `/api/ceo/v1/search?q=${encodeURIComponent(query)}`,

  serviceOrders: '/api/service_orders/v1',
  openServiceOrder: '/api/service_orders/v1/open',
  serviceOrderById: (id) => `/api/service_orders/v1/id/${encodeURIComponent(id)}`,
  updateServiceOrder: (id) => `/api/service_orders/v1/${encodeURIComponent(id)}`,
  serviceOrderAttendance: (id) => `/api/service_orders/v1/${encodeURIComponent(id)}/attendance`,

  serviceOrderPhotos: (id) => `/api/service_order_photos/v1/service-order/${encodeURIComponent(id)}`,
  serviceOrderStatusDescriptions: (id) =>
    `/api/service_orders_status_descriptions/v1/service-order/${encodeURIComponent(id)}`,

  users: '/api/user/v1',
  userSearch: (query) => `/api/user/v1/search?q=${encodeURIComponent(query)}`,
};
