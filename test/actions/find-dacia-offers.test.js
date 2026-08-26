const handler = require('../../actions/find-dacia-offers/index.js');

describe('find_dacia_offers handler', () => {
    test('content is an array of text blocks', async () => {
        const out = await handler({});
        expect(out).toHaveProperty('content');
        expect(Array.isArray(out.content)).toBe(true);
        expect(out.content[0]).toMatchObject({ type: 'text', text: expect.any(String) });
    });

    test('"What current Dacia offers could lower my final cost?" returns offers', async () => {
        const out = await handler({ purchase_preference: 'Rabla program' });
        expect(out.content[0].text.length).toBeGreaterThan(0);
        expect(out.structuredContent.offers.length).toBeGreaterThan(0);
    });

    test('structuredContent is a plain object, not a bare array', async () => {
        const out = await handler({});
        expect(typeof out.structuredContent).toBe('object');
        expect(Array.isArray(out.structuredContent)).toBe(false);
        expect(Array.isArray(out.structuredContent.offers)).toBe(true);
    });

    test('filters offers by model_id', async () => {
        const out = await handler({ model_id: 'Bigster' });
        expect(out.structuredContent.offers.length).toBeGreaterThan(0);
        expect(out.structuredContent.offers.every((o) => o.name.toLowerCase().includes('bigster'))).toBe(true);
    });

    test('unknown model returns empty offers with a no-results message', async () => {
        const out = await handler({ model_id: 'NoSuchModel' });
        expect(out.content[0].text).toMatch(/no current dacia offers/i);
        expect(out.structuredContent.offers).toEqual([]);
    });

    test('no filters returns the full offer set', async () => {
        const out = await handler({});
        expect(out.structuredContent.offers.length).toBe(7);
    });
});
