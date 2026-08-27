// TODO: Replace MOCK_DATA with a real API call.
// See the TODO block below the handler for endpoint details.
const MOCK_DATA = [
  { store_id: 'amat-pitesti', name: 'AMAT', location_type: 'sales agent', address: 'Bd. Nicolae Balcescu, Nr. 204, 110331 Pitesti', phone: '0248 223 555', available_services: 'sales, service' },
  { store_id: 'apan-braila', name: 'APAN', location_type: 'sales agent', address: 'D.N. 22 B, KM 4, 810550 Braila', phone: '0239 617 100', available_services: 'sales, service' },
  { store_id: 'apan-galati', name: 'APAN George Cosbuc', location_type: 'sales agent', address: 'Str. George Cosbuc, Nr. 148, 800385 Galati', phone: '0336 401 127', available_services: 'sales, service' },
  { store_id: 'aurocar-2002-alba', name: 'Aurocar 2002', location_type: 'sales agent', address: 'Str. Alexandru Ioan Cuza, Nr. 31E, 510193 Alba Iulia', phone: '0258 839 230', available_services: 'sales, service' },
  { store_id: 'auto-bara-oradea', name: 'Auto Bara & Co', location_type: 'sales agent', address: 'Sos. Borsului, Nr. 22, 410605 Oradea', phone: '0259 440 000', available_services: 'sales, service' },
  { store_id: 'auto-becoro-baia-mare', name: 'Auto Becoro', location_type: 'sales agent', address: 'B-dul Independentei, Nr. 32, 430071 Baia Mare', phone: '0262 218 023', available_services: 'sales, service' },
  { store_id: 'auto-class-satu-mare', name: 'Auto Class', location_type: 'sales agent', address: 'Str. Botizului, Nr. 43/A, 440101 Satu Mare', phone: '0261 770 085', available_services: 'sales, service' },
  { store_id: 'auto-cobalcescu-bucuresti', name: 'Auto Cobalcescu', location_type: 'sales agent', address: 'Str. Splaiul Unirii Nr. 309, Sect. 3, 010193 Bucuresti', phone: '0374 495 486', available_services: 'sales, service' },
  { store_id: 'auto-europa-timisoara', name: 'Auto Europa', location_type: 'sales agent', address: 'Calea Sagului Nr. 142/A, 300516 Timisoara', phone: '0356 803 450', available_services: 'sales, service' },
  { store_id: 'auto-group-resita', name: 'Auto Group', location_type: 'sales agent', address: 'Calea Caransebesului, Nr. 21, 320170 Resita', phone: '0255 228 308', available_services: 'sales, service' },
  { store_id: 'auto-marcus-bucuresti', name: "Auto Marcu's Grup", location_type: 'sales agent', address: 'Sos. Pantelimon, Nr. 450, Sector 2, 021666 Bucuresti', phone: '021 255 0977', available_services: 'sales, service' },
  { store_id: 'auto-moldova-piatra-neamt', name: 'Auto Moldova', location_type: 'sales agent', address: 'Bd. General Nicolae Dascalescu, Nr. 492B, 610200 Piatra Neamt', phone: '0233 234 258', available_services: 'sales, service' },
  { store_id: 'automobile-service-bistrita', name: 'Automobile Service', location_type: 'sales agent', address: 'Calea Moldovei, Nr. 22, 420096 Bistrita Nasaud', phone: '0263 207 010', available_services: 'sales, service' },
  { store_id: 'auto-haus-tudor-constanta', name: 'Auto Haus Tudor S.R.L.', location_type: 'sales agent', address: 'Soseaua de Centura, DN 2A - Centura de Vest, 905900 Constanta', phone: '0729 655 655', available_services: 'sales, service' },
  { store_id: 'bras-iasi', name: 'BRAS SRL', location_type: 'sales agent', address: 'DN28, Soseaua Iasi-Targul Frumos, KM 10, 707305 Iasi', phone: '0232 276 320', available_services: 'sales, service' },
  { store_id: 'dacia-service-cluj', name: 'Dacia Service Cluj', location_type: 'authorized repair center', address: 'Calea Turzii, Nr. 253-255, 400495 Cluj-Napoca', phone: '0264 438 443', available_services: 'sales, service' },
  { store_id: 'dacoserv-bucuresti', name: 'Dacoserv', location_type: 'sales agent', address: 'Str. Preciziei, Nr. 4, Sector 6, 062203 Bucuresti', phone: '021 317 0986', available_services: 'sales, service' },
  { store_id: 'daren-bacau', name: 'Daren Automobile SRL', location_type: 'sales agent', address: 'Str. Republicii, Nr. 185, 600304 Bacau', phone: '0234 576 345', available_services: 'sales, service' },
  { store_id: 'darex-suceava', name: 'Darex Auto', location_type: 'sales agent', address: 'Str. Humorului, Nr. 96, 727525 Sat Scheia (Suceava)', phone: '0230 551 444', available_services: 'sales, service' },
  { store_id: 'delta-plus-pitesti', name: 'Delta Plus Trading', location_type: 'sales agent', address: 'Autostrada Pitesti-Bucuresti, DN 65B, km 3+750, 110185 Pitesti', phone: '0248 615 131', available_services: 'sales, service' },
];

module.exports = async ({ address = '', latitude, longitude, location_type = '', required_service = '', radius_km } = {}) => {
  const hasOrigin = (typeof address === 'string' && address.trim())
    || (typeof latitude === 'number' && typeof longitude === 'number');

  if (!hasOrigin) {
    return {
      content: [{ type: 'text', text: 'Please provide an address, city, or postal code (or share your location) to find nearby Dacia locations.' }],
      // structuredContent.dealers — derived from action name "locate_dacia_dealer" (bare array outputSchema rule)
      structuredContent: { dealers: [] },
    };
  }

  const typeQuery = typeof location_type === 'string' ? location_type.trim().toLowerCase() : '';
  const serviceQuery = typeof required_service === 'string' ? required_service.trim().toLowerCase() : '';

  const results = MOCK_DATA.filter((store) => {
    if (typeQuery && !(store.location_type || '').toLowerCase().includes(typeQuery)) return false;
    if (serviceQuery && !(store.available_services || '').toLowerCase().includes(serviceQuery)) return false;
    return true;
  });

  const origin = (typeof address === 'string' && address.trim()) ? address.trim() : 'your location';

  if (results.length === 0) {
    return {
      content: [{ type: 'text', text: `No Dacia locations found near ${origin} matching your criteria. Availability should be confirmed during booking.` }],
      // structuredContent.dealers — derived from action name "locate_dacia_dealer" (bare array outputSchema rule)
      structuredContent: { dealers: [] },
    };
  }

  return {
    content: [{ type: 'text', text: `Found ${results.length} Dacia location${results.length === 1 ? '' : 's'} near ${origin}. Model availability, test-drive slots, and workshop appointments should be confirmed with the location during booking.` }],
    // structuredContent.dealers — derived from action name "locate_dacia_dealer" (bare array outputSchema rule)
    structuredContent: { dealers: results },
  };
};

/*
 * TODO: Replace MOCK_DATA with a real API call.
 *
 * Suggested endpoint pattern (update based on actual site API):
 *   GET ${process.env.API_BASE_URL}/dealers?address=${address}&type=${location_type}&radius=${radius_km}
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
 *     `${process.env.API_BASE_URL}/dealers?address=${encodeURIComponent(address)}`,
 *     { headers: { 'Authorization': `Bearer ${process.env.API_KEY}` } }
 *   )
 *   if (!res.ok) throw new Error(`API error: ${res.status}`)
 *   return await res.json()
 */
