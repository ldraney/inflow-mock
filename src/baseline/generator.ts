/**
 * Baseline data generator.
 * Creates clean, realistic manufacturing inventory data.
 */

import type { Vendor, Category, Product } from '../db/schema.js'
import {
  vendorTemplates,
  categoryTemplates,
  productTemplates,
  dimensions,
  emailDomains,
  areaCodes,
} from './data.js'

export interface GenerateOptions {
  products?: number
  vendors?: number
  categories?: number
  seed?: number
}

export interface BaselineData {
  vendors: Vendor[]
  categories: Category[]
  products: Product[]
}

// Simple seeded random for reproducibility
class SeededRandom {
  private seed: number

  constructor(seed: number) {
    this.seed = seed
  }

  next(): number {
    this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff
    return this.seed / 0x7fffffff
  }

  pick<T>(arr: T[]): T {
    return arr[Math.floor(this.next() * arr.length)]
  }

  range(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min
  }

  rangeFloat(min: number, max: number): number {
    return this.next() * (max - min) + min
  }

  shuffle<T>(arr: T[]): T[] {
    const result = [...arr]
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1))
      ;[result[i], result[j]] = [result[j], result[i]]
    }
    return result
  }
}

function generateVendor(template: typeof vendorTemplates[0], index: number, rng: SeededRandom): Vendor {
  const firstName = rng.pick(['John', 'Sarah', 'Mike', 'Lisa', 'Tom', 'Karen', 'Dave', 'Amy'])
  const lastName = rng.pick(['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Wilson'])
  const domain = template.name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 12)
  const areaCode = rng.pick(areaCodes)

  return {
    name: template.name,
    contactName: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}.com`,
    phone: `(${areaCode}) ${rng.range(200, 999)}-${rng.range(1000, 9999)}`,
    address: `${rng.range(100, 9999)} ${rng.pick(['Industrial', 'Commerce', 'Factory', 'Manufacturing', 'Enterprise'])} ${rng.pick(['Blvd', 'Dr', 'Ave', 'Pkwy', 'Way'])}`,
    createdAt: new Date(Date.now() - rng.range(0, 365 * 2) * 24 * 60 * 60 * 1000).toISOString(),
  }
}

function generateCategory(template: typeof categoryTemplates[0], index: number, rng: SeededRandom): Category {
  return {
    name: template.name,
    description: template.description,
    parentId: null,
    createdAt: new Date(Date.now() - rng.range(0, 365 * 2) * 24 * 60 * 60 * 1000).toISOString(),
  }
}

function expandNamePattern(pattern: string, rng: SeededRandom): string {
  return pattern
    .replace('{size}', rng.pick(dimensions.boltSizes))
    .replace('{length}', rng.pick(dimensions.lengths))
    .replace('{thickness}', rng.pick(dimensions.thicknesses))
    .replace('{diameter}', rng.pick(dimensions.diameters))
    .replace('{width}', rng.pick(['4"', '6"', '8"', '12"', '24"', '36"', '48"']))
    .replace('{height}', rng.pick(['4"', '6"', '8"', '12"']))
    .replace('{l}', rng.pick(['12"', '18"', '24"', '36"']))
    .replace('{w}', rng.pick(['12"', '18"', '24"']))
    .replace('{h}', rng.pick(['6"', '12"', '18"', '24"']))
    .replace('{grit}', rng.pick(dimensions.grits))
    .replace('{color}', rng.pick(dimensions.colors))
    .replace('{material}', rng.pick(dimensions.materials))
    .replace('{series}', rng.pick(['6200', '6300', '6000', '6800']))
    .replace('{type}', rng.pick(['Standard', 'Heavy Duty', 'Premium', 'Economy']))
    .replace('{id}', `${rng.range(10, 100)}mm`)
    .replace('{od}', `${rng.range(20, 150)}mm`)
    .replace('{cs}', `${rng.rangeFloat(1.5, 5).toFixed(1)}mm`)
    .replace('{bore}', `${rng.pick(['2"', '3"', '4"', '5"', '6"'])}`)
    .replace('{stroke}', `${rng.pick(['6"', '12"', '18"', '24"', '36"'])}`)
    .replace('{gpm}', `${rng.range(5, 50)}`)
    .replace('{ports}', `${rng.pick(['2', '3', '4'])}`)
    .replace('{pos}', `${rng.pick(['2', '3'])}`)
    .replace('{range}', `${rng.pick(['4mm', '8mm', '12mm', '20mm'])}`)
    .replace('{model}', `${rng.pick(['DL-', 'QM-', 'XC-'])}${rng.range(100, 999)}`)
    .replace('{amps}', `${rng.pick(['10', '20', '30', '50', '100'])}`)
    .replace('{voltage}', `${rng.pick(['12', '24', '48', '120', '240'])}`)
    .replace('{application}', rng.pick(['Pump', 'Cylinder', 'Valve', 'Motor']))
    .replace('{nrr}', `${rng.range(22, 33)}`)
    .replace('{flutes}', `${rng.pick(['2', '3', '4'])}`)
    .replace('{gauge}', `${rng.pick(['10', '12', '14', '16', '18'])}`)
    .replace('{pins}', `${rng.pick(['2', '4', '6', '8', '12'])}`)
    .replace('{hp}', `${rng.pick(['1/4', '1/2', '1', '2', '3', '5', '10'])}`)
    .replace('{rpm}', `${rng.pick(['1200', '1750', '3450'])}`)
    .replace('{grade}', rng.pick(['ISO', 'SAE', 'DIN']))
    .replace('{pitch}', rng.pick(['Fine', 'Coarse']))
}

function generateSku(prefix: string, index: number, rng: SeededRandom): string {
  return `${prefix}-${rng.range(1000, 9999)}`
}

function generateProduct(
  categoryName: string,
  categoryId: number,
  vendorId: number,
  index: number,
  rng: SeededRandom
): Product {
  const templates = productTemplates[categoryName]
  if (!templates || templates.length === 0) {
    throw new Error(`No product templates for category: ${categoryName}`)
  }

  const template = rng.pick(templates)
  const name = expandNamePattern(template.namePattern, rng)
  const sku = generateSku(template.skuPrefix, index, rng)
  const reorderPoint = rng.range(...template.reorderRange)

  return {
    name,
    sku,
    description: `${name} - ${categoryName}`,
    categoryId,
    vendorId,
    unitPrice: Math.round(rng.rangeFloat(...template.priceRange) * 100) / 100,
    unitOfMeasure: template.unitOfMeasure,
    quantityOnHand: rng.range(0, reorderPoint * 3),
    reorderPoint,
    reorderQuantity: Math.round(reorderPoint * rng.rangeFloat(1.5, 3)),
    leadTimeDays: rng.range(3, 21),
    isActive: true,
    createdAt: new Date(Date.now() - rng.range(0, 365 * 2) * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: null,
  }
}

export function generate(options: GenerateOptions = {}): BaselineData {
  const {
    products: productCount = 100,
    vendors: vendorCount = 15,
    categories: categoryCount = 12,
    seed = Date.now(),
  } = options

  const rng = new SeededRandom(seed)

  // Generate vendors
  const vendorPool = rng.shuffle([...vendorTemplates])
  const vendors: Vendor[] = vendorPool
    .slice(0, Math.min(vendorCount, vendorTemplates.length))
    .map((template, i) => generateVendor(template, i, rng))

  // Generate categories
  const categoryPool = rng.shuffle([...categoryTemplates])
  const categories: Category[] = categoryPool
    .slice(0, Math.min(categoryCount, categoryTemplates.length))
    .map((template, i) => generateCategory(template, i, rng))

  // Generate products distributed across categories and vendors
  const products: Product[] = []
  for (let i = 0; i < productCount; i++) {
    const categoryIndex = i % categories.length
    const category = categories[categoryIndex]
    const vendorIndex = i % vendors.length

    // Assign to a vendor that somewhat matches the category specialty
    const product = generateProduct(
      category.name,
      categoryIndex + 1, // 1-indexed IDs
      vendorIndex + 1,   // 1-indexed IDs
      i,
      rng
    )
    products.push(product)
  }

  return { vendors, categories, products }
}

export default { generate }
