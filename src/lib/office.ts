/** Operating office supplied by Samachify; pin verified from its Google Maps place on 2026-09-12. */
export const OPERATING_OFFICE = {
  address: 'J4A, Third floor, E Moorthy Enclave, Perumal Kovil Street, Medavakkam, Tamil Nadu 600100',
  mapsUrl: 'https://maps.app.goo.gl/pc8denFUBKmWvemq5?g_st=awb',
  latitude: 12.9219353,
  longitude: 80.192949,
} as const

export const DELIVERY_AREAS = {
  '600100': 'Medavakkam, Pallikaranai',
  '600117': 'Keelkattalai, Kovilambakkam',
  '600129': 'Nanmangalam, Kovilambakkam',
  '600131': 'Sithalapakkam',
  '600119': 'Sholinganallur, Uthandi',
  '600097': 'Oggiam Thoraipakkam',
  '600096': 'Perungudi',
  '600042': 'Velachery',
  '600091': 'Madipakkam, Puzhuthivakkam',
  '600126': 'Madambakkam',
} as const

export const DELIVERY_PINCODES = Object.keys(DELIVERY_AREAS)
