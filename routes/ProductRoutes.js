const express = require('express')
const router = express.Router()
const ProductController = require('../controllers/productController')

const { isAuthenticated } = require('../middleware/Auth')

const multer = require('multer')

const storage = multer.memoryStorage();
const uploadService = multer({
    storage: storage
});

router.post("/add/product", uploadService.fields([{
    name: 'image'
}]), isAuthenticated,ProductController.addProduct)

router.get('/add/getproduct',isAuthenticated,ProductController.getProduct)

router.get('/all/products',ProductController.getallProduct)

router.get('/get/product/:id',isAuthenticated,ProductController.getProductById)

router.get('/get/productsofbussiness',isAuthenticated,ProductController.getAllProductOfBussinessOwnerAndUser)

router.post('/get/productfiltter',ProductController.productFiltter)

router.put('/update/product/:id',isAuthenticated,ProductController.UpdateProduct)

module.exports = router