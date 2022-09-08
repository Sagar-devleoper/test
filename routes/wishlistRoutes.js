const express = require("express")
const router = express.Router()
const wishlistcontroller = require("../controllers/wishlistcontroller")
const { isAuthenticated } = require('../middleware/Auth')

router.post("/add/wishlist/:id" , isAuthenticated , wishlistcontroller.addWishList)

router.get("/get/wishlist" , isAuthenticated , wishlistcontroller.getWishlist)

router.put("/update/wishlist/:id" , isAuthenticated , wishlistcontroller.UpdateWishList)
router.delete("/delete/wishlist/:id" , isAuthenticated , wishlistcontroller.deleteWishlist)

module.exports = router