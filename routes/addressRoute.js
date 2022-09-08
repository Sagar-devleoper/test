const express = require("express")
const router = express()
const addressController = require("../controllers/addressController")
const { validateadmin } = require("../middleware/userValidations")
const { isAuthenticated } = require('../middleware/Auth')

router.post("/add/address"  ,addressController.addAddress)

router.get("/get/address" , isAuthenticated , addressController.getAddress)

router.get("/get/address/:id" , isAuthenticated , addressController.getAddressByUserId)

router.put("/update/address/:id" , isAuthenticated , addressController.UpdateAddress)

module.exports = router