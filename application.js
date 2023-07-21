/* 
GENERAL NOTES
  Don't forget to run npm.sh and configure.sh

  // TODO: For Stripe we don't have the priv key because it's on the other server.
  //const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY) // $ => G,S




  shir0tetsuo / shadowsword
*/

// Requirements ///////////////////////////////////////////
const { LOG } = require('./logging.js') // from logging.js
const express = require('express');
const app = express();
const crypto = require('crypto-js');
const fs = require("fs") // filesystem mgmt

const { Sequelize, DataTypes } = require('sequelize');
const {User,Matrix,Well} = require('./database.js') // from database.js


const bcrypt = require('bcrypt') // https://www.npmjs.com/package/bcrypt
const saltRounds = 10;

const bparse = require('body-parser') //https://codeforgeek.com/handle-get-post-request-express-4/
const cookies = require('cookie-parser') //https://stackoverflow.com/questions/16209145/how-to-set-cookie-in-node-js-using-express-framework

User.sync()
Matrix.sync()

// Load environment variables from .env file
require('dotenv').config();

/*

                                        d88888b db    db d8b   db  .o88b. 
                                        88'     88    88 888o  88 d8P  Y8 
                                        88ooo   88    88 88V8o 88 8P      
                                        88~~~   88    88 88 V8o88 8b      
                                        88      88b  d88 88  V888 Y8b  d8 
                                        YP      ~Y8888P' VP   V8P  `Y88P' 
                                                                    
*/

// Useful for timeout sessions.
class ExpiringSet {
  // const authorization_timeout = new ExpiringSet();
  // if authorization_timeout.has(IPAddress) {...}
  // authorization_timeout.add(IPAddress, 5000)
  constructor() {
    this.set = new Set();
  }

  add(value, timeoutMilliseconds) {
    this.set.add(value);
    setTimeout(() => {
      this.set.delete(value);
    }, timeoutMilliseconds);
  }

  has(value) {
    return this.set.has(value);
  }

  delete(value) {
    return this.set.delete(value);
  }

  values() {
    return this.set.values();
  }
}

// 99 -> 099 or 0099 or 00099, 99 = 90 (2nd place), 9 (1st place)
function zeroPad(num, places) {
  // num + (0 * places)
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
} //v1

// goes into database.js
async function checkAuthorization(user_uuid, user_hash) {
  //console.log('Authorization Check')

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

  LOG.ticket('Authenticated for ' + user_uuid)
  user_logged = true;
  return user_logged;

} // Deprecated (Old Method)

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
} // Deprecated (Old Method)


/*
            d8888b.  .d8b.   d888b  d88888b db   db  .d8b.  d8b   db d8888b. db      d88888b d8888b. 
            88  `8D d8' `8b 88' Y8b 88'     88   88 d8' `8b 888o  88 88  `8D 88      88'     88  `8D 
            88oodD' 88ooo88 88      88ooooo 88ooo88 88ooo88 88V8o 88 88   88 88      88ooooo 88oobY' 
            88~~~   88~~~88 88  ooo 88~~~~~ 88~~~88 88~~~88 88 V8o88 88   88 88      88~~~~~ 88`8b   
            88      88   88 88. ~8~ 88.     88   88 88   88 88  V888 88  .8D 88booo. 88.     88 `88. 
            88      YP   YP  Y888P  Y88888P YP   YP YP   YP VP   V8P Y8888D' Y88888P Y88888P 88   YD 

                        PageHandler -> replaceHandler -> ReplaceAllInstances

*/

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
} //v1

async function arrayToString(arr) {
  var result = '';
  for (const element of arr) {
    result += element.toString();
  }
  return result
} //v2

// From ChatGPT
function replaceAllInstances(inputString, searchString, replacementString) {
  // Escape special characters in the search string to avoid regex issues
  const escapedSearchString = searchString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Create a regular expression to match all instances of the search string
  const regex = new RegExp(escapedSearchString, 'g');

  // Use the replace method with the regular expression to perform the replacement
  const resultString = inputString.replace(regex, replacementString);

  return resultString;
} //v2 (do not remove)

