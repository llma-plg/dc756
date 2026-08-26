const handler = require('../../actions/book-dacia-test-drive/index.js');

const validArgs = {
  model_id: 'Dacia Bigster',
  dealer_id: 'Dacia Cluj-Napoca',
  preferred_date: '2026-08-29',
  preferred_time_window: 'Dimineața',
  customer_name: 'Andrei Popescu',
  phone: '0712 345 678',
  email: 'andrei@exemplu.ro',
  consent_to_contact: true,
};

describe('book_dacia_test_drive handler', () => {
  test('returns content block shape on happy path', async () => {
    const out = await handler(validArgs);
    expect(out).toHaveProperty('content');
    expect(Array.isArray(out.content)).toBe(true);
    expect(out.content[0]).toMatchObject({ type: 'text', text: expect.any(String) });
  });

  test('"I\'d like to drive the Dacia Bigster at the Cluj dealership" submits a request', async () => {
    const out = await handler(validArgs);
    expect(out.content[0].text.length).toBeGreaterThan(0);
    expect(out.structuredContent.model_name).toBe('Dacia Bigster');
    expect(out.structuredContent.dealer_name).toBe('Dacia Cluj-Napoca');
    expect(out.structuredContent.confirmation_id).toMatch(/^TD-/);
    expect(out.structuredContent.confirmation_required).toBe(true);
  });

  test('content mentions the dealer must confirm availability', async () => {
    const out = await handler(validArgs);
    expect(out.content[0].text).toMatch(/confirm/i);
  });

  test('structuredContent is a plain object, not a bare array', async () => {
    const out = await handler(validArgs);
    expect(typeof out.structuredContent).toBe('object');
    expect(Array.isArray(out.structuredContent)).toBe(false);
  });

  test('returns error message when required model_id is missing', async () => {
    const out = await handler({ ...validArgs, model_id: '' });
    expect(out.content[0].text).toMatch(/model_id|provide/i);
  });

  test('returns error message when consent is not given', async () => {
    const out = await handler({ ...validArgs, consent_to_contact: false });
    expect(out.content[0].text).toMatch(/consent/i);
  });

  test('resolves the model name via partial match', async () => {
    const out = await handler({ ...validArgs, model_id: 'bigster' });
    expect(out.structuredContent.model_name).toBe('Dacia Bigster');
  });

  test('carries forward preferred date and time window', async () => {
    const out = await handler(validArgs);
    expect(out.structuredContent.requested_date).toBe('2026-08-29');
    expect(out.structuredContent.requested_time_window).toBe('Dimineața');
  });
});
