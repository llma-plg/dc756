const handler = require('../../actions/compare-dacia-financing-options/index.js');

describe('compare_dacia_financing_options handler', () => {
    test('content is an array of text blocks', async () => {
        const out = await handler({ vehicle_price_eur: 20000 });
        expect(out).toHaveProperty('content');
        expect(Array.isArray(out.content)).toBe(true);
        expect(out.content[0]).toMatchObject({ type: 'text', text: expect.any(String) });
    });

    test('"Compare Dacia Credit against leasing for a 20,000 EUR Duster" returns both options', async () => {
        const out = await handler({ vehicle_price_eur: 20000, deposit_eur: 4000, preferred_term_months: 48 });
        expect(out.content[0].text.length).toBeGreaterThan(0);
        expect(out.structuredContent.options.length).toBe(2);
        const ids = out.structuredContent.options.map((o) => o.plan_id);
        expect(ids).toContain('dacia_credit');
        expect(ids).toContain('financial_leasing');
    });

    test('structuredContent is a plain object, not a bare array', async () => {
        const out = await handler({ vehicle_price_eur: 20000 });
        expect(typeof out.structuredContent).toBe('object');
        expect(Array.isArray(out.structuredContent)).toBe(false);
        expect(Array.isArray(out.structuredContent.options)).toBe(true);
    });

    test('returns error message when required vehicle_price_eur is missing', async () => {
        const out = await handler({});
        expect(out.content[0].text).toMatch(/vehicle_price_eur|provide/i);
        expect(out.structuredContent.options).toEqual([]);
    });

    test('rejects a non-positive vehicle_price_eur as invalid', async () => {
        const out = await handler({ vehicle_price_eur: 0 });
        expect(out.content[0].text).toMatch(/vehicle_price_eur|provide/i);
        expect(out.structuredContent.options).toEqual([]);
    });

    test('summary reflects the provided deposit and term assumptions', async () => {
        const out = await handler({ vehicle_price_eur: 20000, deposit_eur: 4000, preferred_term_months: 48 });
        expect(out.content[0].text).toMatch(/4,000 EUR deposit/);
        expect(out.content[0].text).toMatch(/48 months/);
    });
});
