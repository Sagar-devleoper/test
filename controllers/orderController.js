// delete is not done for order

const Order = require('../models/order')
const Cart = require('../models/cart')
const Coupon = require("../models/coupon")
const Products = require('../models/Product')
const user = require('../models/user')
const catchasync = require("../middleware/catchAsyncErrors");
const { async } = require('q');
// const sendEmail = require('../');

exports.newOrder = catchasync(async (req, res) => {
    try {
        const {
            cart,
            address,
            // shippingInfo,
            totalPrice,
            ShippingPrice,
            taxPrice,
            itemPrices,
            paymentInfo,
            product,
            PurchasedDate,
            seller,
            payType,
            orderStatus,
            Coupon_Id
        } = req.body
        console.log(req.body)
        let cartData = req.body.cart
        const userDetails = req.user._id

        let itemsData
        console.log(userDetails, cartData, "userdetaile")
        const findSellerData = await Cart.find({ productSeller: cartData })
        findSellerData && findSellerData.map((i) => {
            console.log(i.items, 'l')
            itemsData = i.items
        })
        // console.log(findSellerData, itemsData, 'kl')

        let user_id
        let bussinessName
        itemsData && itemsData.map((j) => {
            user_id = j.productSeller
            bussinessName = j.bussinessOwner_id
        })
        // console.log(user_id , "userid")


        // find cart 

        const findcart = await Cart.findById(cart);

        if(findcart){

                const order = await Order.create({
                cart : findcart,
                address,
                // shippingInfo,
                totalPrice,
                ShippingPrice,
                taxPrice,
                itemPrices,
                paymentInfo,
                product,
                seller: user_id,
                sellerBussinessId: bussinessName,
                payType,
                paidAt: Date.now(),
                PurchasedDate: PurchasedDate,
                user: req.user._id,
                orderStatus
            })
            if (order) {
                res.status(200).json({ message: "order placed sucessfully", order })
                return
            }
        }else{
            res.status(400).json({
                status : false,
                message: "cannot find cart by id" 
            })
            return
        }


    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Something went Wrong" })
    }
})

// getsingleorder for logged in user

exports.getSingleOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('cart').populate('user')
        if (!order) {
            res.status(400).json({ message: "order not found" })
            return;
        }
        res.status(200).json({ message: "Order found", order })
    } catch (err) {
        res.status(401).json({ message: "something went wrong" })
    }
}

// get all
exports.allOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user').populate('cart').sort({ 'PurchasedDate': -1 })
        let totalPrice = 0;
        orders.forEach(Order => {
            totalPrice += Order.totalPrice
        })
        let data
        // console.log(orders, 'kk')
        // orders && orders.map((i) => {
        //     // console.log(i.cart.items, ';;l')
        //     i.cart.items && i.cart.items.map(async(j) => {
        //         console.log(j.productId, 'klj')
        //         data = j.productId
        //     })
        // })
        // const product = await products.findById(data)
        // orders.push(product)
        // // console.log(i.cart.items,'klk')
        // let orderData = []
        // orderData.push(orders)
        // console.log(orderData);
        if (orders) {
            res.status(200).json({ message: "Order fornd", orders, totalPrice })
            return;
        }

    } catch (err) {
        console.log(err)
        res.status(400).json({ message: "order not found" })
    }
}

// update status

exports.updateStatus = async (req, res) => {
    try {
        const updateOrder = await Order.findById(req.params.id)

        const getOrder = await user.findById(updateOrder.user)
        // console.log(getOrder)
        // let Email = getOrder.Email
        // console.log(Email)
        if (updateOrder) {
            const updateData = {
                // commsionPaid: req.body.commsionPaid,
                // shippingInfo: req.body.shippingInfo,
                orderStatus: req.body.orderStatus
            }
            // console.log(updateData);
            const ordered = await Order.findByIdAndUpdate(req.params.id, updateData, {
                new: true,
                runValidators: true,
                useFindAndModify: false
            })
            // console.log(ordered)
            // if (ordered) {
            //     const message = `
            //     your order has been ${req.body.orderStatus} with order Id ${ordered._id} 

            //     please feel to connect us`
            //     console.log(message)

            //     await sendEmail({
            //         email: Email,
            //         subject: "Your order Status  ",
            //         message
            //     })
            //     console.log(Email, 'emal')
            // res.status(200).json({ message: "Succed", ordered })
            res.status(200).json({ mesage: "order update sucessfully", ordered })
            // return;
            // }
            return;
        }
    } catch (err) {
        res.status(400).json({ message: "error while sending email", err })
    }
}


