const express = require("express")
const router = express.Router()
const orderController = require("../controllers/orderController")
const { isAuthenticated, authorizeRoles } = require('../middleware/Auth')

router.post("/add/order" , isAuthenticated , orderController.newOrder)

router.put("/update/orderstatus/:id" , isAuthenticated , orderController.updateStatus)

router.get("/get/order/" , isAuthenticated ,orderController.getorderbyId)

// allorder
router.get('/get/allorder' ,authorizeRoles('admin'), orderController.getorders)

router.post('/get/allorderdate', isAuthenticated, orderController.showOrderDate)

// user order
router.get('/my/order',isAuthenticated,orderController.myOrder)

module.exports = router
