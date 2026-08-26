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

// Map an internal MOCK_DATA record to the tool's outputSchema shape.
function toModel(record) {
    return {
        model_id: record.name,
        name: record.name,
        starting_price: record.starting_price,
        currency: record.currency,
        price_context: 'Advertised starting price; may include promotions and varies by version.',
        body_style: record.body_style,
        passenger_capacity: record.seats,
        luggage_capacity_litres: record.boot_capacity_liters,
        powertrain_types: record.powertrains,
        drivetrain_options: (record.powertrains || []).some((p) => /4x4/i.test(p))
            ? ['front-wheel drive', '4x4']
            : ['front-wheel drive'],
        versions: record.versions,
        key_features: record.features,
        use_case_fit: record.category,
        configure_url: record.configure_url,
    };
}

function findModel(query) {
    const q = query.trim().toLowerCase();
    return MOCK_DATA.find((m) => m.name.toLowerCase() === q)
        || MOCK_DATA.find((m) => m.name.toLowerCase().includes(q));
}

module.exports = async ({ first_model_id = '', second_model_id = '', priority = '' } = {}) => {
    if (!first_model_id || typeof first_model_id !== 'string' || !first_model_id.trim()
        || !second_model_id || typeof second_model_id !== 'string' || !second_model_id.trim()) {
        return {
            content: [{ type: 'text', text: 'Please provide first_model_id and second_model_id — two Dacia models to compare.' }],
            // structuredContent.models — bare array outputSchema; key derived from actionName "compare_dacia_models"
            structuredContent: { models: [] },
        };
    }

    const first = findModel(first_model_id);
    const second = findModel(second_model_id);
    const missing = [];
    if (!first) missing.push(first_model_id.trim());
    if (!second) missing.push(second_model_id.trim());

    if (missing.length > 0) {
        return {
            content: [{ type: 'text', text: `Could not find the following Dacia model(s): ${missing.join(', ')}.` }],
            structuredContent: { models: [] },
        };
    }

    const models = [toModel(first), toModel(second)];
    const priorityNote = priority && priority.trim()
        ? ` based on your priority (${priority.trim()})`
        : '';
    const summary = `Comparing ${first.name} and ${second.name} side by side on price, space, and practicality${priorityNote}. `
        + `${first.name} offers ${first.boot_capacity_liters}L of luggage space versus ${second.name}'s ${second.boot_capacity_liters}L; `
        + 'the larger, more equipped model tends to suit family travel and space while the smaller one favours a lower starting price and urban use. '
        + 'Specifications can vary by version, and advertised prices are not guaranteed final prices.';

    return {
        content: [{ type: 'text', text: summary }],
        // structuredContent.models — bare array outputSchema; key derived from actionName "compare_dacia_models"
        structuredContent: { models },
    };
};

/*
 * TODO: Replace MOCK_DATA with a real API call.
 *
 * Suggested endpoint pattern (update based on actual site API):
 *   GET ${process.env.API_BASE_URL}/models?id=${first_model_id}
 *   GET ${process.env.API_BASE_URL}/models?id=${second_model_id}
 *
 * Environment variables to configure:
 *   API_BASE_URL   Base URL of the website's API
 *   API_KEY        API key if required (add to .env and app.config.yaml)
 *
 * Example fetch:
 *   const res = await fetch(
 *     `${process.env.API_BASE_URL}/models?id=${encodeURIComponent(first_model_id)}`,
 *     { headers: { 'Authorization': `Bearer ${process.env.API_KEY}` } }
 *   )
 *   if (!res.ok) throw new Error(`API error: ${res.status}`)
 *   return await res.json()
 */
