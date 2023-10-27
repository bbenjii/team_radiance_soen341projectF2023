const mysql = require('mysql');

const dbConfig = {
  host: "realestate-database.civ63nddfi4r.ca-central-1.rds.amazonaws.com",
  user: "admin",
  password: "soen341project",
  database: "RealEstateDB"
};

const con = mysql.createConnection(dbConfig);

// Function to initialize the MySQL connection
const initializeConnection = () => {
  con.connect((err) => {
    if (err) {
      throw err;
    }
    console.log("Connected to the database");
  });
};

// Function to create tables for 'properties,' 'brokers,' and 'buyers'
const createTables = () => {
  // SQL command to create a table for 'properties'
  const createPropertiesTableSQL = `
    CREATE TABLE IF NOT EXISTS properties (
      property_id INT AUTO_INCREMENT PRIMARY KEY,
      property_address VARCHAR(255),
      property_country VARCHAR(100),
      property_city VARCHAR(100),
      property_listing_price DECIMAL(15,2),
      property_bedrooms INT,
      property_bathrooms INT,
      property_type VARCHAR(100),
      property_description TEXT,
      broker_id INT,
      property_status VARCHAR(50)
    )
  `;

  // SQL command to create a table for 'brokers'
  const createBrokersTableSQL = `
    CREATE TABLE IF NOT EXISTS brokers (
      broker_id INT AUTO_INCREMENT PRIMARY KEY,
      broker_first_name VARCHAR(255),
      broker_last_name VARCHAR(255),
      broker_email VARCHAR(255),
      broker_phone_number VARCHAR(20),
      broker_agency_name VARCHAR(255)
    )
  `;

  // SQL command to create a table for 'buyers'
  const createBuyersTableSQL = `
    CREATE TABLE IF NOT EXISTS buyers (
      buyer_id INT AUTO_INCREMENT PRIMARY KEY,
      buyer_first_name VARCHAR(255),
      buyer_last_name VARCHAR(255),
      buyer_email VARCHAR(255),
      buyer_phone_number VARCHAR(20)
    )
  `;

  // Execute the SQL commands to create the tables
  con.query(createPropertiesTableSQL, (err, result) => {
    if (err) {
      throw err;
    }
    console.log("Table 'properties' created (or already exists)");
  });

  con.query(createBrokersTableSQL, (err, result) => {
    if (err) {
      throw err;
    }
    console.log("Table 'brokers' created (or already exists)");
  });

  con.query(createBuyersTableSQL, (err, result) => {
    if (err) {
      throw err;
    }
    console.log("Table 'buyers' created (or already exists)");
  });
};

// Function to insert a record into the 'properties' table
const insertProperty = (propertyData) => {
  const insertSQL = `
    INSERT INTO properties (property_address, property_country, property_city, property_listing_price, property_bedrooms, property_bathrooms, property_type, property_description, broker_id, property_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  con.query(insertSQL, Object.values(propertyData), (err, result) => {
    if (err) {
      throw err;
    }
    console.log("Record inserted into 'properties' table");
  });
};

// Function to insert a record into the 'brokers' table
const insertBroker = (brokerData) => {
  const insertSQL = `
    INSERT INTO brokers (broker_first_name, broker_last_name, broker_email, broker_phone_number, broker_agency_name)
    VALUES (?, ?, ?, ?, ?)
  `;
  con.query(insertSQL, Object.values(brokerData), (err, result) => {
    if (err) {
      throw err;
    }
    console.log("Record inserted into 'brokers' table");
  });
};

// Function to insert a record into the 'buyers' table
const insertBuyer = (buyerData) => {
  const insertSQL = `
    INSERT INTO buyers (buyer_first_name, buyer_last_name, buyer_email, buyer_phone_number)
    VALUES (?, ?, ?, ?)
  `;
  con.query(insertSQL, Object.values(buyerData), (err, result) => {
    if (err) {
      throw err;
    }
    console.log("Record inserted into 'buyers' table");
  });
};

// Function to close the MySQL connection
const closeConnection = () => {
  con.end();
};

module.exports = {
  initializeConnection,
  createTables,
  insertProperty,
  insertBroker,
  insertBuyer,
  closeConnection,
};
