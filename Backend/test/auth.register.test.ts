import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../src/app';
import { setSharedEmail } from './testGlobals';

// ✅ Mock MQTT so no real broker connection
jest.mock('mqtt', () => ({
    connect: jest.fn(() => ({
        on: jest.fn(),
        publish: jest.fn(),
        subscribe: jest.fn(),
        end: jest.fn(),
    })),
}));

describe('Registration API', () => {
    const password = 'Test@123';
    const baseUser = {
        name: 'New Farmer',
        role: 'farmer',
        farmname: 'Test Farm',
        farmlocation: 'Nyagatare',
        farmphone: '0788123123',
    };

    beforeAll(() => {
        const email = `testuser${Date.now()}@example.com`; // unique
        setSharedEmail(email);
    });

    it('should register a new farmer successfully', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
                ...baseUser,
                email: (await import('./testGlobals')).sharedEmail,
                password,
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message');
    }, 10000);

    it('should reject if user already exists', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
                ...baseUser,
                email: (await import('./testGlobals')).sharedEmail,
                password,
            });

        expect(res.status).toBe(409);
        expect(res.body).toHaveProperty('message', 'User already exists');
    });

    it('should reject missing farm details for farmers', async () => {
        const incomplete = {
            ...baseUser,
            email: `testuser${Date.now()}@example.com`,
            password,
            farmname: '',
            farmphone: '',
        };

        const res = await request(app).post('/auth/register').send(incomplete);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'Farm information is required');
    });
});
