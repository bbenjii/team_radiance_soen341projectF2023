// server.js

const app = require('./app')
const PORT = 3306
const mysql = require('mysql2')
const nodemailer = require('nodemailer')

// Database connection
const connection = mysql.createConnection({
  host: 'realestate-database.civ63nddfi4r.ca-central-1.rds.amazonaws.com',
  user: 'admin',
  password: 'soen341project',
  database: 'RealEstateDB'
})

connection.connect(error => {
  if (error) throw error
  console.log('Database connected successfully.')
})

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'teamradiance341@gmail.com',
    pass: 'qdhh owzc clqh ofhy'
  }
})

const server = app(connection, transporter)
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
