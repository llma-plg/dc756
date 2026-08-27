const handler = require('../../actions/book-dacia-test-drive/index.js');

const validArgs = {
    model_name: 'Dacia Duster',
    dealer_id: 'RO-BUC-001',
    preferred_date: '2026-08-29',
    preferred_time_window: 'Morning',
    full_name: 'Ana Popescu',
    phone: '+40 721 000 000',
    email: 'ana@example.com',
    consent_to_contact: true,
};

describe('book_dacia_test_drive handler', () => {
    test('returns content block shape on happy path', async () => {
        const out = await handler(validArgs);
        expect(out).toHaveProperty('content');
        expect(Array.isArray(out.content)).toBe(true);
        expect(out.content[0]).toMatchObject({ type: 'text', text: expect.any(String) });
    });

    test('"Arrange a test drive for me this Saturday morning" submits the request', async () => {
        const out = await handler(validArgs);
        expect(out.content[0].text.length).toBeGreaterThan(0);
        expect(out.structuredContent.confirmation_id).toEqual(expect.any(String));
        expect(out.structuredContent.model_name).toBe('Dacia Duster');
        expect(out.structuredContent.requested_slot).toMatch(/2026-08-29/);
    });

    test('structuredContent is a plain object, not a bare array', async () => {
        const out = await handler(validArgs);
        expect(typeof out.structuredContent).toBe('object');
        expect(Array.isArray(out.structuredContent)).toBe(false);
    });

    test('returns error message when required arg is missing', async () => {
        const out = await handler({});
        expect(out.content[0].text).toMatch(/model_name|provide/i);
    });

    test('requires consent before submitting', async () => {
        const out = await handler({ ...validArgs, consent_to_contact: false });
        expect(out.content[0].text).toMatch(/consent/i);
        expect(out.structuredContent.confirmation_id).toBeUndefined();
    });

    test('resolves the canonical model name from a partial match', async () => {
        const out = await handler({ ...validArgs, model_name: 'duster' });
        expect(out.structuredContent.model_name).toBe('Dacia Duster');
    });

    test('echoes the dealer in dealer_name and reports a status', async () => {
        const out = await handler(validArgs);
        expect(out.structuredContent.dealer_name).toMatch(/RO-BUC-001/);
        expect(out.structuredContent.status).toEqual(expect.any(String));
    });
});
