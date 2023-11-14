const mysql = require('mysql2');
const nodemailer = require('nodemailer');



// Mock nodemailer
jest.mock('nodemailer');

const mockedTransport = {
    sendMail: jest.fn().mockImplementation((mailOptions, callback) => callback(null, true)),
};

nodemailer.createTransport.mockReturnValue(mockedTransport);


// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'teamradiance341@gmail.com',
        pass: 'qdhh owzc clqh ofhy',
    },
});


// Database connection
const createTestConnection = () => {
    return new Promise((resolve, reject) => {
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


        connection.connect(error => {
            if (error) {
                console.error('Error connecting to the database:', error);
                return reject(error);
            }
            console.log('Test database connected successfully.');
            resolve(connection);
        });
    });
};

const closeConnection = (connection) => {
    return new Promise((resolve, reject) => {
        if (connection) {
            connection.end((error) => {
                if (error) {
                    console.error('Error closing the database connection:', error);
                    return reject(error);
                }
                console.log('Test database connection closed successfully.');
                resolve();
            });
        } else {
            resolve();
        }
    });
};

module.exports = {
    createTestConnection,
    closeConnection,
    mockedTransport
};