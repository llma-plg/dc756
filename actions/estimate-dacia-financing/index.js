// TODO: Replace MOCK_VEHICLES / the illustrative computation with a real API call.
// See the TODO block below the handler for endpoint details.
// Real Dacia vehicle catalogue (samplePayload) — used for contextual vehicle matching.
const MOCK_VEHICLES = [
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

const REQUEST_OFFER_URL = 'https://www.dacia.ro/oferte-financiare.html';
const DISCLAIMER = 'Illustrative only — not a credit approval or binding finance offer. Approval, interest, fees, insurance, and final payment values require an official Mobilize Financial Services offer.';

// Published financing-route context (structural facts, not a rate quote).
const SCENARIO_TEMPLATES = {
    credit: {
        financing_type: 'Credit',
        ownership_timing: 'You own the vehicle from the start; the financer holds a lien until the final payment.',
        minimum_deposit_context: 'Published minimum deposit typically from ~15%.',
        term_context: 'Terms commonly 12–60 months.',
        fixed_rate_indicator: true,
        residual_value_context: 'No balloon payment; the loan fully amortises over the term.',
        included_services: ['Optional GAP insurance', 'Optional maintenance pack'],
        key_tradeoffs: ['Higher monthly payment than leasing', 'Full ownership and no mileage limits'],
    },
    leasing: {
        financing_type: 'Financial leasing',
        ownership_timing: 'Ownership transfers at the end of the contract after the residual value is settled.',
        minimum_deposit_context: 'Advance payment commonly from ~10–20%.',
        term_context: 'Terms commonly 24–60 months.',
        fixed_rate_indicator: true,
        residual_value_context: 'A residual (balloon) value is due or refinanced at contract end.',
        included_services: ['CASCO insurance often bundled', 'Assistance package'],
        key_tradeoffs: ['Lower monthly payment', 'Residual value due at the end'],
    },
};

function buildScenario(key, includeServices) {
    const base = SCENARIO_TEMPLATES[key];
    const scenario = {
        financing_type: base.financing_type,
        ownership_timing: base.ownership_timing,
        minimum_deposit_context: base.minimum_deposit_context,
        term_context: base.term_context,
        fixed_rate_indicator: base.fixed_rate_indicator,
        residual_value_context: base.residual_value_context,
        included_services: includeServices ? base.included_services.slice() : [],
        key_tradeoffs: base.key_tradeoffs.slice(),
    };
    return scenario;
}

module.exports = async ({
    vehicle_price_eur,
    deposit_eur = 0,
    term_months,
    financing_type = 'compare both',
    include_services = true,
} = {}) => {
    const price = Number(vehicle_price_eur);
    const term = Number(term_months);

    if (!Number.isFinite(price) || price <= 0) {
        return {
            content: [{ type: 'text', text: 'Please provide a vehicle_price_eur (a positive number in euros) to estimate financing.' }],
            structuredContent: {},
        };
    }
    if (!Number.isFinite(term) || term <= 0) {
        return {
            content: [{ type: 'text', text: 'Please provide a term_months (a positive number of months) to estimate financing.' }],
            structuredContent: {},
        };
    }

    const rawDeposit = Number(deposit_eur);
    const deposit = Number.isFinite(rawDeposit) && rawDeposit > 0 ? Math.min(rawDeposit, price) : 0;
    const financed = Math.max(price - deposit, 0);

    // Illustrative flat-amortisation estimate only — NOT an interest-bearing quote.
    const estimatedMonthly = financed > 0 && term > 0 ? Math.round(financed / term) : 0;

    const requested = String(financing_type).toLowerCase();
    const wantsCredit = requested.includes('credit') || requested.includes('both') || requested.includes('compare');
    const wantsLeasing = requested.includes('leas') || requested.includes('both') || requested.includes('compare');

    const scenarios = [];
    if (wantsCredit || (!wantsCredit && !wantsLeasing)) scenarios.push(buildScenario('credit', include_services !== false));
    if (wantsLeasing) scenarios.push(buildScenario('leasing', include_services !== false));

    const structuredContent = {
        vehicle_price: price,
        currency: 'EUR',
        deposit_amount: deposit,
        financed_amount: financed,
        term_months: term,
        estimated_monthly_payment: estimatedMonthly,
        scenarios,
        disclaimer: DISCLAIMER,
        request_offer_url: REQUEST_OFFER_URL,
    };

    const summary = `Explored ${scenarios.length} financing route${scenarios.length === 1 ? '' : 's'} for a ${price.toLocaleString('en-GB')} EUR vehicle with a ${deposit.toLocaleString('en-GB')} EUR deposit over ${term} months. The most consequential difference: with credit you own the car from the start and the loan fully amortises, while financial leasing keeps monthly payments lower but leaves a residual (balloon) value due at contract end before ownership transfers. These figures are illustrative — approval, interest, fees, insurance, and final payment values require an official Mobilize Financial Services offer.`;

    return {
        content: [{ type: 'text', text: summary }],
        // structuredContent — flat single-object detail shape (widget reads sc directly, no wrapper key)
        structuredContent,
    };
};

/*
 * TODO: Replace the illustrative computation and MOCK_VEHICLES with a real API call.
 *
 * Suggested endpoint pattern (update based on actual site / Mobilize Financial Services API):
 *   GET ${process.env.API_BASE_URL}/financing/estimate?price=${vehicle_price_eur}&deposit=${deposit_eur}&term=${term_months}&type=${financing_type}
 *
 * Environment variables to configure:
 *   API_BASE_URL   Base URL of the financing API
 *   API_KEY        API key if required (add to .env and app.config.yaml)
 *
 * Authentication: check the provider's developer docs or captured network
 *   requests for the correct auth header pattern.
 *
 * Example fetch:
 *   const res = await fetch(
 *     `${process.env.API_BASE_URL}/financing/estimate?price=${encodeURIComponent(vehicle_price_eur)}`,
 *     { headers: { 'Authorization': `Bearer ${process.env.API_KEY}` } }
 *   )
 *   if (!res.ok) throw new Error(`API error: ${res.status}`)
 *   return await res.json()
 */
