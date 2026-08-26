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

module.exports = async ({ model_id = '', customer_type = '', purchase_preference = '' } = {}) => {
    const model = typeof model_id === 'string' ? model_id.trim().toLowerCase() : '';

    const offers = MOCK_DATA.filter((offer) => {
        if (model && !offer.name.toLowerCase().includes(model)) return false;
        return true;
    });

    if (offers.length === 0) {
        return {
            content: [{ type: 'text', text: `No current Dacia offers found${model_id ? ` for "${model_id}"` : ''}.` }],
            // structuredContent.offers — derived from action name "find_dacia_offers" (bare array outputSchema rule)
            structuredContent: { offers: [] },
        };
    }

    const prefNote = purchase_preference && typeof purchase_preference === 'string' && purchase_preference.trim()
        ? ` for ${purchase_preference.trim()}`
        : '';
    const summary = `Showing ${offers.length} current Dacia offer${offers.length === 1 ? '' : 's'}${prefNote}. `
        + 'Advertised prices are starting/promotional figures — eligibility, available program funds (e.g. Rabla), '
        + 'stock, chosen configuration and final dealer confirmation can change the final price.';

    return {
        content: [{ type: 'text', text: summary }],
        // structuredContent.offers — derived from action name "find_dacia_offers" (bare array outputSchema rule)
        structuredContent: { offers },
    };
};

/*
 * TODO: Replace MOCK_DATA with a real API call.
 *
 * Suggested endpoint pattern (update based on actual site API):
 *   GET ${process.env.API_BASE_URL}/offers?model=${model_id}&customer=${customer_type}&preference=${purchase_preference}
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
 *     `${process.env.API_BASE_URL}/offers?model=${encodeURIComponent(model_id)}`,
 *     { headers: { 'Authorization': `Bearer ${process.env.API_KEY}` } }
 *   )
 *   if (!res.ok) throw new Error(`API error: ${res.status}`)
 *   return await res.json()
 */
