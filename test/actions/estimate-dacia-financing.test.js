const handler = require('../../actions/estimate-dacia-financing/index.js');

describe('estimate_dacia_financing handler', () => {
    test('content is an array of text blocks', async () => {
        const out = await handler({ vehicle_price_eur: 22000, term_months: 60 });
        expect(Array.isArray(out.content)).toBe(true);
        expect(out.content[0]).toMatchObject({ type: 'text', text: expect.any(String) });
    });

    test('"Walk me through the monthly financing routes" happy path', async () => {
        const out = await handler({
            vehicle_price_eur: 22000,
            deposit_eur: 5000,
            term_months: 60,
        });
        expect(out.content[0].text.length).toBeGreaterThan(0);
        expect(out.structuredContent.vehicle_price).toBe(22000);
        expect(out.structuredContent.deposit_amount).toBe(5000);
        expect(out.structuredContent.financed_amount).toBe(17000);
        expect(out.structuredContent.term_months).toBe(60);
        expect(out.structuredContent.estimated_monthly_payment).toBeGreaterThan(0);
        expect(out.structuredContent.currency).toBe('EUR');
        expect(out.structuredContent.request_offer_url).toMatch(/^https:\/\//);
    });

    test('structuredContent is a plain object, not a bare array', async () => {
        const out = await handler({ vehicle_price_eur: 22000, term_months: 60 });
        expect(typeof out.structuredContent).toBe('object');
        expect(Array.isArray(out.structuredContent)).toBe(false);
    });

    test('compares both credit and leasing by default', async () => {
        const out = await handler({ vehicle_price_eur: 22000, term_months: 60 });
        const types = out.structuredContent.scenarios.map((s) => s.financing_type);
        expect(types).toContain('Credit');
        expect(types).toContain('Financial leasing');
    });

    test('returns error when required vehicle_price_eur is missing', async () => {
        const out = await handler({ term_months: 60 });
        expect(out.content[0].text).toMatch(/vehicle_price_eur|provide/i);
        expect(out.structuredContent.scenarios).toBeUndefined();
    });

    test('returns error when required term_months is missing', async () => {
        const out = await handler({ vehicle_price_eur: 22000 });
        expect(out.content[0].text).toMatch(/term_months|provide/i);
    });

    test('deposit is clamped to at most the vehicle price', async () => {
        const out = await handler({ vehicle_price_eur: 20000, deposit_eur: 50000, term_months: 48 });
        expect(out.structuredContent.deposit_amount).toBe(20000);
        expect(out.structuredContent.financed_amount).toBe(0);
    });

    test('financing_type filter returns only the leasing route', async () => {
        const out = await handler({ vehicle_price_eur: 22000, term_months: 60, financing_type: 'financial leasing' });
        const types = out.structuredContent.scenarios.map((s) => s.financing_type);
        expect(types).toEqual(['Financial leasing']);
    });

    test('include_services false omits bundled services from scenarios', async () => {
        const out = await handler({ vehicle_price_eur: 22000, term_months: 60, include_services: false });
        out.structuredContent.scenarios.forEach((s) => {
            expect(s.included_services).toEqual([]);
        });
    });
});
