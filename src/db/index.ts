/**
 * Database connection - uses inflow-get's createDb.
 */

import { createDb, type InflowDb } from 'inflow-get'

export { createDb, type InflowDb as DB }
export * as schema from './schema.js'
