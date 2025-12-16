/**
 * Database connection and setup.
 *
 * TODO: Replace with import from inflow-get once available:
 * import { db } from 'inflow-get'
 */

import Database from 'better-sqlite3'
import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema.js'

export { schema }

export type DB = BetterSQLite3Database<typeof schema>

export function createDb(path: string): DB {
  const sqlite = new Database(path)
  return drizzle(sqlite, { schema })
}

export function createTables(db: DB) {
  const sqlite = (db as unknown as { session: { client: Database.Database } }).session.client

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS vendors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      contact_name TEXT,
      email TEXT,
      phone TEXT,
      address TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      parent_id INTEGER,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      sku TEXT,
      description TEXT,
      category_id INTEGER REFERENCES categories(id),
      vendor_id INTEGER REFERENCES vendors(id),
      unit_price REAL,
      unit_of_measure TEXT,
      quantity_on_hand INTEGER DEFAULT 0,
      reorder_point INTEGER,
      reorder_quantity INTEGER,
      lead_time_days INTEGER,
      is_active INTEGER DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS inventory_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL REFERENCES products(id),
      transaction_type TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      reference_number TEXT,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS purchase_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vendor_id INTEGER NOT NULL REFERENCES vendors(id),
      order_number TEXT NOT NULL,
      status TEXT NOT NULL,
      order_date TEXT,
      expected_date TEXT,
      received_date TEXT,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS purchase_order_lines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      purchase_order_id INTEGER NOT NULL REFERENCES purchase_orders(id),
      product_id INTEGER NOT NULL REFERENCES products(id),
      quantity INTEGER NOT NULL,
      unit_price REAL,
      received_quantity INTEGER DEFAULT 0
    );
  `)
}
