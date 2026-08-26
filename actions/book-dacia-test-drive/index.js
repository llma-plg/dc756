// TODO: Replace MOCK_DATA with a real API call.
// See the TODO block below the handler for endpoint details.
const MOCK_DATA = [
  { name: 'Dacia Bigster', category: 'SUV (C-segment)', body_style: 'SUV', starting_price: 116900, currency: 'RON', seats: 5, boot_capacity_liters: 667, powertrains: ['full hybrid 155', 'mild hybrid 140', 'mild hybrid 130 4x4', 'GPL/LPG'], versions: ['Expression', 'Extreme', 'Journey'], features: ['Dual-zone climate control', '10.1" media display', 'Wireless smartphone replication', 'Arkamys 3D sound', 'YouClip accessory system', 'Hill descent control', 'Level 2 driving assistance'], detail_url: 'https://www.dacia.ro/gama-dacia/bigster.html', configure_url: 'https://www.dacia.ro/configuratorul-nostru.html', is_deal: false },
  { name: 'Dacia Duster', category: 'SUV (B-segment)', body_style: 'SUV', starting_price: 98900, currency: 'RON', seats: 5, boot_capacity_liters: 517, powertrains: ['full hybrid 140', 'mild hybrid 130', 'mild hybrid 130 4x4', 'GPL/LPG'], versions: ['Essential', 'Expression', 'Extreme', 'Journey'], features: ['YouClip modular system', '10.1" touchscreen', 'Multiview camera', 'Hill descent control', 'Emergency braking assist', 'Sleep Pack (Extreme)'], detail_url: 'https://www.dacia.ro/gama-dacia/duster.html', configure_url: 'https://www.dacia.ro/configuratorul-nostru.html', is_deal: false },
  { name: 'Dacia Jogger', category: 'Family estate (7-seater)', body_style: 'Estate / MPV', starting_price: 82900, currency: 'RON', seats: 7, boot_capacity_liters: 708, powertrains: ['full hybrid 140', 'GPL/LPG', 'petrol TCe'], versions: ['Essential', 'Expression', 'Extreme'], features: ['Up to 7 seats', 'Removable third-row seats', 'Modular boot', 'Roof bars'], detail_url: 'https://www.dacia.ro/gama-dacia/jogger.html', configure_url: 'https://www.dacia.ro/configuratorul-nostru.html', is_deal: false },
  { name: 'Dacia Sandero Stepway', category: 'Crossover hatchback', body_style: 'Hatchback (raised)', starting_price: 70900, currency: 'RON', seats: 5, boot_capacity_liters: 328, powertrains: ['mild hybrid', 'GPL/LPG', 'petrol TCe'], versions: ['Expression', 'Extreme'], features: ['Raised ground clearance', 'Roof bars', 'Media Display', 'Emergency braking assist'], detail_url: 'https://www.dacia.ro/gama-dacia/sandero-stepway.html', configure_url: 'https://www.dacia.ro/configuratorul-nostru.html', is_deal: false },
  { name: 'Dacia Sandero', category: 'City hatchback', body_style: 'Hatchback', starting_price: 62900, currency: 'RON', seats: 5, boot_capacity_liters: 328, powertrains: ['GPL/LPG', 'petrol TCe'], versions: ['Essential', 'Expression'], features: ['Media Control / Media Display', 'Emergency braking assist', 'Cruise control'], detail_url: 'https://www.dacia.ro/gama-dacia/sandero.html', configure_url: 'https://www.dacia.ro/configuratorul-nostru.html', is_deal: false },
  { name: 'Dacia Logan', category: 'Compact sedan', body_style: 'Sedan', starting_price: 65900, currency: 'RON', seats: 5, boot_capacity_liters: 528, powertrains: ['GPL/LPG', 'petrol TCe'], versions: ['Essential', 'Expression'], features: ['Large 528L boot', 'Media Display', 'Rear parking sensors', 'Emergency braking assist'], detail_url: 'https://www.dacia.ro/gama-dacia/logan.html', configure_url: 'https://www.dacia.ro/configuratorul-nostru.html', is_deal: false },
  { name: 'Dacia Spring', category: 'Electric city car', body_style: 'Hatchback (EV)', starting_price: 72900, currency: 'RON', seats: 4, boot_capacity_liters: 308, powertrains: ['electric'], versions: ['Expression', 'Extreme'], features: ['100% electric', 'Up to ~225 km WLTP range', 'DC fast charging', 'Compact urban footprint'], detail_url: 'https://www.dacia.ro/gama-dacia/spring.html', configure_url: 'https://www.dacia.ro/configuratorul-nostru.html', is_deal: false },
];

