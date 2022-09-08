const mongoose = require("mongoose")

const address = mongoose.Schema({
    user : {
        type : mongoose.Schema.ObjectId,
        ref : "user"
    },
    town : {
        type : String ,
        require : true
    },
    neighbouhood : {
        type : String
    },
    area : {
        type : String
    },
    placeName : {
        type : String
    },
    otherDescription : {
        type : String
    },
    saveAddressAs : {
        type : String
    },
    lat : {
        type : Number
    },
    log : {
        type : Number
    },
})

module.exports = mongoose.model("address" , address)