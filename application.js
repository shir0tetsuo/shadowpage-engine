const express = require('express');
const app = express();
const crypto = require('crypto-js');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Load environment variables from .env file
require('dotenv').config();

// Sequelize configuration
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_FILE_PATH
});

// Define the User model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Express configuration
app.use(express.static('static'));

// Load information from a static file
function loadStaticFile(filename) {
  // Implementation to load file contents goes here
}

// Main page - Login
app.get('/', (req, res) => {
  // Google authentication implementation goes here
  // If user is logged in with Gmail, display contents from passed-user-login.html
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

