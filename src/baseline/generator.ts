/**
 * Baseline data generator for inflow-get schema.
 * Creates clean, realistic manufacturing inventory data.
 * Goal: 100% table coverage (38 tables)
 */

import * as schema from '../db/schema.js'

// Infer insert types from schema
type Category = typeof schema.categories.$inferInsert
type Location = typeof schema.locations.$inferInsert
type Currency = typeof schema.currencies.$inferInsert
type PaymentTerms = typeof schema.paymentTerms.$inferInsert
type PricingScheme = typeof schema.pricingSchemes.$inferInsert
type TaxingScheme = typeof schema.taxingSchemes.$inferInsert
type TaxCode = typeof schema.taxCodes.$inferInsert
type AdjustmentReason = typeof schema.adjustmentReasons.$inferInsert
type OperationType = typeof schema.operationTypes.$inferInsert
type TeamMember = typeof schema.teamMembers.$inferInsert
type CustomFieldDefinition = typeof schema.customFieldDefinitions.$inferInsert
type CustomFieldDropdownOption = typeof schema.customFieldDropdownOptions.$inferInsert
type CustomFields = typeof schema.customFields.$inferInsert
type Vendor = typeof schema.vendors.$inferInsert
type Customer = typeof schema.customers.$inferInsert
type Product = typeof schema.products.$inferInsert
type ProductBarcode = typeof schema.productBarcodes.$inferInsert
type InventoryLine = typeof schema.inventoryLines.$inferInsert
type ItemBom = typeof schema.itemBoms.$inferInsert
type ProductOperation = typeof schema.productOperations.$inferInsert
type ProductPrice = typeof schema.productPrices.$inferInsert
type ReorderSetting = typeof schema.reorderSettings.$inferInsert
type VendorItem = typeof schema.vendorItems.$inferInsert
type PurchaseOrder = typeof schema.purchaseOrders.$inferInsert
type PurchaseOrderLine = typeof schema.purchaseOrderLines.$inferInsert
type SalesOrder = typeof schema.salesOrders.$inferInsert
type SalesOrderLine = typeof schema.salesOrderLines.$inferInsert
type ManufacturingOrder = typeof schema.manufacturingOrders.$inferInsert
type StockTransfer = typeof schema.stockTransfers.$inferInsert
type StockTransferLine = typeof schema.stockTransferLines.$inferInsert
type StockAdjustment = typeof schema.stockAdjustments.$inferInsert
type StockAdjustmentLine = typeof schema.stockAdjustmentLines.$inferInsert
type ProductCostAdjustment = typeof schema.productCostAdjustments.$inferInsert
type ProductCostAdjustmentLine = typeof schema.productCostAdjustmentLines.$inferInsert
type StockCount = typeof schema.stockCounts.$inferInsert
type CountSheet = typeof schema.countSheets.$inferInsert
type CountSheetLine = typeof schema.countSheetLines.$inferInsert
type ProductSummary = typeof schema.productSummary.$inferInsert

export type Preset = 'small' | 'medium' | 'large'

export interface GenerateOptions {
  /** Preset size: small (100), medium (500), large (1000) products */
  preset?: Preset
  /** Number of products (overrides preset) */
  products?: number
  /** Number of vendors (default: ~15% of products) */
  vendors?: number
  /** Number of customers (default: ~20% of products) */
  customers?: number
  /** Number of locations (default: 3-5) */
  locations?: number
  /** Seed for reproducible generation */
  seed?: number
}

const PRESETS: Record<Preset, { products: number; vendors: number; customers: number; locations: number }> = {
  small: { products: 100, vendors: 15, customers: 20, locations: 3 },
  medium: { products: 500, vendors: 50, customers: 75, locations: 4 },
  large: { products: 1000, vendors: 100, customers: 150, locations: 5 },
}

