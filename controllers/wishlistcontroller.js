const wishlist = require("../models/wishlist")

const Cart = require('../models/cart')
const Products = require('../models/Product')
const wishlistRepository = require('./repo/wishlistRepo')
const productRepository = require('./repo/productrepo')

exports.addWishList = async (req, res, next) => {
    let userName = req.user.name

    const quantity = Number.parseInt(1);

    try {
        let wish = await wishlistRepository.wishlistdata();
        let productDetails = await productRepository.productById(req.params.id);

        let productSeller = productDetails.user_id
        let bussinessOwner_id = productDetails.bussinessOwner_id
        // console.log(productDetails, productSeller, bussinessOwner_id, 'details')

        if (!productDetails) {
            return res.status(500).json({
                type: "Not Found",
                msg: "Invalid request"
            })
        }
        //--If Cart Exists ----
        if (wish) {
            console.log(wish,'cart')
            //---- check if index exists ----
            const indexFound = wish.items.findIndex(item => item.productId.id == req.params.id);
            //------this removes an item from the the cart if the quantity is set to zero,We can use this method to remove an item from the list  -------
            if (indexFound !== -1 && quantity <= 0) {
                wish.items.splice(indexFound, 1);
                if (wish.items.length == 0) {
                    // wish.subQuantity = 0
                    wish.subTotal = 0;
                 } 
                 //else {
                //     // wish.subQuantity = wish.items.map(item => item.quantity).reduce((acc, next) => acc + next)
                //     wish.subTotal = wish.items.map(item => item.total).reduce((acc, next) => acc + next);
                // }
            }
            //----------check if product exist,just add the previous quantity with the new quantity and update the total price-------
            else if (indexFound !== -1) {
                wish.items[indexFound].quantity = wish.items[indexFound].quantity + quantity;
                wish.items[indexFound].total = wish.items[indexFound].quantity * productDetails.Price;
                wish.items[indexFound].price = productDetails.Price
                wish.items[indexFound].commission = productDetails.commission

                // cart.subQuantity = cart.items.map(item => item.quantity).reduce((acc, next) => acc + next)
                // wish.subTotal = wish.items.map(item => item.total).reduce((acc, next) => acc + next);
            }
            //----Check if Quantity is Greater than 0 then add item to items Array ----
            else if (quantity > 0) {
                wish.items.push({
                    userId: req.user._id,
                    userName: userName,
                    productId: req.params.id,
                    commission: productDetails.commission,
                    quantity: quantity,
                    price: productDetails.Price,
                    seller: productDetails.seller,
                    productName: productDetails.name,
                    productSeller: productSeller,
                    bussinessOwner_id: bussinessOwner_id,
                    total: parseInt(productDetails.Price * quantity)
                })
                // cart.subQuantity = cart.items.map(item => item.quantity).reduce((acc, next) => acc + next)
                // wish.subTotal = wish.items.map(item => item.total).reduce((acc, next) => acc + next);


                // console.log(req.params.id , "this is product id");
            }
            // else if (quantity < 1) {

            // }
            //----if quantity of price is 0 throw the error -------
            else {
                // console.log(indexFound, quantity, 'cart')
                return res.status(400).json({
                    type: "Invalid ",
                    msg: "Invalid request !product doesnt exist in cart !"
                })
            }
            // console.log(cart, 'cart');
            let data = await wish.save();
            res.status(200).json({
                type: "success",
                mgs: "Process Successful",
                data: data
            })
        }
        //------------ if there is no user with a cart...it creates a new cart and then adds the item to the cart that has been created------------
        else {
            const wishData = {
                items: [{
                    userId: req.user._id,
                    userName: userName,
                    productId: req.params.id,
                    quantity: quantity,
                    commission: productDetails.commission,
                    total: parseInt(productDetails.Price * quantity),
                    price: productDetails.Price,
                    productName: productDetails.name,
                    productSeller: productSeller,
                    bussinessOwner_id: bussinessOwner_id,
                }],
                // subQuantity: parseInt(productDetails.quantity * quantity),
                // subTotal: parseInt(productDetails.Price * quantity)
            }
            // console.log(cartData, userName);
            wish = await wishlistRepository.addItem(wishData)
            // let data = await cart.save();
            // console.log(cart, 'cartData');
            res.json(wish);
        }
    } catch (err) {
        console.log(err)
        res.status(400).json({
            type: "Invalid",
            msg: "Something Went Wrong",
            err: err
        })
    }
}


exports.getWishlist = async (req, res) => {
    try{

        const findWishList = await wishlist.find({userId:req.user._id}).populate("items.userId").populate("items.bussinessOwner_id").populate('items.productId');

        if(!findWishList){
            res.status(400).json({
                success: true,
                msg: "Something Went Wrong",
            })
            return 
        }

        if(findWishList){
            res.status(200).json({
                success: true,
                message: "Wishlistfind",
                data : findWishList
            })
            return 
        }

    }catch (err){
        console.log(err)
        res.status(400).json({
            type: "Invalid",
            msg: "Something Went Wrong",
        })
    }
}


exports.UpdateWishList = async (req, res) => {
    try {
        const data = req.body;
        console.log(data)
        
        const findWishList = await wishlist.findById(req.params.id)
        

        if (!findWishList) {
            res.status(400).json({ 
                success : false, 
                error : "Not Find This Record" 
            })
            
            return
        }

        if (findWishList) {

            const updateWishList = await wishlist.findByIdAndUpdate(req.params.id ,  data  , {new : true})

            if (!updateWishList) {
                res.status(400).json({ 
                    success : false, 
                    error : "Unable To Update The Record" 
                })
                
                return
            }

            if (updateWishList) {
                res.status(200).json({ 
                    success : true, 
                    message : "Sub Category Is Updated" ,
                    data : updateWishList
                })
                
                return
            }
            
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ 
            success : false, 
            error : "Update WishList Is Not Possible" 
        })
    }
}




exports.deleteWishlist = async (req, res) => {
    try{

        const findWishList = await wishlist.findById(req.user._id);

        if(!findWishList){
            res.status(400).json({
                success: true,
                msg: "Something Went Wrong",
            })
            return 
        }

        if(findWishList){

            const deletewishlist = await wishlist.findByIdAndDelete(req.params.id)

            res.status(200).json({
                success: true,
                message: "Wishlist Delete",
                data : deletewishlist
            })
            return 
        }

    }catch (err){
        res.status(400).json({
            type: "Invalid",
            msg: "Something Went Wrong",
        })
    }
}