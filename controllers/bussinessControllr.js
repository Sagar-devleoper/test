// update and delete is not done

const express = require("express")
const BusinessOwner = require('../models/businessOwner')
const product = require("../models/Product")
const menu = require("../models/Menu")
const Category = require("../models/Category")
const Coupon = require("../models/coupon")
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const AWS = require("aws-sdk")
const fs = require("fs")
const config = require('../config/config')

const multer = require("multer")

const accessId = config.accessId
const secretKey = config.secretKey
const BUCKET_NAME = config.BUCKET_NAME
const q = require('q')

AWS.config.credentials = {
    accessKeyId: accessId,
    secretAccessKey: secretKey,
    region: "ap-south-1",
    ACL: "public-read",
}

AWS.config.region = "ap-south-1"

const s3 = new AWS.S3()

exports.addbussiness = catchAsyncErrors(async (req, res) => {
    try {
        console.log(req.file, "req.file")
        // bussinessImage = req.file.path
        // const finduser = await BusinessOwner.findOne({ name: req.body.name });

        console.log(req.file)
        // const finduser = await BusinessOwner.findOne({ name: req.body.name });

        // if (finduser) {

        //     res.status(400).json({
        //         success: false,
        //         message: 'cannot create ',
        //     })
        //     return
        // }

        let fileObject = [
            {
                key: req.files.bussinessLogo[0].originalname,
                value: req.files.bussinessLogo[0].buffer,
                filekey: 'bussinessLogo'
            },
            {
                key: req.files.bussinessImages[0].originalname,
                value: req.files.bussinessImages[0].buffer,
                filekey: 'bussinessImages'
            },
            {
                key: req.files.bannerImage[0].originalname,
                value: req.files.bannerImage[0].buffer,
                filekey: 'bannerImage'
            },
            {
                key: req.files.owneridproofurl[0].originalname,
                value: req.files.owneridproofurl[0].buffer,
                filekey: 'owneridproofurl'
            },
            {
                key: req.files.ownerImage[0].originalname,
                value: req.files.ownerImage[0].buffer,
                filekey: 'ownerImage'
            }
        ]
        // let FileNameSplit = [
        //     {
        //         "bussinessLogo": req.files.bussinessLogo[0].originalname,
        //         "bussinessImages": req.files.bussinessImages[0].originalname,
        //         "bannerImage": req.files.bannerImage[0].originalname,
        //         'owneridproofurl': req.files.owneridproofurl[0].originalname,
        //         'ownerImage': req.files.ownerImage[0].originalname,
        //     }
        // ]
        // console.log(FileNameSplit, fileObject)





        let newupdateobject = await uploadMultipleFiles(fileObject).then(data => {
            // console.log(data, '79')
            return data
        }).catch((err) => {
            console.log(err)
        })
        // console.log(newupdateobject, '77')

        let ownerImage, owneridproofurl, bannerImage, bussinessLogo

        newupdateobject && newupdateobject.map(m => {
            if (m.key === 'owneridproofurl') {
                // console.log(m.Location)
                owneridproofurl = m.Location
                return m.Location
            }

            if (m.key === 'ownerImage') {
                // console.log(m.Location, ';owner')
                ownerImage = m.Location
                return m.Location
            }

            if (m.key === 'bannerImage') {
                // console.log(m.Location, ';bannerImage')
                bannerImage = m.Location
                return m.Location
            }

            if (m.key === 'bussinessImages') {
                // console.log(m.Location, ';bussinessImages')
                bussinessImages = m.Location
                return m.Location
            }

            if (m.key === 'bussinessLogo') {
                // console.log(m.Location, ';bussinessLogo')
                bussinessLogo = m.Location
                return m.Location
            }
        })

        // console.log(ownerImage, owneridproofurl, bannerImage, bussinessLogo, '87',)
        // clear

        const finduserinBussiness = await BusinessOwner.findOne({ name: req.body.name })
        console.log(finduserinBussiness, "finduserinbussiness")
        if (finduserinBussiness) {
            res.status(400).json({
                success: false,
                message: 'Bussiness Owner With This Id Is Already Exist',
            })
            return
        }

        const createOwner = await BusinessOwner.create({

            name: req.body.name,
            ownerName: req.body.ownerName,
            ownerEmail: req.body.ownerEmail,
            // dateOfBirth: req.body.dateOfBirth,
            storeName: req.body.storeName,
            bussinessName: req.body.bussinessName,
            lName: req.body.lName,
            lat: req.body.lat,
            log: req.body.log,
            location:{
                type:"Point",
                coordinates:[parseFloat(req.body.log),parseFloat(req.body.lat)]
            },
            bussinessEmailId: req.body.bussinessEmailId,
            bussinessWebsite: req.body.bussinessWebsite,
            bussinessNIF: req.body.bussinessNIF,
            bussinessType: req.body.bussinessType,
            bussinessServices: req.body.bussinessServices,
            bussinessLandlineNumber: req.body.bussinessLandlineNumber,
            bussinessMobileNumber: req.body.bussinessMobileNumber,
            openingTime: req.body.openingTime,
            closingTime: req.body.closingTime,
            range: req.body.range,
            workSince: req.body.workSince,
            designation: req.body.designation,
            merchant_type: req.body.merchant_type,
            bankName: req.body.bankName,
            bankAccountNumber: req.body.bankAccountNumber,
            bankAccountHolderName: req.body.bankAccountHolderName,
            bankCode: req.body.bankCode,
            currentAddress: req.body.currentAddress,
            isactive: req.body.isactive,
            isPromoted: req.body.isPromoted,
            // images
            bussinessLogo: bussinessLogo,

            bussinessImages: bussinessImages,

            bannerImage: bannerImage,

            owneridproofurl: owneridproofurl,

            ownerImage: ownerImage,

        })
        if (createOwner) {
            // console.log(imageData, createOwner._id)
            await createOwner.save()
            res.status(200).json({
                success: true,
                message: 'create user',
                data: createOwner
            })
            if (!createOwner) {
                res.status(400).json({
                    success: false,
                    message: 'cannot create ',
                })
                return
            }

        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "validation failled in catch",
        });
    }
})

