const mongoose = require('mongoose')

const menuSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    Image: {
        type: String
    },
    bussinessOwner_id: {
        type: mongoose.Schema.ObjectId,
        // ref: 'Menu'
        ref: 'BusinessOwner'
    }
})

module.exports = mongoose.model('Menu', menuSchema)