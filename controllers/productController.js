// get by id and update and delete

const Product = require('../models/Product')
const multer = require("multer")
const AWS = require('aws-sdk')
const config = require('../config/config')

const accessId = config.accessId
const secretKey = config.secretKey
const BUCKET_NAME = config.BUCKET_NAME
const q = require('q')
const user = require('../models/user')
const { async } = require('q')
const businessOwner = require('../models/businessOwner')

AWS.config.credentials = {
    accessKeyId: accessId,
    secretAccessKey: secretKey,
    region: "ap-south-1",
    ACL: "public-read",
}

AWS.config.region = "ap-south-1"

const s3 = new AWS.S3()

exports.addProduct = async (req, res) => {
    try {
        console.log(req.file, req.body , req.user, "req.file")

        let fileObject = [
            {
                key: req.files.image[0].originalname,
                value: req.files.image[0].buffer,
                filekey: 'image'
            }
        ]
        let newupdateobject = await uploadMultipleFiles(fileObject).then(data => {
            console.log(data, '79')
            return data
        }).catch((err) => {
            console.log(err)
        })
        // 
        let image
        newupdateobject && newupdateobject.map(i => {
            if (i.key === 'image') {
                console.log(i.Location)
                image = i.Location
                return i.Location
            }
        })
        let calcoffprice = 0
        if (req.body.percentageOff > 0) {
            console.log(req.body.Price , req.body.percentageOff )
            calcoffprice = req.body.Price/req.body.percentageOff
            calcoffprice = req.body.Price - calcoffprice
            // console.log(typeof calcoffprice , calcoffprice)
        }

        const data = req.body
        const product = new Product({
            name: req.body.name,
            Quantity: req.body.Quantity,
            Price: req.body.Price,
            Estimate: req.body.Estimate,
            Catgeory: req.body.Catgeory,
            subCatgeory : req.body.subCatgeory,
            subSubCatgeory : req.body.subSubCatgeory,
            item_descriptions: req.body.item_descriptions,
            Inventory: req.body.Inventory,
            bussinessOwner_id: req.body.bussinessOwner_id,
            unlist: req.body.unlist,
            image: image,
            isFreeDelivery : req.body.isFreeDelivery,
            percentageOff : req.body.percentageOff,
            offPrice : calcoffprice,
            isPromoted : req.body.isPromoted,
            user_id: req.user._id,
            menu: req.body.menu,
            isFavourite : req.body.isFavourite
            // SubCategory: req.body.SubCategory
        })
        await product.save()
        res.status(200).json({
            success: true,
            message: "product added",
            data: product
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ message: "Something went wrong", err });
    }
}


// 


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

exports.getProduct = async (req, res, next) => {
    try {
        console.log(req.user._id)
        const findUser = await Product.find({ user_id: req.user._id })
        console.log(findUser, 'kl')
        if (findUser) {
            res.status(200).json({
                success: true,
                count: findUser.length,
                message: "product of current user",
                data: findUser,
            })
            return
        }
        res.status(400).json({
            message: "cannot find product",
            message: false
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "Something went wrong" });

    }
}

exports.getProductById = async (req, res, next) => {
    try {
        console.log(req.params.id)
        const findUser = await Product.findById(req.params.id).populate("menu").populate("Catgeory").populate("bussinessOwner_id").populate("user_id")
        console.log(findUser, 'kl')
        if (findUser) {
            res.status(200).json({
                success: true,
                count: findUser.length,
                message: "product of current user",
                data: findUser,
            })
            return
        }
        res.status(400).json({
            message: "cannot find product",
            message: false
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "Something went wrong" });

    }
}


exports.getallProduct = async (req, res) => {
    try {
        const AllProduct = await Product.find().populate('user_id').populate('bussinessOwner_id').populate('Catgeory').populate('menu')
        if (!AllProduct) {
            res.status(400).json({
                success: false,
                message: "internal server error"
            })
            return
        }
        if (AllProduct) {
            res.status(200).json({
                count: AllProduct.length,
                data: AllProduct,
                success: true,
                message: "data Found"
            })
            return
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: "something went wrong"
        })
    }
}


exports.getAllProductOfBussinessOwnerAndUser = async (req, res) => {
    try{
        const { id } = req.body;

        if(!id){
            res.status(400).json({
                success: false,
                message: "Please Provide BussinessId"
            })    
            return
        }

        const findProduct = await Product.find({ $or:[{bussinessOwner_id: id},{user_id: id}] }).populate("bussinessOwner_id").populate("user_id").populate("menu").populate("Catgeory")

        if(!findProduct){
            res.status(400).json({
                success: false,
                message: "Unable to find product"
            })    
            return
        }

        if(findProduct){
            res.status(200).json({
                success: true,
                message: "Product found",
                Product :findProduct
            })    
        }
    }catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: "All Product Of User And Bussines Owner Is Not Get"
        })
    }
}

exports.productFiltter = async (req, res) => {
    try{
        const { freeDelivery , isPromoted , high , percentageOff} = req.body;
        let value = high ? -1 : 1
        let percentage = percentageOff ? -1 : 1
        let freeDeliveryIsPromotedProduct , isPromotedProduct , freeDeliveryProduct
        if(freeDelivery === true && isPromoted === true){
            freeDeliveryIsPromotedProduct = await Product.find({ isFreeDelivery : true , isPromoted : true}).sort({Price: value}).where("percentageOff").gt(percentage).populate("bussinessOwner_id")
        }

        if(freeDelivery === true && isPromoted === false){
            freeDeliveryProduct = await Product.find({ isFreeDelivery : true , isPromoted : false}).sort({Price: value}).where("percentageOff").gt(percentage).populate("bussinessOwner_id")
        }

        if(isPromoted === true && freeDelivery === false){
            isPromotedProduct = await Product.find({ isPromoted : true , isFreeDelivery : false}).sort({Price: value}).where("percentageOff").gt(percentage).populate("bussinessOwner_id")
        }

        if (freeDelivery === true && isPromoted === true) {
            res.status(200).json({
                success: true,
                message: "All FreeDelivery And Promoted Product",
                productCount :  freeDeliveryIsPromotedProduct.length,
                product : freeDeliveryIsPromotedProduct
            })
            return
        }

        if (freeDelivery === true && isPromoted === false) {
            res.status(200).json({
                success: true,
                message: "All FreeDelivery",
                productCount :  freeDeliveryProduct.length,
                product : freeDeliveryProduct
            })
            return
        }

        if (isPromoted === true && freeDelivery === false) {
            res.status(200).json({
                success: true,
                message: "All Promoted Product",
                productCount :  isPromotedProduct.length,
                product : isPromotedProduct
            })
            return
        }
        
    }catch(err){
        console.log(err)
        res.status(500).json({
            success: false,
            message: "Unable to filtter"
        })
    }
}

exports.UpdateProduct = async (req, res) => {
    try {
        const data = req.body;
        console.log(data)
        
        const findProduct = await Product.findById(req.params.id)
        

        if (!findProduct) {
            res.status(400).json({ 
                success : false, 
                error : "Not Find This Record" 
            })
            
            return
        }

        if (findProduct) {

            const updateProduct = await Product.findByIdAndUpdate(req.params.id ,  data  , {new : true})

            if (!updateProduct) {
                res.status(400).json({ 
                    success : false, 
                    error : "Unable To Update The Record" 
                })
                
                return
            }

            if (updateProduct) {
                res.status(200).json({ 
                    success : true, 
                    message : "Product Is Updated" ,
                    data : updateProduct
                })
                
                return
            }
            
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ 
            success : false, 
            error : "Update Product Is Not Possible" 
        })
    }
}