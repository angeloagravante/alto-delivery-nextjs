export { default as OrdersTable, type Order } from './OrdersTable';
export { default as NewOrdersModal } from './NewOrdersModal';
export { default as OrderDetailsModal } from './OrderDetailsModal';

// Re-export the new Order type from types
export type { Order as OrderType, OrderStatus, OrderItem, OrderUpdate } from '@/types/order';