async function replaceHandler(replacements, page) {
  for (const replacement_pair in replacements) {
    replaceText = replacements[replacement_pair][0]
    replaceWith = replacements[replacement_pair][1]
    page = await replaceAllInstances(page, replaceText, replaceWith)
  }
  return page
} //v3

async function pageHandler(replacements, central_array = []) {
  const header = await readFileAsString('static/00_headers.html') // HTML page headers
  const central_piece = await arrayToString(central_array) // HTML center pieces
  const tails = await readFileAsString('static/99_tails.html') // </body></html>
  const page_data = [header, central_piece, tails] // The Constructed Page array
  var page = await arrayToString(page_data)
  // Replacement Engine
  page = await replaceHandler(replacements, page)
  return page;
} //v3

/*

                                           .d8b.  db    db d888888b db   db 
                                          d8' `8b 88    88 `~~88~~' 88   88 
                                          88ooo88 88    88    88    88ooo88 
                                          88~~~88 88    88    88    88~~~88 
                                          88   88 88b  d88    88    88   88 
                                          YP   YP ~Y8888P'    YP    YP   YP 

  CLIENT INFORMATION HANDLER (clientInformation)

  req -> headers, user_uuid, user_hash, IPAddress, 
  -> user = loadUserAuth = { Authorized, Account{} }

*/

async function loadUserAuth(user_uuid, user_hash) {
  if (!user_uuid || !user_hash) return { Authorized: false, Account: Well.userDummy() }
  Account = await Well.fetchUserByUUID(user_uuid)
  try {
    Authorized = (Account.account_hash == user_hash && Account.account_enabled) ? true : false
    //return { Authorized: Authorized, Account: Account}
  } catch (e) {
    Authorized = false;
    Account = Well.userDummy();
    console.log(e)
    //return { Authorized: false, Account: Well.userDummy() }
  }
  LOG.ticket(`Account: ${Account.account_uuid}, Authority-Level: ${Account.account_authority}`)
  LOG.ticket(`Authorized: ${Authorized}, (Enabled: ${Account.account_enabled}, Level: ${Account.account_level}, Tokens: ${Account.account_tokens})`)
  return { Authorized: Authorized, Account: Account }
} //v3

async function clientInformation(req) {
  LOG.radio(`CLIENT ${req.socket.remoteAddress} => ${req.path}`)
  return {
    headers: {
      userAgent: req.header('user-agent'),
      contentType: req.header('Content-Type'),
      domain: req.domain,
      path: req.path
    },
    user_uuid: req.cookies.user_uuid,
    user_hash: req.cookies.user_hash,
    IPAddress: req.socket.remoteAddress,
    user: await loadUserAuth(req.cookies.user_uuid, req.cookies.user_hash) //.Authorized, .Account.account_uuid ...
  }
} //v3

/*

                                              db    db .d8888. d88888b 
                                              88    88 88'  YP 88'     
                                              88    88 `8bo.   88ooooo 
                                              88    88   `Y8b. 88~~~~~ 
                                              88b  d88 db   8D 88.     
                                              ~Y8888P' `8888Y' Y88888P 

*/
app.use(express.json());
app.use(bparse.urlencoded({ extended: true }));
app.use(bparse.json());
app.use(cookies())
app.use('/static', express.static('static'));
app.use(express.static('static'));
app.use('/favico.ico', express.static('favicon.ico'));
app.use('/favicon.ico', express.static('favicon.ico'));
app.use('/robots.txt', express.static('robots.txt'));

