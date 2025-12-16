#!/usr/bin/env tsx
/**
 * Generate the combined messy database.
 *
 * Usage:
 *   npm run db:push && npm run generate
 *   npm run generate -- --products=200 --seed=12345
 */

import { existsSync, mkdirSync, unlinkSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

import { createDb, schema } from './db/index.js'
import { generate } from './baseline/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = resolve(__dirname, '../data')
const DB_PATH = resolve(DATA_DIR, 'combined.db')

interface GenerateConfig {
  products: number
  vendors: number
  customers: number
  locations: number
  seed: number
}

function parseArgs(): Partial<GenerateConfig> {
  const config: Partial<GenerateConfig> = {}

  for (const arg of process.argv.slice(2)) {
    const match = arg.match(/^--(\w+)=(\d+)$/)
    if (match) {
      const [, key, value] = match
      if (key === 'products') config.products = parseInt(value)
      if (key === 'vendors') config.vendors = parseInt(value)
      if (key === 'customers') config.customers = parseInt(value)
      if (key === 'locations') config.locations = parseInt(value)
      if (key === 'seed') config.seed = parseInt(value)
    }
  }

  return config
}

async function main() {
  const args = parseArgs()
  const config: GenerateConfig = {
    products: args.products ?? 100,
    vendors: args.vendors ?? 15,
    customers: args.customers ?? 20,
    locations: args.locations ?? 3,
    seed: args.seed ?? 42,
  }

  console.log('Configuration:', config)

  // Ensure data directory exists
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true })
  }

  // Remove existing database
  if (existsSync(DB_PATH)) {
    unlinkSync(DB_PATH)
    console.log('Removed existing database')
  }

  // Create tables using drizzle-kit push
  console.log('Creating database schema...')
  execSync('npm run db:push', { stdio: 'inherit', cwd: resolve(__dirname, '..') })

  // Create database connection
  const db = createDb(DB_PATH)
  console.log('Database connected')

  // Generate baseline data
  console.log('Generating baseline data...')
  const data = generate({
    products: config.products,
    vendors: config.vendors,
    customers: config.customers,
    locations: config.locations,
    seed: config.seed,
  })

  // Insert reference data first
  console.log('Inserting reference data...')
  if (data.categories.length) await db.insert(schema.categories).values(data.categories)
  if (data.locations.length) await db.insert(schema.locations).values(data.locations)
  if (data.currencies.length) await db.insert(schema.currencies).values(data.currencies)
  if (data.paymentTerms.length) await db.insert(schema.paymentTerms).values(data.paymentTerms)
  if (data.pricingSchemes.length) await db.insert(schema.pricingSchemes).values(data.pricingSchemes)

  // Insert entities
  console.log('Inserting vendors...')
  if (data.vendors.length) await db.insert(schema.vendors).values(data.vendors)

  console.log('Inserting customers...')
  if (data.customers.length) await db.insert(schema.customers).values(data.customers)

  console.log('Inserting products...')
  if (data.products.length) await db.insert(schema.products).values(data.products)

  // Insert product-related data
  console.log('Inserting inventory and pricing...')
  if (data.inventoryLines.length) await db.insert(schema.inventoryLines).values(data.inventoryLines)
  if (data.productPrices.length) await db.insert(schema.productPrices).values(data.productPrices)
  if (data.reorderSettings.length) await db.insert(schema.reorderSettings).values(data.reorderSettings)
  if (data.vendorItems.length) await db.insert(schema.vendorItems).values(data.vendorItems)

  // Insert orders
  console.log('Inserting orders...')
  if (data.purchaseOrders.length) await db.insert(schema.purchaseOrders).values(data.purchaseOrders)
  if (data.purchaseOrderLines.length) await db.insert(schema.purchaseOrderLines).values(data.purchaseOrderLines)
  if (data.salesOrders.length) await db.insert(schema.salesOrders).values(data.salesOrders)
  if (data.salesOrderLines.length) await db.insert(schema.salesOrderLines).values(data.salesOrderLines)

  console.log(`\nDatabase generated: ${DB_PATH}`)
  console.log('Summary:')
  console.log(`  - Categories: ${data.categories.length}`)
  console.log(`  - Locations: ${data.locations.length}`)
  console.log(`  - Vendors: ${data.vendors.length}`)
  console.log(`  - Customers: ${data.customers.length}`)
  console.log(`  - Products: ${data.products.length}`)
  console.log(`  - Inventory Lines: ${data.inventoryLines.length}`)
  console.log(`  - Purchase Orders: ${data.purchaseOrders.length}`)
  console.log(`  - Sales Orders: ${data.salesOrders.length}`)
}

main().catch(console.error)
