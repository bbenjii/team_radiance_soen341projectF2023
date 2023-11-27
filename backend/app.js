//app with all backend functions

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const cors = require('cors');
const {query} = require("express");


//operations on database
module.exports = (connection, transporter) => {
    const app = express();

    app.use(cors());
    // Middleware to parse JSON requests
    app.use(bodyParser.json());


// Serve static files (HTML, CSS, etc.) from a "public" directory
    app.use(express.static(path.join(__dirname, '../frontend')));

    //search property function
    app.get('/searchProperty', (req, res) => {
        const {
            Address, Country, City, ListingPrice, Bedrooms, Bathrooms, Description, PropertyType, Status
        } = req.query;

        // Construct SQL query based on provided parameters (with appropriate SQL injection protection)
        let sqlQuery = "SELECT * FROM Properties WHERE 1=1"; // The 1=1 is just a trick to start adding conditions
        if (Address) sqlQuery += ` AND Address LIKE ${connection.escape(Address)}`;
        if (Country) sqlQuery += ` AND Country LIKE ${connection.escape(Country)}`;
        if (City) sqlQuery += ` AND City LIKE ${connection.escape(City)}`;
        if (ListingPrice) sqlQuery <= ` AND ListingPrice LIKE ${connection.escape(ListingPrice)}`;
        if (Bedrooms) sqlQuery += ` AND Bedrooms LIKE ${connection.escape(Bedrooms)}`;
        if (Bathrooms) sqlQuery += ` AND Bathrooms LIKE ${connection.escape(Bathrooms)}`;
        if (Description) sqlQuery += ` AND Description LIKE ${connection.escape(Description)}`;
        if (PropertyType) sqlQuery += ` AND PropertyType LIKE ${connection.escape(PropertyType)}`;
        if (Status) sqlQuery += ` AND Status LIKE ${connection.escape(Status)}`;

        connection.query(sqlQuery, (error, results) => {
            if (error) throw error;
            res.json(results);
        });

    });

    //search broker function
    app.get('/searchBroker', (req, res) => {
        const {
            FirstName, LastName, Email, PhoneNumber
        } = req.query;

        let sqlQuery = "SELECT * FROM Brokers WHERE 1=1"; 
        if (FirstName) sqlQuery += ` AND FirstName LIKE ${connection.escape(FirstName)}`;
        if (LastName) sqlQuery += ` AND LastName LIKE ${connection.escape(LastName)}`;
        if (Email) sqlQuery += ` AND Email LIKE ${connection.escape(Email)}`;
        if (PhoneNumber) sqlQuery += ` AND PhoneNumber LIKE ${connection.escape(PhoneNumber)}`;

        connection.query(sqlQuery, (error, results) => {
            if (error) throw error;
            res.json(results);

        });

    });

    // Fetch all brokers
    app.get('/Brokers', (req, res) => {
        connection.query('SELECT * FROM Brokers', (error, results) => {
            if (error) {
                return res.status(500).json({ error: "Server error" });
            }
            res.json(results);
        });
    });


// Fetch all properties
    app.get('/Properties', (req, res) => {
        connection.query('SELECT * FROM Properties', (error, results) => {
            if (error) {
                return res.status(500).json({ error: "Server error" });
            }
            res.json(results);
        });
    });

    // Fetch properties of a specific broker
    app.get('/Properties/:brokerID', (req, res) => {
        const brokerID = req.params.brokerID;

        const query = `SELECT * FROM Properties WHERE BrokerID = ?`;

        connection.query(query, [brokerID], (error, results) => {
            if (error) {
                console.error('Error Finding Properties:', error);
                res.status(500).json({ success: false, message: 'Database error' });
            } else {
                res.json(results);
            }
        });
    });


    // Fetch visit requests of a specific broker
    app.get('/requestVisit/:brokerID', (req, res) => {
        const brokerID = req.params.brokerID;

        const query = `SELECT * FROM VisitRequests WHERE BrokerID = ?`;

        connection.query(query, [brokerID], (error, results) => {
            if (error) {
                console.error('Error Finding Properties:', error);
                res.status(500).json({ success: false, message: 'Database error' });
            } else {

                res.json(results);
            }
        });
    });

    // Fetch offers of a specific broker
    app.get('/offerRequest/:brokerID', (req, res) => {
        const brokerID = req.params.brokerID;

        const query = `SELECT * FROM OfferRequests WHERE BrokerID = ?`;

        connection.query(query, [brokerID], (error, results) => {
            if (error) {
                console.error('Error Finding Requests:', error);
                res.status(500).json({ success: false, message: 'Database error' });
            } else {

                res.json(results);
            }
        });
    });

    // accept or reject offer
    app.put('/updateOfferStatus', (req, res) => {

        const {offerID, propertyID , status} = req.body;
        console.log(offerID);
        console.log(propertyID);

        console.log(status);

        const query1 = 'UPDATE OfferRequests SET Status = ? WHERE OfferID = ?';

        const query2 = 'UPDATE Properties SET Status = ? WHERE PropertyID = ?';

        connection.query(query1, [status, offerID], (error, results) => {
            if (error) {
                console.error('Error Finding Requests:', error);
                res.status(500).json({ success: false, message: 'Database error' });
            } else {
                res.json(results);

                if (status == "Accepted"){
                    connection.query(query2, ["Sold", propertyID]);
                }
            }
        });

    });

    // Fetch address  of a specific property id
    app.get('/Properties/:propertyID', (req, res) => {
        const propertyID = req.params.brokerID;

        const query = `SELECT Address FROM VisitRequests WHERE PropertyID = ?`;

        connection.query(query, [propertyID], (error, results) => {
            if (error) {
                console.error('Error Finding Properties:', error);
                res.status(500).json({ success: false, message: 'Database error' });
            } else {
                res.json(results);
            }
        });
    });

    // Fetch all Buyers
    app.get('/Buyers', (req, res) => {
        connection.query('SELECT * FROM Buyers', (error, results) => {
            if (error) {
                return res.status(500).json({ error: "Server error" });
            }
            res.json(results);
        });
    });

//Add new broker to database
    app.post('/addBroker', (req, res) => {


        const { FirstName, LastName, Email, PhoneNumber} = req.body;

        const sql = 'INSERT INTO Brokers (FirstName, LastName, Email, PhoneNumber) VALUES (?, ?, ?, ?)';
        connection.query(sql, [FirstName, LastName, Email, PhoneNumber], (error, results) => {
            if (error) {
                console.error("MySQL Error:", error);
                res.status(500).json({ message: 'Error adding broker.' });
            }
            console.log('Broker added successfully.');
            res.json({ success: true, message: 'Broker added successfully.' });
        });
    });

//Add new Property to database
    app.post('/addProperty', (req, res) => {

        const { Address, Country, City, ListingPrice, Bedrooms, Bathrooms, Description, BrokerID, PropertyType, Status} = req.body;

        const sql = 'INSERT INTO Properties (Address, Country, City, ListingPrice, Bedrooms, Bathrooms, PropertyType, Description, BrokerID, Status) VALUES (?, ?, ?, ?,?, ?, ?, ?, ?)';
        connection.query(sql, [Address, Country, City, ListingPrice, Bedrooms, Bathrooms, PropertyType, Description, BrokerID, Status], (error, results) => {
            if (error) {
                console.error("MySQL Error:", error);
                res.status(500).json({ message: 'Error adding property.' });
            }
            console.log('Broker added successfully.');
            res.json({ success: true, message: 'property added successfully.' });
        });
    });

    //edit property information
    app.put('/Properties/:id', (req, res) => {
        const propertyID = parseInt(req.params.id,10);
        const { Address, Country, City, ListingPrice, Bedrooms, Bathrooms, Description, BrokerID, PropertyType,Status} = req.body;

        const query = 'UPDATE Properties SET Address = ?, Country = ?, City = ?, ListingPrice = ?, Bedrooms = ?, Bathrooms = ?,  Description = ?, BrokerID = ?, PropertyType = ?, Status = ? WHERE PropertyID = ?';
        connection.query(query, [Address, Country, City, ListingPrice, Bedrooms, Bathrooms,  Description, BrokerID, PropertyType, Status, propertyID], (error, results) => {
            if (error) {
                console.error(error);
                res.json({ success: false, message: 'Error updating property' });
            } else {
                res.json({ success: true, message: 'property updated successfully' });
            }
        });
    });



//Delete a Broker from the Database
    app.delete('/Brokers/:brokerID', (req, res) => {
        const brokerID = req.params.brokerID;

        const query = `DELETE FROM Brokers WHERE BrokerID = ?`;

        connection.query(query, [brokerID], (error, results) => {
            if (error) {
                console.error('Error deleting broker:', error);
                res.status(500).json({ success: false, message: 'Database error' });
            } else {
                if (results.affectedRows === 0) {
                    res.status(404).json({ success: false, message: 'Broker not found' });
                } else {
                    res.json({ success: true, message: 'Broker deleted successfully' });
                }
            }
        });
    });

// Delete a property from the Database
    app.delete('/Properties/:propertyID', (req, res) => {
        const propertyID = req.params.propertyID;

        const query = `DELETE FROM Properties WHERE PropertyID = ?`;

        connection.query(query, [propertyID], (error, results) => {
            if (error) {
                console.error('Error deleting property:', error);
                res.status(500).json({ success: false, message: 'Database error' });
            } else {
                if (results.affectedRows === 0) {
                    res.status(404).json({ success: false, message: 'Property not found' });
                } else {
                    res.json({ success: true, message: 'Property deleted successfully' });
                }
            }
        });
    });

//edit broker information
    app.put('/Brokers/:id', (req, res) => {
        const brokerId = parseInt(req.params.id,10);
        const { FirstName, LastName, Email, PhoneNumber } = req.body;

        const query = 'UPDATE Brokers SET FirstName = ?, LastName = ?, Email = ?, PhoneNumber = ? WHERE BrokerID = ?';
        connection.query(query, [FirstName, LastName, Email, PhoneNumber, brokerId], (error, results) => {
            if (error) {
                console.error(error);
                res.json({ success: false, message: 'Error updating broker' });
            } else {
                res.json({ success: true, message: 'Broker updated successfully' });
            }
        });
    });

    app.get('/requestVisit', (req, res) => {
        const {
            BuyerID, BrokerID, PropertyID, RequestDate, VisitDate, Status, Message
            } = req.query;

        const query = 'INSERT INTO VisitRequests (BuyerID, BrokerID, PropertyID, RequestDate, VisitDate, Status, AdditionalNotes) VALUES (?, ?, ?, ?,?, ?, ?)';

        connection.query(query, [BuyerID, BrokerID, PropertyID, RequestDate, VisitDate, Status, Message], (error, results) => {
            if (error) {
                console.error("MySQL Error:", error);
                res.status(500).json({ message: 'Error sending visit request.' });
            }else{
                console.log('visit request added successfully.');
                res.json({ success: true, message: 'visit request succesfully sent.' });
            }

        });

    });

    app.get('/sendOfferRequest', (req, res) => {
        console.log("called");
        const {
            PropertyID, BrokerID, BuyerName, BuyerEmail, Address, OfferAmount, DeedOfSaleDate, OccupancyDate, OfferDate, Message
        } = req.query;

        const query = 'INSERT INTO OfferRequests (PropertyID, BrokerID, BuyerName, BuyerEmail, PropertyAddress, OfferAmount, DeedOfSaleDate, OccupancyDate, OfferDate, AdditionalNotes) VALUES (?, ?, ?, ?,?, ?, ?,?, ?, ?)';

        connection.query(query, [PropertyID, BrokerID, BuyerName, BuyerEmail, Address, OfferAmount, DeedOfSaleDate, OccupancyDate, OfferDate, Message], (error, results) => {
            if (error) {
                console.error("MySQL Error:", error);
                res.status(500).json({ message: 'Error sending offer.' });
            }else{
                console.log('Offer succesfully sent.');
                res.json({ success: true, message: 'visit request added successfully.' });
            }

        });

    });



        app.get('/requestPropertyVisit', (req, res) => {
        const {
            Address, Country, City, ListingPrice, Bedrooms, Bathrooms, Description, PropertyType, Status
        } = req.query;

        // Construct the email message
        const emailSubject = 'Property Visit Request';
        const emailBody = `
      You have a request to visit the property with the following information:

      Address: ${Address}
      Country: ${Country}
      City: ${City}
      Listing Price: ${ListingPrice}
      Bedrooms: ${Bedrooms}
      Bathrooms: ${Bathrooms}
      Description: ${Description}
      Property Type: ${PropertyType}
      Status: ${Status}
    `;

        var maillist = [
            'benji.ollomo@gmail.com',
            'ceyhuntopcu4107@gmail.com',
        ];
        // Email options
        const mailOptions = {
            from: 'teamradiance341@gmail.com',
            to: maillist,
            subject: emailSubject,
            text: emailBody,
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email: ' + error);
                res.status(500).send('Error sending email');
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).send('Email sent successfully');
            }
        });
    });

    app.get('/sendOffer', (req, res) => {
        const {
            Address, Country, City, ListingPrice, Bedrooms, Bathrooms, Description, PropertyType, Status, OfferAmount
        } = req.query;

        // Construct the email message with the offer amount
        const emailSubject = 'Property Offer';
        const emailBody = `
      You have an offer for the property with the following information:

      Address: ${Address}
      Country: ${Country}
      City: ${City}
      Listing Price: ${ListingPrice}
      Bedrooms: ${Bedrooms}
      Bathrooms: ${Bathrooms}
      Description: ${Description}
      Property Type: ${PropertyType}
      Status: ${Status}

      Offer Amount: $${OfferAmount}
    `;

        var maillist = [
            'benji.ollomo@gmail.com',
            'ceyhuntopcu4107@gmail.com',
        ];
        // Email options
        const mailOptions = {
            from: 'teamradiance341@gmail.com',
            to: maillist,
            subject: emailSubject,
            text: emailBody,
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email: ' + error);
                res.status(500).send('Error sending email');
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).send('Email sent successfully');
            }
        });
    });

    return app;
};






