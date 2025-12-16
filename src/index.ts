/**
 * inflow-mock
 *
 * Generate comprehensive mock databases for the inflow-get schema.
 *
 * @example
 * ```typescript
 * import { generate, createDb } from 'inflow-mock'
 *
 * // Using presets
 * const small = generate({ preset: 'small' })   // 100 products
 * const large = generate({ preset: 'large' })   // 1000 products
 *
 * // Custom options
 * const data = generate({ products: 500, seed: 42 })
 *
 * // Write to database
 * const db = createDb('./my-test.db')
 * await db.insert(schema.products).values(data.products)
 * ```
 */

// Main API
export { generate, type GenerateOptions, type BaselineData, type Preset } from './baseline/index.js'

// Database utilities
export { createDb, schema, type DB } from './db/index.js'
