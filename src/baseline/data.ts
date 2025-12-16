/**
 * Realistic manufacturing baseline data.
 * These are the "clean" templates that get corrupted by patterns.
 */

// Manufacturing vendors with realistic specializations
export const vendorTemplates = [
  { name: 'Precision Fasteners Inc', specialization: 'hardware', leadTime: 7 },
  { name: 'Allied Steel Supply', specialization: 'metals', leadTime: 14 },
  { name: 'Midwest Industrial Components', specialization: 'components', leadTime: 10 },
  { name: 'Global Electronics Distributors', specialization: 'electronics', leadTime: 21 },
  { name: 'National Bearing Company', specialization: 'bearings', leadTime: 5 },
  { name: 'Thompson Plastics', specialization: 'plastics', leadTime: 12 },
  { name: 'Valley Machine Parts', specialization: 'machined', leadTime: 18 },
  { name: 'Premier Rubber Products', specialization: 'rubber', leadTime: 8 },
  { name: 'Central Hydraulics', specialization: 'hydraulics', leadTime: 14 },
  { name: 'United Electrical Supply', specialization: 'electrical', leadTime: 7 },
  { name: 'American Tubing Corp', specialization: 'tubing', leadTime: 10 },
  { name: 'Quality Seal Systems', specialization: 'seals', leadTime: 6 },
  { name: 'Industrial Adhesives Ltd', specialization: 'adhesives', leadTime: 5 },
  { name: 'Metro Packaging Solutions', specialization: 'packaging', leadTime: 3 },
  { name: 'Coastal Abrasives', specialization: 'abrasives', leadTime: 7 },
]

// Product categories for manufacturing
export const categoryTemplates = [
  { name: 'Fasteners', description: 'Bolts, nuts, screws, and related hardware' },
  { name: 'Raw Materials', description: 'Steel, aluminum, plastics, and other base materials' },
  { name: 'Bearings', description: 'Ball bearings, roller bearings, bushings' },
  { name: 'Electronics', description: 'Circuit boards, sensors, controllers' },
  { name: 'Hydraulics', description: 'Pumps, valves, cylinders, hoses' },
  { name: 'Seals & Gaskets', description: 'O-rings, gaskets, sealing compounds' },
  { name: 'Safety Equipment', description: 'PPE, guards, safety devices' },
  { name: 'Tooling', description: 'Cutting tools, dies, fixtures' },
  { name: 'Electrical', description: 'Wiring, connectors, switches, motors' },
  { name: 'Lubricants', description: 'Oils, greases, cutting fluids' },
  { name: 'Abrasives', description: 'Grinding wheels, sandpaper, polishing compounds' },
  { name: 'Packaging', description: 'Boxes, pallets, stretch wrap, labels' },
]