export interface BaselineData {
  // Reference data (9 tables)
  categories: Category[]
  locations: Location[]
  currencies: Currency[]
  paymentTerms: PaymentTerms[]
  pricingSchemes: PricingScheme[]
  taxingSchemes: TaxingScheme[]
  taxCodes: TaxCode[]
  adjustmentReasons: AdjustmentReason[]
  operationTypes: OperationType[]
  // Team & Custom Fields (4 tables)
  teamMembers: TeamMember[]
  customFieldDefinitions: CustomFieldDefinition[]
  customFieldDropdownOptions: CustomFieldDropdownOption[]
  customFields: CustomFields[]
  // Core entities
  vendors: Vendor[]
  customers: Customer[]
  products: Product[]
  // Product details (4 tables)
  productBarcodes: ProductBarcode[]
  inventoryLines: InventoryLine[]
  itemBoms: ItemBom[]
  productOperations: ProductOperation[]
  productPrices: ProductPrice[]
  reorderSettings: ReorderSetting[]
  vendorItems: VendorItem[]
  // Orders
  purchaseOrders: PurchaseOrder[]
  purchaseOrderLines: PurchaseOrderLine[]
  salesOrders: SalesOrder[]
  salesOrderLines: SalesOrderLine[]
  manufacturingOrders: ManufacturingOrder[]
  // Stock operations (7 tables)
  stockTransfers: StockTransfer[]
  stockTransferLines: StockTransferLine[]
  stockAdjustments: StockAdjustment[]
  stockAdjustmentLines: StockAdjustmentLine[]
  stockCounts: StockCount[]
  countSheets: CountSheet[]
  countSheetLines: CountSheetLine[]
  // Cost adjustments (2 tables)
  productCostAdjustments: ProductCostAdjustment[]
  productCostAdjustmentLines: ProductCostAdjustmentLine[]
  // Computed (1 table)
  productSummary: ProductSummary[]
}

