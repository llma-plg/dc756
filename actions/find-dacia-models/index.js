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
        key_highlights: ['Largest Dacia SUV', 'Available as full hybrid', 'Up to 4x4 hybrid-G powertrain', 'Rabla campaign price from 19,290 EUR'],
        is_deal: true,
        detail_url: 'https://www.dacia.ro/gama-de-modele-hibride-si-electrice/bigster-suv.html',
        image_url: 'https://cdn.group.renault.com/dac/ro/gpl/Bigster%20GPL.jpg.ximg.xsmall.jpg/e6921f98ca.jpg'
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
        image_url: 'https://cdn.group.renault.com/dac/master/dacia-vn/vehicules/duster-p1310/overview/editorial/dacia-duster-p1310-overview-004-1-mobile.jpg.ximg.xsmall.jpg/ba4175c768.jpg'
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
        image_url: 'https://cdn.group.renault.com/dac/ro/gpl/Logan%20GPL.jpg.ximg.xsmall.jpg/7d9c1a07d2.jpg'
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
        image_url: 'https://cdn.group.renault.com/dac/ro/bigster-duster-4x4.jpg.ximg.xsmall.jpg/cabdb68ae0.jpg'
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
        image_url: 'https://cdn.group.renault.com/dac/master/dacia-vn/vehicules/dacia-bbg/spring-bbg-ph2/overview/editorial/dacia-spring-bbg-ph2-overview-029-portrait.jpg.ximg.xsmall.jpg/ace8f25eb0.jpg'
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
        image_url: 'https://cdn.group.renault.com/dac/ro/gpl/Jogger-GPL.jpg.ximg.xsmall.jpg/7292573e4a.jpg'
    }
];

function matchesPowertrain(model, powertrain) {
    const want = powertrain.trim().toLowerCase();
    if (!want || want === 'no preference' || want === 'any') return true;
    return (model.powertrains || []).some((pt) => {
        const s = String(pt).toLowerCase();
        if (want === 'lpg') return s.includes('lpg') || s.includes('eco-g');
        return s.includes(want);
    });
}

module.exports = async ({ max_budget_eur = 0, powertrain = '', body_style = '', minimum_seats = 0, intended_use = '' } = {}) => {
    const budget = typeof max_budget_eur === 'number' && max_budget_eur > 0 ? max_budget_eur : 0;
    const minSeats = typeof minimum_seats === 'number' && minimum_seats > 0 ? minimum_seats : 0;
    const wantBody = String(body_style || '').trim().toLowerCase();

    const results = MOCK_DATA.filter((model) => {
        if (budget && typeof model.starting_price === 'number' && model.starting_price > budget) return false;
        if (minSeats && typeof model.seats === 'number' && model.seats < minSeats) return false;
        if (wantBody) {
            const hay = `${model.body_style || ''} ${model.category || ''}`.toLowerCase();
            if (!hay.includes(wantBody)) return false;
        }
        if (!matchesPowertrain(model, powertrain)) return false;
        return true;
    });

    // Zero matches is not an error — return the empty array under the same key so the
    // widget renders its normal empty-list state.
    if (results.length === 0) {
        return {
            content: [{ type: 'text', text: 'No Dacia models matched those preferences. Try widening the budget, seats, or powertrain — and note that prices and availability require confirmation with a dealer.' }],
            // structuredContent.models — bare array outputSchema; key derived from actionName "find_dacia_models"
            structuredContent: { models: [] }
        };
    }

    const summary = `Found ${results.length} Dacia model${results.length === 1 ? '' : 's'} matching your needs. Published starting prices and availability are indicative and require confirmation with a dealer.`;

    return {
        content: [{ type: 'text', text: summary }],
        // structuredContent.models — bare array outputSchema; key derived from actionName "find_dacia_models"
        structuredContent: { models: results }
    };
};

/*
 * TODO: Replace MOCK_DATA with a real API call.
 *
 * Suggested endpoint pattern (update based on actual site API):
 *   GET ${process.env.API_BASE_URL}/models?max_budget=${max_budget_eur}&body_style=${body_style}
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
 *     `${process.env.API_BASE_URL}/models?max_budget=${encodeURIComponent(max_budget_eur)}`,
 *     { headers: { 'Authorization': `Bearer ${process.env.API_KEY}` } }
 *   )
 *   if (!res.ok) throw new Error(`API error: ${res.status}`)
 *   return await res.json()
 */