/*
                                                .d8b.  d8888b. d8888b. 
                                                d8' `8b 88  `8D 88  `8D 
                                                88ooo88 88oodD' 88oodD' 
                                                88~~~88 88~~~   88~~~   
                                                88   88 88      88      
                                                YP   YP 88      88      
*/
app.get('/', async (req, res) => {
  ClientAccount = await clientInformation(req)

  badge = (ClientAccount.user.Authorized) ? `<i class='bx bxs-user-rectangle'></i> ` : "<i class='bx bxs-user-plus' ></i> "
  
  const replacements = [
    ['{?user_account_url}', (ClientAccount.user.Authorized) ? `/u/${ClientAccount.user.Account.account_uuid}` : `/register`],
    ['{?get_started_url}', (ClientAccount.user.Authorized) ? `/u/${ClientAccount.user.Account.account_uuid}` : `/register`],
    ['{?get_started}', (ClientAccount.user.Authorized) ? `${badge} ${ClientAccount.user.Account.account_uuid}` : `${badge} Create Account or Login`],
  ]
  
  const central = await readFileAsString('static/01_entry_default.html')
  const page = await pageHandler(replacements, [central])

  res.status(200).send(page)
}) //v3

// Simple UUID Generator
app.get('/g', async (req, res) => {
  res.status(200).send(Well.fetchUniqueUUID())
});

// User by ID
app.get('/u/:uuid', async (req, res) => {
  const user_uuid = req.cookies.user_uuid
  const user_hash = req.cookies.user_hash
  const { uuid } = req.params;

  // login check
  login_flag = await checkAuthorization(user_uuid, user_hash)

  // user = user
  editable = (uuid == user_uuid && login_flag) ? true : false;
  // edit button, disabled
  edit_button = (editable) ? `<a class='cardmarine' href='#' id='user_edit_button' title='Edit Account'><i class='bx bx-cog' ></i></a>` : ''

  const account_info = await Well.fetchUserByUUID(uuid)

  var admin_privilege = false
  
  if (account_info) {
    admin_privilege = (account_info.account_authority >= 4 && editable) ? true : false
  } 
  
  const admin_edit_button = (admin_privilege) ? `<a class="cardbee" title="Administrative Tools" href="/admin"><i class='bx bxs-zap' ></i></a>` : ``

  const page_end = await readFileAsString('static/12_user_panel_end.html')

  if (account_info) {

    // static
    const central = await readFileAsString('static/11_user_panel_top.html')

    // put account uuid from db onto page
    const field_acc_uuid = `<i class='bx bxs-user-rectangle'></i> ${account_info.account_uuid}`
    var central_shifted = replaceAllInstances(central, '{?field_acc_uuid}', field_acc_uuid)

    // put edit button on page if available
    central_shifted = replaceAllInstances(central_shifted, '{?edit_button}', edit_button)
    central_shifted = replaceAllInstances(central_shifted, '{?admin_button}', admin_edit_button)

    // run pageloader
    const page_data = await pageloader([central_shifted, page_end])

    // put user account url on page at nav
    var page_data_shifted = (login_flag) ? replaceAllInstances(page_data, '{?user_account_url}',`/u/${user_uuid}`) : replaceAllInstances(page_data,'{?user_account_url}','/register')

    // send response
    res.status(200).send(page_data_shifted)

  } else {

    const central = await readFileAsString('static/11_user_panel_top.html')
    const field_acc_uuid = `<i class='bx bxs-user-rectangle'></i> 00000000-0000-0000-0000-000000000000`

    var central_shifted = replaceAllInstances(central, '{?field_acc_uuid}', field_acc_uuid)
    central_shifted = replaceAllInstances(central_shifted, '{?edit_button}', edit_button)
    central_shifted = replaceAllInstances(central_shifted, '{?admin_button}', admin_edit_button)

    const page_data = await pageloader([central_shifted, page_end])
    var page_data_shifted = (login_flag) ? replaceAllInstances(page_data, '{?user_account_url}',`/u/${user_uuid}`) : replaceAllInstances(page_data,'{?user_account_url}','/register')
    
    res.status(404).send(page_data_shifted)
  }
})

// User Registration
app.get('/register', async (req, res) => {
  const central = await readFileAsString('static/10_user_registration.html')
  const stub = await readFileAsString('static/19_stub_loggedin.html')
  const page_end = await readFileAsString('static/12_user_panel_end.html')
  const user_uuid = req.cookies.user_uuid
  const user_hash = req.cookies.user_hash
  login_flag = await checkAuthorization(user_uuid, user_hash)
  if (login_flag) {
    page_data = await pageloader([stub, page_end])
  } else {
    page_data = await pageloader([central, page_end])
  }
  
  var page_data_shifted = replaceAllInstances(page_data, '{?user_account_url}',`/register`)
  res.status(200).send(page_data_shifted)
})

