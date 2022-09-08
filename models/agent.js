const mongoose = require('mongoose')

const agentSchema = new mongoose.Schema({
    agent_id: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'user'
    },
    income: {
        type: String
    },
    // dl_image: {
    //     type: String
    // },
    // id_image: {
    //     type: String
    // },
    // address: {
    //     type: Array
    // },
    feedbacks: {
        type: Array
    },
    last_active: {
        type: String
    },
    active_status: {
        type: String,
        enum: {
            values: ['idle', 'busy', 'inactive']
        }
    },
    dob: {
        type: String
    },
    vehicle_type: {
        type: String
    },
    vehicle_reg: {
        type: String
    },
    // images
    vehicleLicenceImage : {
        type : String
    },
    // images
    lat: {
        type: String
    },
    log: {
        type: String
    },
    service_radius: {
        type: String
    },
    verification: {
        type: String
    },
    location: {
        type: { type: String },
        coordinates: []
    },
    orders: {
        type: Array
    },
    bankName: {
        type: String
    },
    bankAccountNumber: {
        type: String
    },
    bankAccountHolderName: {
        type: String
    },
    bankCode: {
        type: String
    },
    
})

agentSchema.index({location:"2dsphere"})

module.exports = mongoose.model('agent', agentSchema)