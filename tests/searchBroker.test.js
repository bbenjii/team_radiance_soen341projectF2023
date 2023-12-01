const request = require('supertest');
const createApp = require('../backend/app');
const { createTestConnection, closeConnection, mockedTransport } = require('./testSetup');

describe('GET /searchBroker', () => {

    let app;
    let connection;
    beforeAll(async () => {
        connection = await createTestConnection();
        app = createApp(connection, mockedTransport);
    });

    afterAll(async () => {
        await closeConnection(connection);
    });

    it('should return results for a valid single parameter search', async () => {
        const response = await request(app)
            .get('/searchBroker')
            .query({ FirstName: 'LeBron' }); 

        expect(response.statusCode).toBe(200);
    });


    it('should return results for a valid multiple parameters search', async () => {
        const response = await request(app)
            .get('/searchBroker')
            .query({ FirstName: 'LeBron', Email: 'Lbjames@Gmail.Com' });

        expect(response.statusCode).toBe(200);
        return;
    });

    it('should return an empty array for a broker not found', async () => {
        const response = await request(app)
            .get('/searchBroker')
            .query({ FirstName: 'NonExistentName' });

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]); // Assuming an empty array is returned for no results
    });
});


