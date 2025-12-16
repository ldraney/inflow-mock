# inflow-mock

Generate comprehensive mock databases for cosmetics manufacturing using the inflow-get schema. 100% table coverage (38 tables) with realistic beauty product inventory data including skincare, makeup, hair care, and fragrances.

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

**Vendors (Ingredient & Packaging Suppliers):**
- Pure Botanicals Supply
- Global Fragrance House
- ColorTech Pigments
- Cosmetic Glass & Bottles

**Customers (Beauty Retailers & Spas):**
- Radiant Beauty Co
- Luxe Beauty Supply
- Velvet Touch Spas
- Elite Beauty Stores

**Products:**
- `LP-2464` - Lipstick Rose
- `MO-5711` - Moisturizer 50ml
- `PF-2392` - Perfume Matte
- `SB-1847` - Shea Butter (raw ingredient)
- `JR-3291` - Glass Jar (packaging)

**Features:**
- BOMs for manufacturable cosmetics (formulation recipes)
- Operations: Blending, Mixing, Filling, Labeling, QC Testing
- Multi-location inventory (Climate Controlled, Production Lab, QC)
- Stock transfers, adjustments, counts
- Purchase & sales order history
- Batch tracking custom fields

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
