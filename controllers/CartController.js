const Cart = require('../models/cart')
const Coupon = require("../models/coupon")
const Products = require('../models/Product')
const cartRepository = require('./repo/Repository')
const productRepository = require('./repo/productrepo')
// const { findById } = require('../models/products')

exports.addCart = async (req, res, next) => {
    // console.log('9', req.user._id)
    let userName = req.user.name
    console.log('88')

    // const {
    //     productId
    // } = req.body;
    // console.log(req.body, 'rew')
    const quantity = Number.parseInt(req.body.quantity);
    // const quantity = req.query.quantity
    try {

        let cart = await cartRepository.cart();
        let productDetails = await productRepository.productById(req.params.id);
        let productSeller = productDetails.user_id
        let bussinessOwner_id = productDetails.bussinessOwner_id
        console.log(productDetails, productSeller, bussinessOwner_id, 'details')

        if (!productDetails) {
            return res.status(500).json({
                type: "Not Found",
                msg: "Invalid request"
            })
        }
        //--If Cart Exists ----
        if (cart) {
            console.log(cart,'cart')
            //---- check if index exists ----
            const indexFound = cart.items.findIndex(item => item.productId.id == req.params.id);
            //------this removes an item from the the cart if the quantity is set to zero,We can use this method to remove an item from the list  -------
            if (indexFound !== -1 && quantity <= 0) {
                cart.items.splice(indexFound, 1);
                if (cart.items.length == 0) {
                    // cart.subQuantity = 0
                    cart.subTotal = 0;
                } else {
                    // cart.subQuantity = cart.items.map(item => item.quantity).reduce((acc, next) => acc + next)
                    cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
                    const findCoupon = await Coupon.findById(req.body.Coupon_Id)

                    if(!findCoupon){
                        res.status(400).json({
                            success: false,
                            msg: "unable To Find Coupon !"
                        })
                        return
                    }

                    if(findCoupon){
                        cart.subTotal = (cart.subTotal / findCoupon.percentageOff) * 100
                    }
                }
            }
            //----------check if product exist,just add the previous quantity with the new quantity and update the total price-------
            else if (indexFound !== -1) {
                cart.items[indexFound].quantity = cart.items[indexFound].quantity + quantity;
                cart.items[indexFound].total = cart.items[indexFound].quantity * productDetails.Price;
                cart.items[indexFound].price = productDetails.Price
                cart.items[indexFound].commission = productDetails.commission

                // cart.subQuantity = cart.items.map(item => item.quantity).reduce((acc, next) => acc + next)
                cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
                console.log(cart.subTotal , "cart.subTotal")
                const findCoupon = await Coupon.findById(req.body.Coupon_Id)

                if(!findCoupon){
                    res.status(400).json({
                        success: false,
                        msg: "unable To Find Coupon !"
                    })
                    return
                }

                if(findCoupon){
                    minitotal = (cart.subTotal / findCoupon.percentageOff)
                    cart.subTotal = cart.subTotal - minitotal
                }
            }
            //----Check if Quantity is Greater than 0 then add item to items Array ----
            else if (quantity > 0) {
                cart.items.push({
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
                cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);

                const findCoupon = await Coupon.findById(req.body.Coupon_Id)

                if(!findCoupon){
                    res.status(400).json({
                        success: false,
                        msg: "unable To Find Coupon !"
                    })
                    return
                }

                if(findCoupon){
                    cart.subTotal = (cart.subTotal / findCoupon.percentageOff) * 100
                }

                // console.log(req.params.id , "this is product id");
            }
            // else if (quantity < 1) {

            // }
            //----if quantity of price is 0 throw the error -------
            else {
                console.log(indexFound, quantity, 'cart')
                return res.status(400).json({
                    type: "Invalid ",
                    msg: "Invalid request !product doesnt exist in cart !"
                })
            }
            console.log(cart, 'cart');
            let data = await cart.save();
            res.status(200).json({
                type: "success",
                mgs: "Process Successful",
                data: data
            })
        }
        //------------ if there is no user with a cart...it creates a new cart and then adds the item to the cart that has been created------------
        else {
            const cartData = {
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
                subQuantity: parseInt(productDetails.quantity * quantity),
                subTotal: parseInt(productDetails.Price * quantity)
            }
            console.log(cartData, userName);
            cart = await cartRepository.addItem(cartData)
            // let data = await cart.save();
            console.log(cart, 'cartData');
            res.json(cart);
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

exports.getCart = async (req, res) => {
    try {
        let cart = await cartRepository.cart()
        if (!cart) {
            return res.status(400).json({
                type: "Invalid",
                msg: "Cart Not Found",
            })
        }
        console.log(cart);
        res.status(200).json({
            status: true,
            data: cart
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({
            type: "Invalid",
            msg: "Something Went Wrong",
            err: err
        })
    }
}

exports.getCartbymodel = async (req, res) => {
    try {
        console.log(req.user)
        let cart = await Cart.find({ userId : req.user._id}).populate("items.userId").populate("items.productId").populate("items.bussinessOwner_id")
        if (!cart) {
            return res.status(400).json({
                type: "Invalid",
                msg: "Cart Not Found",
            })
        }
        console.log(cart);
        res.status(200).json({
            status: true,
            data: cart
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({
            type: "Invalid",
            msg: "Something Went Wrong",
            err: err
        })
    }
}
// update 

exports.changeQuantity = async (req, res) => {
    const quantity = Number.parseInt(req.body.quantity);
    try {
        let cart = await cartRepository.cart();
        let productDetails = await productRepository.productById(req.params.id);
        console.log(productDetails, 'klk')
        if (!productDetails) {
            return res.status(500).json({
                type: "Not Found",
                msg: "Invalid request"
            })
        }
        // let data
        if (cart) {
            const indexFound = cart.items.findIndex(item => item.productId.id == req.params.id);
            console.log(indexFound, 'klk')
            cart.items[indexFound].quantity = cart.items[indexFound].quantity + quantity;
            cart.items[indexFound].total = cart.items[indexFound].quantity * productDetails.price;
            cart.items[indexFound].price = productDetails.price
            // cart.items[indexFound].commission = productDetails.commission

            // cart.subQuantity = cart.items.map(item => item.quantity).reduce((acc, next) => acc + next)
            cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);

            let data = await cart.save();
            res.status(200).json({
                type: "success",
                mgs: "Process Successful",
                data: data
            })
        }

    } catch (err) {
        res.status(400).json({ message: "Something went wrong" })
        console.log(err)
    }
}

// empty cart

exports.emptyCart = async (req, res) => {
    try {
        let cart = await cartRepository.cart();

        cart.items = [];
        cart.subTotal = 0
        let data = await cart.save();
        res.status(200).json({
            type: "success",
            mgs: "Cart Has been emptied",
            data: data
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({
            type: "Invalid",
            msg: "Something Went Wrong",
            err: err
        })
    }
}


exports.deletebyId = async (req, res) => {
    try {
        const findcart = await Cart.findById(req.params.id)
        if (!findcart) {
            res.status(400).json({ message: "cart does not exist" })
            return;
        }

        let cartitems = findcart.items.map(function (item) {
            return item.id
        })
        console.log(cartitems[0])
        cartitems = req.body.cartitem
        console.log(cartitems)
        const deleteid = await Cart.findById(cartitems)
        console.log(deleteid);
        res.status(200).json({ message: "cart items delete", deleteid })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "something went wrong !!!", err })
    }
}

exports.UpdateCart = async (req, res) => {
    try {
        const data = req.body;
        console.log(data)
        
        const findCart = await Cart.findById(req.params.id)
        console.log(findCart.subTotal)
        

        if (!findCart) {
            res.status(400).json({ 
                success : false, 
                error : "Not Find This Record" 
            })
            
            return
        }

        if (findCart) {

            const updateCart = await Cart.findByIdAndUpdate(req.params.id ,  data  , {new : true})

            if (!updateCart) {
                res.status(400).json({ 
                    success : false, 
                    error : "Unable To Update The Record" 
                })
                
                return
            }

            if (updateCart) {
                res.status(200).json({ 
                    success : true, 
                    message : "Cart Is Updated" ,
                    data : updateCart
                })
                
                return
            }
            
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ 
            success : false, 
            error : "Update Agent Is Not Possible" 
        })
    }
}