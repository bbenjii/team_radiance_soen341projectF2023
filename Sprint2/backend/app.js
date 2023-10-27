const dbHelper = require('./dbHelper');
const express = require('express');

const port = 3000;
const app = express();

app.use(express.json());

// Initialize the MySQL connection
dbHelper.initializeConnection();

// Create tables (if they don't already exist)
dbHelper.createTables();

// Add the property to the database
app.post('/submit-property', (req, res) => {
    const propertyData = req.body;
  
    dbHelper.insertProperty(propertyData, (err, result) => {
      if (err) {
        res.status(500).send('Error adding property');
      } else {
        res.status(200).send('Property added successfully');
      }
    });
  });
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

// Add the broker to the database
app.post('/submit-broker', (req, res) => {
  const brokerData = req.body;

  dbHelper.insertBroker(brokerData, (err, result) => {
    if (err) {
      res.status(500).send('Error adding broker');
    } else {
      res.status(200).send('Broker added successfully');
    }
  });
});

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

// Close the MySQL connection
dbHelper.closeConnection();