exports.UpdateBussiness = catchAsyncErrors(async (req, res) => {
    try {
        const {
            name, ownerName,
            ownerEmail, bankName,
            bankAccountNumber, bankAccountHolderName,
            bankCode, bussinessLogo, bussinessImages,
            bannerImage, owneridproofurl, ownerImage, isactive, isPromoted, bussinessLogoStatus,
            bussinessImagesStatus,bannerImageStatus,owneridproofurlStatus,ownerImageStatus,
            // bussinessLogoStatus , bussinessImagesStatus , bannerImageStatus , owneridproofurlStatus , ownerImageStatus 
        } = req.body

        const findBussiness = await BusinessOwner.findById(req.params.id)

        if (!findBussiness) {
            res.status(400).json({
                success: false,
                message: "This Bussiness Owner Is Not Exist",
            });
            return
        }

        if (findBussiness) {
            const updateBussiness = await BusinessOwner.findByIdAndUpdate(req.params.id, {
                "$set": {
                    name: name,
                    ownerName: ownerName,
                    ownerEmail: ownerEmail,
                    bankName: bankName,
                    bankAccountNumber: bankAccountNumber,
                    bankAccountHolderName: bankAccountHolderName,
                    bankCode: bankCode,
                    // Images : Images, 
                    bussinessLogo: bussinessLogo,
                    bussinessImages: bussinessImages,
                    bannerImage: bannerImage,
                    owneridproofurl: owneridproofurl,
                    ownerImage: ownerImage,
                    isactive: isactive,
                    isPromoted: isPromoted,
                    // images status
                    bussinessLogoStatus: bussinessLogoStatus,
                    bussinessImagesStatus:bussinessImagesStatus,
                    bannerImageStatus:bannerImageStatus,
                    owneridproofurlStatus:owneridproofurlStatus,
                    ownerImageStatus:ownerImageStatus
                }
            }, { new: true })

            if (!updateBussiness) {
                res.status(400).json({
                    success: false,
                    message: "Bussiness owner Is Not Updated",
                });
                return
            }

            if (updateBussiness) {
                res.status(200).json({
                    success: true,
                    message: "Bussiness owner Is Updated",
                    updateBussiness: updateBussiness
                });
                return
            }

        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "validation failled in catch",
        });
    }
})

