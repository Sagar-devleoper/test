const mongoose = require('mongoose')

const agentStatus = new mongoose.Schema({
    agent_id : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    lat : {
        type : Number
    },
    log : {
        type : Number
    },
    location: {
        type: { type: String },
        coordinates: []
    },
    address : {
        type : mongoose.Schema.ObjectId,
        ref : 'address'
    },
    bussiness_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "BusinessOwner"
    },
    user_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    },
    order_id : {
        type : mongoose.Schema.ObjectId,
        ref : "Order"
    },
    order_status : {
        type : String,
    }
})

agentStatus.index({location:"2dsphere"})
module.exports = mongoose.model('agentStatus',agentStatus)