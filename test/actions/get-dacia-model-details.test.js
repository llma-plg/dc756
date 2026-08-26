const handler = require('../../actions/get-dacia-model-details/index.js');

describe('get_dacia_model_details handler', () => {
  test('content is an array of text blocks', async () => {
    const out = await handler({ model_id: 'Bigster' });
    expect(out).toHaveProperty('content');
    expect(Array.isArray(out.content)).toBe(true);
    expect(out.content[0]).toMatchObject({ type: 'text', text: expect.any(String) });
  });

  test('"Explain the Dacia Bigster" returns the model detail', async () => {
    const out = await handler({ model_id: 'Bigster' });
    expect(out.content[0].text.length).toBeGreaterThan(0);
    expect(out.content[0].text).toMatch(/Bigster/);
    expect(out.structuredContent.name).toBe('Dacia Bigster');
    expect(out.structuredContent.starting_price).toBe(116900);
  });

  test('structuredContent is a plain object, not a bare array', async () => {
    const out = await handler({ model_id: 'Bigster' });
    expect(typeof out.structuredContent).toBe('object');
    expect(Array.isArray(out.structuredContent)).toBe(false);
  });

  test('detail shape is flat — no wrapper key', async () => {
    const out = await handler({ model_id: 'Duster' });
    expect(out.structuredContent).not.toHaveProperty('product');
    expect(out.structuredContent).not.toHaveProperty('item');
    expect(out.structuredContent.powertrain_types).toEqual(expect.arrayContaining(['GPL/LPG']));
  });

  test('case-insensitive partial match resolves a model', async () => {
    const out = await handler({ model_id: 'spring' });
    expect(out.structuredContent.name).toBe('Dacia Spring');
    expect(out.structuredContent.passenger_capacity).toBe(4);
  });

  test('returns error message when required arg is missing', async () => {
    const out = await handler({});
    expect(out.content[0].text).toMatch(/model_id|provide/i);
    expect(typeof out.structuredContent).toBe('object');
    expect(Array.isArray(out.structuredContent)).toBe(false);
  });

  test('unknown model returns not-found with empty structuredContent', async () => {
    const out = await handler({ model_id: 'Nonexistent Model XYZ' });
    expect(out.content[0].text).toMatch(/no results|not found/i);
    expect(out.structuredContent).toEqual({});
  });
});
