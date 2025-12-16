/**
 * inflow-mock
 *
 * Two outputs:
 * 1. A messy database with all known problems combined
 * 2. A library to detect and fix those problems
 */

export * as baseline from './baseline/index.js'
export { patterns, type PatternName } from './patterns/index.js'
export { createDb, createTables, schema, type DB } from './db/index.js'

// Re-export schema types for convenience
export type {
  Vendor,
  Category,
  Product,
  InventoryTransaction,
  PurchaseOrder,
  PurchaseOrderLine,
} from './db/schema.js'
