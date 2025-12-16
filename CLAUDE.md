# inflow-mock

Generate comprehensive mock data for the inflow-get schema. Proves deep expertise with the data model and provides realistic test data for demos.

## Current Status

**Table Coverage: 16/37 (43%)**

- [x] Project structure (TypeScript, Drizzle, better-sqlite3)
- [x] Database schema (uses inflow-get schema, 37 tables)
- [x] Core baseline generator (products, orders, inventory)
- [ ] Complete table coverage (see roadmap below)

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

Goal: 100% table coverage with realistic, interconnected manufacturing data.

```typescript
import { generate, createDb, schema } from 'inflow-mock'

// Generate clean data
const data = generate({ products: 100, customers: 20, vendors: 15 })
// Returns: 100 products, 20 customers, 15 vendors, 60 sales orders, etc.
```

## Table Coverage Roadmap

### Populated (16 tables)
- [x] categories
- [x] currencies
- [x] customers
- [x] inventoryLines
- [x] locations
- [x] paymentTerms
- [x] pricingSchemes
- [x] productPrices
- [x] products
- [x] purchaseOrderLines
- [x] purchaseOrders
- [x] reorderSettings
- [x] salesOrderLines
- [x] salesOrders
- [x] vendorItems
- [x] vendors

### TODO: Reference Data (4 tables)
- [ ] adjustmentReasons - reasons for stock adjustments
- [ ] operationTypes - manufacturing operation types
- [ ] taxCodes - tax codes
- [ ] taxingSchemes - tax schemes

### TODO: Team & Custom Fields (4 tables)
- [ ] teamMembers - users/team members
- [ ] customFieldDefinitions - custom field metadata
- [ ] customFieldDropdownOptions - dropdown choices
- [ ] customFields - custom field values

### TODO: Product Details (3 tables)
- [ ] productBarcodes - barcode data
- [ ] itemBoms - bill of materials
- [ ] productOperations - manufacturing operations

### TODO: Stock Operations (7 tables)
- [ ] stockAdjustments - inventory adjustments
- [ ] stockAdjustmentLines - adjustment line items
- [ ] stockTransfers - inter-location transfers
- [ ] stockTransferLines - transfer line items
- [ ] countSheets - stock count headers
- [ ] countSheetLines - stock count details
- [ ] stockCounts - count records

### TODO: Cost Adjustments (2 tables)
- [ ] productCostAdjustments - cost adjustment headers
- [ ] productCostAdjustmentLines - cost adjustment details

### TODO: Manufacturing (1 table)
- [ ] manufacturingOrders - work orders

### Computed/View (1 table)
- [ ] productSummary - aggregated product data (may be view-only)

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
| `npm run generate` | Build mock.db with all tables populated |
| `npm run typecheck` | Type check without emitting |
| `npm run build` | Compile to dist/ |
