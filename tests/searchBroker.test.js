const request = require('supertest');
const createApp = require('../backend/app'); // Adjust the path to where your Express app is defined
const {connection, closeConnection, transporter} = require('./testSetup');

app = createApp(connection, transporter);

describe('GET /searchBroker', () => {

    afterAll(() => {
        closeConnection(); // Close the test database connection
    });

    it('should return results for a valid single parameter search', async () => {
        const response = await request(app)
            .get('/searchBroker')
            .query({ FirstName: 'LeBron' }); // Use a valid FirstName that exists in your database

        expect(response.statusCode).toBe(200);



        // Further assertions to validate the response structure and data
    });


    it('should return results for a valid multiple parameters search', async () => {
        const response = await request(app)
            .get('/searchBroker')
            .query({ FirstName: 'LeBron', Email: 'Lbjames@Gmail.Com' }); // Adjust with valid parameters

        expect(response.statusCode).toBe(200);
        return;

        // Further assertions
    });

    it('should return an empty array for a broker not found', async () => {
        const response = await request(app)
            .get('/searchBroker')
            .query({ FirstName: 'NonExistentName' });

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]); // Assuming an empty array is returned for no results
    });


    // Additional test for SQL Injection protection can be considered
});


