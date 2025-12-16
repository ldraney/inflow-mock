#!/usr/bin/env tsx
/**
 * Generate the combined messy database.
 *
 * Usage:
 *   npm run generate
 *   npm run generate -- --products=200 --seed=12345
 */

import { existsSync, mkdirSync, unlinkSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

import { createDb, createTables, schema } from './db/index.js'
import { generate } from './baseline/index.js'
// import { patterns } from './patterns/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = resolve(__dirname, '../data')
const DB_PATH = resolve(DATA_DIR, 'combined.db')

interface GenerateConfig {
  products: number
  vendors: number
  categories: number
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
      if (key === 'categories') config.categories = parseInt(value)
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
    categories: args.categories ?? 12,
    seed: args.seed ?? 42, // Fixed seed for reproducibility by default
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

  // Create fresh database
  const db = createDb(DB_PATH)
  createTables(db)
  console.log('Created database schema')

  // Generate clean baseline data
  console.log('Generating baseline data...')
  const baseline = generate({
    products: config.products,
    vendors: config.vendors,
    categories: config.categories,
    seed: config.seed,
  })

  // Insert vendors
  console.log(`Inserting ${baseline.vendors.length} vendors...`)
  for (const vendor of baseline.vendors) {
    await db.insert(schema.vendors).values(vendor)
  }

  // Insert categories
  console.log(`Inserting ${baseline.categories.length} categories...`)
  for (const category of baseline.categories) {
    await db.insert(schema.categories).values(category)
  }

  // Insert products
  console.log(`Inserting ${baseline.products.length} products...`)
  for (const product of baseline.products) {
    await db.insert(schema.products).values(product)
  }

  console.log('Baseline data inserted')

  // Apply patterns to create mess
  // TODO: Uncomment as patterns are implemented
  // console.log('Applying patterns...')
  // await patterns.duplicates.create(db, { severity: 0.2 })
  // await patterns.skuChaos.create(db, { severity: 0.3 })
  // await patterns.vendorSprawl.create(db, { severity: 0.15 })
  // await patterns.missingReorder.create(db, { severity: 0.25 })
  // await patterns.categoryMess.create(db, { severity: 0.2 })
  // await patterns.orphanedRecords.create(db, { severity: 0.1 })
  // await patterns.namingAnarchy.create(db, { severity: 0.3 })

  console.log(`\nDatabase generated: ${DB_PATH}`)
  console.log('Summary:')
  console.log(`  - Vendors: ${baseline.vendors.length}`)
  console.log(`  - Categories: ${baseline.categories.length}`)
  console.log(`  - Products: ${baseline.products.length}`)
  console.log('\nPatterns applied: (none yet - implement patterns to add mess)')
}

main().catch(console.error)
