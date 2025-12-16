# inflow-mock

Generate comprehensive mock data for cosmetics manufacturing using the inflow-get schema. Provides realistic test data for beauty product manufacturing demos including skincare, makeup, hair care, and fragrances.

## Current Status

**Table Coverage: 38/38 (100%)**

- [x] Project structure (TypeScript, Drizzle, better-sqlite3)
- [x] Database schema (uses inflow-get schema, 38 tables)
- [x] Complete baseline generator (all tables populated)
- [x] Works as npm library (importable by other projects)
- [x] Cosmetics-specific product catalog (finished products, raw ingredients, packaging)

## Quick Start

```bash
npm install
npm run generate                           # Generate mock.db
npm run generate -- --products=200         # Custom product count
npm run generate -- --seed=12345           # Reproducible output
```

## What This Repo Produces

A SQLite DB with **comprehensive cosmetics manufacturing mock data** covering all 38 tables in the inflow-get schema.

```
data/
  mock.db    # generated, gitignored
```

## Library Usage

```typescript
import { generate, createDb, schema } from 'inflow-mock'

// Generate data (returns 38 collections)
const data = generate({ products: 100, customers: 20, vendors: 15 })

// Create database and insert
const db = createDb('./test.db')  // or ':memory:' for in-memory
db.insert(schema.products).values(data.products).run()
db.insert(schema.customers).values(data.customers).run()
// ... etc
```

## Cosmetics Product Categories

### Finished Products (Manufacturable)
- **Face Care**: Foundation, Concealer, Face Mask, Cleanser, Toner
- **Color Cosmetics**: Blush, Eyeshadow Palette
- **Eye Products**: Mascara, Eyeliner
- **Lip Products**: Lipstick, Lip Gloss
- **Skincare**: Moisturizer, Serum, Sunscreen
- **Hair Care**: Shampoo, Conditioner
- **Body Care**: Body Lotion, Body Wash
- **Fragrances**: Perfume
- **Nail Care**: Nail Polish

### Raw Ingredients (Purchased)
- Shea Butter, Coconut Oil, Jojoba Oil
- Vitamin E, Hyaluronic Acid, Glycerin
- Pigment Powder, Fragrance Oil
- Emulsifier, Preservative

### Packaging Materials (Purchased)
- Gift Box, Tube Container, Glass Jar
- Pump Bottle, Product Label

## Table Coverage

### Reference Data (9 tables)
- [x] categories (12 records) - Face Care, Body Care, Hair Care, Fragrances, etc.
- [x] locations (3 records) - Main Warehouse, Climate Controlled, Production Lab, QC, Packaging
- [x] currencies (1 record)
- [x] paymentTerms (4 records)
- [x] pricingSchemes (3 records)
- [x] taxingSchemes (2 records)
- [x] taxCodes (3 records)
- [x] adjustmentReasons (8 records) - includes QC Rejection, Expired Product
- [x] operationTypes (8 records) - Blending, Mixing, Filling, Labeling, QC Testing

### Team & Custom Fields (4 tables)
- [x] teamMembers (5 records)
- [x] customFieldDefinitions (4 records) - Batch Number, Shelf Life, QC Approved By
- [x] customFieldDropdownOptions (1 record)
- [x] customFields (1 record)

### Core Entities (3 tables)
- [x] vendors (15 records) - ingredient & packaging suppliers
- [x] customers (20 records) - beauty retailers, spas, distributors
- [x] products (100 records) - cosmetics, ingredients, packaging

### Product Details (7 tables)
- [x] productBarcodes (~86 records)
- [x] inventoryLines (~300 records)
- [x] itemBoms (~76 records) - formulation recipes
- [x] productOperations (~39 records) - manufacturing steps
- [x] productPrices (300 records)
- [x] reorderSettings (100 records)
- [x] vendorItems (100 records)

### Orders (5 tables)
- [x] purchaseOrders (30 records)
- [x] purchaseOrderLines (~89 records)
- [x] salesOrders (60 records)
- [x] salesOrderLines (~168 records)
- [x] manufacturingOrders (~11 records) - batch production

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
| `npm run generate` | Build mock.db with all 38 tables populated |
| `npm run typecheck` | Type check without emitting |
| `npm run build` | Compile to dist/ |
