// TODO: Replace MOCK_DATA with a real API call.
// See the TODO block below the handler for endpoint details.
// MOCK_DATA is the real samplePayload (dacia.ro model range), used verbatim.
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
        features: ['Dual-zone climate control', '10.1" media display', 'Wireless smartphone replication', 'Arkamys 3D sound', 'YouClip accessory system', 'Hill descent control', 'Level 2 driving assistance'],
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
        features: ['YouClip modular system', '10.1" touchscreen', 'Multiview camera', 'Hill descent control', 'Emergency braking assist', 'Sleep Pack (Extreme)'],
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

// Approximate RON→EUR rate for comparing the RON starting_price against the euro budget input.
const RON_PER_EUR = 5;

// Map a powertrain preference to the tokens used in each model's `powertrains` list.
function matchesPowertrain(powertrains, preference) {
    const pref = preference.trim().toLowerCase();
    if (!pref || pref === 'no preference' || pref === 'any') return true;
    const list = powertrains.map((p) => p.toLowerCase());
    if (pref.includes('electric')) return list.some((p) => p.includes('electric'));
    if (pref.includes('full hybrid')) return list.some((p) => p.includes('full hybrid'));
    if (pref.includes('mild hybrid')) return list.some((p) => p.includes('mild hybrid'));
    if (pref.includes('hybrid')) return list.some((p) => p.includes('hybrid'));
    if (pref === 'gpl' || pref === 'lpg') return list.some((p) => p.includes('gpl') || p.includes('lpg'));
    if (pref.includes('petrol')) return list.some((p) => p.includes('petrol'));
    return list.some((p) => p.includes(pref));
}

// Build the fit_summary explaining how each model matches the supplied needs.
function buildFitSummary(item, { budget_max_eur, passenger_capacity, powertrain_preference }) {
    const bits = [];
    bits.push(`Seats up to ${item.seats}`);
    bits.push(`${item.boot_capacity_liters}L boot`);
    if (budget_max_eur) {
        const approxEur = Math.round(item.starting_price / RON_PER_EUR);
        bits.push(`from ~€${approxEur.toLocaleString('en-US')}`);
    }
    const efficient = item.powertrains.filter((p) => /hybrid|electric|gpl|lpg/i.test(p));
    if (efficient.length) bits.push(`economical ${efficient[0]} option`);
    return `${bits.join(', ')}.`;
}

// Transform a MOCK_DATA record into the outputSchema shape the widget reads.
function toModel(item, args) {
    return {
        model_id: item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        name: item.name,
        description: item.category,
        body_style: item.body_style,
        starting_price: item.starting_price,
        currency: item.currency,
        price_context: 'Starting price, subject to the current commercial offer, stock and Rabla/finance conditions.',
        passenger_capacity: item.seats,
        powertrain_types: item.powertrains,
        fit_summary: buildFitSummary(item, args),
        image_url: '',
        details_url: item.detail_url,
        configure_url: item.configure_url,
    };
}

module.exports = async ({
    budget_max_eur = 0,
    body_style = '',
    passenger_capacity = 0,
    powertrain_preference = '',
    primary_use = '',
} = {}) => {
    const args = { budget_max_eur, body_style, passenger_capacity, powertrain_preference, primary_use };

    const budgetRon = Number(budget_max_eur) > 0 ? Number(budget_max_eur) * RON_PER_EUR : 0;
    const style = String(body_style).trim().toLowerCase();
    const minSeats = Number(passenger_capacity) > 0 ? Number(passenger_capacity) : 0;

    const matches = MOCK_DATA.filter((item) => {
        if (budgetRon && item.starting_price > budgetRon) return false;
        if (minSeats && item.seats < minSeats) return false;
        if (style && !item.body_style.toLowerCase().includes(style) && !item.category.toLowerCase().includes(style)) return false;
        if (powertrain_preference && !matchesPowertrain(item.powertrains, powertrain_preference)) return false;
        return true;
    });

    // Cheapest first — starting price is the primary buyer signal.
    matches.sort((a, b) => a.starting_price - b.starting_price);

    const models = matches.map((item) => toModel(item, args));

    // Zero matches is not an error — return the empty array under the same key.
    if (models.length === 0) {
        return {
            content: [{ type: 'text', text: 'No Dacia models match those criteria right now — try relaxing the budget, seat count, or powertrain filters.' }],
            // structuredContent.models — bare array outputSchema; key derived from actionName "discover_dacia_models"
            structuredContent: { models: [] },
        };
    }

    const lead = models[0];
    const second = models[1];
    let summary = `Found ${models.length} Dacia ${models.length === 1 ? 'model' : 'models'} that fit your needs. `
        + `${lead.name} leads on value — it seats ${lead.passenger_capacity} with economical `
        + `${lead.powertrain_types.join(', ')} options at a low starting price.`;
    if (second) {
        summary += ` Compare it with ${second.name} to weigh space against running costs before deciding.`;
    }

    return {
        content: [{ type: 'text', text: summary }],
        // structuredContent.models — bare array outputSchema; key derived from actionName "discover_dacia_models"
        structuredContent: { models },
    };
};

/*
 * TODO: Replace MOCK_DATA with a real API call.
 *
 * Suggested endpoint pattern (update based on the actual dacia.ro API):
 *   GET ${process.env.API_BASE_URL}/models?budget_max_eur=${budget_max_eur}&body_style=${body_style}
 *
 * Environment variables to configure:
 *   API_BASE_URL   Base URL of the website's API
 *   API_KEY        API key if required (add to .env and app.config.yaml)
 *
 * Example fetch:
 *   const res = await fetch(
 *     `${process.env.API_BASE_URL}/models?budget_max_eur=${encodeURIComponent(budget_max_eur)}`,
 *     { headers: { 'Authorization': `Bearer ${process.env.API_KEY}` } }
 *   )
 *   if (!res.ok) throw new Error(`API error: ${res.status}`)
 *   return await res.json()
 */
