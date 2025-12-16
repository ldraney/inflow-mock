# inflow-mock

**Primary purpose: Generate a comprehensive mock database** that exercises every table in inflow-get's schema. This proves deep expertise with the data model and provides realistic test data for demos.

Secondary purpose: A library to detect and fix data quality issues.

## Current Status

**Table Coverage: 16/37 (43%)**

- [x] Project structure (TypeScript, Drizzle, better-sqlite3)
- [x] Database schema (uses inflow-get schema, 37 tables)
- [x] Core baseline generator (products, orders, inventory)
- [ ] Complete table coverage (see roadmap below)
- [ ] Patterns (create/detect/fix modules)
- [ ] Scoring system

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

## Quick Start

```bash
npm install
npm run generate                           # Generate combined.db
npm run generate -- --products=200         # Custom product count
npm run generate -- --seed=12345           # Reproducible output
```

## What This Repo Produces

### 1. The Database (primary output)
A SQLite DB with **comprehensive mock data** covering all 37 tables in the inflow-get schema. Demonstrates deep understanding of the data model with realistic manufacturing inventory data.

```
data/
  combined.db    # generated, gitignored
```

Goal: 100% table coverage with realistic, interconnected data.

### 2. The Library (secondary output)
Detect and fix code for each data quality pattern. Consumers import this to identify and resolve problems.

```typescript
import { baseline, patterns, createDb, schema } from 'inflow-mock'

// Generate clean data (100 products, 20 customers, 15 vendors, 60 sales orders)
const clean = baseline.generate({ products: 100, customers: 20, vendors: 15 })

// Or detect/fix issues in existing data
const dupes = patterns.duplicates.detect(db)
const fixes = patterns.duplicates.fix(dupes)
```

## Project Structure

```
src/
├── index.ts              # Main entry point
├── generate.ts           # CLI script to build combined.db
├── db/
│   ├── schema.ts         # Re-exports inflow-get schema
│   └── index.ts          # DB connection + table creation
├── baseline/
│   ├── generator.ts      # Seeded random data generator
│   └── index.ts
└── patterns/
    ├── index.ts          # Pattern exports
    ├── duplicates/
    ├── missing-reorder/
    ├── sku-chaos/
    ├── vendor-sprawl/
    ├── category-mess/
    ├── orphaned-records/
    └── naming-anarchy/
```

## The Core Insight

**Patterns are symmetric.** If you can create a type of mess, you can detect and fix it. The create/detect/fix code lives together because they're two sides of the same coin.

## Definition of Clean

Data is "clean" when:

### Products
- Unique name (no duplicates within fuzzy threshold)
- SKU present and follows detected pattern
- Category assigned
- Vendor assigned
- Reorder point set (> 0)
- Reorder quantity set (> 0)
- Name follows detected naming convention

### Vendors
- No duplicates (fuzzy match on name)
- At least one product references it

### Categories
- No duplicates
- At least one product references it

### Customers
- Unique name (no duplicates)
- Valid contact info (email, phone)
- At least one sales order references it

### Relationships
- All foreign keys resolve (no orphaned references)

## Patterns

Each pattern is a self-contained module:

| Pattern | The Mess | The Value |
|---------|----------|-----------|
| `duplicates` | Same product entered multiple ways | Detect & merge |
| `missing-reorder` | No safety stock settings | Predict stockouts |
| `sku-chaos` | Multiple formats, missing SKUs | Standardize |
| `vendor-sprawl` | "Acme", "ACME Inc", "Acme LLC" | Normalize |
| `category-mess` | Flat, overlapping, inconsistent | Consolidate |
| `orphaned-records` | Deleted vendors still referenced | Fix broken refs |
| `naming-anarchy` | No product naming convention | Detect patterns |

## Pattern Structure

Each pattern exports three things:

```
src/patterns/{pattern-name}/
  create.ts    # (db, options) => corrupts data in place
  detect.ts    # (db) => issues found
  fix.ts       # (issues) => fixes or SQL mutations
  index.ts     # exports { create, detect, fix }
```

## Adding a New Pattern

1. Create the pattern directory
2. Write `create.ts` that replicates the mess
3. Write `detect.ts` that surfaces it
4. Write `fix.ts` that resolves it
5. Add to `src/patterns/index.ts`

## Scoring

Cleanliness is measurable:

```
Score = (clean records / total records) * 100
```

Weighted by severity:
- **Critical**: Missing reorder points (stockout risk)
- **High**: Duplicate products (inventory confusion)
- **Medium**: SKU violations (operational friction)
- **Low**: Naming inconsistencies (cosmetic)

## Consumers

- **inflow-demo** - ingests generated DBs, shows progressive cleanup
- **inflow-app** - uses detect code to surface issues in real data
- **inflow-put** - uses fix code to generate write operations

## Related Repos

- `inflow-tools` - meta repo, roadmap, architecture
- `inflow-get` - **primary dependency** - Drizzle schema, DB structure, types
- `inflow-materialize` - views (may share detect SQL)
- `inflow-demo` - consumes this library for demos

## Tech Stack

- TypeScript (ESM)
- Drizzle ORM
- better-sqlite3
- tsx (for running scripts)

## Commands

| Command | Description |
|---------|-------------|
| `npm run generate` | Build combined.db with baseline + patterns |
| `npm run typecheck` | Type check without emitting |
| `npm run build` | Compile to dist/ |
