const express = require("express")
const router = express.Router()
const bussinessController = require("../controllers/bussinessControllr")
const { validatebussiness } = require("../middleware/userValidations")
const { isAuthenticated } = require('../middleware/Auth')
const multer = require('multer')


const storage = multer.memoryStorage();
const uploadService = multer({
    storage: storage
});


router.post("/add/bussiness", uploadService.fields([{
    name: 'bussinessLogo'
}, {
    name: 'bussinessImages'
}, {
    name: 'bannerImage'
}, {
    name: 'owneridproofurl'
}, {
    name: 'ownerImage'
}
]), isAuthenticated, bussinessController.addbussiness)


router.post("/add/image",
    uploadService.fields([{
        name: 'bussinessLogo'
    }
    ])
    , bussinessController.oneImage)

router.get("/get/bussiness", bussinessController.getBussiness)

router.get("/get/bussiness/:id", bussinessController.getBussinessById)

router.get("/get/bussiness/info/:id", bussinessController.getBussinessInfo)

router.put("/update/bussiness/:id", bussinessController.UpdateBussiness)

router.get("/get/bussinesswithoffer", bussinessController.findPromotedDeliveryPercentage)

router.get("/get/bestdeal", bussinessController.getBestDeal)

module.exports = router
