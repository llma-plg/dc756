const handler = require('../../actions/locate-dacia-dealer/index.js');

describe('locate_dacia_dealer handler', () => {
  test('returns content block shape on happy path', async () => {
    const out = await handler({ address: 'Cluj-Napoca' });
    expect(out).toHaveProperty('content');
    expect(Array.isArray(out.content)).toBe(true);
    expect(out.content[0]).toMatchObject({ type: 'text', text: expect.any(String) });
  });

  test('structuredContent is a plain object, not a bare array', async () => {
    const out = await handler({ address: 'Cluj-Napoca' });
    expect(typeof out.structuredContent).toBe('object');
    expect(Array.isArray(out.structuredContent)).toBe(false);
  });

  test('"Find nearby Dacia dealers near Cluj-Napoca" returns dealer locations', async () => {
    const out = await handler({ address: 'Cluj-Napoca' });
    expect(out.structuredContent.dealers.length).toBeGreaterThan(0);
    expect(out.content[0].text).toMatch(/confirm/i);
  });

  test('accepts latitude/longitude as origin', async () => {
    const out = await handler({ latitude: 46.77, longitude: 23.6 });
    expect(out.structuredContent.dealers.length).toBeGreaterThan(0);
  });

  test('returns error message when no origin is provided', async () => {
    const out = await handler({});
    expect(out.content[0].text).toMatch(/address|location|provide/i);
    expect(out.structuredContent.dealers).toEqual([]);
  });

  test('filters by location_type', async () => {
    const out = await handler({ address: 'Cluj-Napoca', location_type: 'authorized repair center' });
    const dealers = out.structuredContent.dealers;
    expect(dealers.length).toBeGreaterThan(0);
    expect(dealers.every((d) => d.location_type === 'authorized repair center')).toBe(true);
  });

  test('returns empty dealers array when no match found', async () => {
    const out = await handler({ address: 'Cluj-Napoca', required_service: 'nonexistent-service-xyz' });
    expect(out.structuredContent.dealers).toEqual([]);
    expect(out.content[0].text).toMatch(/no dacia locations/i);
  });
});
