// Unit tests for users service
const request = require('supertest');
const app = require('../app');

// Mock the User model
const User = require('../models/user');
jest.mock('../models/user');

// Mock the Cost model
const Cost = require('../models/cost');
jest.mock('../models/cost');

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
            birthday: new Date(Date.UTC(1990, 0, 1))
        });

        const newUser = {
            id: 999999,
            first_name: 'Test',
            last_name: 'User',
            birthday: '01/01/1990'  // ✅ CORRECT FORMAT
        };

        const response = await request(app)
            .post('/api/add')
            .send(newUser);

        expect(response.status).toBe(201);
        expect(response.body.id).toBe(999999);
        expect(response.body.birthday).toBe('01/01/1990');
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
    test('GET /api/users/123123 should return user details with total', async () => {
        User.findOne.mockResolvedValue({
            id: 123123,
            first_name: 'mosh',
            last_name: 'israeli',
            birthday: new Date('1990-01-01')
        });

        // Mock Cost.find to return costs for total calculation
        Cost.find.mockResolvedValue([
            { sum: 50 },
            { sum: 30 },
            { sum: 20 }
        ]);

        const response = await request(app).get('/api/users/123123');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('first_name');
        expect(response.body).toHaveProperty('total');
        expect(response.body.total).toBe(100);
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
                birthday: '01/01/1990'  // ✅ CORRECT FORMAT
            });

        expect(response.status).toBe(400);
    });

    // Test invalid birthday format
    test('POST /api/add should fail with invalid birthday format', async () => {
        const response = await request(app)
            .post('/api/add')
            .send({
                id: 888888,
                first_name: 'Test',
                last_name: 'User',
                birthday: '1990-01-01'  // ❌ Wrong format
            });

        expect(response.status).toBe(400);
        expect(response.body.id).toBe('INVALID_DATE_FORMAT');
    });

    // Test future birthday
    test('POST /api/add should fail with future birthday', async () => {
        const response = await request(app)
            .post('/api/add')
            .send({
                id: 888888,
                first_name: 'Test',
                last_name: 'User',
                birthday: '01/01/2050'  // Future date
            });

        expect(response.status).toBe(400);
        expect(response.body.id).toBe('INVALID_DATE_FORMAT');
    });
});