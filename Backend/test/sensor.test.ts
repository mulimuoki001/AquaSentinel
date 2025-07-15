jest.mock('mqtt', () => {
    return {
        connect: jest.fn(() => ({
            on: jest.fn(),
            publish: jest.fn(),
            subscribe: jest.fn(),
            end: jest.fn(),
        })),
    };
});
import { token, userId } from './auth.test';
import request from 'supertest';
import app from '../src/app';

describe('Sensor API(Public)', () => {
    it('should return recent moisture data', async () => {
        const res = await request(app).get('/api/sensors/moisture');

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('data');
        expect(Array.isArray(res.body.data)).toBe(true);
    }, 10000);

    it('should return recent water flow data', async () => {
        const res = await request(app).get('/api/sensors/water-flow');

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('data');
        expect(Array.isArray(res.body.data)).toBe(true);
    }, 10000);
    it('should get water usage today for user', async () => {
        const res = await request(app).get(`/api/sensors/water-usage-today/${userId}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('data');
    });
    it('should get all water flow data per user', async () => {
        const res = await request(app).get(`/api/sensors/all-water-flow-data-per-user/${userId}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('data');
    });
});

describe('Sensor API (Protected)', () => {
    it('should get water used in last hour (requires auth)', async () => {
        const res = await request(app)
            .get('/api/sensors/water-used-last-1hr')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('totalWaterUsed');
    });

    it('should get pump runtime (requires auth)', async () => {
        const res = await request(app)
            .get('/api/sensors/pump-runtime')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('runtimeMinutes');
    });

    it('should get flow rate graph data (requires auth)', async () => {
        const res = await request(app)
            .get('/api/sensors/flow-rate-graph')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('data');
    });
});