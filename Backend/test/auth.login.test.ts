import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../src/app';
import { setToken, setUserId } from './testGlobals';

jest.setTimeout(20000); // Allow more time for backend

jest.mock('mqtt', () => ({
    connect: jest.fn(() => ({
        on: jest.fn(),
        publish: jest.fn(),
        subscribe: jest.fn(),
        end: jest.fn(),
    })),
}));

describe('Authentication API', () => {
    const password = 'Test@123';
    let sharedEmail: string;

    beforeAll(async () => {
        sharedEmail = `loginuser${Date.now()}@example.com`;

        const res = await request(app)
            .post('/auth/register')
            .send({
                name: 'Login Farmer',
                role: 'farmer',
                farmname: 'Login Farm',
                farmlocation: 'Nyagatare',
                farmphone: '0788123456',
                email: sharedEmail,
                password,
            });

        console.log("Register status:", res.status, res.body); // 👈 debug
        expect([200, 409]).toContain(res.status); // pass even if already registered
    }, 20000);

    it('should return a token with valid credentials', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ email: sharedEmail, password });

        console.log("Login status:", res.status, res.body); // 👈 debug
        expect(res.status).toBe(200);
        setToken(res.body.newToken);
        setUserId(res.body.userId);
    }, 20000);

    it('should reject invalid credentials', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ email: 'wronguser@example.com', password: 'wrongpass' });

        expect(res.status).toBe(401);
    }, 20000);
});
