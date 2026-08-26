// TODO: Replace MOCK_DATA with a real API call.
// See the TODO block below the handler for endpoint details.
const MOCK_DATA = [
  {
    name: 'Dacia Bigster',
    category: 'SUV (C-segment)',
    body_style: 'SUV',
    starting_price: 116900,
    currency: 'RON',
    seats: 5,
    boot_capacity_liters: 667,
    powertrains: ['full hybrid 155', 'mild hybrid 140', 'mild hybrid 130 4x4', 'GPL/LPG'],
    versions: ['Expression', 'Extreme', 'Journey'],
    features: [
      'Dual-zone climate control',
      '10.1" media display',
      'Wireless smartphone replication',
      'Arkamys 3D sound',
      'YouClip accessory system',
      'Hill descent control',
      'Level 2 driving assistance',
    ],
    detail_url: 'https://www.dacia.ro/gama-dacia/bigster.html',
    configure_url: 'https://www.dacia.ro/configuratorul-nostru.html',
    is_deal: false,
  },
  {
    name: 'Dacia Duster',
    category: 'SUV (B-segment)',
    body_style: 'SUV',
    starting_price: 98900,
    currency: 'RON',
    seats: 5,
    boot_capacity_liters: 517,
    powertrains: ['full hybrid 140', 'mild hybrid 130', 'mild hybrid 130 4x4', 'GPL/LPG'],
    versions: ['Essential', 'Expression', 'Extreme', 'Journey'],
    features: [
      'YouClip modular system',
      '10.1" touchscreen',
      'Multiview camera',
      'Hill descent control',
      'Emergency braking assist',
      'Sleep Pack (Extreme)',
    ],
    detail_url: 'https://www.dacia.ro/gama-dacia/duster.html',
    configure_url: 'https://www.dacia.ro/configuratorul-nostru.html',
    is_deal: false,
  },
  {
    name: 'Dacia Jogger',
    category: 'Family estate (7-seater)',
    body_style: 'Estate / MPV',
    starting_price: 82900,
    currency: 'RON',
    seats: 7,
    boot_capacity_liters: 708,
    powertrains: ['full hybrid 140', 'GPL/LPG', 'petrol TCe'],
    versions: ['Essential', 'Expression', 'Extreme'],
    features: ['Up to 7 seats', 'Removable third-row seats', 'Modular boot', 'Roof bars'],
    detail_url: 'https://www.dacia.ro/gama-dacia/jogger.html',
    configure_url: 'https://www.dacia.ro/configuratorul-nostru.html',
    is_deal: false,
  },
  {
    name: 'Dacia Sandero Stepway',
    category: 'Crossover hatchback',
    body_style: 'Hatchback (raised)',
    starting_price: 70900,
    currency: 'RON',
    seats: 5,
    boot_capacity_liters: 328,
    powertrains: ['mild hybrid', 'GPL/LPG', 'petrol TCe'],
    versions: ['Expression', 'Extreme'],
    features: ['Raised ground clearance', 'Roof bars', 'Media Display', 'Emergency braking assist'],
    detail_url: 'https://www.dacia.ro/gama-dacia/sandero-stepway.html',
    configure_url: 'https://www.dacia.ro/configuratorul-nostru.html',
    is_deal: false,
  },
  {
    name: 'Dacia Sandero',
    category: 'City hatchback',
    body_style: 'Hatchback',
    starting_price: 62900,
    currency: 'RON',
    seats: 5,
    boot_capacity_liters: 328,
    powertrains: ['GPL/LPG', 'petrol TCe'],
    versions: ['Essential', 'Expression'],
    features: ['Media Control / Media Display', 'Emergency braking assist', 'Cruise control'],
    detail_url: 'https://www.dacia.ro/gama-dacia/sandero.html',
    configure_url: 'https://www.dacia.ro/configuratorul-nostru.html',
    is_deal: false,
  },
  {
    name: 'Dacia Logan',
    category: 'Compact sedan',
    body_style: 'Sedan',
    starting_price: 65900,
    currency: 'RON',
    seats: 5,
    boot_capacity_liters: 528,
    powertrains: ['GPL/LPG', 'petrol TCe'],
    versions: ['Essential', 'Expression'],
    features: ['Large 528L boot', 'Media Display', 'Rear parking sensors', 'Emergency braking assist'],
    detail_url: 'https://www.dacia.ro/gama-dacia/logan.html',
    configure_url: 'https://www.dacia.ro/configuratorul-nostru.html',
    is_deal: false,
  },
  {
    name: 'Dacia Spring',
    category: 'Electric city car',
    body_style: 'Hatchback (EV)',
    starting_price: 72900,
    currency: 'RON',
    seats: 4,
    boot_capacity_liters: 308,
    powertrains: ['electric'],
    versions: ['Expression', 'Extreme'],
    features: ['100% electric', 'Up to ~225 km WLTP range', 'DC fast charging', 'Compact urban footprint'],
    detail_url: 'https://www.dacia.ro/gama-dacia/spring.html',
    configure_url: 'https://www.dacia.ro/configuratorul-nostru.html',
    is_deal: false,
  },
];

