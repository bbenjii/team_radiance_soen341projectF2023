const request = require('supertest');
const createApp = require('../backend/app');
const { createTestConnection, closeConnection } = require('./testSetup');

describe('PUT /updateOfferStatus', () => {
    let app;
    let connection;

    beforeAll(async () => {
        connection = await createTestConnection();
        app = createApp(connection);
    });

    afterAll(async () => {
        await closeConnection(connection);
    });

    it('should update offer status successfully', async () => {
        const offerID = '2'; // Replace with valid offer ID
        const propertyID = '2'; // Replace with valid property ID
        const status = 'Accepted'; // Example status

        const response = await request(app)
            .put('/updateOfferStatus')
            .send({ offerID, propertyID, status });

        expect(response.statusCode).toBe(200);
        // Additional checks for the response can be added here
    });


});
