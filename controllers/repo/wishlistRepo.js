const wishlist = require("../../models/wishlist");
const user = require('../../models/user')

exports.wishlistdata = async (req, res) => {
    const wishlists = await wishlist.find().populate({
        path: "items.productId",
        select: "productId name price total "
    });;
    return wishlists[0];
};

exports.addItem = async payload => {
    console.log(payload, 'payload');
    const newItem = await wishlist.create(payload);
    console.log(newItem, 'newItem');
    return newItem
}