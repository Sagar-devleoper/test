const mongoose = require("mongoose");

let ItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "user"
  },
  userName: {
    type: String
  },
  productId: {
    // type: mongoose.Schema.Types.ObjectId,
    type: mongoose.Schema.ObjectId,
    ref: "Product",
  },
  productName: {
    type: String,
  },
  productSeller: {
    type: mongoose.Schema.ObjectId,
    ref: "user"
  },
  bussinessOwner_id:{
    type:mongoose.Schema.ObjectId,
    ref: "BusinessOwner"
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity can not be less then 1.']
  },
  price: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true,
  }
}, {
  timestamps: true
})

const CartSchema = new mongoose.Schema(
  {
    items: [ItemSchema],
    // subQuantity: {
    //   type: Number,
    //   default: 0
    // },
    subTotal: {
      default: 0,
      type: Number
    },
    Coupon_Id : {
      type : mongoose.Schema.ObjectId,
      ref : "Coupon"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);