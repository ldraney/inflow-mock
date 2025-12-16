/**
 * Database schema for manufacturing inventory.
 *
 * TODO: Replace with import from inflow-get once available:
 * import { schema } from 'inflow-get'
 */

import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

export const vendors = sqliteTable('vendors', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  contactName: text('contact_name'),
  email: text('email'),
  phone: text('phone'),
  address: text('address'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
})

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  parentId: integer('parent_id'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
})

export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  sku: text('sku'),
  description: text('description'),
  categoryId: integer('category_id').references(() => categories.id),
  vendorId: integer('vendor_id').references(() => vendors.id),
  unitPrice: real('unit_price'),
  unitOfMeasure: text('unit_of_measure'),
  quantityOnHand: integer('quantity_on_hand').default(0),
  reorderPoint: integer('reorder_point'),
  reorderQuantity: integer('reorder_quantity'),
  leadTimeDays: integer('lead_time_days'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at'),
})

export const inventoryTransactions = sqliteTable('inventory_transactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  productId: integer('product_id').notNull().references(() => products.id),
  transactionType: text('transaction_type').notNull(), // 'receive', 'issue', 'adjust', 'transfer'
  quantity: integer('quantity').notNull(),
  referenceNumber: text('reference_number'),
  notes: text('notes'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
})

export const purchaseOrders = sqliteTable('purchase_orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  vendorId: integer('vendor_id').notNull().references(() => vendors.id),
  orderNumber: text('order_number').notNull(),
  status: text('status').notNull(), // 'draft', 'submitted', 'received', 'cancelled'
  orderDate: text('order_date'),
  expectedDate: text('expected_date'),
  receivedDate: text('received_date'),
  notes: text('notes'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
})

export const purchaseOrderLines = sqliteTable('purchase_order_lines', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  purchaseOrderId: integer('purchase_order_id').notNull().references(() => purchaseOrders.id),
  productId: integer('product_id').notNull().references(() => products.id),
  quantity: integer('quantity').notNull(),
  unitPrice: real('unit_price'),
  receivedQuantity: integer('received_quantity').default(0),
})

// Type exports for use in generators
export type Vendor = typeof vendors.$inferInsert
export type Category = typeof categories.$inferInsert
export type Product = typeof products.$inferInsert
export type InventoryTransaction = typeof inventoryTransactions.$inferInsert
export type PurchaseOrder = typeof purchaseOrders.$inferInsert
export type PurchaseOrderLine = typeof purchaseOrderLines.$inferInsert