app.get('/about', async (req, res) => {
  const central = await readFileAsString('static/20_about.html')
  const page_end = await readFileAsString('static/12_user_panel_end.html')
  page_data = await pageloader([central, page_end])
  const user_uuid = req.cookies.user_uuid
  const user_hash = req.cookies.user_hash
  login_flag = await checkAuthorization(user_uuid, user_hash)
  
  var page_data_shifted = (login_flag) ? replaceAllInstances(page_data, '{?user_account_url}',`/u/${user_uuid}`) : replaceAllInstances(page_data,'{?user_account_url}','/register')

  res.status(200).send(page_data_shifted)
})

/*

                                            d8888b.  .d88b.  .d8888. d888888b 
                                            88  `8D .8P  Y8. 88'  YP `~~88~~' 
                                            88oodD' 88    88 `8bo.      88    
                                            88~~~   88    88   `Y8b.    88    
                                            88      `8b  d8' db   8D    88    
                                            88       `Y88P'  `8888Y'    YP    

*/

const authorization_timeout = new ExpiringSet();
app.post('/authorization', async (req, res) => {

  const IPAddress = req.socket.remoteAddress;
  
  try {

    // authorization timeout
    if (authorization_timeout.has(IPAddress)) return res.status(200).json({ server: 'Please wait 5 seconds before sending another request.' })
    authorization_timeout.add(IPAddress, 5000)

    client_submission = Object.assign({},req.body)

    // If submission mode missing
    if (!client_submission.mode) return res.status(200).json({ server: '<b class="cardtomato">Mode Not Set</b>' })

    // Registration Mode
    if (client_submission.mode == 'register') {
      client_password = client_submission.password;
      client_password_confirm = client_submission.passwordconfirm;
      if (client_password != client_password_confirm) return res.status(200).json({ server: '<b class="cardtomato">Password non-match.</b>' })
      if (client_password.length < 8) return res.status(200).json({ server: '<b class="cardtomato">Your password must be at least 8 characters in length.</b>' })

      new_UUID = await Well.fetchUniqueUUID();
      new_HASH = Well.fetchCrypt(client_password);

      const NewUser = await Well.InsertNewUser(new_UUID, new_HASH)

      res.status(200).json({ server: '<b class="cardmarine">OK</b>', grant: { new_UUID: new_UUID, new_HASH: new_HASH, redirection: '' } })
    }

    // Login Mode
    if (client_submission.mode == 'login') {
      
      client_uuid = client_submission.uuid;
      const account_info = await Well.fetchUserByUUID(client_uuid)
      const client_password_OK = Well.compareCrypt(client_submission.password, account_info.account_hash);

      if (!account_info) return res.status(200).json({ server: '<b class="cardtomato">Invalid UUID/PASS</b>' })

      if (!client_password_OK) return res.status(200).json({ server: '<b class="cardtomato">Invalid UUID/PASS</b>' })

      res.status(200).json({ server: '<b class="cardmarine">OK</b>', grant: { UUID: client_uuid, HASH: account_info.account_hash, redirection: `u/${client_uuid}` } })
    }

  } catch (e) {
    return res.status(500).json({ server: e.message })
  }
  
})

/*
                                        .d8888. d888888b  .d8b.  d8888b. d888888b 
                                        88'  YP `~~88~~' d8' `8b 88  `8D `~~88~~' 
                                        `8bo.      88    88ooo88 88oobY'    88    
                                          `Y8b.    88    88~~~88 88`8b      88    
                                        db   8D    88    88   88 88 `88.    88    
                                        `8888Y'    YP    YP   YP 88   YD    YP    
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Start the server
*/

const port = process.env.PORT //|| 3000;
app.listen(port, () => {
  LOG.thumbs(`The server has started on port ${port}`);
});
