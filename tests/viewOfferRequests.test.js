const request = require('supertest');
const createApp = require('../backend/app');
const { createTestConnection, closeConnection } = require('./testSetup');

describe('GET /offerRequest/:brokerID', () => {
    let app;
    let connection;

    beforeAll(async () => {
        connection = await createTestConnection();
        app = createApp(connection);
    });

    afterAll(async () => {
        await closeConnection(connection);
    });

    it('should return offers for a valid broker ID', async () => {
        const brokerID = '2'; // Replace with a valid broker ID for testing
        const response = await request(app)
            .get(`/offerRequest/${brokerID}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array); // Assuming an array is returned
    });

    it('should return an empty array for a broker with no offers', async () => {
        const brokerID = 'brokerIDWithNoOffers'; // Replace with a broker ID that has no offers
        const response = await request(app)
            .get(`/offerRequest/${brokerID}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]); // Assuming an empty array is returned for no results
    });

});
