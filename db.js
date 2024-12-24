const mongoose = require('mongoose');
require('dotenv').config();

// Define the MongoDB connection URL
// const mongoURL = process.env.MONGODB_URL_LOCAL // Replace 'mydatabase' with your database name
// const mongoURL = process.env.MONGODB_URL;
// const mongoURL = 'mongodb://127.0.0.1:27017/university';
// const mongoURL = 'mongodb+srv://sifatsajin88:HXPvIvsWwZU1mwfW@university.efxne.mongodb.net/university?retryWrites=true&w=majority';
// const mongoURL = 'mongodb+srv://sifatsajin88:HXPvIvsWwZU1mwfW@university.efxne.mongodb.net/';

const mongoURL = process.env.MONGODB_URL_ATLAS
// const mongoURL = process.env.MONGODB_URL_LOCAL

// Set up MongoDB connection
mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
// mongoose.connect(mongoURL)

// Get the default connection
// Mongoose maintains a default connection object representing the MongoDB connection.
const db = mongoose.connection;

// Define event listeners for database connection

db.on('connected', () => {
    console.log('Connected to MongoDB server');
});

db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

db.on('disconnected', () => {
    console.log('MongoDB disconnected');
});


// Export the database connection
module.exports = db;
