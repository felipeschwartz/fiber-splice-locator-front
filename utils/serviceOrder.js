import { firstValue, hasValue } from './format';

// A API já foi vista devolvendo o id da ordem sob nomes diferentes
// dependendo do endpoint. Centraliza a leitura para não repetir isso
// em cada tela/componente que lista ou abre uma ordem.
export function getServiceOrderId(order) {
  const value = firstValue(
    order,
    'serviceOrderId',
    'id',
    'service_order_id',
    'orderId',
    'code'
  ) ?? firstValue(order?.serviceOrder, 'serviceOrderId', 'id')
    ?? firstValue(order?.service_order, 'serviceOrderId', 'id');

  return hasValue(value) ? value : null;
}

// Próximo status sugerido ao abrir o atendimento de uma OS.
export const NEXT_STATUS_BY_CURRENT = {
  OPEN: 'IN_PROGRESS',
  IN_PROGRESS: 'COMPLETED',
};

export const SERVICE_ORDER_STATUSES = ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

export const CEO_STATUSES = ['STANDARDIZED', 'DAMAGED', 'UNDER_MAINTENANCE', 'CANCELLED'];

const CEO_STATUS_LABELS = {
  STANDARDIZED: 'Padronizada',
  DAMAGED: 'Danificada',
  UNDER_MAINTENANCE: 'Em manutenção',
  CANCELLED: 'Cancelada',
};

export function labelCeoStatus(status) {
  return CEO_STATUS_LABELS[status] || status;
}
