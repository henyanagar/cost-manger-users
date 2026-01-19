// Unit tests for users service
const request = require('supertest');
const app = require('../app'); // ← Import app.js, NOT server.js

// Mock the User model
const User = require('../models/user');
jest.mock('../models/user');

// Mock fetch for external API calls
global.fetch = jest.fn();

describe('Users API', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test POST /api/add
    test('POST /api/add should create a new user', async () => {
        User.findOne.mockResolvedValue(null); // User doesn't exist
        User.create.mockResolvedValue({
            id: 999999,
            first_name: 'Test',
            last_name: 'User',
            birthday: new Date('1990-01-01')
        });

        const newUser = {
            id: 999999,
            first_name: 'Test',
            last_name: 'User',
            birthday: '1990-01-01'
        };

        const response = await request(app)
            .post('/api/add')
            .send(newUser);

        expect(response.status).toBe(201);
        expect(response.body.id).toBe(999999);
    });

    // Test GET /api/users
    test('GET /api/users should return all users', async () => {
        User.find.mockResolvedValue([
            {
                id: 123123,
                first_name: 'mosh',
                last_name: 'israeli',
                birthday: new Date('1990-01-01')
            }
        ]);

        const response = await request(app).get('/api/users');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    // Test GET /api/users/:id
    test('GET /api/users/123123 should return user details', async () => {
        User.findOne.mockResolvedValue({
            id: 123123,
            first_name: 'mosh',
            last_name: 'israeli',
            birthday: new Date('1990-01-01')
        });

        // Mock fetch to costs service
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({ total: 100 })
        });

        const response = await request(app).get('/api/users/123123');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('first_name');
        expect(response.body).toHaveProperty('total');
    });

    // Test validation
    test('POST /api/add should fail without required fields', async () => {
        const response = await request(app)
            .post('/api/add')
            .send({ id: 888888 });

        expect(response.status).toBe(400);
    });

    // Test duplicate user
    test('POST /api/add should fail if user exists', async () => {
        User.findOne.mockResolvedValue({
            id: 123123,
            first_name: 'mosh',
            last_name: 'israeli'
        });

        const response = await request(app)
            .post('/api/add')
            .send({
                id: 123123,
                first_name: 'Test',
                last_name: 'User',
                birthday: '1990-01-01'
            });

        expect(response.status).toBe(400);
    });
});