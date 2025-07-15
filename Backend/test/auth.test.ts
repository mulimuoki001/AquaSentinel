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

import request from 'supertest';
import app from '../src/app';

export let sharedEmail: string;
export let token: string;
export let userId: number;


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
        sharedEmail = `testuser${Date.now()}@example.com`; // unique and reused across tests
    });

    it('should register a new farmer successfully', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
                ...baseUser,
                email: sharedEmail,
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
                email: sharedEmail,
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

describe('Authentication API', () => {
    const password = 'Test@123';

    it('should return a token with valid credentials', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ email: sharedEmail, password });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'User logged in successfully');
        expect(res.body).toHaveProperty('newToken');
        expect(res.body).toHaveProperty('role', 'farmer');
        expect(res.body).toHaveProperty('userId');
        expect(res.body).toHaveProperty('expirationTime');

        // Save token for logout test
        token = res.body.newToken;
        userId = res.body.userId;

    });

    it('should reject invalid credentials', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ email: 'wronguser@example.com', password: 'wrongpass' });

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('message', 'Invalid email or password');
    });

    it('should log out the user using the token', async () => {
        const res = await request(app)
            .post('/auth/logout')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Logged out successfully');
    });
});