exports.getBussiness = catchAsyncErrors(async (req, res) => {
    try {
        console.log(req)
        const findusers = await BusinessOwner.find().populate("name")

        if (!findusers) {
            res.status(400).json({
                success: false,
                message: "getUsers failled in try",
            });

            return
        }

        if (findusers) {
            res.status(200).json({
                success: true,
                message: "getUsers Succesfully",
                data: findusers
            });
            return
        }
        if (findusers) {
            res.status(200).json({
                success: true,
                message: "getBussiness Succesfully",
                data: findusers
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "getBussiness failled in catch",
        });
    }
})

exports.getBussinessById = catchAsyncErrors(async (req, res) => {
    try {
        console.log(req.params.id)
        const findusers = await BusinessOwner.find({ name: req.params.id }).populate('name')
        console.log(findusers)
        if (!findusers) {
            res.status(400).json({
                success: false,
                message: "getBussinessById failled in try",
            });
        }

        if (findusers) {
            res.status(200).json({
                success: true,
                message: "getBussinessById Succesfully",
                data: findusers
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "getBussinessById failled in catch",
        });
    }
})



exports.oneImage = catchAsyncErrors(async (req, res) => {
    try {
        // 
        function base64_encode(file) {
            return "data:image/gif;base64," + fs.readFile(file, 'base64');
        }

        const data = base64_encode(req.body.bussinessLogo)
        // console.log(req.body,data)
        let fileObject = [
            {
                key: "bussinessLogo",
                value: data,
                filekey: 'bussinessLogo'
            }
        ]
        console.log(fileObject, '258')
        let newupdateobject = await uploadMultipleFiles(fileObject).then(data => {
            console.log(data, '79')
            return data
        }).catch((err) => {
            console.log(err)
        })
        console.log(newupdateobject, '77')

        let bussinessLogo

        newupdateobject && newupdateobject.map(m => {

            if (m.key === 'bussinessLogo') {
                console.log(m.Location, ';bussinessLogo')
                bussinessLogo = m.Location
                return m.Location
            }
        })

        console.log(bussinessLogo, '87',)
        // clear

        const createOwner = await BusinessOwner.create({

            name: req.body.name,
            bussinessLogo: bussinessLogo,
        })
        if (createOwner) {
            // console.log(imageData, createOwner._id)
            await createOwner.save()
            res.status(200).json({
                success: true,
                message: 'create user',
                data: createOwner
            })
            if (!createOwner) {
                res.status(400).json({
                    success: false,
                    message: 'cannot create ',
                })
                return
            }

        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "validation failled in catch",
        });
    }
})

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
            console.log(data, '255')
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


// get All bussiness infromation like menu products 

exports.getBussinessInfo = async (req, res) => {
    try {
        const findmenu = await menu.find({ bussinessOwner_id: req.params.id })
        const findproduct = await product.find({ bussinessOwner_id: req.params.id })
        const findBusinessOwner = await BusinessOwner.findById(req.params.id).populate('name')

        if (!findmenu && !findproduct) {
            res.status(400).json({
                success: false,
                message: "Your Bussiness id has not menu or not product"
            })
            return
        }

        if (findmenu && findproduct) {
            res.status(200).json({
                success: true,
                message: "menu and product find",
                bussinessOwner: findBusinessOwner,
                menu: findmenu,
                product: findproduct
            })
            return
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Unable to Find info",
        });
    }
}