// Product templates by category with SKU patterns
export const productTemplates: Record<string, Array<{
  namePattern: string
  skuPrefix: string
  unitOfMeasure: string
  priceRange: [number, number]
  reorderRange: [number, number]
}>> = {
  Fasteners: [
    { namePattern: 'Hex Bolt {size} x {length}', skuPrefix: 'HB', unitOfMeasure: 'EA', priceRange: [0.05, 2.00], reorderRange: [100, 1000] },
    { namePattern: 'Socket Cap Screw {size} x {length}', skuPrefix: 'SC', unitOfMeasure: 'EA', priceRange: [0.10, 3.00], reorderRange: [50, 500] },
    { namePattern: 'Hex Nut {size}', skuPrefix: 'HN', unitOfMeasure: 'EA', priceRange: [0.02, 0.50], reorderRange: [200, 2000] },
    { namePattern: 'Lock Washer {size}', skuPrefix: 'LW', unitOfMeasure: 'EA', priceRange: [0.01, 0.25], reorderRange: [500, 5000] },
    { namePattern: 'Flat Washer {size}', skuPrefix: 'FW', unitOfMeasure: 'EA', priceRange: [0.01, 0.20], reorderRange: [500, 5000] },
  ],
  'Raw Materials': [
    { namePattern: 'Steel Plate {thickness} x {width} x {length}', skuPrefix: 'SP', unitOfMeasure: 'EA', priceRange: [50, 500], reorderRange: [5, 20] },
    { namePattern: 'Aluminum Bar {size} x {length}', skuPrefix: 'AB', unitOfMeasure: 'EA', priceRange: [20, 200], reorderRange: [10, 50] },
    { namePattern: 'Steel Round {diameter} x {length}', skuPrefix: 'SR', unitOfMeasure: 'EA', priceRange: [15, 150], reorderRange: [10, 100] },
    { namePattern: 'Plastic Sheet {material} {thickness}', skuPrefix: 'PS', unitOfMeasure: 'EA', priceRange: [25, 250], reorderRange: [5, 25] },
  ],
  Bearings: [
    { namePattern: 'Ball Bearing {series}-{size}', skuPrefix: 'BB', unitOfMeasure: 'EA', priceRange: [5, 150], reorderRange: [10, 100] },
    { namePattern: 'Roller Bearing {type} {size}', skuPrefix: 'RB', unitOfMeasure: 'EA', priceRange: [15, 300], reorderRange: [5, 50] },
    { namePattern: 'Bushing {material} {id} x {od}', skuPrefix: 'BU', unitOfMeasure: 'EA', priceRange: [2, 50], reorderRange: [20, 200] },
    { namePattern: 'Pillow Block {series} {size}', skuPrefix: 'PB', unitOfMeasure: 'EA', priceRange: [25, 200], reorderRange: [5, 25] },
  ],
  Electronics: [
    { namePattern: 'Proximity Sensor {type} {range}', skuPrefix: 'PS', unitOfMeasure: 'EA', priceRange: [25, 250], reorderRange: [5, 20] },
    { namePattern: 'PLC Module {model}', skuPrefix: 'PLC', unitOfMeasure: 'EA', priceRange: [100, 2000], reorderRange: [1, 5] },
    { namePattern: 'Motor Controller {amps}A', skuPrefix: 'MC', unitOfMeasure: 'EA', priceRange: [50, 500], reorderRange: [2, 10] },
    { namePattern: 'Power Supply {voltage}V {amps}A', skuPrefix: 'PWR', unitOfMeasure: 'EA', priceRange: [30, 300], reorderRange: [2, 15] },
  ],
  Hydraulics: [
    { namePattern: 'Hydraulic Cylinder {bore} x {stroke}', skuPrefix: 'HC', unitOfMeasure: 'EA', priceRange: [100, 1500], reorderRange: [1, 5] },
    { namePattern: 'Hydraulic Pump {gpm} GPM', skuPrefix: 'HP', unitOfMeasure: 'EA', priceRange: [200, 3000], reorderRange: [1, 3] },
    { namePattern: 'Directional Valve {ports}P{pos}W', skuPrefix: 'DV', unitOfMeasure: 'EA', priceRange: [75, 500], reorderRange: [2, 10] },
    { namePattern: 'Hydraulic Hose {size} x {length}', skuPrefix: 'HH', unitOfMeasure: 'EA', priceRange: [15, 150], reorderRange: [5, 25] },
  ],
  'Seals & Gaskets': [
    { namePattern: 'O-Ring {material} {id} x {cs}', skuPrefix: 'OR', unitOfMeasure: 'EA', priceRange: [0.10, 5.00], reorderRange: [50, 500] },
    { namePattern: 'Oil Seal {id} x {od} x {width}', skuPrefix: 'OS', unitOfMeasure: 'EA', priceRange: [2, 50], reorderRange: [10, 100] },
    { namePattern: 'Gasket Set {application}', skuPrefix: 'GS', unitOfMeasure: 'EA', priceRange: [15, 150], reorderRange: [5, 25] },
    { namePattern: 'V-Ring Seal {size}', skuPrefix: 'VR', unitOfMeasure: 'EA', priceRange: [3, 25], reorderRange: [20, 100] },
  ],
  'Safety Equipment': [
    { namePattern: 'Safety Glasses {type}', skuPrefix: 'SG', unitOfMeasure: 'EA', priceRange: [5, 50], reorderRange: [10, 50] },
    { namePattern: 'Work Gloves {material} {size}', skuPrefix: 'WG', unitOfMeasure: 'PR', priceRange: [5, 30], reorderRange: [20, 100] },
    { namePattern: 'Ear Plugs {nrr}dB', skuPrefix: 'EP', unitOfMeasure: 'PR', priceRange: [0.25, 5.00], reorderRange: [100, 500] },
    { namePattern: 'Face Shield {type}', skuPrefix: 'FS', unitOfMeasure: 'EA', priceRange: [10, 75], reorderRange: [5, 25] },
  ],
  Tooling: [
    { namePattern: 'End Mill {diameter} {flutes}FL {material}', skuPrefix: 'EM', unitOfMeasure: 'EA', priceRange: [15, 200], reorderRange: [5, 25] },
    { namePattern: 'Drill Bit {size} {material}', skuPrefix: 'DB', unitOfMeasure: 'EA', priceRange: [5, 100], reorderRange: [10, 50] },
    { namePattern: 'Insert {type} {grade}', skuPrefix: 'IN', unitOfMeasure: 'EA', priceRange: [5, 50], reorderRange: [20, 100] },
    { namePattern: 'Tap {size} {pitch}', skuPrefix: 'TP', unitOfMeasure: 'EA', priceRange: [10, 150], reorderRange: [5, 25] },
  ],
  Electrical: [
    { namePattern: 'Wire {gauge}AWG {color} {length}ft', skuPrefix: 'WR', unitOfMeasure: 'RL', priceRange: [20, 200], reorderRange: [5, 25] },
    { namePattern: 'Connector {type} {pins}P', skuPrefix: 'CN', unitOfMeasure: 'EA', priceRange: [1, 50], reorderRange: [20, 200] },
    { namePattern: 'Switch {type} {amps}A', skuPrefix: 'SW', unitOfMeasure: 'EA', priceRange: [5, 100], reorderRange: [10, 50] },
    { namePattern: 'Motor {hp}HP {rpm}RPM', skuPrefix: 'MT', unitOfMeasure: 'EA', priceRange: [100, 2000], reorderRange: [1, 5] },
  ],
  Lubricants: [
    { namePattern: 'Machine Oil {grade}', skuPrefix: 'MO', unitOfMeasure: 'GAL', priceRange: [15, 100], reorderRange: [5, 20] },
    { namePattern: 'Grease {type} {size}', skuPrefix: 'GR', unitOfMeasure: 'EA', priceRange: [5, 50], reorderRange: [10, 50] },
    { namePattern: 'Cutting Fluid {type}', skuPrefix: 'CF', unitOfMeasure: 'GAL', priceRange: [20, 150], reorderRange: [5, 25] },
    { namePattern: 'Penetrating Oil {size}', skuPrefix: 'PO', unitOfMeasure: 'EA', priceRange: [5, 25], reorderRange: [10, 50] },
  ],
  Abrasives: [
    { namePattern: 'Grinding Wheel {diameter} x {width} {grit}', skuPrefix: 'GW', unitOfMeasure: 'EA', priceRange: [10, 150], reorderRange: [5, 25] },
    { namePattern: 'Sanding Disc {diameter} {grit}', skuPrefix: 'SD', unitOfMeasure: 'EA', priceRange: [0.50, 10.00], reorderRange: [50, 500] },
    { namePattern: 'Flap Disc {diameter} {grit}', skuPrefix: 'FD', unitOfMeasure: 'EA', priceRange: [3, 25], reorderRange: [20, 100] },
    { namePattern: 'Wire Brush {type} {diameter}', skuPrefix: 'WB', unitOfMeasure: 'EA', priceRange: [5, 50], reorderRange: [10, 50] },
  ],
  Packaging: [
    { namePattern: 'Corrugated Box {l} x {w} x {h}', skuPrefix: 'BX', unitOfMeasure: 'EA', priceRange: [0.50, 10.00], reorderRange: [100, 1000] },
    { namePattern: 'Stretch Wrap {width} x {length}', skuPrefix: 'STW', unitOfMeasure: 'RL', priceRange: [20, 100], reorderRange: [10, 50] },
    { namePattern: 'Pallet {type} {size}', skuPrefix: 'PLT', unitOfMeasure: 'EA', priceRange: [10, 50], reorderRange: [20, 100] },
    { namePattern: 'Packing Tape {width}', skuPrefix: 'PT', unitOfMeasure: 'RL', priceRange: [3, 15], reorderRange: [20, 100] },
  ],
}