const DEALER_ADDRESS = 'Calea Turzii 247, Cluj-Napoca';

function makeConfirmationId() {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `TD-${rand}`;
}

module.exports = async ({
  model_id = '',
  dealer_id = '',
  preferred_date = '',
  preferred_time_window = '',
  customer_name = '',
  phone = '',
  email = '',
  consent_to_contact = false,
} = {}) => {
  if (!model_id || typeof model_id !== 'string' || !model_id.trim()) {
    return {
      content: [{ type: 'text', text: 'Please provide a model_id — which Dacia model would you like to test drive?' }],
      structuredContent: {},
    };
  }
  if (!dealer_id || typeof dealer_id !== 'string' || !dealer_id.trim()) {
    return {
      content: [{ type: 'text', text: 'Please provide a dealer_id — which Dacia sales agent or location should handle the request?' }],
      structuredContent: {},
    };
  }
  if (!customer_name || typeof customer_name !== 'string' || !customer_name.trim()) {
    return {
      content: [{ type: 'text', text: 'Please provide customer_name so the dealer knows who to contact.' }],
      structuredContent: {},
    };
  }
  if (!phone || typeof phone !== 'string' || !phone.trim()) {
    return {
      content: [{ type: 'text', text: 'Please provide a phone number for dealer follow-up.' }],
      structuredContent: {},
    };
  }
  if (consent_to_contact !== true) {
    return {
      content: [{ type: 'text', text: 'Consent to contact is required before a test-drive request can be submitted.' }],
      structuredContent: {},
    };
  }

  const query = model_id.trim().toLowerCase();
  const model = MOCK_DATA.find((m) => m.name.toLowerCase() === query)
    || MOCK_DATA.find((m) => m.name.toLowerCase().includes(query));
  const modelName = model ? model.name : model_id.trim();
  const dealerName = dealer_id.trim();

  // TODO: submit the request to the real dealer/CRM API here (see TODO block below).
  const confirmationId = makeConfirmationId();

  const structuredContent = {
    confirmation_id: confirmationId,
    status: 'awaiting dealer confirmation',
    message: `Am înregistrat cererea de test drive pentru ${modelName} la ${dealerName}. Agentul Dacia trebuie să confirme disponibilitatea vehiculului și a programării înainte ca data sau modelul solicitat să fie garantate.`,
    model_name: modelName,
    dealer_name: dealerName,
    dealer_address: DEALER_ADDRESS,
    requested_date: preferred_date,
    requested_time_window: preferred_time_window,
    confirmation_required: true,
  };

  const when = [preferred_date, preferred_time_window].filter(Boolean).join(' ');
  const summary = `Test-drive request for ${modelName} submitted to ${dealerName}${when ? ` for ${when}` : ''} (confirmation #${confirmationId}). The dealer must confirm vehicle and appointment availability before the requested date or model is guaranteed.`;

  return {
    content: [{ type: 'text', text: summary }],
    structuredContent,
  };
};

/*
 * TODO: Replace the in-memory confirmation with a real dealer/CRM API call.
 *
 * Suggested endpoint pattern (update based on actual site API):
 *   POST ${process.env.API_BASE_URL}/test-drives
 *   body: { model_id, dealer_id, preferred_date, preferred_time_window,
 *           customer_name, phone, email, consent_to_contact }
 *
 * Environment variables to configure:
 *   API_BASE_URL   Base URL of the website's API
 *   API_KEY        API key if required (add to .env and app.config.yaml)
 *
 * Example fetch:
 *   const res = await fetch(`${process.env.API_BASE_URL}/test-drives`, {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.API_KEY}` },
 *     body: JSON.stringify({ model_id, dealer_id, preferred_date, preferred_time_window, customer_name, phone, email, consent_to_contact }),
 *   })
 *   if (!res.ok) throw new Error(`API error: ${res.status}`)
 *   return await res.json()
 */
