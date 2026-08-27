// TODO: Replace MOCK_DATA with a real API call.
// See the TODO block below the handler for endpoint details.
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
    key_equipment: ['Largest Dacia SUV', 'Available as full hybrid', 'Up to 4x4 hybrid-G powertrain', 'Rabla campaign price from 19,290 EUR'],
    scenario_tradeoffs: ['Largest boot and cabin — best for family road trips', 'Up to 4x4 for mixed terrain', 'Higher starting price than the Duster'],
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
    key_equipment: ['Ground clearance up to 217 mm', '4x4 with terrain mode selector', '10-inch touchscreen', 'Rabla campaign price from 15,900 EUR'],
    scenario_tradeoffs: ['More affordable and easier to park in town', 'Strong off-road ability with terrain modes', 'Smaller cabin and boot than the Bigster'],
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
    key_equipment: ['Most affordable Dacia sedan', 'Large 528 L boot class', 'LPG dual-fuel from factory', 'Rabla campaign price from 11,990 EUR'],
    scenario_tradeoffs: ['Lowest entry price in the range', 'Large sedan boot', 'Sedan body — less ground clearance than the SUVs'],
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
    key_equipment: ['Raised crossover styling', 'First electrified hybrid 155 powertrain', 'LPG dual-fuel option', 'Rabla campaign price from 12,990 EUR'],
    scenario_tradeoffs: ['Compact and city-friendly', 'Raised ride height for rougher roads', 'Smaller than the Duster'],
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
    key_equipment: ['100% electric', 'Spring Extreme 100 CP version', 'Boot capacity ~308 L', 'Optional fast charging & V2L'],
    scenario_tradeoffs: ['Fully electric city car', 'Lowest running costs', 'Four seats and shorter range — not ideal for long road trips'],
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
    key_equipment: ['Up to 7 seats', 'Family-oriented long body', 'Boot up to 2,094 L (5-seat config)', 'Rabla campaign price from 15,990 EUR'],
    scenario_tradeoffs: ['Up to seven seats for larger families', 'Huge boot in 5-seat mode', 'Longer body — less nimble in tight parking'],
    detail_url: 'https://www.dacia.ro/gama-dacia/jogger.html',
    image_url: 'https://cdn.group.renault.com/dac/ro/gpl/Jogger-GPL.jpg.ximg.xsmall.jpg/7292573e4a.jpg',
  },
];

function findModel(query) {
  const q = String(query).trim().toLowerCase();
  if (!q) return null;
  return MOCK_DATA.find((m) => m.model_id.toLowerCase() === q || m.name.toLowerCase() === q)
    || MOCK_DATA.find((m) => m.name.toLowerCase().includes(q) || q.includes(m.model_id.toLowerCase()));
}

module.exports = async ({ first_model = '', second_model = '', intended_use = '', priority_features = [] } = {}) => {
  if (!first_model || typeof first_model !== 'string' || !first_model.trim()
    || !second_model || typeof second_model !== 'string' || !second_model.trim()) {
    return {
      content: [{ type: 'text', text: 'Please provide two Dacia models to compare (first_model and second_model).' }],
      // structuredContent.models — derived from action name "compare_dacia_models" (bare array outputSchema rule)
      structuredContent: { models: [] },
    };
  }

  const modelA = findModel(first_model);
  const modelB = findModel(second_model);
  const found = [modelA, modelB].filter(Boolean);

  if (found.length < 2) {
    const missing = [!modelA ? first_model : null, !modelB ? second_model : null].filter(Boolean).join(', ');
    return {
      content: [{ type: 'text', text: `Could not find both models to compare. No match for: ${missing}.` }],
      // structuredContent.models — derived from action name "compare_dacia_models" (bare array outputSchema rule)
      structuredContent: { models: found },
    };
  }

  const useNote = intended_use && typeof intended_use === 'string' && intended_use.trim()
    ? ` for ${intended_use.trim()}`
    : '';
  const features = Array.isArray(priority_features) && priority_features.length
    ? ` Prioritising ${priority_features.join(', ')}.`
    : '';

  return {
    content: [{
      type: 'text',
      text: `Comparing the ${modelA.name} and ${modelB.name}${useNote} on space, boot capacity, and equipment.${features} Final specifications depend on the selected version and configuration.`,
    }],
    // structuredContent.models — derived from action name "compare_dacia_models" (bare array outputSchema rule)
    structuredContent: { models: found },
  };
};

/*
 * TODO: Replace MOCK_DATA with a real API call.
 *
 * Suggested endpoint pattern (update based on actual site API):
 *   GET ${process.env.API_BASE_URL}/models?ids=${first_model},${second_model}
 *
 * Environment variables to configure:
 *   API_BASE_URL   Base URL of the website's API
 *   API_KEY        API key if required (add to .env and app.config.yaml)
 *
 * Example fetch:
 *   const res = await fetch(
 *     `${process.env.API_BASE_URL}/models?ids=${encodeURIComponent(first_model)},${encodeURIComponent(second_model)}`,
 *     { headers: { 'Authorization': `Bearer ${process.env.API_KEY}` } }
 *   )
 *   if (!res.ok) throw new Error(`API error: ${res.status}`)
 *   return await res.json()
 */
