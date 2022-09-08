const express = require("express")
const router = express.Router()
const cartController = require("../controllers/CartController")
const { isAuthenticated } = require('../middleware/Auth')


router.post("/add/cart/:id" , isAuthenticated , cartController.addCart)

router.get('/get/cart',isAuthenticated , cartController.getCartbymodel)

router.put('/update/cart/:id',isAuthenticated , cartController.UpdateCart)

module.exports = router
