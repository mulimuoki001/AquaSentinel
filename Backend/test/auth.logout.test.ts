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

describe('Logout API', () => {
    let token: string;

    beforeAll(async () => {
        const email = `logoutuser${Date.now()}@example.com`;
        const password = 'Test@123';

        // 1️⃣ Register user
        await request(app)
            .post('/auth/register')
            .send({
                name: 'Logout Tester',
                role: 'farmer',
                farmname: 'Test Farm',
                farmlocation: 'Nyagatare',
                farmphone: '0788123123',
                email,
                password,
            });

        // 2️⃣ Login to get a fresh token
        const loginRes = await request(app)
            .post('/auth/login')
            .send({ email, password });

        expect(loginRes.status).toBe(200);
        token = loginRes.body.newToken;
    }, 20000);

    it('should log out the user using the token', async () => {
        const res = await request(app)
            .post('/auth/logout')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Logged out successfully');
    });
});
