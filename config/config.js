const dotenv = require("dotenv")
const path = require("path")
process.env.NODE_ENV = "test"

dotenv.config({path : path.join(__dirname , `../environment/.${process.env.NODE_ENV}.env` ) })

module.exports = {
    port : process.env.port,
    mongodburl : process.env.mongodburl,
    version:process.env.version,
    JWT:process.env.JWt,
    // 
    accessId: process.env.accessId,
    secretKey: process.env.secretKey,
    BUCKET_NAME: process.env.BUCKET_NAME,
}