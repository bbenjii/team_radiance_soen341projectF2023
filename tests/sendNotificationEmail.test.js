const request = require('supertest')
const createApp = require('../backend/app')
const { createTestConnection, closeConnection, mockedTransport } = require('./testSetup')

describe('/requestPropertyVisit Endpoint', () => {
  let app
  let connection

  beforeAll(async () => {
    connection = await createTestConnection()
    app = createApp(connection, mockedTransport)
  })

  afterAll(async () => {
    await closeConnection(connection)
  })

  it('should send a property visit request email and return a success message', async () => {
    const response = await request(app)
      .get('/requestPropertyVisit')
      .query({
        Address: '123 Test St',
        Country: 'Testland',
        City: 'Testville',
        ListingPrice: '500000',
        Bedrooms: '3',
        Bathrooms: '2',
        Description: 'A lovely test home',
        PropertyType: 'House',
        Status: 'For Sale'
      })

    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('Email sent successfully')

    // Assert that nodemailer's sendMail was called
    expect(mockedTransport.sendMail).toHaveBeenCalled()
  })
})