// Size/dimension options for product variations
export const dimensions = {
  boltSizes: ['M4', 'M5', 'M6', 'M8', 'M10', 'M12', 'M16', 'M20', '1/4-20', '5/16-18', '3/8-16', '1/2-13'],
  lengths: ['10mm', '15mm', '20mm', '25mm', '30mm', '40mm', '50mm', '1"', '1.5"', '2"', '3"', '4"'],
  thicknesses: ['1/8"', '1/4"', '3/8"', '1/2"', '3/4"', '1"', '3mm', '6mm', '10mm', '12mm'],
  diameters: ['1/4"', '3/8"', '1/2"', '3/4"', '1"', '1.5"', '2"', '6mm', '10mm', '12mm', '16mm', '20mm', '25mm'],
  grits: ['40', '60', '80', '100', '120', '150', '180', '220', '320'],
  colors: ['Black', 'Red', 'Blue', 'Green', 'White', 'Yellow'],
  materials: ['Steel', 'Stainless', 'Aluminum', 'Brass', 'Bronze', 'Nylon', 'UHMW', 'Delrin'],
}

// Email domains for vendor contacts
export const emailDomains = ['company.com', 'sales.net', 'industrial.com', 'supply.co', 'parts.com']

// Phone area codes (US manufacturing regions)
export const areaCodes = ['216', '313', '414', '317', '614', '419', '440', '330', '248', '734']
