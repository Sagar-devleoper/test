const subCategorycontroller = require("../controllers/SubCategoryController")
const express = require("express")
const router = express.Router()

const { isAuthenticated } = require('../middleware/Auth')

const multer = require('multer')

const storage = multer.memoryStorage();
const uploadService = multer({
    storage: storage
});

router.post("/add/subcategory" , uploadService.fields([{
    name: 'image'
},
]) ,  subCategorycontroller.addSubCategory)

router.put("/update/subcategory/:id" , subCategorycontroller.UpdateSubCategory)

module.exports = router

