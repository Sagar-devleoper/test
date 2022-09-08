const mongoose = require('mongoose')
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const orderSchema = new mongoose.Schema({
    address : {
        type : mongoose.Schema.ObjectId,
        ref : 'address'
    },
    // shippingInfo: {
    //     city: {
    //         type: String,
    //         require: true
    //     },
    //     phoneNo: {
    //         type: Number,
    //         require: true
    //     },
    //     postalCode: {
    //         type: Number,
    //         require: true
    //     },
    //     country: {
    //         type: String,
    //         require: true
    //     }
    // },
    cart: {
        type: Object
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    sellerBussinessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BusinessOwner'
    },
    // product: {
    //     product_id : {
    //         type : String,
    //     }
    //     // type: Array
    // },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    PurchasedDate: {
        type: Date,
        // default: Date.now()
    },
    payType: {
        type: String,
    },
    paymentInfo: {
        id: {
            type: String
        },
        status: {
            type: String
        },
    },
    ShippingPrice: {
        type: String,
        // require: true,
        default: 0.0
    },
    totalPrice: {
        type: Number,
        // require: true,
        default: 0.0
    },
    paidAt: {
        type: Date
    },
    productSell: {
        type: Number
    },
    taxPrice: {
        type: Number,
        // require: true,
        default: 0.0
    },
    orderStatus: {
        type: String,
        // require: true,
        default: "ordered",
    },
    deliveryAt: {
        type: Date,
        // require: true
    },
    

})


// const orderSchemaOfCart = new mongoose.Schema(
//     {
//       orders : [orderSchema],
//     },
//     { timestamps: true }
//   );
// orderSchema.plugin(AutoIncrement, { id: 'productSell_seq', inc_field: 'productSell' });
module.exports = mongoose.model('Order', orderSchema)