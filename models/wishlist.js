const mongoose = require("mongoose");

let wishlistSchema = new mongoose.Schema({
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
    default : 1,
    required: true,
    min: [1, 'Quantity can not be less then 1.']
  },
  price: {
    type: Number,
    default : 0,
    required: true
  },
  total: {
    type: Number,
    required: true,
  }
}, {
  timestamps: true
})

const wishSchema = new mongoose.Schema(
    {
      items: [wishlistSchema],
      // subQuantity: {
      //   type: Number,
      //   default: 0
      // },
      subTotal: {
        default: 0,
        type: Number
      },
    },
    { timestamps: true }
  );


module.exports = mongoose.model("wishlist", wishSchema);