module.exports = async ({ model_id = '' }) => {
  if (!model_id || typeof model_id !== 'string' || !model_id.trim()) {
    return {
      content: [{ type: 'text', text: 'Please provide a model_id (e.g. "Bigster") to explain.' }],
      structuredContent: {},
    };
  }

  const query = model_id.trim().toLowerCase();
  const found = MOCK_DATA.find((m) => m.name.toLowerCase() === query)
    || MOCK_DATA.find((m) => m.name.toLowerCase().includes(query));

  if (!found) {
    return {
      content: [{ type: 'text', text: `No results found for: ${model_id}` }],
      structuredContent: {},
    };
  }

  // Map the fixture fields onto the outputSchema shape (flat, single-object detail).
  const item = {
    model_id: found.name,
    name: found.name,
    body_style: found.body_style,
    starting_price: found.starting_price,
    currency: found.currency,
    passenger_capacity: found.seats,
    luggage_capacity_litres: found.boot_capacity_liters,
    powertrain_types: found.powertrains || [],
    versions: (found.versions || []).map((v) => ({ name: v })),
    key_features: found.features || [],
    configure_url: found.configure_url,
    offer_url: found.detail_url,
  };

  const priceLine = typeof item.starting_price === 'number'
    ? `from ${item.starting_price.toLocaleString('ro-RO')} ${item.currency}`
    : 'price on request';

  const summary = `${item.name} (${found.category}) starts ${priceLine}, seats ${item.passenger_capacity}, `
    + `${item.luggage_capacity_litres} L boot, with ${item.powertrain_types.length} powertrain options. `
    + 'Its strongest use case is a spacious, value-oriented family vehicle; the advertised starting price is '
    + 'promotional — final price and availability depend on the chosen configuration and dealer confirmation.';

  return {
    // structuredContent — flat single-object detail shape (widget reads sc directly, no wrapper key)
    content: [{ type: 'text', text: summary }],
    structuredContent: item,
  };
};

/*
 * TODO: Replace MOCK_DATA with a real API call.
 *
 * Suggested endpoint pattern (update based on actual site API):
 *   GET ${process.env.API_BASE_URL}/models/${model_id}
 *
 * Environment variables to configure:
 *   API_BASE_URL   Base URL of the website's API
 *   API_KEY        API key if required (add to .env and app.config.yaml)
 *
 * Example fetch:
 *   const res = await fetch(
 *     `${process.env.API_BASE_URL}/models/${encodeURIComponent(model_id)}`,
 *     { headers: { 'Authorization': `Bearer ${process.env.API_KEY}` } }
 *   )
 *   if (!res.ok) throw new Error(`API error: ${res.status}`)
 *   return await res.json()
 */
