# inflow-mock

Generate messy manufacturing databases and provide detection/fix libraries for common data quality patterns.

## Install

```bash
npm install
```

## Usage

### Generate a Database

```bash
npm run generate                    # 100 products, seed=42
npm run generate -- --products=200  # More products
npm run generate -- --seed=12345    # Different seed
```

Output: `data/combined.db` (gitignored)

### As a Library

```typescript
import { baseline, patterns, createDb, schema } from 'inflow-mock'

// Generate clean baseline data
const data = baseline.generate({ products: 100, vendors: 15, seed: 42 })

// Create and populate a database
const db = createDb('./my-test.db')
await db.insert(schema.vendors).values(data.vendors)
await db.insert(schema.products).values(data.products)

// Detect issues (once patterns are implemented)
// const dupes = patterns.duplicates.detect(db)
// const fixes = patterns.duplicates.fix(dupes)
```

## What It Does

1. **Baseline Generator** - Creates clean, realistic manufacturing inventory data (vendors, categories, products with SKUs, reorder points, etc.)

2. **Pattern Library** - Each pattern can:
   - `create` - Corrupt clean data in a specific way
   - `detect` - Find instances of that corruption
   - `fix` - Generate corrections

## Patterns

| Pattern | Creates | Detects & Fixes |
|---------|---------|-----------------|
| `duplicates` | Same product, different names | Fuzzy matching & merge |
| `missing-reorder` | Null reorder points | Stockout risk identification |
| `sku-chaos` | Inconsistent SKU formats | Pattern detection & standardization |
| `vendor-sprawl` | "Acme" vs "ACME Inc" | Vendor deduplication |
| `category-mess` | Overlapping categories | Consolidation suggestions |
| `orphaned-records` | Broken foreign keys | Reference repair |
| `naming-anarchy` | Inconsistent product names | Convention detection |

## Sample Generated Data

**Vendors:**
- United Electrical Supply
- American Tubing Corp
- Midwest Industrial Components

**Products:**
- `HB-2464` - Hex Bolt M10 x 25mm
- `MC-5711` - Motor Controller 30A
- `HC-2392` - Hydraulic Cylinder 6" x 36"

## Development

```bash
npm run typecheck  # Type check
npm run build      # Compile to dist/
```

## License

ISC
