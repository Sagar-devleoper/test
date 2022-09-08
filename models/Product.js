const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    name: {
        type: String,
    },
    Quantity: {
        type: Number
    },
    Price: {
        type: Number
    },
    image: {
        type: String
    },
    menu: {
        type: mongoose.Schema.ObjectId,
        ref: 'Menu'
    },
    Estimate: {
        type: String
    },
    Catgeory: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category'
    },
    subCatgeory: {
        type: mongoose.Schema.ObjectId,
        ref: 'SubCategory'
    },
    subSubCatgeory: {
        type: mongoose.Schema.ObjectId,
        ref: 'subsubCategory'
    },
    item_descriptions: {
        type: String
    },
    Inventory: {
        type: String
    },
    unlist: {
        type: Boolean,
        default: false
    },
    isFreeDelivery : {
        type : Boolean,
        default : false
    },
    percentageOff : {
        type : Number,
        default : 0
    },
    offPrice : {
        type : Number,
        default : 0
    },
    isPromoted : {
        type : Boolean,
        default : false
    },
    bussinessOwner_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'BusinessOwner'
    },
    user_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    },
    isFavourite : {
        type : Boolean,
        default : false
    }
})


module.exports = mongoose.model('Product', productSchema)