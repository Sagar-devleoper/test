// get by id update and delete 

const Menu = require('../models/Menu')
const product = require('../models/Product')
const categorys = require('../models/Category')
const multer = require("multer")
const AWS = require('aws-sdk')
const config = require('../config/config')
// 
const BussinessOwner = require('../models/businessOwner')

const accessId = config.accessId
const secretKey = config.secretKey
const BUCKET_NAME = config.BUCKET_NAME
const q = require('q')
const { async } = require('q')

AWS.config.credentials = {
    accessKeyId: accessId,
    secretAccessKey: secretKey,
    region: "ap-south-1",
    ACL: "public-read",
}

AWS.config.region = "ap-south-1"

const s3 = new AWS.S3()

exports.addMenu = async (req, res) => {
    try {

        console.log(req.file, "req.file")

        let fileObject = [
            {
                key: req.files.Image[0].originalname,
                value: req.files.Image[0].buffer,
                filekey: 'Image'
            },
        ]
        let newupdateobject = await uploadMultipleFiles(fileObject).then(data => {
            console.log(data, '79')
            return data
        }).catch((err) => {
            console.log(err)
        })
        let Image

        newupdateobject && newupdateobject.map(m => {
            if (m.key === 'Image') {
                console.log(m.Location)
                Image = m.Location
                return m.Location
            }
        })

        console.log(req.user , "req.user")
        
        const findBussinessOwner = await BussinessOwner.findOne({ name : req.user._id})
        console.log(findBussinessOwner , "findBussinessOwner")

        const menu = await Menu.create({
            name: req.body.name,
            Image: Image,
            bussinessOwner_id: findBussinessOwner._id

            // SubCategory: req.body.SubCategory
        })
        await menu.save()
        res.status(200).json({
            success: true,
            message: "Menu saved sucessfull",
            data: menu
        })

    } catch (err) {
        console.log(err)
        res.status(200).json({
            success: false,
            message: "internall server error"
        })
    }
}




async function uploadMultipleFiles(fileObject) {
    console.log(fileObject, "fileobject")
    const deferred = q.defer();
    let s3response = []
    try {

        for (const file of fileObject) {
            const params = {
                Bucket: BUCKET_NAME,
                Key: file.key, // File name you want to save as in S3
                Body: file.value,
                ContentEncoding: 'base64',
                ContentType: 'image/jpeg'
            };
            const data = await s3.upload(params).promise()
            console.log(data, '54')
            s3response.push({

                key: file.filekey,
                fileName: data.key,
                Location: data.Location
            })
        }

    } catch (err) {
        console.log(err)
    }
    deferred.resolve(s3response)
    console.log(deferred, "deferred")
    return deferred.promise

}


exports.getMenu = async (req, res, next) => {
    try {
        console.log(req.user,'user')
        // const findBussineOWner = await BussinessOwner.findOne(req.user._id)
        // console.log(findBussineOWner._id, 'k')

        // const data = findBussineOWner._id
        // console.log(data,'kl')
        const findMenuOfCurrentUser = await Menu.find(req.user._id)
        // console.log(findMenuOfCurrentUser,'k')
        if (findMenuOfCurrentUser) {
            res.status(200).json({
                success: true,
                message: "menu of current BussineOwner found",
                data: findMenuOfCurrentUser
            })
            return
        }
        if (!findMenuOfCurrentUser) {
            res.status(400).json({
                success: false,
                message: "menu Cannot be found",
            })
            return
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            data: err,
            message: "Internal server error"
        })
    }
}


// get product according to the menu 

exports.getProductOfMenu = async (req, res) => {
    try {
        const findproduct = await product.find({menu : req.params.id}).populate('Catgeory').populate('subCatgeory').populate('subSubCatgeory')

        if (!findproduct) {
            res.status(400).json({
                success: false,
                data: err,
                message: "Not Able TO Find Products"
            })
            return
        }

        if (findproduct) {
            res.status(200).json({
                success: true,
                message: "Product Found",
                data: findproduct
            })
            return
        }
    } catch (error) {
        console.log(err)
        res.status(500).json({
            success: false,
            data: err,
            message: "Not Able TO get Products"
        })
    }
}



exports.getBussinessOwnerMenuAndProductAndCategory = async (req, res) => {
    try{
        const { bussiness_id } = req.body;
        let allmenuproduct = []
        let allmenucategory = []

        if(!bussiness_id){
            res.status(400).json({
                success: false,
                message: "Please Provide BussinessId"
            })    
            return
        }

        // const findBussiness = await BussinessOwner.findById(bussiness_id)

        const findMenu = await Menu.find({ bussinessOwner_id : bussiness_id })

        for (let i = 0; i < findMenu.length; i++) {
            const findProduct = await product.find({ menu : findMenu[i]._id}).populate("bussinessOwner_id").populate("user_id")
            allmenuproduct.push(findProduct)
        }
        
        // for (let i = 0; i < allmenuproduct.length; i++) {
        //     let data = allmenuproduct[i]
        //     for (let j = 0; j < data.length; j++) {
                // console.log(data[j].Catgeory.toString() , "data[j].Catgeory")

                // const findcategory = categorys.Category.find({ _id : data[j].Catgeory})
                // console.log(data[j])
                // console.log(findcategory , "findcategory")
        //         allmenucategory.push(findcategory)
        //     }
        // }
        // for (let i = 0; i < findMenu.length; i++) {
        //     allmenucategory.push(findcategory)
        // }
//         product = require('../models/Product')
// const category

        if(!findMenu){
            res.status(400).json({
                success: false,
                message: "menu is not found"
            })    
            return
        }
        
        if(findMenu){
            res.status(200).json({
                success: true,
                message: "menu is found",
                menu : findMenu,
                product : allmenuproduct,
                // category : allmenucategory
            })    
            return
        }

    }catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: "Cannot Get BussinessOwner Menu Product And Category"
        })
    }
}


exports.UpdateMenu = async (req, res) => {
    try {
        const data = req.body;
        console.log(data)
        
        const findMenu = await Menu.findById(req.params.id)
        

        if (!findMenu) {
            res.status(400).json({ 
                success : false, 
                error : "Not Find This Record" 
            })
            
            return
        }

        if (findMenu) {

            const updateMenu = await Menu.findByIdAndUpdate(req.params.id ,  data  , {new : true})

            if (!updateMenu) {
                res.status(400).json({ 
                    success : false, 
                    error : "Unable To Update The Record" 
                })
                
                return
            }

            if (updateMenu) {
                res.status(200).json({ 
                    success : true, 
                    message : "Menu Is Updated" ,
                    data : updateMenu
                })
                
                return
            }
            
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ 
            success : false, 
            error : "Update Menu Is Not Possible" 
        })
    }
}