exports.getorders = async (req, res) => {
    try {
        // console.log(req, "req")

        const findorder = await Order.find().populate("seller").populate("sellerBussinessId").populate("user")

        if (!findorder) {
            res.status(400).json({ message: "error getting error" })
            // console.log(err)
            return
        }

        if (findorder) {
            res.status(200).json({ message: "order found",count:findorder.length, findorder })
            return
        }
    } catch (error) {
        res.status(400).json({ message: "error getting error", error })
    }
}

// bussiness owner

exports.getorderbyId = async (req, res) => {
    const userId = req.user._id
    console.log(userId, '192')
    try {
        const findBussinessOrder = await Order.find({ seller: req.user._id }).populate('sellerBussinessId').populate('seller').populate('cart')
        // console.log(findBussinessOrder, 'll')

        if (!findBussinessOrder) {
            res.status(400).json({
                success: false,
                mesage: "cannt find order for this bussiness owner"
            })
            return
        }
        res.status(200).json({
            success: true,
            count: findBussinessOrder.length,
            message: "data found for this bussiness",
            data: findBussinessOrder
        })
    } catch (Err) {
        console.log(Err)
        res.status(400).json({ message: "error getting error", Err })

    }
}

exports.showOrderDate = async (req, res) => {

    try {
        const { way } = req.body
        let orderArr


        const findOrder = await Order.find().populate("cart").populate("address").populate("seller").populate("sellerBussinessId").populate("user")

        if (!findOrder) {
            res.status(400).json({
                success: false,
                error: "Unable to find order"
            })
            return
        }

        if (findOrder) {
            if (way == "Daily") {
                let currentdate = new Date().getDate()
                let currentmonth = new Date().getMonth()
                let currentyear = new Date().getFullYear()
                // console.log(currentdate, "currentdate")

                orderArr = findOrder && findOrder.filter((ele) => {
                    let orderdate = new Date(ele.PurchasedDate).getDate()
                    let ordermonth = new Date(ele.PurchasedDate).getMonth()
                    let orderyear = new Date(ele.PurchasedDate).getFullYear()
                    // console.log(orderdate, "orderdate")
                    if (orderdate === currentdate && currentmonth === currentmonth && currentyear === orderyear) {
                        return ele
                    }
                })
            }

            if (way == "Weekly") {
                let date = new Date()
                let currentdate = new Date().getDate()
                // let currentmonth = new Date().getMonth()
                let currentyear = new Date().getFullYear()
                let previousdaydate = new Date(`${(date.getMonth()) + "/" + (currentdate - 7) + "/" + date.getFullYear()}`).getDate()
                // let previousdaymonth = new Date(`${(date.getMonth()) + "/" + (currentdate-7) + "/" + date.getFullYear()}`).getMonth()
                let previousdayyear = new Date(`${(date.getMonth()) + "/" + (currentdate - 7) + "/" + date.getFullYear()}`).getFullYear()
                // console.log(previousdaydate, "previousdaydate")
                // console.log(currentdate, "currentdate")

                orderArr = findOrder && findOrder.filter((ele) => {
                    let orderdate = new Date(ele.PurchasedDate).getDate()
                    let orderyear = new Date(ele.PurchasedDate).getFullYear()
                    // console.log(orderdate, "orderdate")
                    if ((orderdate > previousdaydate && (orderdate == currentdate || orderdate < currentdate)) &&
                        (orderyear == currentyear)) {
                        return ele
                    }
                })
            }

            if (way == "Monthly") {
                let currentMonth = new Date().getMonth()
                let currentyear = new Date().getFullYear()
                // console.log(currentMonth, "currentMonth")

                orderArr = findOrder && findOrder.filter((ele) => {
                    let orderMonth = new Date(ele.PurchasedDate).getMonth()
                    let orderYear = new Date(ele.PurchasedDate).getFullYear()
                    // console.log(orderMonth, "orderMonth")
                    if (orderMonth === currentMonth && currentyear === orderYear) {
                        return ele
                    }
                })
            }

            if (way == "Dates") {
                let fromdate = new Date(req.body.from)
                let fromday = fromdate.getDate()
                let frommonth = fromdate.getMonth()
                let fromyear = fromdate.getFullYear()
                let todate = new Date(req.body.to)
                let today = todate.getDate()
                let tomonth = todate.getMonth()
                let toyear = todate.getFullYear()
                // console.log(fromdate, "fromdate")
                // console.log(todate, "todate")
                // console.log(today, "today", tomonth, "tomonth", toyear, "toyear")

                orderArr = findOrder && findOrder.filter((ele) => {
                    let orderDay = new Date(ele.PurchasedDate).getDate()
                    let orderMonth = new Date(ele.PurchasedDate).getMonth()
                    let orderYear = new Date(ele.PurchasedDate).getFullYear()
                    // console.log(orderMonth , "orderMonth")

                    // ((orderMonth > frommonth || orderMonth == frommonth) && (orderMonth < tomonth || orderMonth == tomonth)) &&
                    // ((orderYear > fromyear || orderYear == fromyear) && (orderYear < toyear || orderYear == toyear))
                    // if( ((orderDay > fromday || orderDay == fromday) && (orderDay < today || orderDay == today)) &&
                    // ((orderMonth > frommonth || orderMonth == frommonth) && (orderMonth < tomonth || orderMonth == tomonth)) &&
                    // ((orderYear > fromyear || orderYear == fromyear) && (orderYear < toyear || orderYear == toyear))){
                    //     return ele
                    // }
                    if ((orderDay >= fromday && orderDay <= today) && (orderMonth >= frommonth && orderMonth <= tomonth) &&
                        (orderYear >= fromyear && orderYear <= toyear)) {
                        return ele
                    }
                })
            }

            let ordered = orderArr && orderArr.filter((ele) => {
                if (ele.orderStatus === "ordered") {
                    return ele
                }
            })

            //             neworder = status ordered
            // ongoing = status accept
            // reject = status reject
            // intransist = status intransist
            // completedd = status delivered
            let accept = orderArr && orderArr.filter((ele) => {
                if (ele.orderStatus === "accept") {
                    return ele
                }
            })


            let reject = orderArr && orderArr.filter((ele) => {
                if (ele.orderStatus === "reject") {
                    return ele
                }
            })

            let intransist = orderArr && orderArr.filter((ele) => {
                if (ele.orderStatus === "intransist") {
                    return ele
                }
            })

            let delivered = orderArr && orderArr.filter((ele) => {
                if (ele.orderStatus === "delivered") {
                    return ele
                }
            })


            console.log(findOrder, "findOrder")
            res.status(200).json({
                success: true,
                message: "Order Get Succesfully",
                // orderArr : orderArr,
                // length : orderArr.length,
                totalorderLength : findOrder.length,
                orderlength: ordered.length,
                acceptlength: accept.length,
                rejectlength: reject.length,
                intransistlength: intransist.length,
                deliveredlength: delivered.length,
                ordered: ordered,
                accept: accept,
                reject: reject,
                intransist: intransist,
                delivered: delivered,

            })
            return
        }



    } catch (err) {
        console.log(err)
        res.status(400).json({
            success: false,
            message: "Order Not Get Succesfully",
        })
    }
}

// end of bussines owner

// my order for user

exports.myOrder = async (req, res) => {
    try {
        console.log(req.user,'405')
        const getOrderData = await Order.find({ user: req.user._id }).populate('sellerBussinessId').populate('seller').populate('cart').populate('user')
        if (!getOrderData) {
            res.status(400).json({
                success: false,
                message: "order for current user not found",
            })
            return
        }

        if (getOrderData) {
            res.status(200).json({
                success: true,
                message: "order data for current user",
                data: getOrderData
            })
            return
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "internal server error",
            err: err
        })
    }
}