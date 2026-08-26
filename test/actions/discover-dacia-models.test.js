const handler = require('../../actions/discover-dacia-models/index.js');

describe('discover_dacia_models handler', () => {
    test('returns content block shape on happy path', async () => {
        const out = await handler({ budget_max_eur: 25000, passenger_capacity: 5 });
        expect(out).toHaveProperty('content');
        expect(Array.isArray(out.content)).toBe(true);
        expect(out.content[0]).toMatchObject({ type: 'text', text: expect.any(String) });
    });

    test('structuredContent is a plain object, not a bare array', async () => {
        const out = await handler({ budget_max_eur: 25000 });
        expect(typeof out.structuredContent).toBe('object');
        expect(Array.isArray(out.structuredContent)).toBe(false);
        expect(Array.isArray(out.structuredContent.models)).toBe(true);
    });

    test('"spacious Dacia under 25000 euros with room for five" returns matching models', async () => {
        const out = await handler({ budget_max_eur: 25000, passenger_capacity: 5, primary_use: 'family travel' });
        expect(out.structuredContent.models.length).toBeGreaterThan(0);
        const models = out.structuredContent.models;
        // Every returned model must respect the seat requirement and euro budget.
        expect(models.every((m) => m.passenger_capacity >= 5)).toBe(true);
        expect(models.every((m) => m.starting_price <= 25000 * 5)).toBe(true);
        // Cheapest-first ordering.
        for (let i = 1; i < models.length; i += 1) {
            expect(models[i].starting_price).toBeGreaterThanOrEqual(models[i - 1].starting_price);
        }
    });

    test('maps samplePayload fields into the outputSchema shape', async () => {
        const out = await handler({});
        const model = out.structuredContent.models[0];
        expect(model).toHaveProperty('model_id');
        expect(model).toHaveProperty('name');
        expect(model).toHaveProperty('body_style');
        expect(model).toHaveProperty('starting_price');
        expect(model).toHaveProperty('passenger_capacity');
        expect(Array.isArray(model.powertrain_types)).toBe(true);
        expect(model).toHaveProperty('fit_summary');
        expect(model).toHaveProperty('details_url');
        expect(model).toHaveProperty('configure_url');
    });

    test('no args returns the full range', async () => {
        const out = await handler({});
        expect(out.structuredContent.models.length).toBe(7);
        expect(out.content[0].text.length).toBeGreaterThan(0);
    });

    test('powertrain_preference "electric" narrows to electric models', async () => {
        const out = await handler({ powertrain_preference: 'electric' });
        const models = out.structuredContent.models;
        expect(models.length).toBeGreaterThan(0);
        expect(models.every((m) => m.powertrain_types.some((p) => p.toLowerCase().includes('electric')))).toBe(true);
    });

    test('impossible criteria returns an empty models array with a helpful message', async () => {
        const out = await handler({ passenger_capacity: 9 });
        expect(Array.isArray(out.structuredContent.models)).toBe(true);
        expect(out.structuredContent.models.length).toBe(0);
        expect(out.content[0].text).toMatch(/no dacia models|try relaxing/i);
    });
});
