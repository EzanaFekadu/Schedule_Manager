const request = require('supertest');
const app = require('../server');

describe('Users API', () => {
    it('should create a new user', async () => {
        const response = await request(app).post('/api/users').send({
            username: 'testUser',
            password: 'testPassword',
            email: 'test@example.com'
        });
        expect(response.status).toBe(201);
        expect(response.body.id).toBeGreaterThan(0);
    });

    it('should retrieve all users', async () => {
        const response = await request(app).get('/api/users');
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });

    // Write tests for update and delete operations
    // ...
});

// Write tests for other API routes as needed
// ...