////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// Define Databases
/*
    This file contains basic database elements to be implemented into the application.
    If you have a different database setup than the default sqlite database, you should
    have a look at how database interactions are done here to see if they should be changed.
*/
require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
// Sequelize configuration
console.log(process.env.DB_FILE_PATH + ' is loaded.')
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_FILE_PATH
});

const crypto = require('crypto-js');
const SHA256 = require('crypto-js/sha256')
const bcrypt = require('bcrypt') // https://www.npmjs.com/package/bcrypt
const saltRounds = 10;

const { v4: uuidv4 } = require('uuid');
// const uniqueID = generateUUID();
function generateUUID() {
    return uuidv4();
}

function getNow() {
  return new Date().toLocaleString();
}

// DEFAULT SETTINGS for New Users
class UserAccount {
  constructor(user_uuid, user_hash) {
    this.account_uuid = user_uuid;
    this.account_enabled = true;
    this.account_hash = user_hash;
    this.account_authority = 0;
    this.account_level = 1;
    this.account_tokens = 50;
  }

  async GenerateAccount() {
    try {
      const new_account = await User.create({
        account_uuid: this.account_uuid,
        account_hash: this.account_hash,
        account_authority: this.account_authority,
        account_enabled: this.account_enabled,
        account_level: this.account_level,
        account_tokens: this.account_tokens
      })
      console.log('Account Generation:',this.account_uuid,this.account_hash)
    } catch (e) {
      console.log(e)
    }
  }

  // async CheckForPreload(this) {...}

}

// Define the User model
const User = sequelize.define('User', {
  // Account Unique ID; What will be used to login.
  account_uuid: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  // Hash is the encrypted pwd once the hash has been sent
  // to the server
  account_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // Authority dictates user, mod, or admin privileges
  account_authority: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  // Level
  account_level : {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  // Tokens are a currency
  account_tokens : {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  // If disabled, user is banned from the site.
  account_enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
});

const Matrix = sequelize.define('Matrix', {
  plot_uuid: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  // We'll keep using the hex format.
  plot_position: {
    type: DataTypes.STRING
  },
  // JSON squeeze
  // Blockchain-like. Extract array here.
  plot_JSON: {
    type: DataTypes.STRING,
    allowNull: false
  }
  // Ownership information and cost per plot is handled by the JSON squeeze.
})

function userdummy() {
    data = {};
    data.account_uuid = '00000000-0000-0000-0000-000000000000'//generateUUID();
    data.account_hash = 'no-hash';
    data.account_level = 1;
    data.account_tokens = 1;
    data.account_enabled = true;
    data.account_authority = 0;
    console.log(data)
}

async function user_by_uuid(user_uuid) {
    //if (!user_uuid) return udummy()
    account = await User.findOne({
        where: {
            account_uuid: user_uuid
        }
    })
    return account
}

const db_well = {
    async fetchUserByUUID(user_uuid) {
        return await user_by_uuid(user_uuid);
    },
    fetchUniqueUUID() {
        return generateUUID();
    },
    fetchSHA256(string_input) {
      return SHA256(string_input).toString();
    },
    fetchCrypt(string_to_crypt) {
      return bcrypt.hashSync(string_to_crypt, saltRounds);
    },
    compareCrypt(unencrypted_string, encrypted_string) {
      return bcrypt.compareSync(unencrypted_string, encrypted_string)
    },
    async InsertNewUser(user_uuid, user_hash) {
      const account = new UserAccount(user_uuid, user_hash)
      await account.GenerateAccount()
      console.log('👍 Generated Account',user_uuid)
      return account
    },
    async InsertAdminUser(admin_uuid, admin_pass) {
      try {
        const new_account = await User.create({
          account_uuid: admin_uuid,
          account_hash: bcrypt.hashSync(admin_pass, saltRounds),
          account_authority: 4,
          account_level: 100,
          account_tokens: 160
        })
      } catch (e) {
        console.log(e)
      }
    }
}

// This can be expanded later for read/write calls
// and keeps application.js simplified
module.exports = {
    User: User,
    Matrix: Matrix,
    Well: db_well
}