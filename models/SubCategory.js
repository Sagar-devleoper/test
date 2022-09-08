const mongoose = require('mongoose')

const subCategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    Category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category'
    },
})


module.exports = mongoose.model('SubCategory', subCategorySchema)