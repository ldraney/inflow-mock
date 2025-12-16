/**
 * Baseline data generator for inflow-get schema.
 * Creates clean, realistic manufacturing inventory data.
 */

import * as schema from '../db/schema.js'

// Infer insert types from schema
type Category = typeof schema.categories.$inferInsert
type Location = typeof schema.locations.$inferInsert
type Currency = typeof schema.currencies.$inferInsert
type PaymentTerms = typeof schema.paymentTerms.$inferInsert
type PricingScheme = typeof schema.pricingSchemes.$inferInsert
type Vendor = typeof schema.vendors.$inferInsert
type Customer = typeof schema.customers.$inferInsert
type Product = typeof schema.products.$inferInsert
type InventoryLine = typeof schema.inventoryLines.$inferInsert
type ProductPrice = typeof schema.productPrices.$inferInsert
type ReorderSetting = typeof schema.reorderSettings.$inferInsert
type VendorItem = typeof schema.vendorItems.$inferInsert
type PurchaseOrder = typeof schema.purchaseOrders.$inferInsert
type PurchaseOrderLine = typeof schema.purchaseOrderLines.$inferInsert
type SalesOrder = typeof schema.salesOrders.$inferInsert
type SalesOrderLine = typeof schema.salesOrderLines.$inferInsert

export interface GenerateOptions {
  products?: number
  vendors?: number
  customers?: number
  locations?: number
  seed?: number
}

export interface BaselineData {
  categories: Category[]
  locations: Location[]
  currencies: Currency[]
  paymentTerms: PaymentTerms[]
  pricingSchemes: PricingScheme[]
  vendors: Vendor[]
  customers: Customer[]
  products: Product[]
  inventoryLines: InventoryLine[]
  productPrices: ProductPrice[]
  reorderSettings: ReorderSetting[]
  vendorItems: VendorItem[]
  purchaseOrders: PurchaseOrder[]
  purchaseOrderLines: PurchaseOrderLine[]
  salesOrders: SalesOrder[]
  salesOrderLines: SalesOrderLine[]
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

