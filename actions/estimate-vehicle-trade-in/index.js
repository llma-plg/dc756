// TODO: Replace the valuation logic below with a real API call.
// See the TODO block below the handler for endpoint details.
//
// MOCK_DATA is the Dacia model range (from Action Planner's samplePayload). It is
// used as reference context for the "Apply Estimate to a Dacia Purchase" next step,
// not as the source of the trade-in valuation — the valuation is computed from the
// customer-supplied vehicle details below.
const MOCK_DATA = [
  {
    model_id: 'bigster',
    name: 'Dacia Bigster',
    body_style: 'SUV (C-segment)',
    category: 'SUV',
    starting_price: 20490,
    currency: 'EUR',
    powertrains: ['full hybrid 155', 'hybrid-G 150 4x4 (petrol/LPG)', 'mild hybrid 140', 'eco-g 120 (LPG)'],
    seats: 5,
    available_versions: ['essential', 'expression', 'journey', 'extreme'],
    key_highlights: ['Largest Dacia SUV', 'Available as full hybrid', 'Up to 4x4 hybrid-G powertrain', 'Rabla campaign price from 19,290 EUR'],
    is_deal: true,
    detail_url: 'https://www.dacia.ro/gama-de-modele-hibride-si-electrice/bigster-suv.html',
    image_url: 'https://cdn.group.renault.com/dac/ro/gpl/Bigster%20GPL.jpg.ximg.xsmall.jpg/e6921f98ca.jpg',
  },
  {
    model_id: 'duster',
    name: 'Dacia Duster',
    body_style: 'SUV (B-segment)',
    category: 'SUV',
    starting_price: 17100,
    currency: 'EUR',
    powertrains: ['hybrid-G 150 4x4 (petrol/LPG)', 'hybrid 155', 'mild hybrid 140', 'eco-g 120 (LPG)', 'hybrid 150 4x4', 'eco-g 120 auto'],
    seats: 5,
    available_versions: ['essential', 'expression', 'journey', 'extreme'],
    key_highlights: ['Ground clearance up to 217 mm', '4x4 with terrain mode selector', '10-inch touchscreen', 'Rabla campaign price from 15,900 EUR'],
    is_deal: true,
    detail_url: 'https://www.dacia.ro/gama-de-modele-hibride-si-electrice/duster-suv.html',
    image_url: 'https://cdn.group.renault.com/dac/master/dacia-vn/vehicules/duster-p1310/overview/editorial/dacia-duster-p1310-overview-004-1-mobile.jpg.ximg.xsmall.jpg/ba4175c768.jpg',
  },
  {
    model_id: 'logan',
    name: 'Dacia Logan',
    body_style: 'Sedan',
    category: 'Sedan',
    starting_price: 12741,
    currency: 'EUR',
    powertrains: ['eco-g 120 (LPG)', 'mild hybrid', 'hybrid 155'],
    seats: 5,
    available_versions: ['essential', 'expression', 'journey'],
    key_highlights: ['Most affordable Dacia sedan', 'Large 528 L boot class', 'LPG dual-fuel from factory', 'Rabla campaign price from 11,990 EUR'],
    is_deal: true,
    detail_url: 'https://www.dacia.ro/gama-dacia/logan-berlina.html',
    image_url: 'https://cdn.group.renault.com/dac/ro/gpl/Logan%20GPL.jpg.ximg.xsmall.jpg/7d9c1a07d2.jpg',
  },
  {
    model_id: 'sandero-stepway',
    name: 'Dacia Sandero Stepway',
    body_style: 'Crossover / raised hatchback',
    category: 'Crossover',
    starting_price: 13741,
    currency: 'EUR',
    powertrains: ['eco-g 120 (LPG)', 'hybrid 155', 'mild hybrid'],
    seats: 5,
    available_versions: ['essential', 'expression', 'extreme'],
    key_highlights: ['Raised crossover styling', 'First electrified hybrid 155 powertrain', 'LPG dual-fuel option', 'Rabla campaign price from 12,990 EUR'],
    is_deal: true,
    detail_url: 'https://www.dacia.ro/gama-dacia/sandero-stepway-crossover.html',
    image_url: 'https://cdn.group.renault.com/dac/ro/bigster-duster-4x4.jpg.ximg.xsmall.jpg/cabdb68ae0.jpg',
  },
  {
    model_id: 'spring',
    name: 'Dacia Spring',
    body_style: 'City car (electric)',
    category: 'City car',
    starting_price: 13590,
    currency: 'EUR',
    powertrains: ['electric'],
    seats: 4,
    available_versions: ['essential', 'expression', 'extreme'],
    key_highlights: ['100% electric', 'Spring Extreme 100 CP version', 'Boot capacity ~308 L', 'Optional fast charging & V2L'],
    is_deal: true,
    detail_url: 'https://www.dacia.ro/gama-de-modele-hibride-si-electrice/spring-masina-de-oras.html',
    image_url: 'https://cdn.group.renault.com/dac/master/dacia-vn/vehicules/dacia-bbg/spring-bbg-ph2/overview/editorial/dacia-spring-bbg-ph2-overview-029-portrait.jpg.ximg.xsmall.jpg/ace8f25eb0.jpg',
  },
  {
    model_id: 'jogger',
    name: 'Dacia Jogger',
    body_style: 'Estate / 7-seat MPV',
    category: 'MPV',
    starting_price: 16650,
    currency: 'EUR',
    powertrains: ['eco-g 120 (LPG)', 'hybrid 155', 'mild hybrid'],
    seats: 7,
    luggage_capacity_liters: 2094,
    available_versions: ['essential', 'expression', 'journey', 'extreme'],
    key_highlights: ['Up to 7 seats', 'Family-oriented long body', 'Boot up to 2,094 L (5-seat config)', 'Rabla campaign price from 15,990 EUR'],
    is_deal: true,
    detail_url: 'https://www.dacia.ro/gama-dacia/jogger.html',
    image_url: 'https://cdn.group.renault.com/dac/ro/gpl/Jogger-GPL.jpg.ximg.xsmall.jpg/7292573e4a.jpg',
  },
];

