const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    icon: {
        type:String
    },
    // subCategorydataL: {
    //     name: {
    //         type: String
    //     },
    //     SubCategoryId: {
    //         type: String
    //     }

    // },
})


module.exports.Category = mongoose.model('Category', categorySchema)