// first promoted second free delivery third any percentage 

exports.findPromotedDeliveryPercentage = async (req, res) => {
    try {
        console.log("hello")
        const findBussiness = await BusinessOwner.find({ isPromoted: true }).populate("name");

        const findNewBussiness = await BusinessOwner.find().populate('name').sort({ 'createdAt': -1 })
        // await Order.find().populate('user').populate('cart').sort({ 'PurchasedDate': -1 })
        console.log(findBussiness)

        const findProduct = await product.find({ isFreeDelivery: true }).populate("Catgeory").populate("bussinessOwner_id").populate("user_id")
        const findProductWithDiscount = await product.find().where('percentageOff').gt(1).populate("Catgeory").populate("bussinessOwner_id").populate("user_id");

        const findCategoryMedicine = await Category.Category.findOne({ name: "medicine" })
        let findProductWithPharmacy = []
        if (findCategoryMedicine) {
            findProductWithPharmacy = await product.find({ Catgeory: findCategoryMedicine._id }).populate("Catgeory").populate("bussinessOwner_id").populate("user_id")
        }

        const findCategoryGrocery = await Category.Category.findOne({ name: "grocery" })
        let findProductWithGrocery = []
        if (findCategoryGrocery) {
            findProductWithGrocery = await product.find({ Catgeory: findCategoryGrocery._id }).populate("Catgeory").populate("bussinessOwner_id").populate("user_id")

        }

        // console.log(findCategoryMedicine)

        if (!findBussiness || !findProduct) {
            res.status(400).json({
                success: false,
                message: "not able to find restraunt of romoted free delivery and percentage",
            });
            return
        }

        if (findBussiness && findProduct && findProductWithPharmacy && findProductWithDiscount && findProductWithGrocery) {
            res.status(200).json({
                success: true,
                message: "find restraunt of romoted free delivery and percentage",
                PromotedBusinessOwnerCount: findBussiness.length,
                FreeDeliveryProductCount: findProduct.length,
                DiscountProductCount: findProductWithDiscount.length,
                PharmacyProductCount: findProductWithPharmacy.length,
                GroceryProductCount: findProductWithGrocery.length,
                NewBussinessCount: findNewBussiness.length,
                PromotedBusinessOwner: findBussiness,
                FreeDeliveryProduct: findProduct,
                DiscountProduct: findProductWithDiscount,
                PharmacyProduct: findProductWithPharmacy,
                GroceryProduct: findProductWithGrocery,
                NewBussiness: findNewBussiness
            });
            return
        }


    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Unable to Find info restraunt of romoted free delivery and percentage",
        });
    }
}


exports.getBestDeal = async (req, res) => {
    try {
        const findBussiness = await BusinessOwner.find();
        const findratingBussiness = await BusinessOwner.find().where("rating").gt(1);


        let bestdeal = []
        let finalbestdeal = []
        for (let i = 0; i < findBussiness.length; i++) {
            const data = await Coupon.aggregate([{
                $match: { bussiness_id: findBussiness[i]._id }
            }])

            bestdeal.push(data)
        }


        if (!bestdeal) {
            res.status(400).json({
                success: false,
                message: "Till Now There Is Not Big Deal",
            });
        }

        if (bestdeal) {

            for (let i = 0; i < bestdeal.length; i++) {
                const newarr = bestdeal[i]
                if (newarr.length > 4) {
                    const findBussiness = await BusinessOwner.findById(newarr[0].bussiness_id);
                    finalbestdeal.push(findBussiness)
                }
            }
            res.status(200).json({
                success: true,
                message: "Best Deal ",
                data: finalbestdeal,
                bestBussiness: findratingBussiness
            });
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Till Now There Is Not Big Deal",
        });
    }
}


