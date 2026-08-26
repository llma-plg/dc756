// TODO: Replace MOCK_DATA with a real API call.
// See the TODO block below the handler for endpoint details.
// MOCK_DATA is the samplePayload from Action Planner, used verbatim.
const MOCK_DATA = [
  { name: 'Automobile Bavaria / Dacia București', city: 'București', region: 'București', url: 'https://www.dacia.ro/reteaua-dacia/lista-agenti.html' },
  { name: 'Autoklass Dacia', city: 'București', region: 'București', url: 'https://www.dacia.ro/reteaua-dacia/lista-agenti.html' },
  { name: 'Dacia Cluj-Napoca', city: 'Cluj-Napoca', region: 'Cluj', url: 'https://www.dacia.ro/reteaua-dacia/lista-agenti.html' },
  { name: 'Dacia Timișoara', city: 'Timișoara', region: 'Timiș', url: 'https://www.dacia.ro/reteaua-dacia/lista-agenti.html' },
  { name: 'Dacia Iași', city: 'Iași', region: 'Iași', url: 'https://www.dacia.ro/reteaua-dacia/lista-agenti.html' },
  { name: 'Dacia Constanța', city: 'Constanța', region: 'Constanța', url: 'https://www.dacia.ro/reteaua-dacia/lista-agenti.html' },
  { name: 'Dacia Brașov', city: 'Brașov', region: 'Brașov', url: 'https://www.dacia.ro/reteaua-dacia/lista-agenti.html' },
  { name: 'Dacia Craiova', city: 'Craiova', region: 'Dolj', url: 'https://www.dacia.ro/reteaua-dacia/lista-agenti.html' },
  { name: 'Dacia Ploiești', city: 'Ploiești', region: 'Prahova', url: 'https://www.dacia.ro/reteaua-dacia/lista-agenti.html' },
  { name: 'Dacia Oradea', city: 'Oradea', region: 'Bihor', url: 'https://www.dacia.ro/reteaua-dacia/lista-agenti.html' },
  { name: 'Dacia Sibiu', city: 'Sibiu', region: 'Sibiu', url: 'https://www.dacia.ro/reteaua-dacia/lista-agenti.html' },
  { name: 'Dacia Bacău', city: 'Bacău', region: 'Bacău', url: 'https://www.dacia.ro/reteaua-dacia/lista-agenti.html' },
  { name: 'Dacia Arad', city: 'Arad', region: 'Arad', url: 'https://www.dacia.ro/reteaua-dacia/lista-agenti.html' },
  { name: 'Dacia Pitești', city: 'Pitești', region: 'Argeș', url: 'https://www.dacia.ro/reteaua-dacia/lista-agenti.html' },
  { name: 'Dacia Galați', city: 'Galați', region: 'Galați', url: 'https://www.dacia.ro/reteaua-dacia/lista-agenti.html' },
];

function toDealer(item, index) {
  const slug = String(item.name || `dealer-${index}`)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return {
    location_id: slug || `dealer-${index}`,
    name: item.name || '',
    location_type: item.location_type || 'sales agent',
    address: item.address || (item.city ? `${item.city}, ${item.region || ''}`.replace(/,\s*$/, '') : ''),
    city: item.city || '',
    distance_km: typeof item.distance_km === 'number' ? item.distance_km : null,
    latitude: typeof item.latitude === 'number' ? item.latitude : null,
    longitude: typeof item.longitude === 'number' ? item.longitude : null,
    phone: item.phone || '',
    opening_hours: item.opening_hours || '',
    services: Array.isArray(item.services) ? item.services : [],
    details_url: item.details_url || item.url || '',
    directions_url: item.directions_url || item.url || '',
  };
}

module.exports = async ({ location = '', location_type = '', required_service = '', radius_km = 0 } = {}) => {
  if (!location || typeof location !== 'string' || !location.trim()) {
    return {
      content: [{ type: 'text', text: 'Please provide a location (city, address, or postal code) to search near.' }],
      // structuredContent.dealers — derived from action name "find_dacia_dealers" (bare array outputSchema rule)
      structuredContent: { dealers: [] },
    };
  }

  const query = location.trim().toLowerCase();
  const typeQuery = String(location_type || '').trim().toLowerCase();
  const serviceQuery = String(required_service || '').trim().toLowerCase();
  const radius = typeof radius_km === 'number' && radius_km > 0 ? radius_km : null;

  const matches = MOCK_DATA.map(toDealer).filter((dealer) => {
    const haystack = `${dealer.name} ${dealer.city} ${dealer.address}`.toLowerCase();
    if (!haystack.includes(query)) return false;
    if (typeQuery && !/either|both/.test(typeQuery)) {
      const dealerType = String(dealer.location_type || '').toLowerCase();
      if (dealerType && !dealerType.includes(typeQuery)) return false;
    }
    if (serviceQuery && dealer.services.length) {
      if (!dealer.services.some((s) => String(s).toLowerCase().includes(serviceQuery))) return false;
    }
    if (radius !== null && typeof dealer.distance_km === 'number' && dealer.distance_km > radius) return false;
    return true;
  });

  const sorted = matches.sort((a, b) => {
    const da = typeof a.distance_km === 'number' ? a.distance_km : Number.MAX_SAFE_INTEGER;
    const db = typeof b.distance_km === 'number' ? b.distance_km : Number.MAX_SAFE_INTEGER;
    return da - db;
  });

  if (sorted.length === 0) {
    return {
      content: [{ type: 'text', text: `No Dacia locations found near "${location.trim()}". Try a nearby city or a wider search radius.` }],
      structuredContent: { dealers: [] },
    };
  }

  const nearest = sorted[0];
  const summary = `Found ${sorted.length} Dacia location${sorted.length === 1 ? '' : 's'} near ${location.trim()} — ${nearest.name} is the nearest suitable match. Confirm the desired vehicle or service with the location by phone before you travel.`;

  return {
    content: [{ type: 'text', text: summary }],
    // structuredContent.dealers — derived from action name "find_dacia_dealers" (bare array outputSchema rule)
    structuredContent: { dealers: sorted },
  };
};

/*
 * TODO: Replace MOCK_DATA with a real API call.
 *
 * Suggested endpoint pattern (update based on actual site API):
 *   GET ${process.env.API_BASE_URL}/dealers?location=${location}&type=${location_type}&radius=${radius_km}
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
 *     `${process.env.API_BASE_URL}/dealers?location=${encodeURIComponent(location)}`,
 *     { headers: { 'Authorization': `Bearer ${process.env.API_KEY}` } }
 *   )
 *   if (!res.ok) throw new Error(`API error: ${res.status}`)
 *   return await res.json()
 */