// Simple seeded random for reproducibility
class SeededRandom {
  private seed: number
  private counter: number = 0

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
    // Use counter to guarantee uniqueness, combined with seed-based randomness
    this.counter++
    const counterHex = this.counter.toString(16).padStart(8, '0')
    const randomPart = 'xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.floor(this.next() * 16)
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
    return `${counterHex}-${randomPart}`
  }

  date(daysAgo: number = 365): string {
    const d = new Date(Date.now() - this.range(0, daysAgo) * 24 * 60 * 60 * 1000)
    return d.toISOString().split('T')[0]
  }

  timestamp(): string {
    return new Date().toISOString()
  }

  boolean(probability: number = 0.5): boolean {
    return this.next() < probability
  }

  barcode(): string {
    // Generate realistic UPC-A style barcode
    return Array.from({ length: 12 }, () => this.range(0, 9)).join('')
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

const teamMemberNames = [
  { name: 'John Smith', email: 'jsmith@company.com' },
  { name: 'Sarah Johnson', email: 'sjohnson@company.com' },
  { name: 'Mike Williams', email: 'mwilliams@company.com' },
  { name: 'Emily Davis', email: 'edavis@company.com' },
  { name: 'Robert Brown', email: 'rbrown@company.com' },
]

const adjustmentReasonNames = [
  'Damaged Goods', 'Cycle Count Adjustment', 'Shrinkage', 'Found Inventory',
  'Quality Rejection', 'Expired Product', 'Customer Return', 'Sample/Demo',
]

const operationTypeNames = [
  'Assembly', 'Machining', 'Welding', 'Painting', 'Inspection',
  'Packaging', 'Testing', 'Heat Treatment',
]

const productTemplates = [
  { prefix: 'HB', name: 'Hex Bolt', category: 'Fasteners', uom: 'EA', manufacturable: false },
  { prefix: 'SC', name: 'Socket Cap Screw', category: 'Fasteners', uom: 'EA', manufacturable: false },
  { prefix: 'HN', name: 'Hex Nut', category: 'Fasteners', uom: 'EA', manufacturable: false },
  { prefix: 'SP', name: 'Steel Plate', category: 'Raw Materials', uom: 'EA', manufacturable: false },
  { prefix: 'AB', name: 'Aluminum Bar', category: 'Raw Materials', uom: 'EA', manufacturable: false },
  { prefix: 'BB', name: 'Ball Bearing', category: 'Bearings', uom: 'EA', manufacturable: false },
  { prefix: 'RB', name: 'Roller Bearing', category: 'Bearings', uom: 'EA', manufacturable: false },
  { prefix: 'PS', name: 'Proximity Sensor', category: 'Electronics', uom: 'EA', manufacturable: false },
  { prefix: 'MC', name: 'Motor Controller', category: 'Electronics', uom: 'EA', manufacturable: true },
  { prefix: 'HC', name: 'Hydraulic Cylinder', category: 'Hydraulics', uom: 'EA', manufacturable: true },
  { prefix: 'HH', name: 'Hydraulic Hose', category: 'Hydraulics', uom: 'EA', manufacturable: false },
  { prefix: 'OR', name: 'O-Ring', category: 'Seals & Gaskets', uom: 'EA', manufacturable: false },
  { prefix: 'GS', name: 'Gasket Set', category: 'Seals & Gaskets', uom: 'EA', manufacturable: true },
  { prefix: 'SG', name: 'Safety Glasses', category: 'Safety Equipment', uom: 'EA', manufacturable: false },
  { prefix: 'WG', name: 'Work Gloves', category: 'Safety Equipment', uom: 'PR', manufacturable: false },
  { prefix: 'EM', name: 'End Mill', category: 'Tooling', uom: 'EA', manufacturable: false },
  { prefix: 'DB', name: 'Drill Bit', category: 'Tooling', uom: 'EA', manufacturable: false },
  { prefix: 'WR', name: 'Wire Spool', category: 'Electrical', uom: 'RL', manufacturable: false },
  { prefix: 'MT', name: 'Motor', category: 'Motors', uom: 'EA', manufacturable: true },
  { prefix: 'GW', name: 'Grinding Wheel', category: 'Abrasives', uom: 'EA', manufacturable: false },
]

const sizes = ['Small', 'Medium', 'Large', 'XL', '1/4"', '3/8"', '1/2"', '3/4"', '1"', 'M6', 'M8', 'M10', 'M12']

export function generate(options: GenerateOptions = {}): BaselineData {
  // Apply preset defaults, then override with explicit options
  const presetDefaults = options.preset ? PRESETS[options.preset] : PRESETS.small

  const {
    products: productCount = presetDefaults.products,
    vendors: vendorCount = presetDefaults.vendors,
    customers: customerCount = presetDefaults.customers,
    locations: locationCount = presetDefaults.locations,
    seed = Date.now(),
  } = options

  const rng = new SeededRandom(seed)

  // ============================================================================
  // Reference Data (9 tables)
  // ============================================================================

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
    { paymentTermsId: rng.uuid(), name: '2/10 Net 30', netDays: 30, discountDays: 10, discountPercent: '2.00', timestamp: rng.timestamp() },
  ]

  const pricingSchemes: PricingScheme[] = [
    { pricingSchemeId: rng.uuid(), name: 'Standard', isDefault: true, timestamp: rng.timestamp() },
    { pricingSchemeId: rng.uuid(), name: 'Wholesale', isDefault: false, timestamp: rng.timestamp() },
    { pricingSchemeId: rng.uuid(), name: 'Preferred', isDefault: false, timestamp: rng.timestamp() },
  ]

  const taxingSchemes: TaxingScheme[] = [
    { taxingSchemeId: rng.uuid(), name: 'Standard Tax', timestamp: rng.timestamp() },
    { taxingSchemeId: rng.uuid(), name: 'Tax Exempt', timestamp: rng.timestamp() },
  ]

  const taxCodes: TaxCode[] = [
    { taxCodeId: rng.uuid(), taxingSchemeId: taxingSchemes[0].taxingSchemeId, name: 'Sales Tax', rate: '8.25', isDefault: true, timestamp: rng.timestamp() },
    { taxCodeId: rng.uuid(), taxingSchemeId: taxingSchemes[0].taxingSchemeId, name: 'Reduced Rate', rate: '5.00', isDefault: false, timestamp: rng.timestamp() },
    { taxCodeId: rng.uuid(), taxingSchemeId: taxingSchemes[1].taxingSchemeId, name: 'Exempt', rate: '0.00', isDefault: true, timestamp: rng.timestamp() },
  ]

  const adjustmentReasons: AdjustmentReason[] = adjustmentReasonNames.map(name => ({
    adjustmentReasonId: rng.uuid(),
    name,
    isActive: true,
    timestamp: rng.timestamp(),
  }))

  const operationTypes: OperationType[] = operationTypeNames.map(name => ({
    operationTypeId: rng.uuid(),
    name,
    timestamp: rng.timestamp(),
  }))

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

  // ============================================================================
  // Team & Custom Fields (4 tables)
  // ============================================================================

  const teamMembers: TeamMember[] = teamMemberNames.map(tm => ({
    teamMemberId: rng.uuid(),
    name: tm.name,
    email: tm.email,
    isActive: true,
  }))

  const customFieldDefinitions: CustomFieldDefinition[] = [
    { customFieldDefinitionId: rng.uuid(), label: 'Project Code', propertyName: 'custom1', customFieldType: 'text', entityType: 'salesOrder', isActive: true },
    { customFieldDefinitionId: rng.uuid(), label: 'Priority', propertyName: 'custom2', customFieldType: 'dropdown', entityType: 'salesOrder', isActive: true },
    { customFieldDefinitionId: rng.uuid(), label: 'Approved By', propertyName: 'custom1', customFieldType: 'text', entityType: 'purchaseOrder', isActive: true },
    { customFieldDefinitionId: rng.uuid(), label: 'Bin Location', propertyName: 'custom1', customFieldType: 'text', entityType: 'product', isActive: true },
  ]

  const customFieldDropdownOptions: CustomFieldDropdownOption[] = [
    { id: rng.uuid(), entityType: 'salesOrder', propertyName: 'custom2', dropdownOptions: JSON.stringify(['Low', 'Medium', 'High', 'Critical']) },
  ]

  const customFields: CustomFields[] = [{
    customFieldsId: rng.uuid(),
    purchaseOrderCustom1Print: true,
    purchaseOrderCustom2Print: false,
    purchaseOrderCustom3Print: false,
    salesOrderCustom1Print: true,
    salesOrderCustom2Print: true,
    salesOrderCustom3Print: false,
    stockAdjustmentCustom1Print: false,
    stockAdjustmentCustom2Print: false,
    stockAdjustmentCustom3Print: false,
    stockTransferCustom1Print: false,
    stockTransferCustom2Print: false,
    stockTransferCustom3Print: false,
    workOrderCustom1Print: false,
    workOrderCustom2Print: false,
    workOrderCustom3Print: false,
  }]

  // ============================================================================
  // Vendors & Customers
  // ============================================================================

  const vendors: Vendor[] = rng.shuffle([...vendorNames]).slice(0, vendorCount).map(name => ({
    vendorId: rng.uuid(),
    name,
    vendorCode: name.split(' ').map(w => w[0]).join('').toUpperCase(),
    isActive: true,
    currencyId: currencies[0].currencyId,
    paymentTermsId: rng.pick(paymentTerms).paymentTermsId,
    taxingSchemeId: rng.pick(taxingSchemes).taxingSchemeId,
    timestamp: rng.timestamp(),
  }))

  const customers: Customer[] = rng.shuffle([...customerNames]).slice(0, customerCount).map(name => ({
    customerId: rng.uuid(),
    name,
    customerCode: name.split(' ').map(w => w[0]).join('').toUpperCase(),
    isActive: true,
    currencyId: currencies[0].currencyId,
    pricingSchemeId: rng.pick(pricingSchemes).pricingSchemeId,
    paymentTermsId: rng.pick(paymentTerms).paymentTermsId,
    taxingSchemeId: rng.pick(taxingSchemes).taxingSchemeId,
    timestamp: rng.timestamp(),
  }))

  // ============================================================================
  // Products & Related Data
  // ============================================================================

  const products: Product[] = []
  const productBarcodes: ProductBarcode[] = []
  const inventoryLines: InventoryLine[] = []
  const itemBoms: ItemBom[] = []
  const productOperations: ProductOperation[] = []
  const productPrices: ProductPrice[] = []
  const reorderSettings: ReorderSetting[] = []
  const vendorItems: VendorItem[] = []
  const productSummary: ProductSummary[] = []

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
      itemType: template.manufacturable ? 'Assembly' : 'Stock',
      isActive: true,
      categoryId: category.categoryId,
      standardUomName: template.uom,
      isManufacturable: template.manufacturable,
      timestamp: rng.timestamp(),
    })

    // Add barcode (most products have one)
    if (rng.boolean(0.8)) {
      productBarcodes.push({
        productBarcodeId: rng.uuid(),
        productId,
        barcode: rng.barcode(),
        lineNum: 1,
        timestamp: rng.timestamp(),
      })
    }

    // Add inventory at each location
    let totalOnHand = 0
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
        totalOnHand += qty
      }
    }

    // Add pricing for each scheme
    for (const scheme of pricingSchemes) {
      const multiplier = scheme.name === 'Wholesale' ? 0.85 : scheme.name === 'Preferred' ? 0.9 : 1.0
      productPrices.push({
        productPriceId: rng.uuid(),
        productId,
        pricingSchemeId: scheme.pricingSchemeId,
        priceType: 'Fixed',
        unitPrice: (parseFloat(unitPrice) * multiplier).toFixed(2),
        timestamp: rng.timestamp(),
      })
    }

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

    // Add product summary
    productSummary.push({
      productSummaryId: rng.uuid(),
      productId,
      locationId: mainLocation.locationId,
      quantityOnHand: totalOnHand.toString(),
      quantityAvailable: totalOnHand.toString(),
      quantityOnOrder: '0',
      quantityOnPurchaseOrder: '0',
      quantityReserved: '0',
    })
  }

  // Add BOMs for manufacturable products
  const manufacturableProducts = products.filter(p => p.isManufacturable)
  const stockProducts = products.filter(p => !p.isManufacturable)

  for (const product of manufacturableProducts) {
    // Each manufacturable product has 2-5 components
    const componentCount = rng.range(2, 5)
    const components = rng.pickMultiple(stockProducts, componentCount)

    for (const component of components) {
      itemBoms.push({
        itemBomId: rng.uuid(),
        productId: product.productId,
        childProductId: component.productId,
        quantity: rng.range(1, 10).toString(),
        uomName: component.standardUomName,
        timestamp: rng.timestamp(),
      })
    }

    // Add operations for manufacturable products
    const opCount = rng.range(1, 3)
    const ops = rng.pickMultiple(operationTypes, opCount)
    for (let i = 0; i < ops.length; i++) {
      productOperations.push({
        productOperationId: rng.uuid(),
        productId: product.productId,
        operationTypeId: ops[i].operationTypeId,
        lineNum: i + 1,
        instructions: `Perform ${ops[i].name} operation`,
        estimatedMinutes: rng.range(15, 120).toString(),
        cost: rng.rangeFloat(10, 100).toFixed(2),
        timestamp: rng.timestamp(),
      })
    }
  }

  // ============================================================================
  // Purchase Orders
  // ============================================================================

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

    const po = purchaseOrders.find(p => p.purchaseOrderId === poId)!
    po.subtotal = subtotal.toFixed(2)
    po.total = subtotal.toFixed(2)
  }

  // ============================================================================
  // Sales Orders
  // ============================================================================

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

    const so = salesOrders.find(s => s.salesOrderId === soId)!
    so.subtotal = subtotal.toFixed(2)
    so.total = subtotal.toFixed(2)
  }

  // ============================================================================
  // Manufacturing Orders
  // ============================================================================

  const manufacturingOrders: ManufacturingOrder[] = []
  const moCount = Math.floor(manufacturableProducts.length * 0.5)

  for (let i = 0; i < moCount; i++) {
    const product = rng.pick(manufacturableProducts)
    const location = rng.pick(locations)
    const status = rng.pick(['Open', 'Open', 'InProgress', 'InProgress', 'Completed'])
    const qty = rng.range(10, 100)

    manufacturingOrders.push({
      manufacturingOrderId: rng.uuid(),
      orderNumber: `MO-${3000 + i}`,
      productId: product.productId,
      status,
      quantity: qty.toString(),
      quantityCompleted: status === 'Completed' ? qty.toString() : '0',
      orderDate: rng.date(60),
      expectedDate: rng.date(30),
      locationId: location.locationId,
      timestamp: rng.timestamp(),
    })
  }

  // ============================================================================
  // Stock Transfers
  // ============================================================================

  const stockTransfers: StockTransfer[] = []
  const stockTransferLines: StockTransferLine[] = []

  if (locations.length >= 2) {
    const transferCount = rng.range(5, 10)

    for (let i = 0; i < transferCount; i++) {
      const [fromLoc, toLoc] = rng.pickMultiple(locations, 2)
      const transferId = rng.uuid()
      const status = rng.pick(['Open', 'InTransit', 'Completed', 'Completed'])

      stockTransfers.push({
        stockTransferId: transferId,
        transferNumber: `TR-${4000 + i}`,
        status,
        transferDate: rng.date(30),
        fromLocationId: fromLoc.locationId,
        toLocationId: toLoc.locationId,
        timestamp: rng.timestamp(),
      })

      const lineCount = rng.range(1, 4)
      const transferProducts = rng.pickMultiple(products, lineCount)

      for (let j = 0; j < transferProducts.length; j++) {
        stockTransferLines.push({
          stockTransferLineId: rng.uuid(),
          stockTransferId: transferId,
          productId: transferProducts[j].productId,
          lineNum: j + 1,
          quantity: rng.range(5, 50).toString(),
          timestamp: rng.timestamp(),
        })
      }
    }
  }

  // ============================================================================
  // Stock Adjustments
  // ============================================================================

  const stockAdjustments: StockAdjustment[] = []
  const stockAdjustmentLines: StockAdjustmentLine[] = []
  const adjustmentCount = rng.range(5, 10)

  for (let i = 0; i < adjustmentCount; i++) {
    const location = rng.pick(locations)
    const reason = rng.pick(adjustmentReasons)
    const adjustmentId = rng.uuid()

    stockAdjustments.push({
      stockAdjustmentId: adjustmentId,
      adjustmentNumber: `ADJ-${5000 + i}`,
      adjustmentDate: rng.date(60),
      locationId: location.locationId,
      adjustmentReasonId: reason.adjustmentReasonId,
      timestamp: rng.timestamp(),
    })

    const lineCount = rng.range(1, 3)
    const adjustProducts = rng.pickMultiple(products, lineCount)

    for (let j = 0; j < adjustProducts.length; j++) {
      stockAdjustmentLines.push({
        stockAdjustmentLineId: rng.uuid(),
        stockAdjustmentId: adjustmentId,
        productId: adjustProducts[j].productId,
        lineNum: j + 1,
        quantity: (rng.boolean(0.5) ? 1 : -1) * rng.range(1, 20) + '',
        timestamp: rng.timestamp(),
      })
    }
  }

  // ============================================================================
  // Product Cost Adjustments
  // ============================================================================

  const productCostAdjustments: ProductCostAdjustment[] = []
  const productCostAdjustmentLines: ProductCostAdjustmentLine[] = []
  const costAdjustmentCount = rng.range(2, 5)

  for (let i = 0; i < costAdjustmentCount; i++) {
    const costAdjustmentId = rng.uuid()

    productCostAdjustments.push({
      productCostAdjustmentId: costAdjustmentId,
      adjustmentNumber: `CA-${6000 + i}`,
      adjustmentDate: rng.date(90),
      remarks: 'Periodic cost review',
      timestamp: rng.timestamp(),
    })

    const lineCount = rng.range(2, 6)
    const costProducts = rng.pickMultiple(products, lineCount)

    for (let j = 0; j < costProducts.length; j++) {
      const product = costProducts[j]
      const vendorItem = vendorItems.find(vi => vi.productId === product.productId)
      const oldCost = vendorItem?.cost || '10.00'
      const newCost = (parseFloat(oldCost) * rng.rangeFloat(0.9, 1.15)).toFixed(2)

      productCostAdjustmentLines.push({
        productCostAdjustmentLineId: rng.uuid(),
        productCostAdjustmentId: costAdjustmentId,
        productId: product.productId,
        lineNum: j + 1,
        oldCost,
        newCost,
        timestamp: rng.timestamp(),
      })
    }
  }

  // ============================================================================
  // Stock Counts
  // ============================================================================

  const stockCounts: StockCount[] = []
  const countSheets: CountSheet[] = []
  const countSheetLines: CountSheetLine[] = []
  const stockCountCount = rng.range(2, 4)

  for (let i = 0; i < stockCountCount; i++) {
    const location = rng.pick(locations)
    const assignee = rng.pick(teamMembers)
    const stockCountId = rng.uuid()
    const status = rng.pick(['Open', 'InProgress', 'InReview', 'Completed'])

    stockCounts.push({
      stockCountId,
      stockCountNumber: `SC-${7000 + i}`,
      status,
      locationId: location.locationId,
      assignedToTeamMemberId: assignee.teamMemberId,
      isPrepared: true,
      isStarted: status !== 'Open',
      isReviewed: status === 'InReview' || status === 'Completed',
      isCompleted: status === 'Completed',
      isCancelled: false,
      startedDate: status !== 'Open' ? rng.date(30) : undefined,
      completedDate: status === 'Completed' ? rng.date(7) : undefined,
      timestamp: rng.timestamp(),
    })

    // Each stock count has 1-3 count sheets
    const sheetCount = rng.range(1, 3)
    for (let s = 0; s < sheetCount; s++) {
      const countSheetId = rng.uuid()
      const sheetAssignee = rng.pick(teamMembers)

      countSheets.push({
        countSheetId,
        stockCountId,
        sheetNumber: s + 1,
        status: status === 'Completed' ? 'Completed' : rng.pick(['Open', 'InProgress']),
        assignedToTeamMemberId: sheetAssignee.teamMemberId,
        isCancelled: false,
        isCompleted: status === 'Completed',
        timestamp: rng.timestamp(),
      })

      // Each sheet has 3-8 lines
      const lineCount = rng.range(3, 8)
      const countProducts = rng.pickMultiple(products, lineCount)

      for (let l = 0; l < countProducts.length; l++) {
        const product = countProducts[l]
        const invLine = inventoryLines.find(il => il.productId === product.productId && il.locationId === location.locationId)
        const snapshotQty = invLine?.quantityOnHand || '0'
        const variance = rng.range(-5, 5)
        const countedQty = Math.max(0, parseInt(snapshotQty) + variance).toString()

        countSheetLines.push({
          countSheetLineId: rng.uuid(),
          countSheetId,
          productId: product.productId,
          description: product.name,
          countedQuantity: status === 'Completed' || status === 'InReview' ? countedQty : undefined,
          countedUom: product.standardUomName,
          snapshotQuantity: snapshotQty,
          snapshotUom: product.standardUomName,
          timestamp: rng.timestamp(),
        })
      }
    }
  }

  return {
    // Reference data
    categories,
    locations,
    currencies,
    paymentTerms,
    pricingSchemes,
    taxingSchemes,
    taxCodes,
    adjustmentReasons,
    operationTypes,
    // Team & Custom Fields
    teamMembers,
    customFieldDefinitions,
    customFieldDropdownOptions,
    customFields,
    // Core entities
    vendors,
    customers,
    products,
    // Product details
    productBarcodes,
    inventoryLines,
    itemBoms,
    productOperations,
    productPrices,
    reorderSettings,
    vendorItems,
    // Orders
    purchaseOrders,
    purchaseOrderLines,
    salesOrders,
    salesOrderLines,
    manufacturingOrders,
    // Stock operations
    stockTransfers,
    stockTransferLines,
    stockAdjustments,
    stockAdjustmentLines,
    stockCounts,
    countSheets,
    countSheetLines,
    // Cost adjustments
    productCostAdjustments,
    productCostAdjustmentLines,
    // Computed
    productSummary,
  }
}

export default { generate }
