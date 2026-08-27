const handler = require('../../actions/find-dacia-models/index.js');

describe('find_dacia_models handler', () => {
    test('content is an array of text blocks', async () => {
        const out = await handler({ max_budget_eur: 20000 });
        expect(Array.isArray(out.content)).toBe(true);
        expect(out.content[0]).toMatchObject({ type: 'text', text: expect.any(String) });
    });

    test('"family of five, ~20,000 euros, spacious SUV" returns matching models', async () => {
        const out = await handler({ max_budget_eur: 20000, body_style: 'SUV', minimum_seats: 5 });
        expect(out.content[0].text.length).toBeGreaterThan(0);
        expect(out.structuredContent.models.length).toBeGreaterThan(0);
        expect(out.structuredContent.models.every((m) => m.starting_price <= 20000)).toBe(true);
        expect(out.structuredContent.models.every((m) => m.seats >= 5)).toBe(true);
        expect(out.structuredContent.models.every((m) => /suv/i.test(`${m.body_style} ${m.category}`))).toBe(true);
    });

    test('structuredContent is a plain object, not a bare array', async () => {
        const out = await handler({ max_budget_eur: 20000 });
        expect(typeof out.structuredContent).toBe('object');
        expect(Array.isArray(out.structuredContent)).toBe(false);
        expect(Array.isArray(out.structuredContent.models)).toBe(true);
    });

    test('no args returns the full list (all inputs optional)', async () => {
        const out = await handler({});
        expect(out.structuredContent.models.length).toBeGreaterThan(0);
    });

    test('filters by powertrain (electric)', async () => {
        const out = await handler({ powertrain: 'electric' });
        const models = out.structuredContent.models;
        expect(models.length).toBeGreaterThan(0);
        expect(models.every((m) => m.powertrains.some((pt) => /electric/i.test(pt)))).toBe(true);
    });

    test('unsatisfiable budget returns empty models array with a hint', async () => {
        const out = await handler({ max_budget_eur: 100 });
        expect(out.structuredContent.models).toEqual([]);
        expect(out.content[0].text).toMatch(/no dacia models|confirm/i);
    });
});
