// TODO: Replace MOCK_DATA with a real API call.
// See the TODO block below the handler for endpoint details.
const MOCK_DATA = [
    {
        plan_id: 'dacia_credit',
        plan_name: 'Dacia Credit',
        financing_structure: 'Classic auto credit: you borrow the financed amount and repay it in fixed monthly instalments, becoming the outright owner from the start.',
        deposit_note: 'Optional deposit reduces the financed amount; 4,000 EUR on a 20,000 EUR vehicle lowers the amount to finance to 16,000 EUR.',
        term_note: 'Typical terms range from 12 to 60 months; 48 months requested.',
        rate_structure: 'Fixed annual interest rate for the whole term, so instalments stay predictable.',
        illustrative_monthly_payment: 372,
        currency: 'EUR',
        ownership_options: ['Own the vehicle from day one', 'No mileage limits', 'Keep the car after the final instalment'],
        flexibility_summary: 'Best when you want to keep the car long term with predictable, unchanging repayments.',
        required_documents: ['Valid ID', 'Proof of income', 'Proof of address'],
        important_conditions: ['Approval subject to eligibility and credit checks', 'Advertised rate depends on profile and term', 'Final APR confirmed in the official offer'],
    },
    {
        plan_id: 'financial_leasing',
        plan_name: 'Financial Leasing',
        financing_structure: 'Leasing: you pay to use the vehicle over the term with a set residual value, then choose to buy, return, or change it.',
        deposit_note: 'Upfront contribution lowers monthly payments; 4,000 EUR upfront reduces the amount spread across the term.',
        term_note: 'Common terms from 24 to 48 months; 48 months requested.',
        rate_structure: 'Rate reflected in the lease factor; monthly cost weighted by the agreed residual value.',
        illustrative_monthly_payment: 315,
        currency: 'EUR',
        ownership_options: ['Buy at the residual value', 'Return the vehicle', 'Change to a newer Dacia'],
        flexibility_summary: 'Best when you value lower monthly cost and the freedom to return or change the car at term end.',
        required_documents: ['Valid ID', 'Proof of income', 'Proof of address'],
        important_conditions: ['Mileage limits may apply', 'Excess wear or mileage can incur charges', 'Approval subject to eligibility and credit checks'],
    },
];

module.exports = async ({
    vehicle_price_eur,
    deposit_eur = 0,
    preferred_term_months = 0,
    annual_mileage_km = 0,
    ownership_preference = '',
} = {}) => {
    if (
        vehicle_price_eur === undefined
        || vehicle_price_eur === null
        || typeof vehicle_price_eur !== 'number'
        || !(vehicle_price_eur > 0)
    ) {
        return {
            content: [{ type: 'text', text: 'Please provide a vehicle_price_eur (a positive number) to compare financing options.' }],
            // structuredContent.options — bare array outputSchema; key derived from actionName "compare_dacia_financing_options"
            structuredContent: { options: [] },
        };
    }

    const options = MOCK_DATA;

    const price = vehicle_price_eur;
    const financed = Math.max(0, price - deposit_eur);
    const termNote = preferred_term_months > 0 ? ` over ${preferred_term_months} months` : '';
    const depositNote = deposit_eur > 0 ? ` with a ${deposit_eur.toLocaleString('en-US')} EUR deposit (about ${financed.toLocaleString('en-US')} EUR to finance)` : '';

    const summary = `Comparing ${options.length} Dacia financing paths for a ${price.toLocaleString('en-US')} EUR vehicle${depositNote}${termNote}: Dacia Credit for predictable ownership and Financial Leasing for lower monthly cost and end-of-term flexibility. Payment figures are illustrative — approval, rates, and final payments require eligibility checks and confirmation through the official financing process.`;

    return {
        content: [{ type: 'text', text: summary }],
        // structuredContent.options — bare array outputSchema; key derived from actionName "compare_dacia_financing_options"
        structuredContent: { options },
    };
};

/*
 * TODO: Replace MOCK_DATA with a real API call.
 *
 * Suggested endpoint pattern (update based on actual site API):
 *   GET ${process.env.API_BASE_URL}/financing/compare?price=${vehicle_price_eur}&deposit=${deposit_eur}&term=${preferred_term_months}
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
 *     `${process.env.API_BASE_URL}/financing/compare?price=${encodeURIComponent(vehicle_price_eur)}`,
 *     { headers: { 'Authorization': `Bearer ${process.env.API_KEY}` } }
 *   )
 *   if (!res.ok) throw new Error(`API error: ${res.status}`)
 *   return await res.json()
 */
