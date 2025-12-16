# inflow-mock

Generate comprehensive mock data for the inflow-get schema. Proves deep expertise with the data model and provides realistic test data for demos.

## Current Status

**Table Coverage: 37/37 (100%)**

- [x] Project structure (TypeScript, Drizzle, better-sqlite3)
- [x] Database schema (uses inflow-get schema, 37 tables)
- [x] Complete baseline generator (all tables populated)

## Quick Start

```bash
npm install
npm run generate                           # Generate mock.db
npm run generate -- --products=200         # Custom product count
npm run generate -- --seed=12345           # Reproducible output
```

## What This Repo Produces

A SQLite DB with **comprehensive mock data** covering all 37 tables in the inflow-get schema.

```
data/
  mock.db    # generated, gitignored
```

```typescript
import { generate, createDb, schema } from 'inflow-mock'

// Generate clean data
const data = generate({ products: 100, customers: 20, vendors: 15 })
// Returns: 100 products, 20 customers, 15 vendors, 60 sales orders, etc.
```

## Table Coverage

### Reference Data (9 tables)
- [x] categories (12 records)
- [x] locations (3 records)
- [x] currencies (1 record)
- [x] paymentTerms (4 records)
- [x] pricingSchemes (3 records)
- [x] taxingSchemes (2 records)
- [x] taxCodes (3 records)
- [x] adjustmentReasons (8 records)
- [x] operationTypes (8 records)

### Team & Custom Fields (4 tables)
- [x] teamMembers (5 records)
- [x] customFieldDefinitions (4 records)
- [x] customFieldDropdownOptions (1 record)
- [x] customFields (1 record)

### Core Entities (3 tables)
- [x] vendors (15 records)
- [x] customers (20 records)
- [x] products (100 records)

### Product Details (7 tables)
- [x] productBarcodes (~86 records)
- [x] inventoryLines (~300 records)
- [x] itemBoms (~76 records)
- [x] productOperations (~39 records)
- [x] productPrices (300 records)
- [x] reorderSettings (100 records)
- [x] vendorItems (100 records)

### Orders (5 tables)
- [x] purchaseOrders (30 records)
- [x] purchaseOrderLines (~89 records)
- [x] salesOrders (60 records)
- [x] salesOrderLines (~168 records)
- [x] manufacturingOrders (~11 records)

### Stock Operations (7 tables)
- [x] stockTransfers (~5 records)
- [x] stockTransferLines (~13 records)
- [x] stockAdjustments (~6 records)
- [x] stockAdjustmentLines (~8 records)
- [x] stockCounts (~4 records)
- [x] countSheets (~9 records)
- [x] countSheetLines (~55 records)

### Cost Adjustments (2 tables)
- [x] productCostAdjustments (~4 records)
- [x] productCostAdjustmentLines (~15 records)

### Computed (1 table)
- [x] productSummary (100 records)

## Project Structure

```
src/
├── index.ts              # Main entry point
├── generate.ts           # CLI script to build mock.db
├── db/
│   ├── schema.ts         # Re-exports inflow-get schema
│   └── index.ts          # DB connection + table creation
└── baseline/
    ├── generator.ts      # Seeded random data generator
    └── index.ts
```

## Related Repos

- `inflow-get` - **primary dependency** - Drizzle schema, DB structure, types
- `inflow-clean` - detect and fix data quality issues (uses mock data for demos)
- `inflow-materialize` - views built on top of schema
- `inflow-app` - consumes mock data for development/demos

## Tech Stack

- TypeScript (ESM)
- Drizzle ORM
- better-sqlite3
- tsx (for running scripts)

## Commands

| Command | Description |
|---------|-------------|
| `npm run generate` | Build mock.db with all 37 tables populated |
| `npm run typecheck` | Type check without emitting |
| `npm run build` | Compile to dist/ |
