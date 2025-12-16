# inflow-mock

Two outputs: a messy database and a library to fix it.

## Current Status

- [x] Project structure (TypeScript, Drizzle, better-sqlite3)
- [x] Database schema (local, TODO: swap for inflow-get)
- [x] Baseline generator (clean manufacturing data)
- [ ] Patterns (create/detect/fix modules)
- [ ] Scoring system

## Quick Start

```bash
npm install
npm run generate                           # Generate combined.db
npm run generate -- --products=200         # Custom product count
npm run generate -- --seed=12345           # Reproducible output
```

## What This Repo Produces

### 1. The Database (gitignored)
A SQLite DB with **all known problems combined**. Every pattern's mess layered into one realistic disaster.

```
data/
  combined.db    # generated, gitignored - the messy carpet
```

### 2. The Library (the vacuum)
Detect and fix code for each pattern. Consumers import this to identify and resolve problems.

```typescript
import { baseline, patterns, createDb, schema } from 'inflow-mock'

// Generate clean data
const clean = baseline.generate({ products: 100, vendors: 15 })

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
│   ├── schema.ts         # Drizzle schema (TODO: swap for inflow-get)
│   └── index.ts          # DB connection + table creation
├── baseline/
│   ├── data.ts           # Manufacturing templates
│   ├── generator.ts      # Seeded random generator
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
