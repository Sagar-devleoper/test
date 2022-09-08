const express = require("express")
const route = express.Router()
const CouponController = require("../controllers/couponController")
const { isAuthenticated } = require("../middleware/Auth")


route.post("/add/coupon" ,isAuthenticated, CouponController.GenerateCouponCode)

route.get('/get/coupon',isAuthenticated,CouponController.getCoupon)
// apply coupen api
route.put("/use/coupon/" , isAuthenticated , CouponController.ApplyCoupenCode)

route.put("/update/coupon/:id" , isAuthenticated , CouponController.UpdateCoupon)

module.exports = route