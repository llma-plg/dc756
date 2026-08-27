const handler = require('../../actions/compare-dacia-models/index.js');

describe('compare_dacia_models handler', () => {
  test('returns content block shape on happy path', async () => {
    const out = await handler({ first_model: 'Duster', second_model: 'Bigster' });
    expect(out).toHaveProperty('content');
    expect(Array.isArray(out.content)).toBe(true);
    expect(out.content[0]).toMatchObject({ type: 'text', text: expect.any(String) });
  });

  test('"Compare the Dacia Duster and the Dacia Bigster" returns exactly two models', async () => {
    const out = await handler({ first_model: 'Duster', second_model: 'Bigster', intended_use: 'family road trips' });
    expect(out.structuredContent.models).toHaveLength(2);
    expect(out.content[0].text.length).toBeGreaterThan(0);
    const names = out.structuredContent.models.map((m) => m.name);
    expect(names).toContain('Dacia Duster');
    expect(names).toContain('Dacia Bigster');
  });

  test('structuredContent is a plain object, not a bare array', async () => {
    const out = await handler({ first_model: 'Duster', second_model: 'Bigster' });
    expect(typeof out.structuredContent).toBe('object');
    expect(Array.isArray(out.structuredContent)).toBe(false);
    expect(Array.isArray(out.structuredContent.models)).toBe(true);
  });

  test('returns error message when required arg is missing', async () => {
    const out = await handler({ first_model: 'Duster' });
    expect(out.content[0].text).toMatch(/provide|first_model|second_model/i);
    expect(out.structuredContent.models).toEqual([]);
  });

  test('unknown model returns a not-found message', async () => {
    const out = await handler({ first_model: 'Duster', second_model: 'Nonexistent Model XYZ' });
    expect(out.content[0].text).toMatch(/could not find|no match/i);
    expect(out.structuredContent.models.length).toBeLessThan(2);
  });

  test('reflects intended_use and priority_features in the summary', async () => {
    const out = await handler({
      first_model: 'bigster',
      second_model: 'duster',
      intended_use: 'family road trips',
      priority_features: ['space', 'boot capacity'],
    });
    expect(out.content[0].text).toMatch(/family road trips/i);
    expect(out.content[0].text).toMatch(/space/i);
  });
});
