const express = require('express');
const subCategories = require('../models/SubCategory')
const product = require("../models/Product")
const q = require('q')
const multer = require("multer")
const AWS = require('aws-sdk')
const config = require('../config/config')

const accessId = config.accessId
const secretKey = config.secretKey
const BUCKET_NAME = config.BUCKET_NAME

AWS.config.credentials = {
    accessKeyId: accessId,
    secretAccessKey: secretKey,
    region: "ap-south-1",
    ACL: "public-read",
}

AWS.config.region = "ap-south-1"

const s3 = new AWS.S3()

exports.addSubCategory = async (req, res) => {
    try {
        console.log(req.files, "req.file")


        // old object
        let fileObject = [
            {
                key: req.files.image[0].originalname,
                value: req.files.image[0].buffer,
                filekey: 'image'
            },
        ]
        console.log(fileObject , "fileObject")

        let newupdateobject = await uploadMultipleFiles(fileObject).then(data => {
            console.log(data, '79')
            return data
        }).catch((err) => {
            console.log(err)
        })
        
        let icon
        newupdateobject && newupdateobject.map(m => {
            if (m.key === 'image') {
                console.log(m.Location)
                icon = m.Location
                return m.Location
            }
        })

        const subcategoryData = await subCategories.create({
            name: req.body.name,
            image: icon,
            Category: req.body.Category,
        })

        await subcategoryData.save()

        res.status(200).json({
            success: true,
            message: "sub catgeory added",
            data: subcategoryData
        })
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ message: "Something went wrong", err });
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


exports.UpdateSubCategory = async (req, res) => {
    try {
        const data = req.body;
        console.log(data)
        
        const findSubCategory = await subCategories.findById(req.params.id)
        

        if (!findSubCategory) {
            res.status(400).json({ 
                success : false, 
                error : "Not Find This Record" 
            })
            
            return
        }

        if (findSubCategory) {

            const updatesubCategory = await subCategories.findByIdAndUpdate(req.params.id ,  data  , {new : true})

            if (!updatesubCategory) {
                res.status(400).json({ 
                    success : false, 
                    error : "Unable To Update The Record" 
                })
                
                return
            }

            if (updatesubCategory) {
                res.status(200).json({ 
                    success : true, 
                    message : "Sub Category Is Updated" ,
                    data : updatesubCategory
                })
                
                return
            }
            
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ 
            success : false, 
            error : "Update Agent Is Not Possible" 
        })
    }
}









































// // get and getby id and update and delete

// const Category  = require('../models/Category');
// const  SubCategory  = require('../models/SubCategory');


// exports.addSubCategory = async (req, res) => {
//     try {
//         const subCategories = new SubCategory({
//             name: req.body.name,
//             image: req.body.image,
//             Category: req.body.Category
//         })
//         await subCategories.save()
//         console.log("hh", subCategories._id, 'hh')
//         let data = subCategories.Category
//         let l = []
//         l.push(subCategories._id)
//         if (subCategories.Category) {
//             console.log('work', data)
//             let ct = await Category.findByIdAndUpdate(data, {
//                 $push: {
//                     "subCategorydataL": {
//                         name: subCategories.name,
//                         SubCategoryId: subCategories._id
//                     }
//                 }
//             }, {
//                 new: true
//             })
//             console.log(ct);
//             return;
//         }


//         res.status(200).json({ message: "Sub Category saved sucessfull", subCategories })
//     } catch (err) {
//         console.log(err);
//     }
// }