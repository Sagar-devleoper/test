const Cart = require("../../models/cart");
const user = require('../../models/user')

// {user:req.user._id}
exports.cart = async (req, res) => {
    // console.log(req.user._id)
    // console.log(req.user._id)
    const carts = await Cart.find().populate({
        path: "items.productId",
        select: "productId name price total "
    });;
    return carts[0];
};

exports.addItem = async payload => {
    console.log(payload, 'payload');
    const newItem = await Cart.create(payload);
    console.log(newItem, 'newItem');
    return newItem
}