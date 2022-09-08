const subsubCategorycontroller = require("../controllers/subsubCategory")
const express = require("express")
const router = express.Router()

const { isAuthenticated } = require('../middleware/Auth')

const multer = require('multer')

const storage = multer.memoryStorage();
const uploadService = multer({
    storage: storage
});

router.post("/add/subsubcategory" , uploadService.fields([{
    name: 'image'
},
]) ,  subsubCategorycontroller.addSubSubCategory)

router.put("/update/subsubcategory/:id" , subsubCategorycontroller.UpdateSubCategory)

module.exports = router

