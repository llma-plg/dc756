const handler = require('../../actions/compare-dacia-models/index.js');

describe('compare_dacia_models handler', () => {
    test('returns content block shape on happy path', async () => {
        const out = await handler({ first_model_id: 'Dacia Bigster', second_model_id: 'Dacia Duster' });
        expect(out).toHaveProperty('content');
        expect(Array.isArray(out.content)).toBe(true);
        expect(out.content[0]).toMatchObject({ type: 'text', text: expect.any(String) });
    });

    test('"torn between the Bigster and the Duster" compares exactly two models', async () => {
        const out = await handler({ first_model_id: 'Dacia Bigster', second_model_id: 'Dacia Duster', priority: 'family travel' });
        expect(out.structuredContent.models).toHaveLength(2);
        expect(out.structuredContent.models[0].name).toBe('Dacia Bigster');
        expect(out.structuredContent.models[1].name).toBe('Dacia Duster');
        expect(out.content[0].text.length).toBeGreaterThan(0);
    });

    test('maps sample fields to the outputSchema shape', async () => {
        const out = await handler({ first_model_id: 'Dacia Bigster', second_model_id: 'Dacia Duster' });
        const bigster = out.structuredContent.models[0];
        expect(bigster).toMatchObject({
            model_id: expect.any(String),
            name: 'Dacia Bigster',
            starting_price: 116900,
            currency: 'RON',
            passenger_capacity: 5,
            luggage_capacity_litres: 667,
        });
        expect(Array.isArray(bigster.powertrain_types)).toBe(true);
        expect(Array.isArray(bigster.versions)).toBe(true);
    });

    test('structuredContent is a plain object, not a bare array', async () => {
        const out = await handler({ first_model_id: 'Dacia Bigster', second_model_id: 'Dacia Duster' });
        expect(typeof out.structuredContent).toBe('object');
        expect(Array.isArray(out.structuredContent)).toBe(false);
    });

    test('returns error message when a required arg is missing', async () => {
        const out = await handler({ first_model_id: 'Dacia Bigster' });
        expect(out.content[0].text).toMatch(/second_model_id|provide/i);
        expect(out.structuredContent.models).toEqual([]);
    });

    test('reports unknown models instead of comparing', async () => {
        const out = await handler({ first_model_id: 'Dacia Bigster', second_model_id: 'Tesla Model 3' });
        expect(out.content[0].text).toMatch(/could not find|Tesla Model 3/i);
        expect(out.structuredContent.models).toEqual([]);
    });

    test('matches models by partial / case-insensitive name', async () => {
        const out = await handler({ first_model_id: 'bigster', second_model_id: 'duster' });
        expect(out.structuredContent.models).toHaveLength(2);
        expect(out.structuredContent.models.map((m) => m.name)).toEqual(['Dacia Bigster', 'Dacia Duster']);
    });
});
