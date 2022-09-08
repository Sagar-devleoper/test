const express = require('express')
const router = express.Router()
const MenuController = require('../controllers/MenuController')

const { isAuthenticated } = require('../middleware/Auth')

const multer = require('multer')

const storage = multer.memoryStorage();
const uploadService = multer({
    storage: storage
});


router.post('/add/menu', uploadService.fields([{
    name: 'Image'
},
]), isAuthenticated,MenuController.addMenu)

router.get("/menu",isAuthenticated,MenuController.getMenu)

router.get("/get/menuproduct/:id",isAuthenticated,MenuController.getProductOfMenu)

router.get("/get/bussinessmenuproduct/",isAuthenticated,MenuController.getBussinessOwnerMenuAndProductAndCategory)

router.put("/update/menu/:id",isAuthenticated,MenuController.UpdateMenu)


module.exports = router