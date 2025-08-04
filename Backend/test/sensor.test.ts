import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../src/app';

jest.mock('mqtt', () => ({
    connect: jest.fn(() => ({
        on: jest.fn(),
        publish: jest.fn(),
        subscribe: jest.fn(),
        end: jest.fn(),
    })),
}));

describe('Sensor API', () => {
    let token: string;
    let userId: number;

    beforeAll(async () => {
        const email = `sensoruser${Date.now()}@example.com`;
        const password = 'Test@123';

        // 1️⃣ Register a user
        await request(app)
            .post('/auth/register')
            .send({
                name: 'Sensor Tester',
                role: 'farmer',
                farmname: 'Test Farm',
                farmlocation: 'Nyagatare',
                farmphone: '0788123123',
                email,
                password,
            });

        // 2️⃣ Login to get token and userId
        const loginRes = await request(app)
            .post('/auth/login')
            .send({ email, password });

        expect(loginRes.status).toBe(200);
        token = loginRes.body.newToken;
        userId = loginRes.body.userId;
    }, 20000);

    // --- PUBLIC ROUTES ---
    it('should return recent moisture data', async () => {
        const res = await request(app).get('/api/sensors/moisture');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should return recent water flow data', async () => {
        const res = await request(app).get('/api/sensors/water-flow');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

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

    // --- PROTECTED ROUTES ---
    it('should get water used in last hour', async () => {
        const res = await request(app)
            .get('/api/sensors/water-used-last-1hr')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('success', true);
    });

    it('should get pump runtime', async () => {
        const res = await request(app)
            .get('/api/sensors/pump-runtime')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('success', true);
    });

    it('should get flow rate graph data', async () => {
        const res = await request(app)
            .get('/api/sensors/flow-rate-graph')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('success', true);
    });
});
