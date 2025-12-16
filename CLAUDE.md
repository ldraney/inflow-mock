# inflow-mock

Two outputs: a messy database and a library to fix it.

## What This Repo Produces

### 1. The Database (gitignored)
A SQLite DB with **all known problems combined**. Every pattern's mess layered into one realistic disaster. This is the "before" that demos consume.

```
data/
  combined.db    # generated, gitignored - the messy carpet
```

### 2. The Library (the vacuum)
Detect and fix code for each pattern. Consumers import this to identify and resolve problems - whether in the generated DB or real client data.

```typescript
import { patterns, score } from 'inflow-mock'

// Detect issues
const dupes = patterns.duplicates.detect(db)

// Fix them
const fixes = patterns.duplicates.fix(dupes)
```

## Build Order

1. **Baseline** - clean data covering every entity in inflow-get's Drizzle schema, realistic manufacturing workflows
2. **Patterns** - each pattern corrupts the baseline in a known way
3. **Generate** - run script, output combined.db with all patterns applied
4. **Export** - library provides detect/fix for each pattern

No seed files. TypeScript generates the DB directly using Drizzle from inflow-get:

```typescript
import { db, schema } from 'inflow-get'
import { baseline } from './baseline'
import { patterns } from './patterns'

// Generate clean data
const clean = baseline.generate({ products: 100, vendors: 15 })

// Insert via Drizzle (type-safe)
await db.insert(schema.products).values(clean.products)
await db.insert(schema.vendors).values(clean.vendors)

// Corrupt in place
await patterns.duplicates.create(db, { severity: 0.2 })
await patterns.skuChaos.create(db, { severity: 0.3 })

// DB now has realistic mess
```

## The Core Insight

**Patterns are symmetric.** If you can create a type of mess, you can detect and fix it. The create/detect/fix code lives together because they're two sides of the same coin.

## Why This Exists

We're making the carpet dirty so we can show how the vacuum works.

1. **Generate the mess** - combined.db has every problem we know how to fix
2. **Export the fixes** - library provides detect/fix for each pattern
3. **Demos consume both** - inflow-demo imports the DB + uses the library to clean it
4. **Real products use the library** - same detect/fix code works on client data

## Definition of Clean

This is the contract. Data is "clean" when:

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
  create.ts    # (cleanData, options) => messyData
  detect.ts    # SQL or function to surface the problem
  fix.ts       # (issues) => fixes or SQL mutations
  index.ts     # exports { create, detect, fix }
```

## Adding a New Pattern

When you find new mess in real client data:

1. Create the pattern directory
2. Write `create.ts` that replicates the mess
3. Write `detect.ts` that surfaces it
4. Write `fix.ts` that resolves it
5. Add to the pattern index
6. Pattern is now part of the library

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

## Tech Decisions

- TypeScript
- Uses Drizzle schema from `inflow-get` (single source of truth for DB structure)
- Type-safe inserts via Drizzle
- Detect code should be portable to SQL views where possible
