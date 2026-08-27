const handler = require('../../actions/estimate-vehicle-trade-in/index.js');

const validArgs = {
  make: 'Volkswagen',
  model: 'Golf',
  year: 2016,
  mileage_km: 128000,
  fuel_type: 'Diesel',
  condition: 'Good',
};

describe('estimate_vehicle_trade_in handler', () => {
  test('content is an array of text blocks', async () => {
    const out = await handler(validArgs);
    expect(out).toHaveProperty('content');
    expect(Array.isArray(out.content)).toBe(true);
    expect(out.content[0]).toMatchObject({ type: 'text', text: expect.any(String) });
  });

  test('"preliminary trade-in value for my 2016 diesel hatchback" returns an estimate range', async () => {
    const out = await handler(validArgs);
    expect(out.content[0].text.length).toBeGreaterThan(0);
    const sc = out.structuredContent;
    expect(typeof sc.estimated_value_low).toBe('number');
    expect(typeof sc.estimated_value_high).toBe('number');
    expect(sc.estimated_value_high).toBeGreaterThanOrEqual(sc.estimated_value_low);
    expect(sc.status).toBe('preliminary');
    expect(sc.currency).toBe('EUR');
  });

  test('content mentions the non-binding, in-person inspection next step', async () => {
    const out = await handler(validArgs);
    expect(out.content[0].text).toMatch(/non-binding/i);
    expect(out.content[0].text).toMatch(/in-person|inspection|partner network/i);
  });

  test('structuredContent is a plain object, not a bare array', async () => {
    const out = await handler(validArgs);
    expect(typeof out.structuredContent).toBe('object');
    expect(Array.isArray(out.structuredContent)).toBe(false);
  });

  test('structuredContent is flat (no wrapper key) — detail concept', async () => {
    const out = await handler(validArgs);
    expect(out.structuredContent).not.toHaveProperty('item');
    expect(out.structuredContent).not.toHaveProperty('valuation');
    expect(out.structuredContent).toHaveProperty('vehicle_summary');
    expect(out.structuredContent).toHaveProperty('assumptions');
    expect(Array.isArray(out.structuredContent.assumptions)).toBe(true);
    expect(Array.isArray(out.structuredContent.factors_affecting_value)).toBe(true);
  });

  test('returns error message when required args are missing', async () => {
    const out = await handler({ make: 'Volkswagen' });
    expect(out.content[0].text).toMatch(/provide|model|year|mileage_km/i);
    expect(typeof out.structuredContent).toBe('object');
    expect(Array.isArray(out.structuredContent)).toBe(false);
  });

  test('no args at all returns a guidance message, not a crash', async () => {
    const out = await handler();
    expect(Array.isArray(out.content)).toBe(true);
    expect(out.content[0].text).toMatch(/provide/i);
  });

  test('condition affects the estimate — excellent values higher than poor', async () => {
    const excellent = await handler({ ...validArgs, condition: 'Excellent' });
    const poor = await handler({ ...validArgs, condition: 'Poor' });
    expect(excellent.structuredContent.estimated_value_high)
      .toBeGreaterThan(poor.structuredContent.estimated_value_high);
  });

  test('vehicle_summary is built from the supplied make, model, and year', async () => {
    const out = await handler(validArgs);
    expect(out.structuredContent.vehicle_summary).toMatch(/Volkswagen/);
    expect(out.structuredContent.vehicle_summary).toMatch(/Golf/);
    expect(out.structuredContent.vehicle_summary).toMatch(/2016/);
  });
});
