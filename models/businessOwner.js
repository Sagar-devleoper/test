const mongoose = require('mongoose')

const BusinessOwnerSchema = mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.ObjectId,
        // type : String,
        required: true,
        ref: 'user'
    },
    ownerName: {
        type: String
    },
    ownerEmail: {
        type: String
    },
    ownerImages: {
        type: String
    },
    dateOfBirth: {
        type: String
    },
    storeName: {
        type: String
    },
    bussinessName: {
        type: String
    },
    bussinessLegalName: {
        type: String
    },
    bussinessEmailId: {
        type: String
    },
    bussinessWebsite: {
        type: String
    },
    bussinessNIF: {
        type: String
    },
    bussinessType: {
        type: String
    },
    bussinessServices: {
        type: String
    },
    bussinessLandlineNumber: {
        type: String
    },
    bussinessMobileNumber: {
        type: String
    },
    Number: {
        type: Number
    },
    rating: {
        type: Number,
        max: 5
    },
    openingTime: {
        type: String
    },
    closingTime: {
        type: String
    },
    range: {
        type: String
    },
    workSince: {
        type: String
    },
    designation: {
        type: String
    },
    merchant_type: {
        type: String,
        enum: {
            values: ['Localbusiness', 'RegionalFranchise', 'LiquorStore', 'pharmacy', 'market', 'resturanat']
        }
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
    currentAddress: {
        type: String
    },
    lat: {
        type: Number
    },
    log: {
        type: Number
    },
    location: {
        type: { type: String },
        coordinates: []
    },
    bussinessDescriptions: {
        type: String
    },
    // {bussinessLogoStatus , bussinessImagesStatus , bannerImageStatus , owneridproofurlStatus , ownerImageStatus }
    //  bussiness logo
    bussinessLogo: {
        type: String
    },
    bussinessLogoStatus: {
        type: Boolean,
        default: false
    },
    //  bussiness image
    bussinessImages: {
        type: String
    },
    bussinessImagesStatus: {
        type: Boolean,
        default: false
    },

    //  banner image
    bannerImage: {
        type: String
    },
    bannerImageStatus: {
        type: Boolean,
        default: false
    },
    //  owner id proof
    owneridproofurl: {
        type: String
    },

    owneridproofurlStatus: {
        type: Boolean,
        default: false
    },
    // owner image 
    ownerImage: {
        type: String
    },
    ownerImageStatus: {
        type: Boolean,
        default: false
    },
    // 
    isactive: {
        type: Boolean,
        default: false
    },
    isPromoted: {
        type: Boolean,
        default: false
    }
})

BusinessOwnerSchema.index({location:"2dsphere"})
module.exports = mongoose.model('BusinessOwner', BusinessOwnerSchema)