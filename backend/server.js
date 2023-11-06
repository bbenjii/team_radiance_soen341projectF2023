//server to run the Web App


const express = require('express');
const bodyParser = require('body-parser');
const PORT = 3306;
const path = require('path');

const cors = require('cors');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
// Middleware to parse JSON requests
app.use(bodyParser.json());


// Serve static files (HTML, CSS, etc.) from a "public" directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'teamradiance341@gmail.com',
      pass: 'soenradiance341',
    },
  });

// Database connection
const connection = mysql.createConnection({
    host: "realestate-database.civ63nddfi4r.ca-central-1.rds.amazonaws.com",
    user: "admin",
    password: "soen341project",
    database: "RealEstateDB"
});

connection.connect(error => {
    if (error) throw error;
    console.log('Database connected successfully.');
});


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

    console.log(sqlQuery);
    connection.query(sqlQuery, (error, results) => {
        if (error) throw error;
        res.json(results);
    });

});

app.get('/searchBroker', (req, res) => {
    const {
        FirstName, LastName, Email, PhoneNumber
    } = req.query;

    // Construct SQL query based on provided parameters (with appropriate SQL injection protection)
    let sqlQuery = "SELECT * FROM Brokers WHERE 1=1"; // The 1=1 is just a trick to start adding conditions
    if (FirstName) sqlQuery += ` AND FirstName LIKE ${connection.escape(FirstName)}`;
    if (LastName) sqlQuery += ` AND LastName LIKE ${connection.escape(LastName)}`;
    if (Email) sqlQuery += ` AND Email LIKE ${connection.escape(Email)}`;
    if (PhoneNumber) sqlQuery <= ` AND PhoneNumber LIKE ${connection.escape(PhoneNumber)}`;

    console.log(sqlQuery);
    connection.query(sqlQuery, (error, results) => {
        if (error) throw error;
        res.json(results);
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
  
    // Email options
    const mailOptions = {
      from: 'teamradiance341@gmail.com',
      to: 'topcuceyhun4107@gmail.com',
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
  
    // Email options
    const mailOptions = {
      from: 'teamradiance341@gmail.com',
      to: 'topcuceyhun4107@gmail.com',
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

//Add new broker to database
app.post('/addBroker', (req, res) => {

    console.log("add new broker");

    const { FirstName, LastName, Email, PhoneNumber} = req.body;

    // Insert the new broker into the database
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

    console.log("add new Property");

    const { Address, Country, City, ListingPrice, Bedrooms, Bathrooms, PropertyType, Description, Status} = req.body;

    // Insert the new broker into the database
    const sql = 'INSERT INTO Properties (Address, Country, City, ListingPrice, Bedrooms, Bathrooms, PropertyType, Description, Status) VALUES (?, ?, ?, ?,?, ?, ?, ?, ?)';
    connection.query(sql, [Address, Country, City, ListingPrice, Bedrooms, Bathrooms, PropertyType, Description, Status], (error, results) => {
        if (error) {
            console.error("MySQL Error:", error);
            res.status(500).json({ message: 'Error adding broker.' });
        }
        console.log('Broker added successfully.');
        res.json({ success: true, message: 'Broker added successfully.' });
    });
});




//Delete a Broker from the Database
app.delete('/Brokers/:brokerID', (req, res) => {
    const brokerID = req.params.brokerID;

    // SQL query to delete a broker
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

    // SQL query to delete a broker
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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

