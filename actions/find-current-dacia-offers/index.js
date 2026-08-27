// TODO: Replace MOCK_DATA with a real API call.
// See the TODO block below the handler for endpoint details.
// Real data from Action Planner (Dacia Romania model range + published Rabla
// campaign pricing), reshaped to match this tool's outputSchema (offer fields).
const MOCK_DATA = [
  {
    offer_id: 'bigster-rabla-2026',
    model_name: 'Dacia Bigster',
    image_url: 'https://cdn.group.renault.com/dac/ro/gpl/Bigster%20GPL.jpg.ximg.xsmall.jpg/e6921f98ca.jpg',
    offer_price: 19290,
    currency: 'EUR',
    offer_type: 'Rabla campaign',
    customer_type: 'Private',
    eligibility_summary: 'Rabla trade-in required. Largest Dacia SUV, full hybrid.',
    valid_until: '2026-12-31',
    availability_note: 'Subject to Rabla program funding and stock.',
    offer_url: 'https://www.dacia.ro/gama-de-modele-hibride-si-electrice/bigster-suv.html',
  },
  {
    offer_id: 'duster-rabla-2026',
    model_name: 'Dacia Duster',
    image_url: 'https://cdn.group.renault.com/dac/master/dacia-vn/vehicules/duster-p1310/overview/editorial/dacia-duster-p1310-overview-004-1-mobile.jpg.ximg.xsmall.jpg/ba4175c768.jpg',
    offer_price: 15900,
    currency: 'EUR',
    offer_type: 'Rabla campaign',
    customer_type: 'Private',
    eligibility_summary: 'Rabla trade-in required. 4x4 with terrain mode selector.',
    valid_until: '2026-12-31',
    availability_note: 'Subject to Rabla program funding and stock.',
    offer_url: 'https://www.dacia.ro/gama-de-modele-hibride-si-electrice/duster-suv.html',
  },
  {
    offer_id: 'logan-rabla-2026',
    model_name: 'Dacia Logan',
    image_url: 'https://cdn.group.renault.com/dac/ro/gpl/Logan%20GPL.jpg.ximg.xsmall.jpg/7d9c1a07d2.jpg',
    offer_price: 11990,
    currency: 'EUR',
    offer_type: 'Rabla campaign',
    customer_type: 'Private',
    eligibility_summary: 'Rabla trade-in required. Most affordable Dacia sedan.',
    valid_until: '2026-12-31',
    availability_note: 'Subject to Rabla program funding and stock.',
    offer_url: 'https://www.dacia.ro/gama-dacia/logan-berlina.html',
  },
  {
    offer_id: 'sandero-stepway-rabla-2026',
    model_name: 'Dacia Sandero Stepway',
    image_url: 'https://cdn.group.renault.com/dac/ro/bigster-duster-4x4.jpg.ximg.xsmall.jpg/cabdb68ae0.jpg',
    offer_price: 12990,
    currency: 'EUR',
    offer_type: 'Rabla campaign',
    customer_type: 'Private',
    eligibility_summary: 'Rabla trade-in required. Raised crossover with LPG.',
    valid_until: '2026-12-31',
    availability_note: 'Subject to Rabla program funding and stock.',
    offer_url: 'https://www.dacia.ro/gama-dacia/sandero-stepway-crossover.html',
  },
  {
    offer_id: 'spring-2026',
    model_name: 'Dacia Spring',
    image_url: 'https://cdn.group.renault.com/dac/master/dacia-vn/vehicules/dacia-bbg/spring-bbg-ph2/overview/editorial/dacia-spring-bbg-ph2-overview-029-portrait.jpg.ximg.xsmall.jpg/ace8f25eb0.jpg',
    offer_price: 13590,
    currency: 'EUR',
    offer_type: 'Campaign',
    customer_type: 'Private',
    eligibility_summary: '100% electric city car; optional fast charging.',
    valid_until: '',
    availability_note: 'Availability and financing conditions can change.',
    offer_url: 'https://www.dacia.ro/gama-de-modele-hibride-si-electrice/spring-masina-de-oras.html',
  },
  {
    offer_id: 'jogger-rabla-2026',
    model_name: 'Dacia Jogger',
    image_url: 'https://cdn.group.renault.com/dac/ro/gpl/Jogger-GPL.jpg.ximg.xsmall.jpg/7292573e4a.jpg',
    offer_price: 15990,
    currency: 'EUR',
    offer_type: 'Rabla campaign',
    customer_type: 'Private',
    eligibility_summary: 'Rabla trade-in required. Up to 7 seats, long body.',
    valid_until: '2026-12-31',
    availability_note: 'Subject to Rabla program funding and stock.',
    offer_url: 'https://www.dacia.ro/gama-dacia/jogger.html',
  },
];

module.exports = async ({ model_name = '', customer_type = '', offer_type = '' }) => {
  const modelQuery = typeof model_name === 'string' ? model_name.trim().toLowerCase() : '';
  const customerQuery = typeof customer_type === 'string' ? customer_type.trim().toLowerCase() : '';
  const offerQuery = typeof offer_type === 'string' ? offer_type.trim().toLowerCase() : '';

  const offers = MOCK_DATA.filter((offer) => {
    if (modelQuery && !offer.model_name.toLowerCase().includes(modelQuery)) return false;
    if (customerQuery && !offer.customer_type.toLowerCase().includes(customerQuery)) return false;
    if (offerQuery && !offer.offer_type.toLowerCase().includes(offerQuery)) return false;
    return true;
  });

  const caveat = 'Final eligibility, government-program funding, and stock must be confirmed with a Dacia dealer, as discounts and financing conditions can change.';

  if (offers.length === 0) {
    return {
      content: [{ type: 'text', text: `No current Dacia offers matched that request. ${caveat}` }],
      // structuredContent.offers — bare array outputSchema; key derived from actionName "find_current_dacia_offers"
      structuredContent: { offers: [] },
    };
  }

  const summary = `Found ${offers.length} current Dacia ${offers.length === 1 ? 'offer' : 'offers'}. ${caveat}`;

  return {
    content: [{ type: 'text', text: summary }],
    // structuredContent.offers — bare array outputSchema; key derived from actionName "find_current_dacia_offers"
    structuredContent: { offers },
  };
};

/*
 * TODO: Replace MOCK_DATA with a real API call.
 *
 * Suggested endpoint pattern (update based on actual site API):
 *   GET ${process.env.API_BASE_URL}/offers?model=${model_name}&customer=${customer_type}&type=${offer_type}
 *
 * Environment variables to configure:
 *   API_BASE_URL   Base URL of the website's API
 *   API_KEY        API key if required (add to .env and app.config.yaml)
 *
 * Authentication: check the website's developer docs or network requests
 *   captured during browsing for the correct auth header pattern.
 *
 * Example fetch:
 *   const res = await fetch(
 *     `${process.env.API_BASE_URL}/offers?model=${encodeURIComponent(model_name)}`,
 *     { headers: { 'Authorization': `Bearer ${process.env.API_KEY}` } }
 *   )
 *   if (!res.ok) throw new Error(`API error: ${res.status}`)
 *   return await res.json()
 */
