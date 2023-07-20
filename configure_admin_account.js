require('dotenv').config();
const {User, Well} = require('./database.js')

async function GenerateAdminAccount() {
    await User.sync()
    await Well.InsertAdminUser(process.env.ADMINUUID, process.env.ADMINPASS)
    const account = await Well.fetchUserByUUID(process.env.ADMINUUID)
    console.log('📣 UUID:',account.account_uuid)
    console.log('📣 Authority:',account.account_authority)
    console.log('📣 HASH:',account.account_hash)
}

GenerateAdminAccount()