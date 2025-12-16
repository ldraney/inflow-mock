# inflow-mock

Generate comprehensive mock databases for the inflow-get schema. 100% table coverage (38 tables) with realistic manufacturing inventory data.

## Install

```bash
npm install inflow-mock
```

## Quick Start

### As a Library

```typescript
import { generate, createDb, schema } from 'inflow-mock'

// Using presets
const small = generate({ preset: 'small' })   // 100 products
const medium = generate({ preset: 'medium' }) // 500 products
const large = generate({ preset: 'large' })   // 1000 products

// Custom options
const data = generate({
  products: 250,
  vendors: 30,
  customers: 50,
  seed: 42  // Reproducible
})

// Write to database
const db = createDb('./test.db')  // or ':memory:'
db.insert(schema.products).values(data.products).run()
db.insert(schema.vendors).values(data.vendors).run()
// ... insert other tables
```

### CLI (for local development)

```bash
npm run generate                       # small preset, seed=42
npm run generate -- --preset=large     # 1000 products
npm run generate -- --products=500     # Custom count
npm run generate -- --seed=12345       # Reproducible output
```

Output: `data/mock.db`

## Presets

| Preset | Products | Vendors | Customers | Locations |
|--------|----------|---------|-----------|-----------|
| small  | 100      | 15      | 20        | 3         |
| medium | 500      | 50      | 75        | 4         |
| large  | 1000     | 100     | 150       | 5         |

## Table Coverage (38/38)

**Reference Data:** categories, locations, currencies, paymentTerms, pricingSchemes, taxingSchemes, taxCodes, adjustmentReasons, operationTypes

**Team & Custom Fields:** teamMembers, customFieldDefinitions, customFieldDropdownOptions, customFields

**Core Entities:** vendors, customers, products

**Product Details:** productBarcodes, inventoryLines, itemBoms, productOperations, productPrices, reorderSettings, vendorItems

**Orders:** purchaseOrders, purchaseOrderLines, salesOrders, salesOrderLines, manufacturingOrders

**Stock Operations:** stockTransfers, stockTransferLines, stockAdjustments, stockAdjustmentLines, stockCounts, countSheets, countSheetLines

**Cost Adjustments:** productCostAdjustments, productCostAdjustmentLines

**Computed:** productSummary

## Sample Generated Data

**Vendors:**
- Precision Fasteners Inc
- Allied Steel Supply
- Global Electronics Distributors

**Products:**
- `HB-2464` - Hex Bolt M10
- `MC-5711` - Motor Controller Large
- `HC-2392` - Hydraulic Cylinder 3/4"

**Features:**
- BOMs for manufacturable products
- Operations with time/cost estimates
- Multi-location inventory
- Stock transfers, adjustments, counts
- Purchase & sales order history

## API

### generate(options?)

Returns `BaselineData` containing arrays for all 38 tables.

```typescript
interface GenerateOptions {
  preset?: 'small' | 'medium' | 'large'
  products?: number
  vendors?: number
  customers?: number
  locations?: number
  seed?: number
}
```

### createDb(path)

Creates a Drizzle database connection.

### schema

Re-exports the inflow-get schema for inserts.

## License

ISC
