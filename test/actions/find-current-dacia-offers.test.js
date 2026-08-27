const handler = require('../../actions/find-current-dacia-offers/index.js');

describe('find_current_dacia_offers handler', () => {
  test('content is an array of text blocks', async () => {
    const out = await handler({});
    expect(Array.isArray(out.content)).toBe(true);
    expect(out.content[0]).toMatchObject({ type: 'text', text: expect.any(String) });
  });

  test('"I\'m a private buyer ready to commit to the Dacia Duster this month" returns offers', async () => {
    const out = await handler({ model_name: 'Duster', customer_type: 'private' });
    expect(out.content[0].text.length).toBeGreaterThan(0);
    expect(out.structuredContent.offers.length).toBeGreaterThan(0);
    expect(out.structuredContent.offers.every((o) => o.model_name.toLowerCase().includes('duster'))).toBe(true);
  });

  test('no args returns all current offers', async () => {
    const out = await handler({});
    expect(out.structuredContent.offers.length).toBeGreaterThan(0);
  });

  test('structuredContent is a plain object, not a bare array', async () => {
    const out = await handler({});
    expect(typeof out.structuredContent).toBe('object');
    expect(Array.isArray(out.structuredContent)).toBe(false);
  });

  test('content summary notes eligibility and stock must be confirmed', async () => {
    const out = await handler({});
    expect(out.content[0].text).toMatch(/confirm|eligibility|stock/i);
  });

  test('filters by offer_type', async () => {
    const out = await handler({ offer_type: 'Rabla' });
    const { offers } = out.structuredContent;
    expect(offers.length).toBeGreaterThan(0);
    expect(offers.every((o) => o.offer_type.toLowerCase().includes('rabla'))).toBe(true);
  });

  test('unmatched query returns empty offers array with a message', async () => {
    const out = await handler({ model_name: 'NonexistentModelXYZ' });
    expect(Array.isArray(out.structuredContent.offers)).toBe(true);
    expect(out.structuredContent.offers.length).toBe(0);
    expect(out.content[0].text).toMatch(/no current dacia offers/i);
  });
});
