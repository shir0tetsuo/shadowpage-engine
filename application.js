////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Import
const express = require('express');
const app = express();
const crypto = require('crypto-js');
const fs = require("fs") // filesystem mgmt

const { Sequelize, DataTypes } = require('sequelize');
const {User,Matrix,Well} = require('./database.js')

// TODO: We don't have the priv key because it's on the other server.
//const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY) // $ => G,S

const bcrypt = require('bcrypt') // https://www.npmjs.com/package/bcrypt
const saltRounds = 10;

const bparse = require('body-parser') //https://codeforgeek.com/handle-get-post-request-express-4/
const cookies = require('cookie-parser') //https://stackoverflow.com/questions/16209145/how-to-set-cookie-in-node-js-using-express-framework


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Fn

async function arrayToString(arr) {
  var result = '';
  for (const element of arr) {
    result += element.toString();
  }
  return result
}

async function readFileAsString(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

// From ChatGPT
function replaceAllInstances(inputString, searchString, replacementString) {
  // Escape special characters in the search string to avoid regex issues
  const escapedSearchString = searchString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Create a regular expression to match all instances of the search string
  const regex = new RegExp(escapedSearchString, 'g');

  // Use the replace method with the regular expression to perform the replacement
  const resultString = inputString.replace(regex, replacementString);

  return resultString;
}

// 99 -> 099 or 0099 or 00099
// 99 = 90 (2nd place), 9 (1st place)
// num + (0 * places)
function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}

// Fetch random integer
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}



// Load environment variables from .env file
require('dotenv').config();

// Init DB with Sync Call
// should produce an error if it doesn't work
User.sync()
Matrix.sync()

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Usage Constructors

app.use(express.json());
app.use(bparse.urlencoded({ extended: true }));
app.use(bparse.json());
app.use(cookies())
// load /img/ media from folder 'img'
app.use('/static', express.static('static'));
app.use('/favico.ico', express.static('favicon.ico'));
app.use('/robots.txt', express.static('robots.txt'));

// Express configuration
app.use(express.static('static'));

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Main Application

// goes into database.js
async function checkAuthorization(user_uuid, user_hash) {
  console.log('Authorization Check')

  var user_logged = false;

  // no uuid or no hash
  if (!user_uuid || !user_hash) return user_logged;

  Account = await Well.fetchUserByUUID(user_uuid)

  // no account
  if (!Account) return user_logged;

  // if account hash doesn't equal the user hash in cookies
  if (Account.account_hash != user_hash) return user_logged;

  // if account is disabled
  if (Account.account_enabled == false) return user_logged;

  console.log('Authenticated for ' + user_uuid)
  user_logged = true;
  return user_logged;

}

async function pageloader(central_array = []) {

  var data_to_string = ''

  try {
    const header = await readFileAsString('static/00_headers.html')
    const central = await arrayToString(central_array)
    const tails = await readFileAsString('static/99_tails.html')


    const page_data = [header, central, tails]

    data_to_string = await arrayToString(page_data)


  } catch (error) {
    console.error('Error Reading file: ', error)
  }

  return data_to_string
}

// Main page - Login
app.get('/', async (req, res) => {

  const user_uuid = req.cookies.user_uuid
  const user_hash = req.cookies.user_hash

  
  // check login cookies against database
  login_flag = await checkAuthorization(user_uuid, user_hash)

  if (login_flag) {
    Account = await Well.fetchUserByUUID(user_uuid)

    // central piece data
    const central = await readFileAsString('static/01_entry_default.html')

    const badge = "<i class='bx bxs-user-rectangle'></i> "

    var central_shifted = replaceAllInstances(central, '{?get_started_url}',`/u/${user_uuid}`)
    central_shifted = replaceAllInstances(central_shifted, '{?get_started}', badge + user_uuid)

    // page loader
    const page_data = await pageloader([central_shifted])
    var page_data_shifted = replaceAllInstances(page_data, '{?user_account_url}',`/u/${user_uuid}`)

    res.status(200).send(page_data_shifted)
  
  } else {
    // User not logged in
    // central piece data
    const central = await readFileAsString('static/01_entry_default.html')

    const badge = "<i class='bx bxs-user-plus' ></i> "

    var central_shifted = replaceAllInstances(central, '{?get_started_url}','/register')
    central_shifted = replaceAllInstances(central_shifted, '{?get_started}', badge + 'Create Account or Login')

    // page loader
    const page_data = await pageloader([central_shifted])
    var page_data_shifted = replaceAllInstances(page_data, '{?user_account_url}','/register')

    res.status(200).send(page_data_shifted)
  }
 
});

// Simple UUID Generator
app.get('/g', async (req, res) => {
  res.status(200).send(Well.fetchUniqueUUID())
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Start the server
const port = process.env.PORT //|| 3000;
app.listen(port, () => {

  console.log(`The server has started on port ${port}`);
});

