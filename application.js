const express = require('express');
const app = express();
const crypto = require('crypto-js');
const { Sequelize, DataTypes } = require('sequelize');
// According to huggingchat
var googleapis = require('googleapis')
var auth = require('google-auth-library')
const { ClosureSystem } = require('closure-library')

// TODO: We don't have the priv key because it's on the other server.
//const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY) // $ => G,S

const bcrypt = require('bcrypt') // https://www.npmjs.com/package/bcrypt
const saltRounds = 10;

const bparse = require('body-parser') //https://codeforgeek.com/handle-get-post-request-express-4/
const cookies = require('cookie-parser') //https://stackoverflow.com/questions/16209145/how-to-set-cookie-in-node-js-using-express-framework


// Fn

async function readFile(filePath) {
  try {
    const data = await fs.readFile(filePath);
    //console.log(data.toString());
    return data.toString()
  } catch (error) {
    console.error(`Got an error trying to read the file: ${error.message}`);
  }
}

function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function genID() {
  return `1P${zeroPad(getRandomInt(999),3)}X${Date.now()}`
}


// Load environment variables from .env file
require('dotenv').config();

// Sequelize configuration
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_FILE_PATH
});

// Define the User model
const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

User.sync()


app.use(express.json());
app.use(bparse.urlencoded({ extended: true }));
app.use(bparse.json());
app.use(cookies())
// load /img/ media from folder 'img'
app.use('/static', express.static('static'));
//app.use('/favicon.ico', express.static('favicon.ico'));
app.use('/robots.txt', express.static('robots.txt'));

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
  console.log(res)
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  // Preload ClosureSystem on app listen
  //ClosureSystem.preload
  console.log(`The server has started on port ${port}`);
});

