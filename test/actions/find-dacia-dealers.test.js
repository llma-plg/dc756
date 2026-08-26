const handler = require('../../actions/find-dacia-dealers/index.js');

describe('find_dacia_dealers handler', () => {
  test('content is an array of text blocks', async () => {
    const out = await handler({ location: 'Cluj-Napoca' });
    expect(out).toHaveProperty('content');
    expect(Array.isArray(out.content)).toBe(true);
    expect(out.content[0]).toMatchObject({ type: 'text', text: expect.any(String) });
  });

  test('"authorized Dacia sales locations near Cluj-Napoca" returns dealers', async () => {
    const out = await handler({ location: 'Cluj-Napoca' });
    expect(out.content[0].text.length).toBeGreaterThan(0);
    expect(out.structuredContent.dealers.length).toBeGreaterThan(0);
  });

  test('structuredContent is a plain object, not a bare array', async () => {
    const out = await handler({ location: 'București' });
    expect(typeof out.structuredContent).toBe('object');
    expect(Array.isArray(out.structuredContent)).toBe(false);
    expect(Array.isArray(out.structuredContent.dealers)).toBe(true);
  });

  test('returns error message when required location is missing', async () => {
    const out = await handler({});
    expect(Array.isArray(out.content)).toBe(true);
    expect(out.content[0].text).toMatch(/location|provide/i);
    expect(out.structuredContent.dealers).toEqual([]);
  });

  test('returns empty dealers list when no location matches', async () => {
    const out = await handler({ location: 'Reykjavik' });
    expect(out.content[0].text).toMatch(/no dacia locations found/i);
    expect(out.structuredContent.dealers).toEqual([]);
  });

  test('normalizes samplePayload into the output schema shape', async () => {
    const out = await handler({ location: 'Timișoara' });
    const dealer = out.structuredContent.dealers[0];
    expect(dealer).toHaveProperty('location_id');
    expect(dealer).toHaveProperty('name');
    expect(dealer).toHaveProperty('city');
    expect(dealer).toHaveProperty('details_url');
    expect(Array.isArray(dealer.services)).toBe(true);
  });

  test('matches by city name case-insensitively', async () => {
    const out = await handler({ location: 'oradea' });
    expect(out.structuredContent.dealers.some((d) => /Oradea/i.test(d.name))).toBe(true);
  });
});