const CONDITION_MULTIPLIERS = {
  excellent: 1.12,
  'very good': 1.06,
  good: 1.0,
  fair: 0.88,
  poor: 0.72,
};

function computeEstimate({ year, mileage_km, condition }) {
  // Deterministic preliminary estimate — NOT a real market valuation.
  // Baseline value decays with age and mileage, then a condition multiplier applies.
  const now = new Date();
  const age = Math.max(0, now.getFullYear() - Number(year));
  const baseline = 24000;
  const afterAge = baseline * Math.pow(0.9, age);
  const mileagePenalty = Math.max(0, Number(mileage_km) || 0) * 0.015;
  const conditionKey = String(condition || 'good').trim().toLowerCase();
  const multiplier = CONDITION_MULTIPLIERS[conditionKey] || 1.0;
  const midpoint = Math.max(800, (afterAge - mileagePenalty) * multiplier);
  const low = Math.round((midpoint * 0.9) / 50) * 50;
  const high = Math.round((midpoint * 1.1) / 50) * 50;
  return { low, high };
}

module.exports = async ({
  make = '',
  model = '',
  year = null,
  mileage_km = null,
  fuel_type = '',
  transmission = '',
  condition = '',
  registration_number = '',
} = {}) => {
  const missing = [];
  if (!make || typeof make !== 'string' || !make.trim()) missing.push('make');
  if (!model || typeof model !== 'string' || !model.trim()) missing.push('model');
  if (year === null || year === undefined || Number.isNaN(Number(year))) missing.push('year');
  if (mileage_km === null || mileage_km === undefined || Number.isNaN(Number(mileage_km))) missing.push('mileage_km');

  if (missing.length > 0) {
    return {
      content: [{
        type: 'text',
        text: `Please provide the following vehicle detail(s) to produce a trade-in estimate: ${missing.join(', ')}.`,
      }],
      structuredContent: {},
    };
  }

  const { low, high } = computeEstimate({ year, mileage_km, condition });

  const summaryParts = [year, make.trim(), model.trim()].filter(Boolean);
  if (fuel_type && typeof fuel_type === 'string' && fuel_type.trim()) summaryParts.push(fuel_type.trim());
  const vehicle_summary = summaryParts.join(' ');

  const assumptions = [
    'No undisclosed accident or structural damage',
    'Documentation (service history, registration) available at inspection',
    'Standard factory equipment and specification',
  ];
  const factors_affecting_value = [
    'Actual mileage confirmed at inspection',
    'Tyre, brake, and mechanical wear',
    'Bodywork and interior condition',
    'Number of previous owners and service history',
  ];

  const valuation_date = new Date().toISOString().slice(0, 10);
  const idBase = `${make.trim()}-${model.trim()}-${year}`.toUpperCase().replace(/[^A-Z0-9]+/g, '-');

  const message = 'This is a free, preliminary and non-binding estimate. To complete a trade-in, an in-person vehicle evaluation is required through the Dacia partner network; the final offer may differ from this range once the vehicle is inspected.';

  return {
    content: [{
      type: 'text',
      text: `Preliminary trade-in estimate for the ${vehicle_summary}: ${low.toLocaleString('en-US')}–${high.toLocaleString('en-US')} EUR. This estimate is free and non-binding — completing the sale requires an in-person vehicle evaluation through the Dacia partner network.`,
    }],
    // structuredContent — flat single-object detail shape (widget reads sc directly, no wrapper key)
    structuredContent: {
      valuation_id: `VAL-${idBase}`,
      vehicle_summary,
      make: make.trim(),
      model: model.trim(),
      year: Number(year),
      mileage_km: Number(mileage_km),
      fuel_type: fuel_type ? String(fuel_type).trim() : '',
      transmission: transmission ? String(transmission).trim() : '',
      condition: condition ? String(condition).trim() : '',
      registration_number: registration_number ? String(registration_number).trim() : '',
      estimated_value_low: low,
      estimated_value_high: high,
      currency: 'EUR',
      valuation_date,
      assumptions,
      factors_affecting_value,
      status: 'preliminary',
      message,
    },
  };
};

/*
 * TODO: Replace the deterministic estimate with a real valuation API call.
 *
 * Suggested endpoint pattern (update based on the actual valuation service API):
 *   POST ${process.env.API_BASE_URL}/trade-in/valuation
 *   body: { make, model, year, mileage_km, fuel_type, transmission, condition, registration_number }
 *
 * Environment variables to configure:
 *   API_BASE_URL   Base URL of the valuation service API
 *   API_KEY        API key if required (add to .env and app.config.yaml)
 *
 * Example fetch:
 *   const res = await fetch(`${process.env.API_BASE_URL}/trade-in/valuation`, {
 *     method: 'POST',
 *     headers: {
 *       'Content-Type': 'application/json',
 *       'Authorization': `Bearer ${process.env.API_KEY}`,
 *     },
 *     body: JSON.stringify({ make, model, year, mileage_km, fuel_type, transmission, condition, registration_number }),
 *   });
 *   if (!res.ok) throw new Error(`API error: ${res.status}`);
 *   return await res.json();
 *
 * MOCK_DATA (the Dacia model range) can back the "Apply Estimate to a Dacia
 * Purchase" next step — e.g. recommending a model whose price the estimate offsets.
 */