  pickMultiple<T>(arr: T[], count: number): T[] {
    const shuffled = this.shuffle([...arr])
    return shuffled.slice(0, Math.min(count, arr.length))
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

  uuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.floor(this.next() * 16)
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  date(daysAgo: number = 365): string {
    const d = new Date(Date.now() - this.range(0, daysAgo) * 24 * 60 * 60 * 1000)
    return d.toISOString().split('T')[0]
  }

  timestamp(): string {
    return new Date().toISOString()
  }
}

// Template data
const categoryNames = [
  'Fasteners', 'Raw Materials', 'Bearings', 'Electronics', 'Hydraulics',
  'Seals & Gaskets', 'Safety Equipment', 'Tooling', 'Electrical', 'Lubricants',
  'Abrasives', 'Packaging', 'Pneumatics', 'Motors', 'Pumps',
]

const locationNames = [
  { name: 'Main Warehouse', abbr: 'MAIN' },
  { name: 'Secondary Storage', abbr: 'SEC' },
  { name: 'Production Floor', abbr: 'PROD' },
  { name: 'Receiving Dock', abbr: 'RECV' },
  { name: 'Shipping Area', abbr: 'SHIP' },
]

const vendorNames = [
  'Precision Fasteners Inc', 'Allied Steel Supply', 'Midwest Industrial Components',
  'Global Electronics Distributors', 'National Bearing Company', 'Thompson Plastics',
  'Valley Machine Parts', 'Premier Rubber Products', 'Central Hydraulics',
  'United Electrical Supply', 'American Tubing Corp', 'Quality Seal Systems',
  'Industrial Adhesives Ltd', 'Metro Packaging Solutions', 'Coastal Abrasives',
]

const customerNames = [
  'Acme Manufacturing', 'Summit Industries', 'Pinnacle Products', 'Atlas Fabrication',
  'Frontier Engineering', 'Apex Machining', 'Prime Assembly', 'Titan Manufacturing',
  'Sterling Products', 'Vanguard Industries', 'Eagle Precision', 'Liberty Manufacturing',
  'Patriot Products', 'Champion Industries', 'Victory Manufacturing', 'Horizon Fabrication',
  'Pioneer Products', 'Guardian Manufacturing', 'Sentinel Industries', 'Phoenix Assembly',
]

const productTemplates = [
  { prefix: 'HB', name: 'Hex Bolt', category: 'Fasteners', uom: 'EA' },
  { prefix: 'SC', name: 'Socket Cap Screw', category: 'Fasteners', uom: 'EA' },
  { prefix: 'HN', name: 'Hex Nut', category: 'Fasteners', uom: 'EA' },
  { prefix: 'SP', name: 'Steel Plate', category: 'Raw Materials', uom: 'EA' },
  { prefix: 'AB', name: 'Aluminum Bar', category: 'Raw Materials', uom: 'EA' },
  { prefix: 'BB', name: 'Ball Bearing', category: 'Bearings', uom: 'EA' },
  { prefix: 'RB', name: 'Roller Bearing', category: 'Bearings', uom: 'EA' },
  { prefix: 'PS', name: 'Proximity Sensor', category: 'Electronics', uom: 'EA' },
  { prefix: 'MC', name: 'Motor Controller', category: 'Electronics', uom: 'EA' },
  { prefix: 'HC', name: 'Hydraulic Cylinder', category: 'Hydraulics', uom: 'EA' },
  { prefix: 'HH', name: 'Hydraulic Hose', category: 'Hydraulics', uom: 'EA' },
  { prefix: 'OR', name: 'O-Ring', category: 'Seals & Gaskets', uom: 'EA' },
  { prefix: 'GS', name: 'Gasket Set', category: 'Seals & Gaskets', uom: 'EA' },
  { prefix: 'SG', name: 'Safety Glasses', category: 'Safety Equipment', uom: 'EA' },
  { prefix: 'WG', name: 'Work Gloves', category: 'Safety Equipment', uom: 'PR' },
  { prefix: 'EM', name: 'End Mill', category: 'Tooling', uom: 'EA' },
  { prefix: 'DB', name: 'Drill Bit', category: 'Tooling', uom: 'EA' },
  { prefix: 'WR', name: 'Wire Spool', category: 'Electrical', uom: 'RL' },
  { prefix: 'MT', name: 'Motor', category: 'Motors', uom: 'EA' },
  { prefix: 'GW', name: 'Grinding Wheel', category: 'Abrasives', uom: 'EA' },
]

const sizes = ['Small', 'Medium', 'Large', 'XL', '1/4"', '3/8"', '1/2"', '3/4"', '1"', 'M6', 'M8', 'M10', 'M12']

export function generate(options: GenerateOptions = {}): BaselineData {
  const {
    products: productCount = 100,
    vendors: vendorCount = 15,
    customers: customerCount = 20,
    locations: locationCount = 3,
    seed = Date.now(),
  } = options

  const rng = new SeededRandom(seed)

  // Generate reference data
  const currencies: Currency[] = [{
    currencyId: rng.uuid(),
    name: 'US Dollar',
    code: 'USD',
    symbol: '$',
    exchangeRate: '1.00',
    isBaseCurrency: true,
    timestamp: rng.timestamp(),
  }]

  const paymentTerms: PaymentTerms[] = [
    { paymentTermsId: rng.uuid(), name: 'Net 30', netDays: 30, timestamp: rng.timestamp() },
    { paymentTermsId: rng.uuid(), name: 'Net 60', netDays: 60, timestamp: rng.timestamp() },
    { paymentTermsId: rng.uuid(), name: 'Due on Receipt', netDays: 0, timestamp: rng.timestamp() },
  ]

  const pricingSchemes: PricingScheme[] = [
    { pricingSchemeId: rng.uuid(), name: 'Standard', isDefault: true, timestamp: rng.timestamp() },
    { pricingSchemeId: rng.uuid(), name: 'Wholesale', isDefault: false, timestamp: rng.timestamp() },
  ]

  const categories: Category[] = categoryNames.slice(0, Math.min(12, categoryNames.length)).map(name => ({
    categoryId: rng.uuid(),
    name,
    isActive: true,
    timestamp: rng.timestamp(),
  }))

  const locations: Location[] = locationNames.slice(0, locationCount).map(loc => ({
    locationId: rng.uuid(),
    name: loc.name,
    abbreviation: loc.abbr,
    isActive: true,
    isShippable: loc.abbr === 'SHIP',
    isReceivable: loc.abbr === 'RECV' || loc.abbr === 'MAIN',
    timestamp: rng.timestamp(),
  }))

  // Generate vendors
  const vendors: Vendor[] = rng.shuffle([...vendorNames]).slice(0, vendorCount).map(name => ({
    vendorId: rng.uuid(),
    name,
    vendorCode: name.split(' ').map(w => w[0]).join('').toUpperCase(),
    isActive: true,
    currencyId: currencies[0].currencyId,
    paymentTermsId: rng.pick(paymentTerms).paymentTermsId,
    timestamp: rng.timestamp(),
  }))

  // Generate customers
  const customers: Customer[] = rng.shuffle([...customerNames]).slice(0, customerCount).map(name => ({
    customerId: rng.uuid(),
    name,
    customerCode: name.split(' ').map(w => w[0]).join('').toUpperCase(),
    isActive: true,
    currencyId: currencies[0].currencyId,
    pricingSchemeId: rng.pick(pricingSchemes).pricingSchemeId,
    paymentTermsId: rng.pick(paymentTerms).paymentTermsId,
    timestamp: rng.timestamp(),
  }))

  // Generate products
  const products: Product[] = []
  const inventoryLines: InventoryLine[] = []
  const productPrices: ProductPrice[] = []
  const reorderSettings: ReorderSetting[] = []
  const vendorItems: VendorItem[] = []

  for (let i = 0; i < productCount; i++) {
    const template = rng.pick(productTemplates)
    const size = rng.pick(sizes)
    const category = categories.find(c => c.name === template.category) || rng.pick(categories)
    const vendor = rng.pick(vendors)

    const productId = rng.uuid()
    const sku = `${template.prefix}-${rng.range(1000, 9999)}`
    const unitPrice = rng.rangeFloat(5, 500).toFixed(2)
    const cost = (parseFloat(unitPrice) * rng.rangeFloat(0.4, 0.7)).toFixed(2)

    products.push({
      productId,
      name: `${template.name} ${size}`,
      description: `${template.name} - ${size} size`,
      sku,
      itemType: 'Stock',
      isActive: true,
      categoryId: category.categoryId,
      standardUomName: template.uom,
      timestamp: rng.timestamp(),
    })

    // Add inventory at each location
    for (const location of locations) {
      const qty = rng.range(0, 200)
      if (qty > 0) {
        inventoryLines.push({
          inventoryLineId: rng.uuid(),
          productId,
          locationId: location.locationId,
          quantityOnHand: qty.toString(),
          timestamp: rng.timestamp(),
        })
      }
    }

    // Add pricing
    productPrices.push({
      productPriceId: rng.uuid(),
      productId,
      pricingSchemeId: pricingSchemes[0].pricingSchemeId,
      priceType: 'Fixed',
      unitPrice,
      timestamp: rng.timestamp(),
    })

    // Add reorder settings for main location
    const mainLocation = locations[0]
    reorderSettings.push({
      reorderSettingsId: rng.uuid(),
      productId,
      locationId: mainLocation.locationId,
      vendorId: vendor.vendorId,
      enableReordering: true,
      reorderMethod: 'ReorderPoint',
      reorderPoint: rng.range(10, 50).toString(),
      reorderQuantity: rng.range(50, 200).toString(),
      timestamp: rng.timestamp(),
    })

    // Add vendor item
    vendorItems.push({
      vendorItemId: rng.uuid(),
      vendorId: vendor.vendorId,
      productId,
      vendorItemCode: sku,
      cost,
      leadTimeDays: rng.range(3, 21),
      lineNum: 1,
      timestamp: rng.timestamp(),
    })
  }

  // Generate purchase orders
  const purchaseOrders: PurchaseOrder[] = []
  const purchaseOrderLines: PurchaseOrderLine[] = []
  const poCount = Math.floor(vendorCount * 2)

  for (let i = 0; i < poCount; i++) {
    const vendor = rng.pick(vendors)
    const location = rng.pick(locations)
    const poId = rng.uuid()
    const status = rng.pick(['Open', 'Open', 'Open', 'Received', 'Received', 'PartiallyReceived'])
    const orderDate = rng.date(90)

    purchaseOrders.push({
      purchaseOrderId: poId,
      orderNumber: `PO-${1000 + i}`,
      vendorId: vendor.vendorId,
      status,
      orderDate,
      expectedDate: rng.date(30),
      locationId: location.locationId,
      currencyId: currencies[0].currencyId,
      exchangeRate: '1.00',
      timestamp: rng.timestamp(),
    })

    // Add 1-5 lines per PO
    const lineCount = rng.range(1, 5)
    const poProducts = rng.pickMultiple(products, lineCount)
    let subtotal = 0

    for (let j = 0; j < poProducts.length; j++) {
      const product = poProducts[j]
      const vendorItem = vendorItems.find(vi => vi.productId === product.productId)
      const qty = rng.range(10, 100)
      const unitCost = vendorItem?.cost || rng.rangeFloat(5, 100).toFixed(2)
      const lineTotal = qty * parseFloat(unitCost)
      subtotal += lineTotal

      purchaseOrderLines.push({
        purchaseOrderLineId: rng.uuid(),
        purchaseOrderId: poId,
        productId: product.productId,
        lineNum: j + 1,
        description: product.name,
        quantity: qty.toString(),
        unitCost,
        lineTotal: lineTotal.toFixed(2),
        quantityReceived: status === 'Received' ? qty.toString() : '0',
        timestamp: rng.timestamp(),
      })
    }

    // Update PO totals
    const po = purchaseOrders.find(p => p.purchaseOrderId === poId)!
    po.subtotal = subtotal.toFixed(2)
    po.total = subtotal.toFixed(2)
  }

  // Generate sales orders
  const salesOrders: SalesOrder[] = []
  const salesOrderLines: SalesOrderLine[] = []
  const soCount = Math.floor(customerCount * 3)

  for (let i = 0; i < soCount; i++) {
    const customer = rng.pick(customers)
    const location = rng.pick(locations)
    const soId = rng.uuid()
    const status = rng.pick(['Open', 'Open', 'Shipped', 'Shipped', 'Shipped', 'PartiallyShipped'])
    const orderDate = rng.date(90)

    salesOrders.push({
      salesOrderId: soId,
      orderNumber: `SO-${2000 + i}`,
      customerId: customer.customerId,
      status,
      orderDate,
      expectedShipDate: rng.date(14),
      locationId: location.locationId,
      currencyId: currencies[0].currencyId,
      exchangeRate: '1.00',
      timestamp: rng.timestamp(),
    })

    // Add 1-5 lines per SO
    const lineCount = rng.range(1, 5)
    const soProducts = rng.pickMultiple(products, lineCount)
    let subtotal = 0

    for (let j = 0; j < soProducts.length; j++) {
      const product = soProducts[j]
      const price = productPrices.find(pp => pp.productId === product.productId)
      const qty = rng.range(1, 50)
      const unitPrice = price?.unitPrice || rng.rangeFloat(10, 200).toFixed(2)
      const lineTotal = qty * parseFloat(unitPrice)
      subtotal += lineTotal

      salesOrderLines.push({
        salesOrderLineId: rng.uuid(),
        salesOrderId: soId,
        productId: product.productId,
        lineNum: j + 1,
        description: product.name,
        quantity: qty.toString(),
        unitPrice,
        lineTotal: lineTotal.toFixed(2),
        quantityPicked: status === 'Shipped' ? qty.toString() : '0',
        quantityShipped: status === 'Shipped' ? qty.toString() : '0',
        timestamp: rng.timestamp(),
      })
    }

    // Update SO totals
    const so = salesOrders.find(s => s.salesOrderId === soId)!
    so.subtotal = subtotal.toFixed(2)
    so.total = subtotal.toFixed(2)
  }

  return {
    categories,
    locations,
    currencies,
    paymentTerms,
    pricingSchemes,
    vendors,
    customers,
    products,
    inventoryLines,
    productPrices,
    reorderSettings,
    vendorItems,
    purchaseOrders,
    purchaseOrderLines,
    salesOrders,
    salesOrderLines,
  }
}

export default { generate }
