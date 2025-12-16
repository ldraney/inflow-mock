#!/usr/bin/env tsx
/**
 * Generate the comprehensive mock database.
 * Goal: 100% table coverage (38 tables)
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
import { generate, type Preset } from './baseline/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = resolve(__dirname, '../data')
const DB_PATH = resolve(DATA_DIR, 'mock.db')

interface GenerateConfig {
  preset?: Preset
  products?: number
  vendors?: number
  customers?: number
  locations?: number
  seed?: number
}

function parseArgs(): GenerateConfig {
  const config: GenerateConfig = {}

  for (const arg of process.argv.slice(2)) {
    // Handle --preset=small|medium|large
    const presetMatch = arg.match(/^--preset=(small|medium|large)$/)
    if (presetMatch) {
      config.preset = presetMatch[1] as Preset
      continue
    }

    // Handle numeric args
    const numMatch = arg.match(/^--(\w+)=(\d+)$/)
    if (numMatch) {
      const [, key, value] = numMatch
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
  const config = parseArgs()

  // Default to small preset with seed 42 if nothing specified
  if (!config.preset && !config.products) {
    config.preset = 'small'
  }
  if (!config.seed) {
    config.seed = 42
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
  const data = generate(config)

  // ============================================================================
  // Insert Reference Data (9 tables)
  // ============================================================================
  console.log('Inserting reference data...')
  if (data.categories.length) await db.insert(schema.categories).values(data.categories)
  if (data.locations.length) await db.insert(schema.locations).values(data.locations)
  if (data.currencies.length) await db.insert(schema.currencies).values(data.currencies)
  if (data.paymentTerms.length) await db.insert(schema.paymentTerms).values(data.paymentTerms)
  if (data.pricingSchemes.length) await db.insert(schema.pricingSchemes).values(data.pricingSchemes)
  if (data.taxingSchemes.length) await db.insert(schema.taxingSchemes).values(data.taxingSchemes)
  if (data.taxCodes.length) await db.insert(schema.taxCodes).values(data.taxCodes)
  if (data.adjustmentReasons.length) await db.insert(schema.adjustmentReasons).values(data.adjustmentReasons)
  if (data.operationTypes.length) await db.insert(schema.operationTypes).values(data.operationTypes)

  // ============================================================================
  // Insert Team & Custom Fields (4 tables)
  // ============================================================================
  console.log('Inserting team & custom fields...')
  if (data.teamMembers.length) await db.insert(schema.teamMembers).values(data.teamMembers)
  if (data.customFieldDefinitions.length) await db.insert(schema.customFieldDefinitions).values(data.customFieldDefinitions)
  if (data.customFieldDropdownOptions.length) await db.insert(schema.customFieldDropdownOptions).values(data.customFieldDropdownOptions)
  if (data.customFields.length) await db.insert(schema.customFields).values(data.customFields)

  // ============================================================================
  // Insert Core Entities
  // ============================================================================
  console.log('Inserting vendors...')
  if (data.vendors.length) await db.insert(schema.vendors).values(data.vendors)

  console.log('Inserting customers...')
  if (data.customers.length) await db.insert(schema.customers).values(data.customers)

  console.log('Inserting products...')
  if (data.products.length) await db.insert(schema.products).values(data.products)

  // ============================================================================
  // Insert Product Details (7 tables)
  // ============================================================================
  console.log('Inserting product details...')
  if (data.productBarcodes.length) await db.insert(schema.productBarcodes).values(data.productBarcodes)
  if (data.inventoryLines.length) await db.insert(schema.inventoryLines).values(data.inventoryLines)
  if (data.itemBoms.length) await db.insert(schema.itemBoms).values(data.itemBoms)
  if (data.productOperations.length) await db.insert(schema.productOperations).values(data.productOperations)
  if (data.productPrices.length) await db.insert(schema.productPrices).values(data.productPrices)
  if (data.reorderSettings.length) await db.insert(schema.reorderSettings).values(data.reorderSettings)
  if (data.vendorItems.length) await db.insert(schema.vendorItems).values(data.vendorItems)

  // ============================================================================
  // Insert Orders (5 tables)
  // ============================================================================
  console.log('Inserting orders...')
  if (data.purchaseOrders.length) await db.insert(schema.purchaseOrders).values(data.purchaseOrders)
  if (data.purchaseOrderLines.length) await db.insert(schema.purchaseOrderLines).values(data.purchaseOrderLines)
  if (data.salesOrders.length) await db.insert(schema.salesOrders).values(data.salesOrders)
  if (data.salesOrderLines.length) await db.insert(schema.salesOrderLines).values(data.salesOrderLines)
  if (data.manufacturingOrders.length) await db.insert(schema.manufacturingOrders).values(data.manufacturingOrders)

  // ============================================================================
  // Insert Stock Operations (7 tables)
  // ============================================================================
  console.log('Inserting stock operations...')
  if (data.stockTransfers.length) await db.insert(schema.stockTransfers).values(data.stockTransfers)
  if (data.stockTransferLines.length) await db.insert(schema.stockTransferLines).values(data.stockTransferLines)
  if (data.stockAdjustments.length) await db.insert(schema.stockAdjustments).values(data.stockAdjustments)
  if (data.stockAdjustmentLines.length) await db.insert(schema.stockAdjustmentLines).values(data.stockAdjustmentLines)
  if (data.stockCounts.length) await db.insert(schema.stockCounts).values(data.stockCounts)
  if (data.countSheets.length) await db.insert(schema.countSheets).values(data.countSheets)
  if (data.countSheetLines.length) await db.insert(schema.countSheetLines).values(data.countSheetLines)

  // ============================================================================
  // Insert Cost Adjustments (2 tables)
  // ============================================================================
  console.log('Inserting cost adjustments...')
  if (data.productCostAdjustments.length) await db.insert(schema.productCostAdjustments).values(data.productCostAdjustments)
  if (data.productCostAdjustmentLines.length) await db.insert(schema.productCostAdjustmentLines).values(data.productCostAdjustmentLines)

  // ============================================================================
  // Insert Computed/Summary (1 table)
  // ============================================================================
  console.log('Inserting product summary...')
  if (data.productSummary.length) await db.insert(schema.productSummary).values(data.productSummary)

  // ============================================================================
  // Summary
  // ============================================================================
  console.log(`\nDatabase generated: ${DB_PATH}`)
  console.log('\n=== Table Coverage: 38/38 (100%) ===\n')
  console.log('Reference Data:')
  console.log(`  - categories: ${data.categories.length}`)
  console.log(`  - locations: ${data.locations.length}`)
  console.log(`  - currencies: ${data.currencies.length}`)
  console.log(`  - paymentTerms: ${data.paymentTerms.length}`)
  console.log(`  - pricingSchemes: ${data.pricingSchemes.length}`)
  console.log(`  - taxingSchemes: ${data.taxingSchemes.length}`)
  console.log(`  - taxCodes: ${data.taxCodes.length}`)
  console.log(`  - adjustmentReasons: ${data.adjustmentReasons.length}`)
  console.log(`  - operationTypes: ${data.operationTypes.length}`)
  console.log('\nTeam & Custom Fields:')
  console.log(`  - teamMembers: ${data.teamMembers.length}`)
  console.log(`  - customFieldDefinitions: ${data.customFieldDefinitions.length}`)
  console.log(`  - customFieldDropdownOptions: ${data.customFieldDropdownOptions.length}`)
  console.log(`  - customFields: ${data.customFields.length}`)
  console.log('\nCore Entities:')
  console.log(`  - vendors: ${data.vendors.length}`)
  console.log(`  - customers: ${data.customers.length}`)
  console.log(`  - products: ${data.products.length}`)
  console.log('\nProduct Details:')
  console.log(`  - productBarcodes: ${data.productBarcodes.length}`)
  console.log(`  - inventoryLines: ${data.inventoryLines.length}`)
  console.log(`  - itemBoms: ${data.itemBoms.length}`)
  console.log(`  - productOperations: ${data.productOperations.length}`)
  console.log(`  - productPrices: ${data.productPrices.length}`)
  console.log(`  - reorderSettings: ${data.reorderSettings.length}`)
  console.log(`  - vendorItems: ${data.vendorItems.length}`)
  console.log('\nOrders:')
  console.log(`  - purchaseOrders: ${data.purchaseOrders.length}`)
  console.log(`  - purchaseOrderLines: ${data.purchaseOrderLines.length}`)
  console.log(`  - salesOrders: ${data.salesOrders.length}`)
  console.log(`  - salesOrderLines: ${data.salesOrderLines.length}`)
  console.log(`  - manufacturingOrders: ${data.manufacturingOrders.length}`)
  console.log('\nStock Operations:')
  console.log(`  - stockTransfers: ${data.stockTransfers.length}`)
  console.log(`  - stockTransferLines: ${data.stockTransferLines.length}`)
  console.log(`  - stockAdjustments: ${data.stockAdjustments.length}`)
  console.log(`  - stockAdjustmentLines: ${data.stockAdjustmentLines.length}`)
  console.log(`  - stockCounts: ${data.stockCounts.length}`)
  console.log(`  - countSheets: ${data.countSheets.length}`)
  console.log(`  - countSheetLines: ${data.countSheetLines.length}`)
  console.log('\nCost Adjustments:')
  console.log(`  - productCostAdjustments: ${data.productCostAdjustments.length}`)
  console.log(`  - productCostAdjustmentLines: ${data.productCostAdjustmentLines.length}`)
  console.log('\nComputed:')
  console.log(`  - productSummary: ${data.productSummary.length}`)
}

main().catch(console.error)
