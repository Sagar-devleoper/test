const mongoose = require('mongoose')

const subSubCategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    subCategory: {
        type: mongoose.Schema.ObjectId,
        ref: 'SubCategory'
    },
})


module.exports = mongoose.model('subsubCategory', subSubCategorySchema)