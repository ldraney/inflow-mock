/**
 * Pattern exports.
 * Each pattern provides create/detect/fix functions.
 */

// Import patterns as they're implemented
// import * as duplicates from './duplicates/index.js'
// import * as missingReorder from './missing-reorder/index.js'
// import * as skuChaos from './sku-chaos/index.js'
// import * as vendorSprawl from './vendor-sprawl/index.js'
// import * as categoryMess from './category-mess/index.js'
// import * as orphanedRecords from './orphaned-records/index.js'
// import * as namingAnarchy from './naming-anarchy/index.js'

export const patterns = {
  // duplicates,
  // missingReorder,
  // skuChaos,
  // vendorSprawl,
  // categoryMess,
  // orphanedRecords,
  // namingAnarchy,
}

export type PatternName = keyof typeof patterns
