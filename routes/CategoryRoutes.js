const express = require('express')
const router = express.Router()
const CategoryController = require('../controllers/CatgeoryController')

const { isAuthenticated, authorizeRoles } = require('../middleware/Auth')

const multer = require('multer')

const storage = multer.memoryStorage();
const uploadService = multer({
    storage: storage
});



router.post('/add/category', uploadService.fields([{
    name: 'icon'
},
]), isAuthenticated,CategoryController.addCategory)


router.get('/get/category',authorizeRoles('admin'),CategoryController.getCategory)

router.get('/category/:id', CategoryController.getCategoryById)

router.post('/get/productOfcategory', CategoryController.findProductOfCategory)

router.put('/update/category/:id', CategoryController.UpdateCategory)



module.exports = router