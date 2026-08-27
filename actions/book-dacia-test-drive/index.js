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
        seats: 5,
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
        seats: 5,
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
        seats: 5,
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
        seats: 5,
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
        seats: 4,
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
        seats: 7,
        is_deal: true,
        detail_url: 'https://www.dacia.ro/gama-dacia/jogger.html',
        image_url: 'https://cdn.group.renault.com/dac/ro/gpl/Jogger-GPL.jpg.ximg.xsmall.jpg/7292573e4a.jpg',
    },
];

function findModel(modelName) {
    const query = modelName.trim().toLowerCase();
    return MOCK_DATA.find((m) => m.name.toLowerCase() === query)
        || MOCK_DATA.find((m) => m.name.toLowerCase().includes(query))
        || MOCK_DATA.find((m) => m.model_id.toLowerCase() === query);
}

function buildRequestedSlot(preferred_date, preferred_time_window) {
    const parts = [];
    if (preferred_date) parts.push(preferred_date);
    if (preferred_time_window) parts.push(preferred_time_window);
    return parts.join(' ');
}

function buildConfirmationId(dealer_id) {
    const suffix = Date.now().toString(36).toUpperCase().slice(-6);
    const prefix = String(dealer_id || 'TD').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6) || 'TD';
    return `TD-${prefix}-${suffix}`;
}

module.exports = async ({
    model_name = '',
    dealer_id = '',
    preferred_date = '',
    preferred_time_window = '',
    full_name = '',
    phone = '',
    email = '',
    consent_to_contact = false,
} = {}) => {
    if (!model_name || typeof model_name !== 'string' || !model_name.trim()) {
        return {
            content: [{ type: 'text', text: 'Please provide a model_name for the Dacia model you want to test drive.' }],
            structuredContent: {},
        };
    }
    if (!dealer_id || typeof dealer_id !== 'string' || !dealer_id.trim()) {
        return {
            content: [{ type: 'text', text: 'Please provide a dealer_id for the dealership where you want the test drive.' }],
            structuredContent: {},
        };
    }
    if (!preferred_date || typeof preferred_date !== 'string' || !preferred_date.trim()) {
        return {
            content: [{ type: 'text', text: 'Please provide a preferred_date (ISO date) for the test drive.' }],
            structuredContent: {},
        };
    }
    if (!full_name || typeof full_name !== 'string' || !full_name.trim()) {
        return {
            content: [{ type: 'text', text: 'Please provide your full_name so the dealership can contact you.' }],
            structuredContent: {},
        };
    }
    if (!phone || typeof phone !== 'string' || !phone.trim()) {
        return {
            content: [{ type: 'text', text: 'Please provide a contact phone number for the test-drive request.' }],
            structuredContent: {},
        };
    }
    if (consent_to_contact !== true) {
        return {
            content: [{ type: 'text', text: 'The dealership needs your consent to contact you (consent_to_contact) before we can submit the request.' }],
            structuredContent: {},
        };
    }

    const model = findModel(model_name);
    const resolvedModelName = model ? model.name : model_name.trim();
    const dealerName = `Dacia Dealer ${dealer_id.trim()}`;
    const requestedSlot = buildRequestedSlot(preferred_date.trim(), preferred_time_window.trim());
    const confirmationId = buildConfirmationId(dealer_id);

    // TODO: submit to the real dealership booking API here (see TODO block below).
    const status = 'pending confirmation';
    const message = `Your test-drive request for the ${resolvedModelName} has been submitted to ${dealerName}`
        + `${requestedSlot ? ` for ${requestedSlot}` : ''}. `
        + 'The dealership will follow up to confirm the final appointment.';

    return {
        content: [{ type: 'text', text: `Test-drive request submitted for the ${resolvedModelName} — confirmation #${confirmationId} (${status}).` }],
        structuredContent: {
            confirmation_id: confirmationId,
            status,
            message,
            model_name: resolvedModelName,
            dealer_name: dealerName,
            requested_slot: requestedSlot,
        },
    };
};

/*
 * TODO: Replace the mock booking logic with a real API call.
 *
 * Suggested endpoint pattern (update based on actual site API):
 *   POST ${process.env.API_BASE_URL}/test-drive-requests
 *   body: { model_name, dealer_id, preferred_date, preferred_time_window,
 *           full_name, phone, email, consent_to_contact }
 *
 * Environment variables to configure:
 *   API_BASE_URL   Base URL of the website's API
 *   API_KEY        API key if required (add to .env and app.config.yaml)
 *
 * Example fetch:
 *   const res = await fetch(`${process.env.API_BASE_URL}/test-drive-requests`, {
 *     method: 'POST',
 *     headers: {
 *       'Content-Type': 'application/json',
 *       'Authorization': `Bearer ${process.env.API_KEY}`,
 *     },
 *     body: JSON.stringify({ model_name, dealer_id, preferred_date,
 *       preferred_time_window, full_name, phone, email, consent_to_contact }),
 *   })
 *   if (!res.ok) throw new Error(`API error: ${res.status}`)
 *   return await res.json()
 */
